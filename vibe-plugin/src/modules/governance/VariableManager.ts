import type { TokenEntity, VariableScope } from '../../core/types';
import { TokenGraph } from '../../core/TokenGraph';
// import { ImpactAnalyzer } from './ImpactAnalyzer';

// Helper to map Figma types to W3C
function mapFigmaResolvedType(type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"): TokenEntity['$extensions']['figma']['resolvedType'] {
    return type;
}

export class VariableManager {
    private graph: TokenGraph;
    // private impactAnalyzer: ImpactAnalyzer;

    constructor(graph: TokenGraph) {
        this.graph = graph;
        // this.impactAnalyzer = new ImpactAnalyzer(graph);
    }

    /**
     * Syncs all local variables from Figma into the TokenGraph.
     * This is a heavy operation, usually run on startup or manual sync.
     */
    async syncFromFigma(): Promise<TokenEntity[]> {
        this.graph.reset();
        const tokens: TokenEntity[] = [];

        // In strict architectural terms, this class should be injected with a 
        // "FigmaRepository" to mock figma calls, but for this plugin scope, 
        // direct global `figma` access in the controller module is acceptable 
        // IF valid in the bundle context. 
        // Note: This file relies on `figma` global which exists in the sandbox.

        try {
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            for (const collection of collections) {
                // We only care about variables for now
                const variableIds = collection.variableIds;

                for (const varId of variableIds) {
                    const variable = await figma.variables.getVariableByIdAsync(varId);
                    if (!variable) continue;

                    // Resolve value for the first mode (simplification for MVP)
                    const modeId = collection.modes[0]?.modeId;
                    const value = variable.valuesByMode[modeId];

                    // Determine W3C type
                    let w3cType: TokenEntity['$type'] = 'color'; // default
                    if (variable.resolvedType === 'FLOAT') w3cType = 'dimension';
                    if (variable.resolvedType === 'STRING') w3cType = 'fontFamily'; // approximation

                    // Extract dependencies (aliases)
                    const dependencies: string[] = [];
                    if (typeof value === 'object' && value !== null && 'type' in value && value.type === 'VARIABLE_ALIAS') {
                        dependencies.push(value.id);
                    }

                    const token: TokenEntity = {
                        id: variable.id,
                        name: variable.name,
                        $value: typeof value === 'object' ? 'ALIAS' : String(value), // simplified representation
                        $type: w3cType,
                        $description: variable.description,
                        $extensions: {
                            figma: {
                                scopes: variable.scopes as VariableScope[],
                                collectionId: collection.id,
                                modeId: modeId,
                                resolvedType: mapFigmaResolvedType(variable.resolvedType)
                            }
                        },
                        dependencies: dependencies,
                        dependents: [] // to be filled primarily by graph logic
                    };

                    this.graph.addNode(token);
                    tokens.push(token);
                }
            }

            // Second pass: Add edges
            for (const token of tokens) {
                for (const depId of token.dependencies) {
                    this.graph.addEdge(token.id, depId);
                }
            }

            return tokens;

        } catch (error) {
            console.error('Failed to sync variables', error);
            throw error;
        }
    }

    /**
     * Creates a new variable.
     */
    async createVariable(name: string, type: 'color' | 'number' | 'string', value: any): Promise<void> {
        let collections = await figma.variables.getLocalVariableCollectionsAsync();
        let collection = collections[0];

        if (!collection) {
            collection = figma.variables.createVariableCollection('Vibe Tokens');
        }

        const variable = figma.variables.createVariable(
            name,
            collection,
            type === 'color' ? 'COLOR' : type === 'number' ? 'FLOAT' : 'STRING'
        );

        const modeId = collection.modes[0].modeId;

        if (type === 'color') {
            const rgb = this.hexToRgb(value);
            variable.setValueForMode(modeId, rgb);
        } else if (type === 'number') {
            variable.setValueForMode(modeId, parseFloat(value));
        } else {
            variable.setValueForMode(modeId, value);
        }
    }

    /**
     * Updates a variable value directly.
     */
    async updateVariable(id: string, newValue: string | number | VariableAlias): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error(`Variable ${id} not found`);

        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const collection = collections.find(c => c.variableIds.includes(id));

        if (collection) {
            const modeId = collection.modes[0].modeId;
            // Handle color conversion if needed
            if (variable.resolvedType === 'COLOR' && typeof newValue === 'string') {
                variable.setValueForMode(modeId, this.hexToRgb(newValue));
            } else {
                variable.setValueForMode(modeId, newValue);
            }
        }
    }

    async renameVariable(id: string, newName: string): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) {
            variable.name = newName;
        } else {
            throw new Error(`Variable ${id} not found`);
        }
    }

    private hexToRgb(hex: string): RGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }
}
