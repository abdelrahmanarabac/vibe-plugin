import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { TokenGraph } from './core/TokenGraph';
import { PerceptionEngine } from './modules/intelligence/PerceptionEngine';

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
                if (msg.key === 'VIBE_API_KEY_ENCRYPTED') {
                    figma.notify('🔒 Key Secured: Vibe System Primed.');
                }
                break;
            }

            case 'STORAGE_REMOVE': {
                await figma.clientStorage.deleteAsync(msg.key);
                break;
            }

            // Auto-Discovery & Scanning
            case 'SCAN_SELECTION': {
                const selection = figma.currentPage.selection;
                // Use the new PerceptionEngine!
                const primitives = PerceptionEngine.scan(selection);
                figma.ui.postMessage({
                    type: 'SCAN_RESULT',
                    primitives
                });
                break;
            }

            // Vision Capability
            case 'SCAN_IMAGE': {
                const selection = figma.currentPage.selection[0];
                if (selection) {
                    try {
                        const bytes = await selection.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } });
                        figma.ui.postMessage({ type: 'SCAN_IMAGE_RESULT', bytes });
                    } catch (e) {
                        figma.notify("Failed to export image. Select a layer first.");
                    }
                } else {
                    figma.notify("Select a layer to scan vision.");
                }
                break;
            }

            // Vector Memory (Persistence)
            case 'MEMORY_SAVE': {
                await figma.clientStorage.setAsync(msg.key, msg.data);
                break;
            }

            case 'MEMORY_LOAD': {
                const data = await figma.clientStorage.getAsync(msg.key);
                figma.ui.postMessage({
                    type: 'MEMORY_LOAD_RESPONSE',
                    key: msg.key,
                    data
                });
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
