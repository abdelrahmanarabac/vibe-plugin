import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';

// Core Systems
import { TokenGraph } from './core/TokenGraph';
import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { CollectionRenamer } from './modules/collections/adapters/CollectionRenamer';
import { CapabilityRegistry } from './core/CapabilityRegistry';

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
console.log('[Vibe] System Booting (Architecture v2.0)...');

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

// === 3. Live Sync State (Legacy Polling - to be refactored to Event Driven later) ===
// We keep this local function for now as it's not a user-initiated capability but a background process
let syncInterval: number | null = null;
let lastVariableHash: string = '';

// === 4. Setup UI ===
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// === 5. Bootstrap ===
(async () => {
    try {
        console.log('[Vibe] Initial Sync...');
        await performSync();
        startLiveSync();
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
                // If it's a sync-related action, we might want to force a broadcast
                // Ideally capabilities return specific events, but for now we hook into result types
                // or just rely on the background poller.
                // However, Create/Update usually demand instant feedback.
                if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_GRAPH'].includes(msg.type)) {
                    await performSync();
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

        // B. System/Utility Fallpack (The "Plumbing" that isn't a capability yet)
        switch (msg.type) {
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
            // Explicitly ignore "SYNC_VARIABLES" if it's handled by SYNC_GRAPH capability or aliased
            // If SYNC_VARIABLES is NOT in registry (it isn't, SYNC_GRAPH is), we handle it:
            case 'SYNC_VARIABLES': {
                // Alias to SyncGraph
                await registry.getByCommand('SYNC_GRAPH')?.execute({}, context);
                await performSync();
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

// === 7. Live Sync Logic (Background Process) ===
// This stays outside the registry as it's an event loop, not a command.
// TODO: Move to an "EventLoop" or "BackgroundWorker" class in future refactor.

function startLiveSync() {
    if (syncInterval) return;
    syncInterval = setInterval(async () => {
        try {
            const vars = await figma.variables.getLocalVariablesAsync();
            const currentHash = computeVariableHash(vars);
            if (currentHash !== lastVariableHash) {
                lastVariableHash = currentHash;
                await performSync();
            }
        } catch (e) {
            console.error('[LiveSync] Error:', e);
        }
    }, 1000) as unknown as number;
}

async function performSync() {
    const tokens = await variableManager.syncFromFigma();
    figma.ui.postMessage({
        type: 'GRAPH_UPDATED',
        tokens,
        timestamp: Date.now()
    });
}

function computeVariableHash(variables: Variable[]): string {
    return variables.map(v => {
        try {
            return `${v.id}:${v.name}:${v.resolvedType}:${JSON.stringify(v.valuesByMode)}`;
        } catch (e) {
            return v.id;
        }
    }).join('|');
}
