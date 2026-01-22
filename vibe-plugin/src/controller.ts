import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { TokenGraph } from './core/TokenGraph';
import { CollectionRenamer } from './modules/collections/adapters/CollectionRenamer';
import type { PluginAction } from './shared/types';

console.clear();
console.log('[Vibe] System Booting (Token OS Mode)...');

// === 1. Initialize Core Engines ===
const graph = new TokenGraph();
const variableManager = new VariableManager(graph);
const docsRenderer = new DocsRenderer(graph);
const collectionRenamer = new CollectionRenamer();

// === 2. Live Sync State ===
let syncInterval: number | null = null;
let lastVariableHash: string = '';

// === 3. Setup UI ===
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// === 4. Bootstrap ===
(async () => {
    try {
        console.log('[Vibe] Initial Sync...');
        await performSync(); // Instant sync on load
        startLiveSync(); // Start polling
        console.log('[Vibe] System Ready. Live Sync Active.');
    } catch (e) {
        console.error('[Vibe] Bootstrap failed:', e);
    }
})();

// === 5. Message Bus ===
figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // console.log(`[Command] ${msg.type}`, msg.payload); // Debug log

        switch (msg.type) {
            // === TOKEN OPERATIONS (CORE) ===

            case 'SYNC_VARIABLES':
            case 'SYNC_GRAPH': {
                await performSync();
                break;
            }

            case 'CREATE_TOKEN':
            case 'CREATE_VARIABLE': {
                const { name, type, value } = msg.payload;
                await variableManager.createVariable(name, type, value);
                // Create triggers sync implicitly via polling, but accurate hash update is good
                await performSync();
                figma.notify(`✅ Created ${name}`);
                break;
            }

            case 'UPDATE_TOKEN':
            case 'UPDATE_VARIABLE': {
                const { id, newValue } = msg as any; // Cast to allow loose access
                // Support both msg.newValue (legacy) and msg.payload.value
                const val = newValue !== undefined ? newValue : (msg as any).payload?.value;

                await variableManager.updateVariable(id, val);
                await performSync();
                break;
            }

            case 'RENAME_TOKEN': {
                const { id, newName } = msg.payload;
                await variableManager.renameVariable(id, newName);
                await performSync();
                break;
            }

            // === COLLECTIONS ===

            case 'RENAME_COLLECTIONS': {
                const { dryRun } = msg.payload || { dryRun: false };
                const result = await collectionRenamer.renameAll(dryRun);
                figma.notify(result.success ? `✅ Renamed ${result.renamedCount} collections` : `⚠️ Rename completed with errors`);
                figma.ui.postMessage({ type: 'RENAME_COLLECTIONS_RESULT', payload: result });
                break;
            }

            case 'RENAME_COLLECTION': {
                const { oldName, newName } = msg.payload;
                const collections = await figma.variables.getLocalVariableCollectionsAsync();
                const target = collections.find(c => c.name === oldName);
                if (target) {
                    target.name = newName;
                    figma.notify(`✅ Renamed to "${newName}"`);
                } else {
                    figma.notify(`❌ Collection not found`);
                }
                break;
            }

            // === DOCUMENTATION ===

            case 'GENERATE_DOCS': {
                await variableManager.syncFromFigma();
                await docsRenderer.generateDocs();
                figma.notify('📘 Documentation Generated');
                break;
            }

            // === UTILITIES ===

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

            default: {
                console.warn(`[Vibe] Unknown command: ${msg.type}`);
            }
        }
    } catch (error: any) {
        console.error('[Vibe] Controller Error:', error);
        figma.ui.postMessage({
            type: 'ERROR',
            message: error.message || 'Unknown Controller Error'
        });
    }
};

// === 6. Live Sync Logic (Phase 3) ===

function startLiveSync() {
    if (syncInterval) return;

    // Check every 1 second for snappy feel
    syncInterval = setInterval(async () => {
        try {
            const vars = await figma.variables.getLocalVariablesAsync();
            const currentHash = computeVariableHash(vars);

            if (currentHash !== lastVariableHash) {
                // Change detected!
                // console.log('[LiveSync] Change detected. Syncing...');
                lastVariableHash = currentHash;
                await performSync();
            }
        } catch (e) {
            console.error('[LiveSync] Error polling:', e);
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
    // Robust hash: ID + Name + ResolvedType + Values (Stringified)
    // This ensures that if ANY value changes in ANY mode, we trigger a sync.
    return variables.map(v => {
        try {
            const values = JSON.stringify(v.valuesByMode);
            return `${v.id}:${v.name}:${v.resolvedType}:${values}`;
        } catch (e) {
            return v.id; // Fallback
        }
    }).join('|');
}
