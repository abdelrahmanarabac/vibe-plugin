import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { TokenGraph } from './core/TokenGraph';

console.clear();

// 1. Initialize Core Engines
const graph = new TokenGraph();
const variableManager = new VariableManager(graph);
const docsRenderer = new DocsRenderer(graph);

// 2. Setup UI
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// Message Handler
figma.ui.onmessage = async (msg) => {
    try {
        switch (msg.type) {
            // Storage Proxy Handlers (for UI thread)
            case 'STORAGE_GET': {
                const value = await figma.clientStorage.getAsync(msg.key);
                figma.ui.postMessage({
                    type: 'STORAGE_GET_RESPONSE',
                    key: msg.key,
                    value: value || null
                });
                break;
            }

            case 'STORAGE_SET': {
                await figma.clientStorage.setAsync(msg.key, msg.value);
                break;
            }

            case 'STORAGE_REMOVE': {
                await figma.clientStorage.deleteAsync(msg.key);
                break;
            }

            // Documentation
            case 'GENERATE_DOCS': {
                await variableManager.syncFromFigma(); // Ensure fresh data
                await docsRenderer.generateDocs();
                break;
            }

            // Graph Operations
            case 'SYNC_GRAPH': {
                const tokens = await variableManager.syncFromFigma();
                // Send condensed graph back to UI (or just the list for the tree for now)
                figma.ui.postMessage({ type: 'GRAPH_SYNCED', tokens });
                break;
            }

            case 'UPDATE_VARIABLE': {
                const { id, newValue } = msg;
                await variableManager.updateVariable(id, newValue);
                figma.ui.postMessage({ type: 'VARIABLE_UPDATED', id });
                // Optional: Re-sync or partial update
                const updatedTokens = await variableManager.syncFromFigma();
                figma.ui.postMessage({ type: 'GRAPH_SYNCED', tokens: updatedTokens });
                break;
            }

            case 'RESIZE_WINDOW': {
                const { width, height } = msg;
                figma.ui.resize(width, height);
                break;
            }

            case 'NOTIFY': {
                figma.notify(msg.message);
                break;
            }
        }
    } catch (error: any) {
        console.error('Controller Error:', error);
        figma.ui.postMessage({
            type: 'ERROR',
            message: error.message || 'Unknown Controller Error'
        });
    }
};
