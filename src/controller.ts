import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';
import { Dispatcher } from './core/Dispatcher';
import { logger } from './core/services/Logger';


logger.clear();
logger.info('system', 'System booting...');

// === 1. Bootstrap Core ===
const root = new CompositionRoot();
const dispatcher = new Dispatcher(root.registry);

// === 2. Bind Background Services ===
// === 2. Bind Background Services ===
// 🛑 CORE RULE: No auto-sync callback. Sync is triggered purely by UI message.
// root.syncEngine.setCallback(...) -> REMOVED.

// === 3. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 4. Start Engine ===
(async () => {
    try {
        logger.info('system', 'Initializing architecture...');
        // root.syncEngine.start(); // 🛑 DISABLED: No background loop.
        logger.info('system', 'System ready');
    } catch (e) {
        logger.error('system', 'Bootstrap failed', { error: e });
    }
})();

// === 5. Message Handling ===
let currentSyncAbortController: AbortController | null = null;

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
            if (currentSyncAbortController) {
                logger.warn('sync', 'Sync already in progress, ignoring start request.');
                return;
            }
            currentSyncAbortController = new AbortController();
            logger.info('sync', 'Manual Sync Initiated');
            await performFullSync(currentSyncAbortController.signal);
            currentSyncAbortController = null; // Reset after completion
            return;
        }

        // 🛑 MANUAL SYNC CANCEL
        else if (msg.type === 'SYNC_CANCEL') {
            if (currentSyncAbortController) {
                logger.info('sync', 'Cancelling sync process...');
                currentSyncAbortController.abort();
                currentSyncAbortController = null;
                figma.ui.postMessage({ type: 'SYNC_CANCELLED' }); // Feedback to UI
            } else {
                logger.debug('sync', 'No active sync to cancel.');
            }
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
                logger.error('controller:usage', 'Scan usage failed', { error: err });
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
                logger.error('controller:usage', 'Failed to broadcast graph update', { error: err });
            }
        }

    } catch (error: unknown) {
        logger.error('controller:error', 'Controller error occurred', { error });
        const errorMessage = error instanceof Error ? error.message : 'Unknown Controller Error';
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: errorMessage, type: 'error' }
        });
        figma.ui.postMessage({ type: 'ERROR', message: errorMessage });
    }
};

// Helper: extracted sync logic
async function performFullSync(abortSignal: AbortSignal) {
    // 🌊 Progressive Protocol
    const allTokens: any[] = [];
    let progress = 0;

    if (abortSignal.aborted) return;

    // 1. Start Phase: Definitions
    figma.ui.postMessage({ type: 'SYNC_PHASE_START', phase: 'definitions' });

    try {
        // Stream Chunks
        for await (const chunk of root.syncService.syncDefinitionsGenerator()) {
            if (abortSignal.aborted) {
                logger.info('sync', 'Aborted during definitions stream.');
                throw new Error('Sync Aborted');
            }

            allTokens.push(...chunk);
            progress += chunk.length;

            figma.ui.postMessage({
                type: 'SYNC_CHUNK',
                tokens: chunk,
                progress: progress // Simple count for now, or we could estimate % if we knew total
            });

            // Allow event loop to breathe and process aborts
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // Phase Complete
        figma.ui.postMessage({ type: 'SYNC_PHASE_COMPLETE', phase: 'definitions' });

        // 🔄 Final Consistency Event (Backward Compat)
        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: allTokens,
            timestamp: Date.now()
        });

    } catch (e) {
        if (e instanceof Error && e.message === 'Sync Aborted') {
            logger.info('sync', 'Sync process aborted gracefully.');
            return; // Exit cleanly
        }
        logger.error('controller:sync', 'Progressive sync failed', { error: e });
        figma.ui.postMessage({ type: 'ERROR', message: 'Sync Interrupted' });
        return; // Stop if failed
    }

    if (abortSignal.aborted) return;

    // 2. Sync Stats (Collections/Styles)
    try {
        const stats = await root.syncService.getStats();

        if (abortSignal.aborted) return;

        figma.ui.postMessage({
            type: 'STATS_UPDATED',
            payload: {
                totalVariables: stats.totalVariables,
                collections: stats.collections,
                styles: stats.styles,
                collectionNames: Object.keys(stats.collectionMap),
                collectionMap: stats.collectionMap
            }
        });
    } catch (e) {
        logger.error('controller:sync', 'Stats sync failed', { error: e });
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: {
                message: "Stats Sync Partial Failure",
                type: 'error'
            }
        });
    }

    // 3. Lazy Usage Scan (Optional / Background)
    // Disabled in manual sync unless requested.
}
