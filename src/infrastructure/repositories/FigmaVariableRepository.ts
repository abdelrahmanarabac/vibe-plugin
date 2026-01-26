import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';
import type { TokenEntity, VariableScope } from '../../core/types';

// Helper to map Figma types to W3C
function mapFigmaResolvedType(type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"): TokenEntity['$extensions']['figma']['resolvedType'] {
    return type;
}

/**
 * Converts Figma RGB to HEX string.
 */
function rgbToHex(rgb: any): string | null {
    if (!rgb || typeof rgb !== 'object' || !('r' in rgb)) return null;

    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export class FigmaVariableRepository implements IVariableRepository {

    async sync(): Promise<TokenEntity[]> {
        const tokens: TokenEntity[] = [];
        try {
            const allVariables = await figma.variables.getLocalVariablesAsync();
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // Create lookup map for collections
            const collectionMap = new Map(collections.map(c => [c.id, c]));

            for (const variable of allVariables) {
                const collection = collectionMap.get(variable.variableCollectionId);
                if (!collection) continue;

                // Resolve value for the default mode
                const modeId = collection.defaultModeId || (collection.modes[0] && collection.modes[0].modeId);
                if (!modeId) continue;

                const value = variable.valuesByMode[modeId];

                // Determine W3C type
                let w3cType: TokenEntity['$type'] = 'color';
                if (variable.resolvedType === 'FLOAT') w3cType = 'dimension';
                if (variable.resolvedType === 'STRING') w3cType = 'fontFamily';
                if (variable.resolvedType === 'BOOLEAN') continue; // Skip booleans for now

                // Hierarchical Path Construction
                const fullPath = `${collection.name}/${variable.name}`;
                const pathParts = fullPath.split('/');

                // Extract dependencies (aliases) and value resolution
                const dependencies: string[] = [];

                const resolveValue = (val: any): string | number => {
                    if (val && typeof val === 'object' && 'type' in val && val.type === 'VARIABLE_ALIAS') {
                        dependencies.push(val.id);
                        const target = allVariables.find(v => v.id === val.id);
                        if (target) {
                            const targetCollection = collectionMap.get(target.variableCollectionId);
                            const targetModeId = targetCollection?.defaultModeId || (targetCollection?.modes[0]?.modeId);
                            if (targetModeId) {
                                return resolveValue(target.valuesByMode[targetModeId]);
                            }
                        }
                        return 'ALIAS_ERROR';
                    }

                    if (variable.resolvedType === 'COLOR') {
                        return rgbToHex(val) || '#000000';
                    }
                    return val;
                };

                const resolvedValue = resolveValue(value);

                const token: TokenEntity = {
                    id: variable.id,
                    name: pathParts[pathParts.length - 1],
                    path: pathParts.slice(0, -1),
                    $value: resolvedValue,
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
                    dependents: [] // Will be populated by Graph algorithm
                };
                tokens.push(token);
            }
            return tokens;
        } catch (error) {
            console.error('[Repository] Failed to sync variables:', error);
            throw error;
        }
    }

    async create(name: string, type: 'color' | 'number' | 'string', value: any): Promise<void> {

        // Check if this is a Responsive Definition (Multi-mode)
        const isResponsive = typeof value === 'object' && value !== null && 'mobile' in value;

        let collection: VariableCollection;

        if (isResponsive) {
            // Find or Create "Responsive Tokens" collection
            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            let respCollection = collections.find(c => c.name === 'Responsive Tokens');

            if (!respCollection) {
                respCollection = figma.variables.createVariableCollection('Responsive Tokens');
                // Rename default mode to Mobile
                respCollection.renameMode(respCollection.modes[0].modeId, 'Mobile');
                // Add Tablet and Desktop
                respCollection.addMode('Tablet');
                respCollection.addMode('Desktop');
            }
            collection = respCollection;
        } else {
            // Standard Single Mode
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // 🧠 INTELLIGENT PATH PARSING
            // Format: "CollectionName/Group/TokenName"
            const parts = name.split('/');

            // If we have at least "Collection/Token", we treat the first part as Collection Name
            // If just "Token", we default to "Vibe Tokens"
            let targetCollectionName = 'Vibe Tokens';
            let finalTokenName = name;

            if (parts.length > 1) {
                targetCollectionName = parts[0];
                // The Figma API uses "/" for grouping WITHIN a collection.
                // So if we have "Brand/Colors/Primary", 
                // Collection = "Brand"
                // Valid Variable Name = "Colors/Primary"
                finalTokenName = parts.slice(1).join('/');
            }

            collection = collections.find(c => c.name === targetCollectionName)
                || await figma.variables.createVariableCollection(targetCollectionName);

            // Update the name to be relative to the collection
            name = finalTokenName;
        }

        const variable = figma.variables.createVariable(
            name,
            collection,
            type === 'color' ? 'COLOR' : type === 'number' ? 'FLOAT' : 'STRING'
        );

        if (isResponsive) {
            // Set values for each mode
            const modes = collection.modes;
            // Expect modes: Mobile, Tablet, Desktop
            // We map input keys (lowercase) to Mode Names (Title case)
            const map: Record<string, string> = { 'mobile': 'Mobile', 'tablet': 'Tablet', 'desktop': 'Desktop' };

            for (const [key, val] of Object.entries(value)) {
                const modeName = map[key];
                const mode = modes.find(m => m.name === modeName);
                if (mode) {
                    const parsed = type === 'number' ? parseFloat(val as string) : val;
                    variable.setValueForMode(mode.modeId, parsed as VariableValue);
                }
            }
        } else {
            // Standard Set
            const modeId = collection.modes[0].modeId;
            if (type === 'color') {
                const rgb = this.hexToRgbInternal(value);
                variable.setValueForMode(modeId, rgb);
            } else if (type === 'number') {
                variable.setValueForMode(modeId, parseFloat(value));
            } else {
                variable.setValueForMode(modeId, value);
            }
        }
    }

    async update(id: string, value: any): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error(`Variable ${id} not found`);

        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const collection = collections.find(c => c.variableIds.includes(id));

        if (collection) {
            const modeId = collection.modes[0].modeId;
            if (variable.resolvedType === 'COLOR' && typeof value === 'string') {
                variable.setValueForMode(modeId, this.hexToRgbInternal(value));
            } else {
                variable.setValueForMode(modeId, value);
            }
        }
    }

    async rename(id: string, newName: string): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) {
            variable.name = newName;
        } else {
            throw new Error(`Variable ${id} not found`);
        }
    }

    private hexToRgbInternal(hex: string): RGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }
}
