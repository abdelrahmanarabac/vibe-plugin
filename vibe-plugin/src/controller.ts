import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';

// Core Systems
import { TokenGraph } from './core/TokenGraph';
import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { CollectionRenamer } from './modules/collections/adapters/CollectionRenamer';
import { CapabilityRegistry } from './core/CapabilityRegistry';
import { EventLoop } from './core/EventLoop';

// Infra
import { FigmaVariableRepository } from './infra/repositories/FigmaVariableRepository';

// Capabilities
import { ScanSelectionCapability } from './features/scanning/ScanSelectionCapability';
import { SyncGraphCapability } from './features/sync/SyncGraphCapability';
import { CreateVariableCapability } from './features/management/CreateVariableCapability';
import { UpdateVariableCapability } from './features/management/UpdateVariableCapability';
import { RenameVariableCapability } from './features/management/RenameVariableCapability';
import { GenerateDocsCapability } from './features/documentation/GenerateDocsCapability';
import { RenameCollectionsCapability } from './features/collections/RenameCollectionsCapability';

console.clear();
console.log('[Vibe] System Booting (Architecture v2.1)...');

// === 1. Initialize Core Engines ===
const graph = new TokenGraph();
const variableRepository = new FigmaVariableRepository(); // Repo
const variableManager = new VariableManager(graph, variableRepository); // Injection
const docsRenderer = new DocsRenderer(graph);
const collectionRenamer = new CollectionRenamer();

// === 2. Initialize Registry & Capabilities ===
const registry = new CapabilityRegistry();

const capabilities = [
    new ScanSelectionCapability(),
    new SyncGraphCapability(variableManager),
    new CreateVariableCapability(variableManager),
    new UpdateVariableCapability(variableManager),
    new RenameVariableCapability(variableManager),
    new GenerateDocsCapability(docsRenderer, variableManager),
    new RenameCollectionsCapability(collectionRenamer)
];

capabilities.forEach(cap => registry.register(cap));

// === 3. Initialize Event Loop (Background Services) ===
// Handler for when the EventLoop detects a need to sync
const handleSyncRequest = async () => {
    const tokens = await variableManager.syncFromFigma();
    figma.ui.postMessage({
        type: 'GRAPH_UPDATED',
        tokens,
        timestamp: Date.now()
    });
};

const eventLoop = new EventLoop(handleSyncRequest);

// === 4. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 5. Bootstrap ===
(async () => {
    try {
        console.log('[Vibe] Initial Sync...');
        await handleSyncRequest(); // Initial Sync
        eventLoop.start();         // Start Polling
        console.log('[Vibe] System Ready.');
    } catch (e) {
        console.error('[Vibe] Bootstrap failed:', e);
    }
})();

// === 6. Message Dispatcher ===
figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // Build Context on-the-fly
        const context: AgentContext = {
            graph,
            selection: figma.currentPage.selection,
            page: figma.currentPage,
            session: { timestamp: Date.now() }
        };

        // A. Capability Dispatch
        const capability = registry.getByCommand(msg.type);
        if (capability) {
            console.log(`[Dispatcher] Routing ${msg.type} -> ${capability.id}`);

            if (!capability.canExecute(context)) {
                console.warn(`[Dispatcher] Capability ${capability.id} declined execution.`);
                figma.notify(`⚠️ Cannot execute ${msg.type} in current context.`);
                return;
            }

            // Extract payload safely
            const payload = (msg as any).payload !== undefined ? (msg as any).payload : msg;

            // Execute
            const result = await capability.execute(payload, context);

            // Handle Result
            if (result.success) {
                // If it's a sync-related action, force a broadcast
                if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_GRAPH'].includes(msg.type)) {
                    await handleSyncRequest();
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
                // UI requests initial token graph state
                try {
                    const tokens = graph.getAllNodes();
                    figma.ui.postMessage({
                        type: 'GRAPH_UPDATED',
                        payload: tokens,
                        timestamp: Date.now()
                    });
                } catch (error: any) {
                    console.error('[Controller] Failed to retrieve graph:', error);
                    figma.ui.postMessage({
                        type: 'GRAPH_UPDATED',
                        payload: [],
                        timestamp: Date.now()
                    });
                }
                break;
            }
            case 'REQUEST_STATS': {
                // UI requests statistics (collections, variables count)
                try {
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
                } catch (error: any) {
                    console.error('[Controller] Failed to retrieve stats:', error);
                    figma.ui.postMessage({
                        type: 'STATS_UPDATED',
                        payload: {
                            totalVariables: 0,
                            collections: 0,
                            styles: 0
                        }
                    });
                }
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
                // Alias to SyncGraph
                await registry.getByCommand('SYNC_GRAPH')?.execute({}, context);
                await handleSyncRequest();
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
