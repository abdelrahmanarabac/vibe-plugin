import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollectionClassifier } from '../src/modules/collections/logic/CollectionClassifier';

// Mock types since we can't import figma types easily in node environment
const createMockVariable = (name: string, hasAliases: boolean, scopes: string[] = ['ALL_SCOPES']) => ({
    id: `mock-id-${name}`,
    name,
    resolvedType: 'COLOR',
    valuesByMode: { 'mode-1': hasAliases ? { type: 'VARIABLE_ALIAS' } : '#000000' },
    scopes: scopes as any[]
});

const createMockCollection = (variables: any[]) => ({
    id: 'collection-id',
    name: 'Untitled Collection',
    variableIds: variables.map((_, i) => `var-${i}`),
    modes: [{ modeId: 'mode-1', name: 'Mode 1' }]
});

describe('CollectionClassifier', () => {
    let classifier: CollectionClassifier;

    beforeEach(() => {
        classifier = new CollectionClassifier();

        // Mock the extractVariableInfo method to avoid making Figma API calls
        // We're testing the classification logic, not the extraction logic
        vi.spyOn(classifier as any, 'extractVariableInfo').mockImplementation(async (collection: any) => {
            return collection.variables;
        });
    });

    // Helper to access private method for testing logic directly
    const runLogic = (variables: any[], collectionName = 'Untitled Collection') => {
        const mockCollection = {
            id: 'collection-id',
            name: collectionName,
            variableIds: variables.map((_, i) => `var-${i}`),
            modes: [{ modeId: 'mode-1', name: 'Mode 1' }]
        } as any;
        return (classifier as any).runClassificationLogic(mockCollection, variables);
    };

    it('should classify Primitives correctly based on patterns (Rule 1)', () => {
        const variables = [
            { name: 'primitives/blue/500', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'color-red-500', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'spacing-4', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'radius-sm', hasAliases: false, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Primitives');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Semantic correctly based on patterns (Rule 1)', () => {
        const variables = [
            { name: 'brand/primary', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'surface/background', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'text/primary', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'border/default', hasAliases: true, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Semantic');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Component correctly based on patterns (Rule 1)', () => {
        const variables = [
            { name: 'component/button/bg', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'button-primary-bg', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'card-shadow', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'input-border', hasAliases: true, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Component');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Semantic tokens correctly based on alias dependency (Rule 2)', () => {
        // No patterns, but high alias count (> 80%)
        const variables = [
            { name: 'action-primary', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'container-bg', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'header-text', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'sidebar-border', hasAliases: true, scopes: ['ALL_SCOPES'] },
            { name: 'extra-item', hasAliases: true, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Semantic');
        expect(result.confidence).toBe(0.75);
    });

    it('should classify Primitives correctly based on raw values (Rule 2)', () => {
        // No patterns, but raw values (no aliases < 20%)
        const variables = [
            { name: 'blue-500', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'space-16', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'rem-1', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'font-bold', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'extra-val', hasAliases: false, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Primitives');
        expect(result.confidence).toBe(0.7);
    });

    it('should classify Component correctly based on Scopes + Patterns (Rule 3)', () => {
        // Avoid Rule 2 (Semantic) by having aliases < 80% (66% here)
        // Avoid Rule 2 (Primitive) by having aliases > 20%
        const variables = [
            { name: 'random-var-1', hasAliases: true, scopes: ['TEXT_FILL'] },
            { name: 'input-text', hasAliases: true, scopes: ['TEXT_FILL'] }, // matches /^input-/
            { name: 'random-var-2', hasAliases: false, scopes: ['ALL_SCOPES'] },
        ];

        // Component patterns: 1/3 (input-text).
        // Scopes: TEXT_FILL.

        const result = runLogic(variables);

        expect(result.type).toBe('Component');
        expect(result.confidence).toBe(0.6);
    });

    it('should return Unknown for ambiguous structure', () => {
        const variables = [
            { name: 'random-1', hasAliases: false, scopes: ['ALL_SCOPES'] },
            { name: 'random-2', hasAliases: true, scopes: ['ALL_SCOPES'] }, // Mixed alias/raw
            { name: 'random-2', hasAliases: true, scopes: ['ALL_SCOPES'] },
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Unknown');
        expect(result.confidence).toBe(0.0);
    });
});
