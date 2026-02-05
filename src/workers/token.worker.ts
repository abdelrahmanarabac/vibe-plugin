/**
 * 🔧 Token Processing Worker
 * 
 * Handles CPU-intensive operations off the main thread:
 * - Search indexing
 * - Token filtering
 * - Dependency graph analysis
 * - Usage calculations
 */

import type { TokenEntity } from '../core/types';

// Worker message types
export type WorkerMessage =
    | { type: 'INDEX_TOKENS'; payload: TokenEntity[] }
    | { type: 'SEARCH'; payload: { query: string; tokens: TokenEntity[] } }
    | { type: 'ANALYZE_DEPENDENCIES'; payload: { tokenId: string; tokens: TokenEntity[] } }
    | { type: 'FILTER_TOKENS'; payload: { filter: FilterCriteria; tokens: TokenEntity[] } };

export type WorkerResponse =
    | { type: 'INDEX_COMPLETE'; payload: SearchIndex }
    | { type: 'SEARCH_RESULTS'; payload: TokenEntity[] }
    | { type: 'DEPENDENCIES'; payload: { ancestors: TokenEntity[]; descendants: TokenEntity[] } }
    | { type: 'FILTERED_TOKENS'; payload: TokenEntity[] }
    | { type: 'ERROR'; payload: { message: string } };

interface SearchIndex {
    byName: Map<string, number[]>;
    byPath: Map<string, number[]>;
    byType: Map<string, number[]>;
}

export interface FilterCriteria {
    type?: string;
    collection?: string;
    hasUsage?: boolean;
    minUsageCount?: number;
}

// Global search index (built once, reused)
let searchIndex: SearchIndex = {
    byName: new Map(),
    byPath: new Map(),
    byType: new Map()
};

// Handle messages from main thread
self.onmessage = (event: MessageEvent<WorkerMessage>) => {
    const { type, payload } = event.data;

    try {
        switch (type) {
            case 'INDEX_TOKENS':
                handleIndexing(payload);
                break;
            case 'SEARCH':
                handleSearch(payload);
                break;
            case 'ANALYZE_DEPENDENCIES':
                handleDependencyAnalysis(payload);
                break;
            case 'FILTER_TOKENS':
                handleFiltering(payload);
                break;
        }
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            payload: { message: error instanceof Error ? error.message : 'Unknown error' }
        } as WorkerResponse);
    }
};

/**
 * Build search index from tokens
 */
function handleIndexing(tokens: TokenEntity[]): void {
    // console.log(`[Worker] Indexing ${tokens.length} tokens...`);

    searchIndex = {
        byName: new Map(),
        byPath: new Map(),
        byType: new Map()
    };

    tokens.forEach((token, index) => {
        // Index by name (normalized)
        const nameParts = token.name.toLowerCase().split(/[-_./]/);
        nameParts.forEach(part => {
            if (!searchIndex.byName.has(part)) {
                searchIndex.byName.set(part, []);
            }
            searchIndex.byName.get(part)!.push(index);
        });

        // Index by path
        token.path.forEach(pathPart => {
            const normalized = pathPart.toLowerCase();
            if (!searchIndex.byPath.has(normalized)) {
                searchIndex.byPath.set(normalized, []);
            }
            searchIndex.byPath.get(normalized)!.push(index);
        });

        // Index by type
        const type = token.$type.toLowerCase();
        if (!searchIndex.byType.has(type)) {
            searchIndex.byType.set(type, []);
        }
        searchIndex.byType.get(type)!.push(index);
    });

    // console.log(`[Worker] Indexing complete in ${duration.toFixed(2)}ms`);

    self.postMessage({
        type: 'INDEX_COMPLETE',
        payload: searchIndex
    } as WorkerResponse);
}

/**
 * Fast search using pre-built index
 */
function handleSearch(payload: { query: string; tokens: TokenEntity[] }): void {
    const { query, tokens } = payload;
    const lowerQuery = query.toLowerCase();
    const matchedIndices = new Set<number>();

    // Search in name index
    searchIndex.byName.forEach((indices, key) => {
        if (key.includes(lowerQuery)) {
            indices.forEach(idx => matchedIndices.add(idx));
        }
    });

    // Search in path index
    searchIndex.byPath.forEach((indices, key) => {
        if (key.includes(lowerQuery)) {
            indices.forEach(idx => matchedIndices.add(idx));
        }
    });

    // Search in type index (exact match for type)
    if (searchIndex.byType.has(lowerQuery)) {
        searchIndex.byType.get(lowerQuery)!.forEach(idx => matchedIndices.add(idx));
    }

    // Map indices back to tokens
    const results = Array.from(matchedIndices)
        .map(idx => tokens[idx])
        .filter(Boolean);

    self.postMessage({
        type: 'SEARCH_RESULTS',
        payload: results
    } as WorkerResponse);
}

/**
 * Analyze token dependencies (ancestors and descendants)
 */
function handleDependencyAnalysis(payload: { tokenId: string; tokens: TokenEntity[] }): void {
    const { tokenId, tokens } = payload;

    // Build quick lookup map
    const tokenMap = new Map<string, TokenEntity>();
    tokens.forEach(t => tokenMap.set(t.id, t));

    const targetToken = tokenMap.get(tokenId);
    if (!targetToken) {
        self.postMessage({
            type: 'DEPENDENCIES',
            payload: { ancestors: [], descendants: [] }
        } as WorkerResponse);
        return;
    }

    // Find ancestors (DFS)
    const ancestors = new Set<string>();
    const findAncestors = (currentId: string) => {
        const token = tokenMap.get(currentId);
        if (!token) return;

        token.dependencies.forEach(depId => {
            if (!ancestors.has(depId)) {
                ancestors.add(depId);
                findAncestors(depId);
            }
        });
    };
    findAncestors(tokenId);

    // Find descendants (DFS)
    const descendants = new Set<string>();
    const findDescendants = (currentId: string) => {
        const token = tokenMap.get(currentId);
        if (!token) return;

        token.dependents.forEach(depId => {
            if (!descendants.has(depId)) {
                descendants.add(depId);
                findDescendants(depId);
            }
        });
    };
    findDescendants(tokenId);

    self.postMessage({
        type: 'DEPENDENCIES',
        payload: {
            ancestors: Array.from(ancestors).map(id => tokenMap.get(id)!).filter(Boolean),
            descendants: Array.from(descendants).map(id => tokenMap.get(id)!).filter(Boolean)
        }
    } as WorkerResponse);
}

/**
 * Filter tokens by criteria
 */
function handleFiltering(payload: { filter: FilterCriteria; tokens: TokenEntity[] }): void {
    const { filter, tokens } = payload;

    const filtered = tokens.filter(token => {
        // Filter by type
        if (filter.type && token.$type !== filter.type) {
            return false;
        }

        // Filter by collection
        if (filter.collection && token.$extensions.figma.collectionId !== filter.collection) {
            return false;
        }

        // Filter by usage existence
        if (filter.hasUsage !== undefined) {
            const hasUsage = Boolean(token.usage && token.usage.totalRawUsage > 0);
            if (hasUsage !== filter.hasUsage) {
                return false;
            }
        }

        // Filter by minimum usage count
        if (filter.minUsageCount !== undefined) {
            const usageCount = token.usage?.totalRawUsage || 0;
            if (usageCount < filter.minUsageCount) {
                return false;
            }
        }

        return true;
    });

    self.postMessage({
        type: 'FILTERED_TOKENS',
        payload: filtered
    } as WorkerResponse);
}
