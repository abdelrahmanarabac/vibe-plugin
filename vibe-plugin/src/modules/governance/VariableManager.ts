import type { TokenEntity, VariableScope } from '../../core/types';
import { TokenGraph } from '../../core/TokenGraph';
import { ImpactAnalyzer } from './ImpactAnalyzer';

// Helper to map Figma types to W3C
function mapFigmaResolvedType(type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"): TokenEntity['$extensions']['figma']['resolvedType'] {
    return type;
}

export class VariableManager {
    private graph: TokenGraph;
    private impactAnalyzer: ImpactAnalyzer;

    constructor(graph: TokenGraph) {
        this.graph = graph;
        this.impactAnalyzer = new ImpactAnalyzer(graph);
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
     * Updates a variable value.
     * Returns impact report BEFORE applying changes (for UI confirmation).
     * @param id The variable ID to update
     * @param newValue The proposed new value (used for future value-based impact logic)
     */
    async updateVariable(id: string, newValue: string | number | VariableAlias): Promise<{ success: boolean, impactReport?: any }> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error(`Variable ${id} not found`);

        // CRITICAL: Check impact BEFORE applying changes
        const impactReport = this.impactAnalyzer.analyzeImpact(id);

        // NOTE: `newValue` is currently unused in the impact analysis (topology only),
        // but reserved here for future logic (e.g. contrast checks).
        // @ts-ignore - Reserved for future use
        const _futureValue = newValue;

        return {
            success: false, // Not applied yet
            impactReport: impactReport
        };
    }

    /**
     * Confirms and applies a variable update after user approval.
     * Should only be called after updateVariable() and user confirmation.
     */
    async confirmUpdate(id: string, newValue: string | number | VariableAlias): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error(`Variable ${id} not found`);

        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const collection = collections.find(c => c.variableIds.includes(id));
        if (collection) {
            const modeId = collection.modes[0].modeId;
            variable.setValueForMode(modeId, newValue);
        }

        // Trigger re-sync after update
        // The controller should broadcast a GRAPH_UPDATED event
    }
}
