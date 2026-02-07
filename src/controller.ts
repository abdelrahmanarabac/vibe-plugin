import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';
import { Dispatcher } from './core/Dispatcher';
import { logger } from './core/services/Logger';

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
            figma.ui.postMessage({ type: 'STORAGE_SET_SUCCESS', key: msg.key }); // ACK
            return; // Handled
        }
        else if (msg.type === 'STORAGE_REMOVE') {
            await figma.clientStorage.deleteAsync(msg.key);
            figma.ui.postMessage({ type: 'STORAGE_REMOVE_SUCCESS', key: msg.key }); // ACK
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

        // � MANUAL SYNC CANCEL
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
        } else if (msg.type === 'SEARCH_QUERY') {
            // 🔍 Handle Search Request
            const query = msg.payload?.query || '';
            const results = searchTokens(query);
            figma.ui.postMessage({
                type: 'SEARCH_RESULTS',
                payload: { matches: results, query }
            });
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

// ==========================================
// 🔍 SEARCH ENGINE (Main Thread + Yielding)
// ==========================================

import type { TokenEntity } from './core/types';

let searchIndex: {
    byName: Map<string, number[]>;
    byPath: Map<string, number[]>;
    byType: Map<string, number[]>;
} = {
    byName: new Map(),
    byPath: new Map(),
    byType: new Map()
};

// Cache tokens for search to avoid re-fetching from repo constantly
let cachedSearchTokens: TokenEntity[] = [];

async function buildSearchIndex(tokens: TokenEntity[]): Promise<void> {
    // 1. Reset
    searchIndex = {
        byName: new Map(),
        byPath: new Map(),
        byType: new Map()
    };
    cachedSearchTokens = tokens;

    logger.info('search', `Building index for ${tokens.length} tokens...`);

    // 2. Batch Processing
    const batchSize = 200; // slightly larger batch for performance

    for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);

        batch.forEach((token, localIndex) => {
            const globalIndex = i + localIndex;

            // Index by name parts
            const nameParts = token.name.toLowerCase().split(/[-_./]/);
            nameParts.forEach(part => {
                if (!part) return;
                if (!searchIndex.byName.has(part)) {
                    searchIndex.byName.set(part, []);
                }
                searchIndex.byName.get(part)!.push(globalIndex);
            });

            // Index by path (full string)
            // Assuming path is array of strings
            if (Array.isArray(token.path)) {
                const pathStr = token.path.join('/').toLowerCase();
                if (!searchIndex.byPath.has(pathStr)) {
                    searchIndex.byPath.set(pathStr, []);
                }
                searchIndex.byPath.get(pathStr)!.push(globalIndex);
            }

            // Index by type
            if (!searchIndex.byType.has(token.$type)) {
                searchIndex.byType.set(token.$type, []);
            }
            searchIndex.byType.get(token.$type)!.push(globalIndex);
        });

        // 🌊 Yield to Main Thread
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    logger.info('search', 'Index built successfully.');
    figma.ui.postMessage({ type: 'INDEX_COMPLETE' });
}

function searchTokens(query: string): TokenEntity[] {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    const matchedIndices = new Set<number>();

    // Search Name (Exact or Partial match on indexed parts)
    for (const [key, indices] of searchIndex.byName) {
        if (key.includes(lowerQuery)) {
            indices.forEach(i => matchedIndices.add(i));
        }
    }

    // Search Path
    for (const [key, indices] of searchIndex.byPath) {
        if (key.includes(lowerQuery)) {
            indices.forEach(i => matchedIndices.add(i));
        }
    }

    return Array.from(matchedIndices).map(idx => cachedSearchTokens[idx]);
}

// ==========================================
// 🔄 SYNC & UTILS
// ==========================================
async function performFullSync(abortSignal: AbortSignal) {
    // 🌊 Progressive Protocol
    // 🛑 OPTIMIZATION: Do NOT buffer allTokens. UI rebuilds from chunks.
    // const allTokens: any[] = []; // Removed to save memory
    let progress = 0;
    let totalTokensProcessed = 0;  // ← Track total

    if (abortSignal.aborted) return;

    // 1. Progressive Sync (Definitions + Usage)
    figma.ui.postMessage({ type: 'SYNC_PHASE_START', phase: 'definitions' });

    try {
        // Stream Chunks (Unified Generator)
        // Note: syncWithUsageGenerator manages both phases
        const generator = root.syncService.syncWithUsageGenerator(abortSignal);

        // Accumulate Usage for Persistence
        const fullUsageAccumulator: Record<string, any> = {};

        for await (const chunk of generator) {
            if (abortSignal.aborted) {
                logger.info('sync', 'Aborted during sync stream.');
                throw new Error('Sync Aborted');
            }

            // Track progress
            if (chunk.phase === 'definitions') {
                totalTokensProcessed += chunk.tokens.length;
                progress += chunk.tokens.length;
            }

            // Convert Usage Map to Object for Serialization if present
            let usagePayload: Record<string, any> | undefined;
            if (chunk.usageMap && chunk.usageMap instanceof Map) {
                usagePayload = Object.fromEntries(chunk.usageMap);
                // Merge into accumulator
                Object.assign(fullUsageAccumulator, usagePayload);
            }

            // ✨ Smart Emission: Send usage data with the chunk
            figma.ui.postMessage({
                type: 'SYNC_CHUNK',
                payload: {
                    tokens: chunk.tokens,
                    usageMap: usagePayload, // ← New Data Here!
                    chunkIndex: chunk.chunkIndex,
                    phase: chunk.phase,
                    isLast: chunk.isLast,
                    progress: {
                        current: totalTokensProcessed,
                        total: totalTokensProcessed > 0 ? totalTokensProcessed : 100 // Approximation
                    }
                }
            });

            // Allow event loop to breathe
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // ✅ FIX: Send final SYNC_COMPLETE with actual count
        figma.ui.postMessage({
            type: 'SYNC_COMPLETE',
            payload: {
                totalTokens: totalTokensProcessed,  // ← Send actual count
                message: '✅ Sync complete!'
            }
        });

        logger.info('sync', `Sync complete: ${totalTokensProcessed} tokens`);

        // 🔄 Final Consistency Event (Backward Compat)
        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: [], // Empty payload. UI has already built state from chunks.
            isIncremental: true, // 🚩 Signal UI to keep chunked data
            timestamp: Date.now()
        });

        // 🔍 Auto-Index for Search
        await buildSearchIndex(root.repository.getAllNodes());

        // 💾 Persist Usage Data (Optimized)
        if (Object.keys(fullUsageAccumulator).length > 0) {
            await figma.clientStorage.setAsync('internal_usage_cache', fullUsageAccumulator);
            logger.info('sync', 'Usage data persisted to clientStorage.');
        }

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

    // 🛑 REMOVED: Redundant "3. Lazy Usage Scan"
    // The usage scan is now integrated into the loop above.
    logger.info('sync', 'Full sync lifecycle completed.');
    figma.notify("✅ Data Synced & Analysis Complete");
}
