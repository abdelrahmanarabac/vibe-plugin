import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollectionClassifier } from '../src/modules/collections/logic/CollectionClassifier';

// Mock types
interface MockVariable {
    id: string;
    name: string;
    resolvedType: string;
    valuesByMode: Record<string, unknown>;
    scopes: string[];
    hasAliases: boolean;
}

interface ClassificationResult {
    type: string;
    confidence: number;
}

interface TestableClassifier {
    extractVariableInfo: (collection: unknown) => Promise<unknown[]>;
    runClassificationLogic: (collection: unknown, variables: unknown[]) => ClassificationResult;
}

const createMockVariable = (name: string, hasAliases: boolean, scopes: string[] = ['ALL_SCOPES']): MockVariable => ({
    id: `mock-id-${name}`,
    name,
    resolvedType: 'COLOR' as any,
    valuesByMode: { 'mode-1': hasAliases ? { type: 'VARIABLE_ALIAS' } : '#000000' },
    scopes,
    hasAliases
});

describe('CollectionClassifier', () => {
    let classifier: CollectionClassifier;

    beforeEach(() => {
        classifier = new CollectionClassifier();

        // Mock the extractVariableInfo method
        vi.spyOn(classifier as unknown as TestableClassifier, 'extractVariableInfo').mockImplementation(async (collection: unknown) => {
            return (collection as { variables: unknown[] }).variables;
        });
    });

    // Helper to access private method for testing logic directly
    const runLogic = (variables: MockVariable[], collectionName = 'Untitled Collection'): ClassificationResult => {
        const mockCollection = {
            id: 'collection-id',
            name: collectionName,
            variableIds: variables.map((_, i) => `var-${i}`),
            modes: [{ modeId: 'mode-1', name: 'Mode 1' }]
        };
        return (classifier as unknown as TestableClassifier).runClassificationLogic(mockCollection, variables);
    };

    it('should classify Primitives correctly based on patterns (Rule 1)', () => {
        const variables = [
            createMockVariable('primitives/blue/500', false),
            createMockVariable('color-red-500', false),
            createMockVariable('spacing-4', false),
            createMockVariable('radius-sm', false),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Primitives');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Semantic correctly based on patterns (Rule 1)', () => {
        const variables = [
            createMockVariable('brand/primary', true),
            createMockVariable('surface/background', true),
            createMockVariable('text/primary', true),
            createMockVariable('border/default', true),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Semantic');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Component correctly based on patterns (Rule 1)', () => {
        const variables = [
            createMockVariable('component/button/bg', true),
            createMockVariable('button-primary-bg', true),
            createMockVariable('card-shadow', true),
            createMockVariable('input-border', true),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Component');
        expect(result.confidence).toBeGreaterThan(0.7);
    });

    it('should classify Semantic tokens correctly based on alias dependency (Rule 2)', () => {
        // No patterns, but high alias count (> 80%)
        const variables = [
            createMockVariable('action-primary', true),
            createMockVariable('container-bg', true),
            createMockVariable('header-text', true),
            createMockVariable('sidebar-border', true),
            createMockVariable('extra-item', true),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Semantic');
        expect(result.confidence).toBe(0.75);
    });

    it('should classify Primitives correctly based on raw values (Rule 2)', () => {
        // No patterns, but raw values (no aliases < 20%)
        const variables = [
            createMockVariable('blue-500', false),
            createMockVariable('space-16', false),
            createMockVariable('rem-1', false),
            createMockVariable('font-bold', false),
            createMockVariable('extra-val', false),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Primitives');
        expect(result.confidence).toBe(0.7);
    });

    it('should classify Component correctly based on Scopes + Patterns (Rule 3)', () => {
        // Avoid Rule 2 (Semantic) by having aliases < 80% (66% here)
        // Avoid Rule 2 (Primitive) by having aliases > 20%
        const variables = [
            createMockVariable('random-var-1', true, ['TEXT_FILL']),
            createMockVariable('input-text', true, ['TEXT_FILL']), // matches /^input-/
            createMockVariable('random-var-2', false),
        ];

        // Component patterns: 1/3 (input-text).
        // Scopes: TEXT_FILL.

        const result = runLogic(variables);

        expect(result.type).toBe('Component');
        expect(result.confidence).toBe(0.6);
    });

    it('should return Unknown for ambiguous structure', () => {
        const variables = [
            createMockVariable('random-1', false),
            createMockVariable('random-2', true), // Mixed alias/raw
            createMockVariable('random-2', true),
        ];

        const result = runLogic(variables);

        expect(result.type).toBe('Unknown');
        expect(result.confidence).toBe(0.0);
    });
});
