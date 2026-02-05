import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';
import { Dispatcher } from './core/Dispatcher';
import { logger } from './core/services/Logger';
import { ProgressiveSyncCoordinator } from './core/services/ProgressiveSyncCoordinator';

// 🛑 POLYFILL: AbortController for Figma Sandbox
if (typeof globalThis.AbortController === 'undefined') {
    class SimpleAbortSignal {
        aborted = false;
        onabort: (() => void) | null = null;
        _listeners: (() => void)[] = [];
        addEventListener(_type: string, listener: () => void) { this._listeners.push(listener); }
        removeEventListener(_type: string, listener: () => void) { this._listeners = this._listeners.filter(l => l !== listener); }
        dispatchEvent(_event: any) { return true; }
    }
    class SimpleAbortController {
        signal = new SimpleAbortSignal();
        abort() {
            this.signal.aborted = true;
            this.signal._listeners.forEach(l => l());
            if (this.signal.onabort) this.signal.onabort();
        }
    }
    (globalThis as any).AbortController = SimpleAbortController;
    (globalThis as any).AbortSignal = SimpleAbortSignal;
}


logger.clear();
logger.info('system', 'System booting...');

// === 1. Bootstrap Core ===
const root = new CompositionRoot();
const dispatcher = new Dispatcher(root.registry);

// 1. Initialize the Coordinator (Singleton Scope)
const syncCoordinator = new ProgressiveSyncCoordinator();

// === 3. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 4. Start Engine ===
(async () => {
    try {
        logger.info('system', 'Initializing architecture...');
        logger.info('system', 'System ready');
    } catch (e) {
        logger.error('system', 'Bootstrap failed', { error: e });
    }
})();

// === 5. Message Handling ===

figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // Build Context on-the-fly
        const context: AgentContext = {
            repository: root.repository,
            selection: figma.currentPage.selection,
            page: figma.currentPage,
            session: { timestamp: Date.now() }
        };

        logger.debug('controller:message', `Received: ${msg.type}`);

        // 1. Initial System Check: Storage Bridge Handlers
        if (msg.type === 'PING') {
            figma.ui.postMessage({ type: 'PONG', timestamp: Date.now() });
            return;
        }

        // 🚀 STARTUP: Load Cached Data Instantaneously
        if (msg.type === 'STARTUP') {
            const cachedUsage = await figma.clientStorage.getAsync('internal_usage_cache');
            if (cachedUsage) {
                logger.info('sync', 'Loaded cached usage data.');
                figma.ui.postMessage({
                    type: 'SCAN_COMPLETE',
                    payload: {
                        timestamp: Date.now(),
                        usage: cachedUsage,
                        isCached: true
                    }
                });
            }
            return;
        }

        // Bridge Handlers
        else if (msg.type === 'STORAGE_GET') {
            const value = await figma.clientStorage.getAsync(msg.key);
            figma.ui.postMessage({ type: 'STORAGE_GET_RESPONSE', key: msg.key, value });
            return; // Handled
        }
        else if (msg.type === 'STORAGE_SET') {
            await figma.clientStorage.setAsync(msg.key, msg.value);
            return; // Handled
        }
        else if (msg.type === 'STORAGE_REMOVE') {
            await figma.clientStorage.deleteAsync(msg.key);
            return; // Handled
        }

        // 🛑 MANUAL SYNC TRIGGER
        else if (msg.type === 'SYNC_START') {
            // Safety Check: Don't start if already running
            if (syncCoordinator.isActive()) {
                figma.ui.postMessage({ type: 'ERROR', message: 'Sync is already in progress!' });
                return;
            }

            try {
                logger.info('sync', '🚀 Starting Non-Blocking Sync Strategy...');

                // Notify UI: Lock the button
                figma.ui.postMessage({ type: 'SYNC_PHASE_START', phase: 'initializing' });

                // Run the Coordinator
                await syncCoordinator.start(root.syncService.syncDefinitionsGenerator(), {
                    // ⚡ Vital: Update UI every chunk
                    onChunk: (chunk) => {
                        // Instead of sending the whole list, send the chunk diff (Performance Optimization)
                        figma.ui.postMessage({ type: 'SYNC_CHUNK', payload: chunk });
                    },
                    // 📊 Vital: Real Progress Bar
                    onProgress: (progress) => {
                        figma.ui.postMessage({ type: 'SYNC_PROGRESS', payload: progress });
                    },
                    // ✅ Done
                    onComplete: async () => {
                        logger.info('sync', '✅ Sync Completed without freezing!');
                        figma.ui.postMessage({ type: 'SYNC_PHASE_COMPLETE', phase: 'done' });

                        // Refresh Stats after sync
                        try {
                            const stats = await root.syncService.getStats();
                            figma.ui.postMessage({ type: 'STATS_UPDATED', payload: stats });
                        } catch (err) {
                            logger.error('sync', 'Stats refresh failed', { error: err as Error });
                        }
                    },
                    onError: (err) => {
                        logger.error('sync', 'Sync Crashed', { error: err });
                        figma.ui.postMessage({ type: 'ERROR', message: 'Sync Failed: ' + err.message });
                        figma.ui.postMessage({ type: 'SYNC_PHASE_COMPLETE', phase: 'error' }); // Unlock UI
                    }
                });

            } catch (e) {
                logger.error('sync', 'Critical Controller Error', { error: e as Error });
                figma.ui.postMessage({ type: 'SYNC_PHASE_COMPLETE', phase: 'error' }); // Unlock UI
            }
            return;
        }

        // 🛑 MANUAL SYNC CANCEL
        else if (msg.type === 'SYNC_CANCEL') {
            logger.warn('sync', 'User invoked Emergency Stop');
            syncCoordinator.cancel();
            figma.ui.postMessage({ type: 'SYNC_CANCELLED' });
            return;
        }

        // 2. Dispatch Domain Logic
        // 🛡️ Guard: Do NOT dispatch invalid commands to the registry
        // Type assertion needed because SYNC_START/CANCEL are handled above and TS narrows the type
        const type = msg.type as string;
        if (type !== 'SCAN_USAGE' && type !== 'SYNC_START' && type !== 'SYNC_CANCEL') {
            await dispatcher.dispatch(msg, context);
        }

        // Global Post-Dispatch Side Effects
        if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'CREATE_COLLECTION', 'RENAME_COLLECTION', 'DELETE_COLLECTION', 'CREATE_STYLE'].includes(msg.type)) {
            // 🛑 CORE RULE: NO IMPLICIT SYNC.
            logger.debug('controller:sync', 'Action completed. Auto-sync suppressed (Manual Mode).');
        } else if (msg.type === 'SCAN_USAGE') {
            // Usage scan logic remains but only if triggered explicitly
            logger.debug('controller:usage', 'Starting lazy usage scan...');
            try {
                await root.syncService.scanUsage();
            } catch (err) {
                logger.error('controller:usage', 'Scan usage failed', { error: err as Error });
            }

            // Re-emit graph with updated usage info
            try {
                const tokens = root.repository.getAllNodes(); // Access via Composition Root
                figma.ui.postMessage({
                    type: 'GRAPH_UPDATED',
                    payload: tokens,
                    timestamp: Date.now()
                });
                logger.debug('controller:usage', 'Usage scan complete & broadcasted.');
            } catch (err) {
                logger.error('controller:usage', 'Failed to broadcast graph update', { error: err as Error });
            }
        }

    } catch (error: unknown) {
        logger.error('controller:error', 'Controller error occurred', { error: error as Error });
        const errorMessage = error instanceof Error ? error.message : 'Unknown Controller Error';
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: errorMessage, type: 'error' }
        });
        figma.ui.postMessage({ type: 'ERROR', message: errorMessage });
    }
};
