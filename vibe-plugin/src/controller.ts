import { VariableManager } from './modules/governance/VariableManager';
import { DocsRenderer } from './modules/documentation/DocsRenderer';
import { TokenGraph } from './core/TokenGraph';
import { PerceptionEngine } from './modules/intelligence/PerceptionEngine';
import { ComponentBuilder } from './modules/construction/ComponentBuilder';
import { CollectionRenamer } from './modules/collections/adapters/CollectionRenamer';

console.clear();

// 1. Initialize Core Engines
const graph = new TokenGraph();
const variableManager = new VariableManager(graph);
const docsRenderer = new DocsRenderer(graph);
const componentBuilder = new ComponentBuilder(graph);
const collectionRenamer = new CollectionRenamer();

// 2. Setup UI
figma.showUI(__html__, { width: 500, height: 700, themeColors: true });

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
                if (msg.key === 'VIBE_API_KEY') {
                    figma.notify('✅ API Key Saved');
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

            // Phase 4: Component Construction
            case 'CREATE_COMPONENT': {
                const { recipe } = msg;
                await componentBuilder.createButton(recipe.variant);
                figma.notify(`Created ${recipe.variant} Button`);
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

            case 'SCAN_VARS': {
                // Real Data Scan
                const localVars = figma.variables.getLocalVariables();
                const collections = figma.variables.getLocalVariableCollections();

                const report = {
                    totalVariables: localVars.length,
                    collections: collections.length,
                    styles: figma.getLocalPaintStyles().length + figma.getLocalTextStyles().length,
                    lastSync: Date.now()
                };

                figma.ui.postMessage({ type: 'SCAN_COMPLETE', payload: report });
                break;
            }

            case 'CREATE_VARIABLE': {
                const { name, type, value } = msg.payload;

                // Get or create default collection
                let collections = figma.variables.getLocalVariableCollections();
                let collection = collections[0];

                if (!collection) {
                    collection = figma.variables.createVariableCollection('Vibe Tokens');
                }

                // Create variable
                const variable = figma.variables.createVariable(name, collection, type === 'color' ? 'COLOR' : type === 'number' ? 'FLOAT' : 'STRING');

                // Set value
                const modeId = collection.modes[0].modeId;
                if (type === 'color') {
                    const rgb = hexToRgb(value);
                    variable.setValueForMode(modeId, rgb);
                } else if (type === 'number') {
                    variable.setValueForMode(modeId, parseFloat(value));
                } else {
                    variable.setValueForMode(modeId, value);
                }

                figma.ui.postMessage({ type: 'VARIABLE_CREATED', payload: { id: variable.id, name: variable.name } });
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

            // Collection Auto-Rename
            case 'RENAME_COLLECTIONS': {
                const { dryRun } = msg.payload || { dryRun: false };
                const result = await collectionRenamer.renameAll(dryRun);

                if (result.success) {
                    figma.notify(`✅ Renamed ${result.renamedCount} collection(s). Skipped: ${result.skippedCount}.`);
                } else {
                    figma.notify(`⚠️ Renaming completed with ${result.errors.length} error(s). Check console.`, { error: true });
                }

                figma.ui.postMessage({
                    type: 'RENAME_COLLECTIONS_RESULT',
                    payload: result
                });
                break;
            }

            case 'RENAME_COLLECTION_BY_ID': {
                const { collectionId } = msg.payload;
                const success = await collectionRenamer.renameById(collectionId);
                figma.ui.postMessage({
                    type: 'RENAME_COLLECTION_RESULT',
                    payload: { collectionId, success }
                });
                break;
            }

            case 'PREVIEW_CLASSIFICATIONS': {
                const classifications = await collectionRenamer.previewClassifications();
                figma.ui.postMessage({
                    type: 'PREVIEW_CLASSIFICATIONS_RESULT',
                    payload: classifications
                });
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

// Helper function to convert hex to RGB
function hexToRgb(hex: string): RGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
}
