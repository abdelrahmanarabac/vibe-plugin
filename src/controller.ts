import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';
import { Dispatcher } from './core/Dispatcher';

console.clear();
console.log('[Vibe] System Booting...');

// === 1. Bootstrap Core ===
const root = new CompositionRoot();
const dispatcher = new Dispatcher(root.registry);

// === 2. Bind Background Services ===
root.syncEngine.setCallback(async () => {
    // We found a drift! Re-run the full sync protocol.
    // This ensures both GRAPH (Tokens) and STATS (Collections) are updated in the UI.
    // "Momentary" sync restored.
    await performFullSync();
});

// === 3. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 4. Start Engine ===
(async () => {
    try {
        console.log('[Vibe] Initializing Architecture...');
        root.syncEngine.start();
        console.log('[Vibe] System Ready.');
    } catch (e) {
        console.error('[Vibe] Bootstrap failed:', e);
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

        console.log(`[Controller] Received: ${msg.type}`);

        // 1. Initial System Check: Storage Bridge Handlers
        // These are low-level system messages that shouldn't go through the domain dispatcher.
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

        // 2. Dispatch Domain Logic
        await dispatcher.dispatch(msg, context);

        // Global Post-Dispatch Side Effects (e.g. Sync Trigger)
        if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_TOKENS', 'CREATE_COLLECTION', 'RENAME_COLLECTION', 'DELETE_COLLECTION', 'CREATE_STYLE'].includes(msg.type)) {
            // Re-trigger global sync to ensure Graph is up to date:
            console.log('[Controller] Action requires sync, triggering stabilization delay...');
            // Wait 100ms to allow Figma's internal cache to settle (Anti-Phantom Fix)
            setTimeout(async () => {
                await performFullSync();
            }, 100);
        }

    } catch (error: unknown) {
        console.error('[Vibe] Controller Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown Controller Error';
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: errorMessage, type: 'error' }
        });
        figma.ui.postMessage({ type: 'ERROR', message: errorMessage });
    }
};

// Helper: extracted sync logic
async function performFullSync() {
    // 1. Sync Graph (Tokens)
    try {
        const tokens = await root.syncService.sync();
        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: tokens,
            timestamp: Date.now()
        });
    } catch (e) {
        console.error('[Controller] Token Sync Failed:', e);
        // Continue to stats...
    }

    // 2. Sync Stats (Collections/Styles)
    // 2. Sync Stats (Collections/Styles)
    try {
        const stats = await root.syncService.getStats();

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
        console.error('[Controller] Stats Sync Failed:', e);
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: {
                message: "Sync Partial Failure: Check Console",
                type: 'error'
            }
        });
    }
}
