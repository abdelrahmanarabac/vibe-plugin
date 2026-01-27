import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';

console.clear();
console.log('[Vibe] System Booting (Architecture v2.2)...');

// === 1. Bootstrap System ===
const system = new CompositionRoot();

// === 2. Bind UI Messaging to Sync Service ===
// The Controller acts as the "Presenter" here, bridging Core Logic <-> Figma UI

const broadcastStats = async () => {
    try {
        const stats = await system.syncService.getStats();
        figma.ui.postMessage({ type: 'STATS_UPDATED', payload: stats });
    } catch (error) {
        console.error('[Controller] Stats Broadcast Failed:', error);
    }
};

const performFullSync = async () => {
    try {
        const tokens = await system.syncService.sync();

        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: tokens,
            timestamp: Date.now()
        });

        await broadcastStats();
        console.log(`[Controller] Synced ${tokens.length} tokens.`);
    } catch (e) {
        console.error('[Controller] Sync Failed:', e);
    }
};

// === 3. Configure Event Loop ===
// We override the default behavior to trigger our bound sync function
system.eventLoop.setCallback(performFullSync);

// === 4. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 5. Start Background Services ===
(async () => {
    try {
        console.log('[Vibe] Initializing Architecture v2.2...');
        system.eventLoop.start();
        console.log('[Vibe] System Ready.');
    } catch (e) {
        console.error('[Vibe] Bootstrap failed:', e);
    }
})();

// === 6. Message Dispatcher ===
figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // Build Context
        const context: AgentContext = {
            repository: system.repository,
            selection: figma.currentPage.selection,
            page: figma.currentPage,
            session: { timestamp: Date.now() }
        };

        // A. Capability Dispatch
        const capability = system.registry.getByCommand(msg.type);
        if (capability) {
            console.log(`[Dispatcher] Routing ${msg.type} -> ${capability.id}`);

            if (!capability.canExecute(context)) {
                console.warn(`[Dispatcher] Capability ${capability.id} declined execution.`);
                figma.notify(`⚠️ Cannot execute ${msg.type} in current context.`);
                return;
            }

            // Strict Payload Extraction
            const payload = 'payload' in msg ? msg.payload : undefined;

            // Execute
            const result = await capability.execute(payload, context);

            // Handle Result
            if (result.success) {
                figma.ui.postMessage({
                    type: `${msg.type}_SUCCESS`,
                    payload: result.value,
                    timestamp: Date.now()
                });

                // Auto-Sync for state-changing capabilities
                if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_TOKENS', 'CREATE_COLLECTION', 'RENAME_COLLECTIONS', 'CREATE_STYLE'].includes(msg.type)) {
                    await performFullSync();
                }

                if (result.value && result.value.message) {
                    figma.notify(result.value.message);
                }
            } else {
                console.error(`[Dispatcher] Capability failed:`, result.error);
                figma.notify(`❌ Action failed: ${result.error}`);
            }
            return;
        }

        // B. System/Utility Fallback
        switch (msg.type) {
            case 'REQUEST_GRAPH': {
                console.log('[Controller] Triggering manual deep sync...');
                await performFullSync();
                break;
            }
            case 'REQUEST_STATS': {
                await broadcastStats();
                break;
            }
            case 'STORAGE_GET': {
                const value = await figma.clientStorage.getAsync(msg.key);
                figma.ui.postMessage({ type: 'STORAGE_GET_RESPONSE', key: msg.key, value: value || null });
                break;
            }
            case 'STORAGE_SET': {
                await figma.clientStorage.setAsync(msg.key, msg.value);
                if (msg.key === 'VIBE_API_KEY') figma.notify('✅ API Key Saved');
                break;
            }
            case 'RESIZE_WINDOW': {
                figma.ui.resize(msg.width, msg.height);
                break;
            }
            case 'NOTIFY': {
                figma.notify(msg.message);
                break;
            }
            case 'SYNC_VARIABLES': {
                await performFullSync();
                break;
            }
            default: {
                console.warn(`[Vibe] Unknown command: ${msg.type}`);
            }
        }

    } catch (error: any) {
        console.error('[Vibe] Controller Error:', error);
        figma.ui.postMessage({ type: 'ERROR', message: error.message || 'Unknown Controller Error' });
    }
};
