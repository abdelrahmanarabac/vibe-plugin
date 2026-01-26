import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';

// Core Systems
import { TokenRepository } from './core/TokenRepository';
import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { CollectionRenamer } from './modules/collections/adapters/CollectionRenamer';
import { CapabilityRegistry } from './core/CapabilityRegistry';
import { EventLoop } from './core/EventLoop';

// Infra (Purified)
import { FigmaVariableRepository } from './infrastructure/repositories/FigmaVariableRepository';

// Capabilities (Unified Module Structure)
import { ScanSelectionCapability } from './modules/perception/capabilities/scanning/ScanSelectionCapability';
import { SyncTokensCapability } from './modules/tokens/capabilities/sync/SyncTokensCapability';
import { CreateVariableCapability } from './modules/tokens/capabilities/management/CreateVariableCapability';
import { UpdateVariableCapability } from './modules/tokens/capabilities/management/UpdateVariableCapability';
import { RenameVariableCapability } from './modules/tokens/capabilities/management/RenameVariableCapability';
import { GenerateDocsCapability } from './modules/documentation/capabilities/GenerateDocsCapability';
import { GetAnatomyCapability } from './modules/perception/capabilities/scanning/GetAnatomyCapability';
import { RenameCollectionsCapability } from './modules/collections/capabilities/RenameCollectionsCapability';
import { CreateCollectionCapability } from './modules/collections/capabilities/CreateCollectionCapability';
import { TraceLineageCapability } from './modules/intelligence/capabilities/TraceLineageCapability';

// === 1. Initialize Core Engines ===
const repository = new TokenRepository();
const variableRepository = new FigmaVariableRepository();
const variableManager = new VariableManager(repository, variableRepository);
const docsRenderer = new DocsRenderer(repository);
const collectionRenamer = new CollectionRenamer();

// === 2. Initialize Registry & Capabilities ===
const registry = new CapabilityRegistry();

const capabilities = [
    new ScanSelectionCapability(),
    new SyncTokensCapability(variableManager),
    new CreateVariableCapability(variableManager),
    new UpdateVariableCapability(variableManager),
    new RenameVariableCapability(variableManager),
    new GenerateDocsCapability(docsRenderer, variableManager),
    new RenameCollectionsCapability(collectionRenamer),
    new CreateCollectionCapability(),
    new GetAnatomyCapability(),
    new TraceLineageCapability()
];

capabilities.forEach(cap => registry.register(cap));

// === 3. Initialize Event Loop (Background Services) ===

// Helper to broadcast stats
const broadcastStats = async () => {
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
    } catch (error) {
        console.error('[Controller] Failed to broadcast stats:', error);
    }
};

// Handler for when the EventLoop detects a need to sync
const handleSyncRequest = async () => {
    try {
        const tokens = await variableManager.syncFromFigma();
        // Force the graph to ingest the new tokens
        repository.reset();
        tokens.forEach(t => repository.addNode(t));

        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: tokens,
            timestamp: Date.now()
        });

        // Broadcast stats immediately after graph update
        await broadcastStats();
    } catch (e) {
        console.error('[Controller] Sync Failed:', e);
    }
};

const eventLoop = new EventLoop(handleSyncRequest);

// === 4. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 5. Bootstrap ===
(async () => {
    try {
        eventLoop.start();
    } catch (e) {
        console.error('[Vibe] Bootstrap failed:', e);
    }
})();

// === 6. Message Dispatcher ===
figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // Build Context on-the-fly
        const context: AgentContext = {
            repository,
            selection: figma.currentPage.selection,
            page: figma.currentPage,
            session: { timestamp: Date.now() }
        };

        // A. Capability Dispatch
        const capability = registry.getByCommand(msg.type);
        if (capability) {
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
                figma.ui.postMessage({
                    type: `${msg.type}_SUCCESS`,
                    payload: result.value,
                    timestamp: Date.now()
                });

                // If it's a sync-related action, force a broadcast
                if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'SYNC_TOKENS', 'CREATE_COLLECTION'].includes(msg.type)) {
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
                await handleSyncRequest();
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
                await handleSyncRequest();
                break;
            }
            case 'CREATE_STYLE': {
                const { name, type, value } = (msg as any).payload;
                try {
                    let newStyle: BaseStyle | null = null;

                    if (type === 'typography') {
                        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                        const style = figma.createTextStyle();
                        style.name = name;
                        style.fontName = { family: "Inter", style: "Regular" };
                        style.fontSize = 16;
                        newStyle = style;
                    }
                    else if (type === 'effect') {
                        const style = figma.createEffectStyle();
                        style.name = name;
                        style.effects = [{
                            type: 'DROP_SHADOW',
                            color: { r: 0, g: 0, b: 0, a: 0.25 },
                            offset: { x: 0, y: 4 },
                            radius: 4,
                            visible: true,
                            blendMode: 'NORMAL'
                        }];
                        newStyle = style;
                    }
                    else if (type === 'grid') {
                        const style = figma.createGridStyle();
                        style.name = name;
                        style.layoutGrids = [{
                            pattern: 'ROWS',
                            alignment: 'STRETCH',
                            gutterSize: 20,
                            count: 4,
                            sectionSize: 1,
                            visible: true,
                            color: { r: 1, g: 0, b: 0, a: 0.1 }
                        }];
                        newStyle = style;
                    }

                    if (newStyle) {
                        newStyle.description = value || '';
                        figma.notify(`✅ Created Style: ${name}`);
                        await broadcastStats();
                    } else {
                        throw new Error(`Unsupported style type: ${type}`);
                    }
                } catch (e: any) {
                    console.error('[Controller] Failed to create style:', e);
                    figma.notify(`❌ Failed: ${e.message}`);
                }
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
