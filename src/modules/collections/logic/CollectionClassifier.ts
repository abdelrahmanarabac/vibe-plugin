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
        /primitives\//i,
        /color-/i,
        /spacing-/i,
        /radius-/i,
        /font-/i,
        /size-/i
    ];

    private readonly semanticPatterns = [
        /brand\//i,
        /surface\//i,
        /content\//i,
        /feedback\//i,
        /border\//i,
        /text\//i,
        /bg\//i,
        /background\//i
    ];

    private readonly componentPatterns = [
        /component\//i,
        /button-/i,
        /card-/i,
        /input-/i,
        /modal-/i,
        /nav-/i
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

        const classification = this.runClassificationLogic(collection, variables);

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

            // ✅ ARCHITECTURAL FIX (Level 1): Check ALL modes for aliases.
            const hasAliases = Object.values(variable.valuesByMode).some(value =>
                typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'VARIABLE_ALIAS'
            );

            variableInfos.push({
                id: variable.id,
                // ✅ ARCHITECTURAL FIX (Level 2): Use standard name (leaf). 
                // Context is now handled via Collection Name Signal (Rule 0).
                name: variable.name,
                type: variable.resolvedType,
                hasAliases,
                scopes: variable.scopes
            });
        }

        return variableInfos;
    }

    /**
     * Core classification algorithm using a 4-tier decision tree.
     * 
     * Decision Tree:
     * 0. Collection Name Signal (Explicit keywords)
     * 1. Pattern Matching (Match threshold)
     * 2. Dependency Analysis (alias ratio analysis)
     * 3. Scope Analysis (component scope detection)
     * 
     * @param collection - The target VariableCollection
     * @param variables - Array of VariableInfo to analyze
     * @returns Classification result with type, confidence, and reasoning
     */
    private runClassificationLogic(
        collection: VariableCollection,
        variables: VariableInfo[]
    ): { type: CollectionType; confidence: number; reason: string } {
        // Defensive check for malformed inputs or test setup mismatches
        if (!variables || !Array.isArray(variables)) {
            return {
                type: 'Unknown',
                confidence: 0.0,
                reason: 'No variables provided for analysis'
            };
        }

        const totalVars = variables.length;
        if (totalVars === 0) {
            return {
                type: 'Unknown',
                confidence: 0.0,
                reason: 'Collection variables list is empty'
            };
        }

        // ✅ RULE 0: Collection Name Signal (Level 2 - Highest Priority)
        const collectionName = collection.name.toLowerCase();

        if (collectionName.includes('primitive') || collectionName.includes('base') || collectionName.includes('core')) {
            return {
                type: 'Primitives',
                confidence: 0.95,
                reason: `Collection name "${collection.name}" explicitly indicates Primitives`
            };
        }

        if (collectionName.includes('semantic') || collectionName.includes('theme') || collectionName.includes('token')) {
            return {
                type: 'Semantic',
                confidence: 0.95,
                reason: `Collection name "${collection.name}" explicitly indicates Semantic Tokens`
            };
        }

        // RULE 1: Pattern Matching
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

        // Semantic: 50%+ match
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

        // RULE 2: Dependency Analysis
        const aliasCount = variables.filter(v => v.hasAliases).length;
        const aliasRatio = aliasCount / totalVars;

        // High alias ratio suggests Semantic
        if (aliasRatio > 0.8) {
            return {
                type: 'Semantic',
                confidence: 0.75,
                reason: `${Math.round(aliasRatio * 100)}% variables are aliases (likely semantic tokens)`
            };
        }

        // Low alias ratio suggests Primitives
        if (aliasRatio < 0.2) {
            return {
                type: 'Primitives',
                confidence: 0.7,
                reason: `${Math.round((1 - aliasRatio) * 100)}% variables are raw values (likely primitives)`
            };
        }

        // RULE 3: Scope Analysis
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
