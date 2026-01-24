import type { TokenEntity } from './types';

export class TokenGraph {
    private nodes: Map<string, TokenEntity>;
    private adjacencyList: Map<string, Set<string>>;  // Directed edges: Key depends on Value(s)
    private reverseAdjacencyList: Map<string, Set<string>>; // Directed edges: Key defines who depends on it

    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
        this.reverseAdjacencyList = new Map();
    }

    addNode(token: TokenEntity): void {
        this.nodes.set(token.id, token);
        if (!this.adjacencyList.has(token.id)) {
            this.adjacencyList.set(token.id, new Set());
        }
        if (!this.reverseAdjacencyList.has(token.id)) {
            this.reverseAdjacencyList.set(token.id, new Set());
        }
    }

    addEdge(dependentId: string, dependencyId: string): void {
        // dependentId "uses" dependencyId
        this.adjacencyList.get(dependentId)?.add(dependencyId);
        this.reverseAdjacencyList.get(dependencyId)?.add(dependentId);
    }

    getNode(id: string): TokenEntity | undefined {
        return this.nodes.get(id);
    }

    getAllNodes(): TokenEntity[] {
        return Array.from(this.nodes.values());
    }

    // Alias for semantics
    getTokens(): Map<string, TokenEntity> {
        return this.nodes;
    }

    /**
     * DFS-based impact analysis
     * Returns all tokens that depend on `tokenId` (directly or indirectly)
     * Time Complexity: O(V+E)
     */
    getImpact(tokenId: string): TokenEntity[] {
        const visited = new Set<string>();
        const impacted: TokenEntity[] = [];

        const dfs = (currentId: string) => {
            if (visited.has(currentId)) {
                // 🛑 Cycle Detected - Break Recursion
                console.warn(`⚠️ Cycle detected at token: ${currentId} while analyzing impact of ${tokenId}`);
                return;
            }
            visited.add(currentId);

            const token = this.nodes.get(currentId);
            if (token && currentId !== tokenId) {
                impacted.push(token);
            }

            // Read from reverse adjacency list to find who depends on currentId
            const dependents = this.reverseAdjacencyList.get(currentId) || new Set();
            for (const dependentId of dependents) {
                dfs(dependentId);
            }

            // Backtrack (optional, but for impact analysis we generally want to avoid re-visiting regardless of path)
            // visited.delete(currentId); 
        };

        dfs(tokenId);
        return impacted;
    }

    /**
     * Detects orphans (variables not used by anyone and not bound to Figma nodes - logic to be extended)
     * Currently returns tokens that have 0 dependents.
     */
    detectOrphans(): TokenEntity[] {
        return Array.from(this.nodes.values()).filter(token => {
            const dependents = this.reverseAdjacencyList.get(token.id);
            return !dependents || dependents.size === 0;
        });
    }

    reset(): void {
        this.nodes.clear();
        this.adjacencyList.clear();
        this.reverseAdjacencyList.clear();
    }
}
