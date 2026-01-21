import type { CollectionClassification, CollectionType, VariableInfo } from '../types';

/**
 * CollectionClassifier: Core Business Logic for Collection Classification
 * 
 * Responsibility: Analyze Figma Variable Collections and determine their semantic purpose
 * based on pattern matching, dependency analysis, and scope inspection.
 * 
 * Classification Strategy:
 * 1. Pattern Matching (Primary): Match variable names against known patterns
 * 2. Dependency Analysis (Secondary): Analyze alias vs raw value ratio
 * 3. Scope Analysis (Fallback): Check for component-specific scopes
 */
export class CollectionClassifier {
    // Pattern definitions for each collection type
    private readonly primitivePatterns = [
        /^primitives\//i,
        /^color-/i,
        /^spacing-/i,
        /^radius-/i,
        /^font-/i,
        /^size-/i
    ];

    private readonly semanticPatterns = [
        /^brand\//i,
        /^surface\//i,
        /^content\//i,
        /^feedback\//i,
        /^border\//i,
        /^text\//i,
        /^bg\//i,
        /^background\//i
    ];

    private readonly componentPatterns = [
        /^component\//i,
        /^button-/i,
        /^card-/i,
        /^input-/i,
        /^modal-/i,
        /^nav-/i
    ];

    // Confidence threshold for classification
    private readonly CONFIDENCE_THRESHOLD = 0.7;

    /**
     * Classifies a single VariableCollection based on its variables.
     * 
     * @param collection - The Figma VariableCollection to classify
     * @returns CollectionClassification with proposed name and confidence score
     */
    async classify(collection: VariableCollection): Promise<CollectionClassification> {
        const variables = await this.extractVariableInfo(collection);

        // Handle empty collections
        if (variables.length === 0) {
            return {
                collectionId: collection.id,
                currentName: collection.name,
                proposedName: 'Unknown',
                confidence: 0.0,
                reason: 'Collection is empty',
                variables: []
            };
        }

        const classification = this.runClassificationLogic(variables);

        return {
            collectionId: collection.id,
            currentName: collection.name,
            proposedName: classification.type,
            confidence: classification.confidence,
            reason: classification.reason,
            variables
        };
    }

    /**
     * Extracts relevant information from all variables in a collection.
     * 
     * @param collection - The Figma VariableCollection to analyze
     * @returns Array of VariableInfo objects
     */
    private async extractVariableInfo(collection: VariableCollection): Promise<VariableInfo[]> {
        const variableInfos: VariableInfo[] = [];

        for (const varId of collection.variableIds) {
            const variable = await figma.variables.getVariableByIdAsync(varId);
            if (!variable) continue;

            // Check if variable uses aliases (VARIABLE_ALIAS type)
            const modeId = collection.modes[0]?.modeId;
            if (!modeId) continue;

            const value = variable.valuesByMode[modeId];
            const hasAliases = typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'VARIABLE_ALIAS';

            variableInfos.push({
                id: variable.id,
                name: variable.name,
                type: variable.resolvedType,
                hasAliases,
                scopes: variable.scopes
            });
        }

        return variableInfos;
    }

    /**
     * Core classification algorithm using a 3-tier decision tree.
     * 
     * Decision Tree:
     * 1. Pattern Matching (70%+ match threshold)
     * 2. Dependency Analysis (alias ratio analysis)
     * 3. Scope Analysis (component scope detection)
     * 4. Fallback to Unknown if no clear classification
     * 
     * @param variables - Array of VariableInfo to analyze
     * @returns Classification result with type, confidence, and reasoning
     */
    private runClassificationLogic(
        variables: VariableInfo[]
    ): { type: CollectionType; confidence: number; reason: string } {
        const totalVars = variables.length;

        // RULE 1: Pattern Matching (Highest Priority)
        const primitiveMatches = this.countPatternMatches(variables, this.primitivePatterns);
        const semanticMatches = this.countPatternMatches(variables, this.semanticPatterns);
        const componentMatches = this.countPatternMatches(variables, this.componentPatterns);

        const primitiveRatio = primitiveMatches / totalVars;
        const semanticRatio = semanticMatches / totalVars;
        const componentRatio = componentMatches / totalVars;

        // Primitives: 70%+ match
        if (primitiveRatio > 0.7) {
            return {
                type: 'Primitives',
                confidence: 0.9,
                reason: `${primitiveMatches}/${totalVars} variables match primitive patterns (${Math.round(primitiveRatio * 100)}%)`
            };
        }

        // Semantic: 50%+ match (lower threshold because semantic tokens are more diverse)
        if (semanticRatio > 0.5) {
            return {
                type: 'Semantic',
                confidence: 0.85,
                reason: `${semanticMatches}/${totalVars} variables match semantic patterns (${Math.round(semanticRatio * 100)}%)`
            };
        }

        // Component: 50%+ match
        if (componentRatio > 0.5) {
            return {
                type: 'Component',
                confidence: 0.8,
                reason: `${componentMatches}/${totalVars} variables match component patterns (${Math.round(componentRatio * 100)}%)`
            };
        }

        // RULE 2: Dependency Analysis (Secondary)
        const aliasCount = variables.filter(v => v.hasAliases).length;
        const aliasRatio = aliasCount / totalVars;

        // High alias ratio suggests Semantic (tokens that reference primitives)
        if (aliasRatio > 0.8) {
            return {
                type: 'Semantic',
                confidence: 0.75,
                reason: `${Math.round(aliasRatio * 100)}% variables are aliases (likely semantic tokens)`
            };
        }

        // Low alias ratio suggests Primitives (raw values)
        if (aliasRatio < 0.2) {
            return {
                type: 'Primitives',
                confidence: 0.7,
                reason: `${Math.round((1 - aliasRatio) * 100)}% variables are raw values (likely primitives)`
            };
        }

        // RULE 3: Scope Analysis (Tertiary Fallback)
        // We check for restricted scopes (like TEXT_FILL) as a proxy for specific usage
        const hasTextScopes = variables.some(v =>
            v.scopes.includes('TEXT_FILL')
        );

        if (hasTextScopes && componentRatio > 0.3) {
            return {
                type: 'Component',
                confidence: 0.6,
                reason: 'Text-scoped variables with some component patterns detected'
            };
        }

        // FALLBACK: Cannot determine with confidence
        return {
            type: 'Unknown',
            confidence: 0.0,
            reason: `Ambiguous structure - primitive:${Math.round(primitiveRatio * 100)}%, semantic:${Math.round(semanticRatio * 100)}%, component:${Math.round(componentRatio * 100)}%, aliases:${Math.round(aliasRatio * 100)}%`
        };
    }

    /**
     * Counts how many variables match any of the given patterns.
     * 
     * @param variables - Array of variables to check
     * @param patterns - Array of RegExp patterns to match against variable names
     * @returns Number of variables matching at least one pattern
     */
    private countPatternMatches(variables: VariableInfo[], patterns: RegExp[]): number {
        return variables.filter(v =>
            patterns.some(pattern => pattern.test(v.name))
        ).length;
    }

    /**
     * Public getter for confidence threshold (for testing/debugging)
     */
    get confidenceThreshold(): number {
        return this.CONFIDENCE_THRESHOLD;
    }
}
