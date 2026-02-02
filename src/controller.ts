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
    try {
        const tokens = await root.syncService.sync();

        // Broadcast to UI
        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: tokens,
            timestamp: Date.now()
        });

        // Broadcast Stats
        await root.registry.getByCommand('REQUEST_STATS')?.execute({}, {} as AgentContext);

        console.log(`[Controller] Synced ${tokens.length} tokens.`);
    } catch (e) {
        console.error('[Controller] Sync Failed:', e);
        figma.notify("Sync Failed", { error: true });
    }
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

        // Dispatch
        await dispatcher.dispatch(msg, context);

        // Storage Bridge Handlers
        if (msg.type === 'STORAGE_GET') {
            const value = await figma.clientStorage.getAsync(msg.key);
            figma.ui.postMessage({ type: 'STORAGE_GET_RESPONSE', key: msg.key, value });
        }
        else if (msg.type === 'STORAGE_SET') {
            await figma.clientStorage.setAsync(msg.key, msg.value);
        }
        else if (msg.type === 'STORAGE_REMOVE') {
            await figma.clientStorage.deleteAsync(msg.key);
        }
        else if (msg.type === 'REQUEST_FIGMA_ID') {
            figma.ui.postMessage({
                type: 'FIGMA_ID_RESPONSE',
                payload: { id: figma.currentUser?.id || null }
            });
        }

        // Global Post-Dispatch Side Effects (e.g. Sync Trigger)
        if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_TOKENS', 'CREATE_COLLECTION', 'CREATE_STYLE'].includes(msg.type)) {
            // Re-trigger global sync to ensure Graph is up to date:
            console.log('[Controller] Action requires sync, triggering...');
            await performFullSync();
        }

    } catch (error: unknown) {
        console.error('[Vibe] Controller Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown Controller Error';
        figma.notify(errorMessage, { error: true });
        figma.ui.postMessage({ type: 'ERROR', message: errorMessage });
    }
};

// Helper: extracted sync logic
async function performFullSync() {
    try {
        const tokens = await root.syncService.sync();

        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: tokens,
            timestamp: Date.now()
        });

        // Also update stats
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const variables = await figma.variables.getLocalVariablesAsync();
        const styles = await figma.getLocalPaintStylesAsync();

        figma.ui.postMessage({
            type: 'STATS_UPDATED',
            payload: {
                totalVariables: variables.length,
                collections: collections.length,
                styles: styles.length
            }
        });

    } catch (e) {
        console.error('[Controller] Manual Sync Failed:', e);
        figma.notify("❌ Sync Failed: " + (e instanceof Error ? e.message : String(e)), { error: true });
    }
}
