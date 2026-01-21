import { describe, it, expect, beforeEach } from 'vitest';
import { TokenGraph } from '../../src/core/TokenGraph';
import { TokenEntity } from '../../src/core/types';

describe('TokenGraph', () => {
    let graph: TokenGraph;

    const createToken = (id: string, overrides: Partial<TokenEntity> = {}): TokenEntity => ({
        id,
        name: id,
        $value: '#000000',
        $type: 'color',
        dependencies: [],
        dependents: [],
        $extensions: {
            figma: {
                scopes: [],
                collectionId: 'col_1',
                modeId: 'mode_1',
                resolvedType: 'COLOR'
            }
        },
        ...overrides
    });

    beforeEach(() => {
        graph = new TokenGraph();
    });

    it('should correctly identify direct dependencies', () => {
        const tokenA = createToken('a');
        const tokenB = createToken('b'); // b depends on a

        graph.addNode(tokenA);
        graph.addNode(tokenB);
        graph.addEdge('b', 'a');

        const impact = graph.getImpact('a');
        expect(impact).toHaveLength(1);
        expect(impact[0].id).toBe('b');
    });

    it('should correctly identify transitive dependencies (chain)', () => {
        // a -> b -> c
        const a = createToken('a');
        const b = createToken('b');
        const c = createToken('c');

        graph.addNode(a);
        graph.addNode(b);
        graph.addNode(c);

        graph.addEdge('b', 'a'); // b uses a
        graph.addEdge('c', 'b'); // c uses b

        const impact = graph.getImpact('a');
        expect(impact.map(t => t.id)).toContain('b');
        expect(impact.map(t => t.id)).toContain('c');
        expect(impact).toHaveLength(2);
    });

    it('should detect orphans (tokens with no dependents)', () => {
        const a = createToken('a'); // used by b
        const b = createToken('b'); // orphan
        const c = createToken('c'); // orphan

        graph.addNode(a);
        graph.addNode(b);
        graph.addNode(c);

        graph.addEdge('b', 'a');

        const orphans = graph.detectOrphans();
        // 'b' and 'c' are orphans because no one depends on them
        // 'a' is not an orphan because 'b' depends on it
        expect(orphans.map(t => t.id)).toContain('b');
        expect(orphans.map(t => t.id)).toContain('c');
        expect(orphans).toHaveLength(2);
    });
});
