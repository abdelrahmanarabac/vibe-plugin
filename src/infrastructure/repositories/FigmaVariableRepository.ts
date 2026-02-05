import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';
import type { TokenEntity, VariableScope, VariableValue } from '../../core/types';

// Helper to map Figma types to W3C
function mapFigmaResolvedType(type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"): TokenEntity['$extensions']['figma']['resolvedType'] {
    return type;
}

/**
 * Converts Figma RGB to HEX string.
 */
function rgbToHex(rgb: unknown): string | null {
    if (!rgb || typeof rgb !== 'object' || !('r' in rgb)) return null;
    const c = rgb as RGB; // Safe cast after check

    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase();
}

export class FigmaVariableRepository implements IVariableRepository {

    async sync(): Promise<TokenEntity[]> {
        const tokens: TokenEntity[] = [];
        for await (const chunk of this.syncGenerator()) {
            tokens.push(...chunk);
        }
        return tokens;
    }

    async *syncGenerator(): AsyncGenerator<TokenEntity[]> {
        try {
            const allVariables = await figma.variables.getLocalVariablesAsync();
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // ⚡ OPTIMIZATION: Create Lookup Maps (O(1) access)
            const collectionMap = new Map(collections.map(c => [c.id, c]));
            const variableMap = new Map(allVariables.map(v => [v.id, v]));

            // ⚡ PERFORMANCE: Time Slicing Config
            const CHUNK_SIZE = 50;
            let currentChunk: TokenEntity[] = [];

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
                if (variable.resolvedType === 'BOOLEAN') continue; // Skip booleans

                // Hierarchical Path Construction
                const fullPath = `${collection.name}/${variable.name}`;
                const pathParts = fullPath.split('/');

                // Extract dependencies (aliases) and value resolution
                const dependencies: string[] = [];

                const resolveValue = (val: VariableValue | VariableAlias, visited: Set<string> = new Set()): string | number => {
                    if (val && typeof val === 'object' && 'type' in val && val.type === 'VARIABLE_ALIAS') {
                        const aliasId = val.id;

                        // 🛑 CYCLE DETECTION
                        if (visited.has(aliasId)) {
                            console.warn(`[Repo] Cycle detected for alias ${aliasId}`);
                            return 'CYCLE_DETECTED';
                        }
                        visited.add(aliasId);

                        dependencies.push(aliasId);
                        // ⚡ OPTIMIZED: Use Map Lookup instead of array.find
                        const target = variableMap.get(aliasId);

                        if (target) {
                            const targetCollection = collectionMap.get(target.variableCollectionId);
                            const targetModeId = targetCollection?.defaultModeId || (targetCollection?.modes[0]?.modeId);
                            if (targetModeId) {
                                return resolveValue(target.valuesByMode[targetModeId], visited);
                            }
                        }
                        return 'ALIAS_ERROR';
                    }

                    if (variable.resolvedType === 'COLOR') {
                        return rgbToHex(val) || '#000000';
                    }

                    if (typeof val === 'string' || typeof val === 'number') {
                        return val;
                    }

                    return String(val); // Fallback
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
                    dependents: []
                };

                currentChunk.push(token);

                // Yield to main thread every CHUNK_SIZE
                if (currentChunk.length >= CHUNK_SIZE) {
                    yield currentChunk;
                    currentChunk = [];
                    await new Promise(resolve => setTimeout(resolve, 1)); // Yield
                }
            }

            // Yield remaining
            if (currentChunk.length > 0) {
                yield currentChunk;
            }

        } catch (error) {
            console.error('[Repository] Failed to sync variables:', error);
            throw error;
        }
    }

    async create(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void> {

        // Check if this is a Responsive Definition (Multi-mode)
        // We cast value to unknown first to safely check properties
        const isResponsive = typeof value === 'object' && value !== null && 'mobile' in value;

        let collection: VariableCollection;

        if (isResponsive) {
            // Find or Create "Responsive Tokens" collection
            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            let respCollection = collections.find(c => c.name === 'Responsive Tokens');

            if (!respCollection) {
                console.log('[Repo] Creating Responsive Collection...');
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

            // 🧠 STRICT PATH ENFORCEMENT
            // Format: "CollectionName/Group/TokenName" or "CollectionName/TokenName"
            // We NO LONGER support bare token names without collections.
            const parts = name.split('/');

            if (parts.length < 2) {
                throw new Error(
                    `Invalid token path: "${name}". ` +
                    `Expected format: "Collection/TokenName" or "Collection/Group/TokenName". ` +
                    `Please specify a collection path.`
                );
            }

            const targetCollectionName = parts[0];
            // The Figma API uses "/" for grouping WITHIN a collection.
            // So if we have "Brand/Colors/Primary", 
            // Collection = "Brand"
            // Valid Variable Name = "Colors/Primary"
            const finalTokenName = parts.slice(1).join('/');

            // Find existing collection or create it with user-provided name
            let foundCollection = collections.find(c => c.name === targetCollectionName);
            if (!foundCollection) {
                foundCollection = figma.variables.createVariableCollection(targetCollectionName);
                console.log(`[Repo] Auto-created collection: "${targetCollectionName}"`);
            }
            collection = foundCollection;

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

            // Safe cast since we confirmed isResponsive
            const responsiveValue = value as Record<string, VariableValue>;

            for (const [key, val] of Object.entries(responsiveValue)) {
                const modeName = map[key];
                const mode = modes.find(m => m.name === modeName);
                if (mode) {
                    const parsed = type === 'number' && typeof val === 'string' ? parseFloat(val) : val;
                    variable.setValueForMode(mode.modeId, parsed as VariableValue);
                }
            }
        } else {
            // Standard Set
            const modeId = collection.modes[0].modeId;
            if (type === 'color' && typeof value === 'string') {
                const rgb = this.hexToRgbInternal(value);
                variable.setValueForMode(modeId, rgb);
            } else if (type === 'number' && typeof value === 'string') {
                variable.setValueForMode(modeId, parseFloat(value));
            } else {
                variable.setValueForMode(modeId, value as VariableValue);
            }
        }
    }

    async update(id: string, value: VariableValue): Promise<void> {
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
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }
}
