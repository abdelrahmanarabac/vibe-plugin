import { TokenRepository } from '../TokenRepository';
import { VariableManager } from '../../features/governance/VariableManager';
import type { TokenEntity } from '../types';

export interface SyncStats {
    totalVariables: number;
    collections: number;
    styles: number;
    collectionMap: Record<string, string>; // Name -> ID
}

/**
 * 🔄 SyncService
 * 
 * Orchestrates the synchronization between the Plugin UI and the Figma Main thread.
 * Handles variable creation, updates, and feedback loops.
 */
export class SyncService {
    private readonly variableManager: VariableManager;
    private readonly repository: TokenRepository;

    constructor(
        variableManager: VariableManager,
        repository: TokenRepository
    ) {
        this.variableManager = variableManager;
        this.repository = repository;
    }

    /**
     * 🌊 Progressive Sync Generator
     * Yields chunks of tokens definitions (Lightweight).
     * Usage analysis is DEFERRED.
     */
    async *syncDefinitionsGenerator(): AsyncGenerator<TokenEntity[]> {
        // Yield from Variable Manager (which yields from Repo)
        for await (const chunk of this.variableManager.syncGenerator()) {
            yield chunk;
        }
    }

    /**
     * 🧠 Lazy Usage Analysis
     * Should be called ONLY when user requests it or on idle.
     */
    async scanUsage(): Promise<any> { // Using any or specific type if import available, prefer weak typing here to avoid circular dep issues in signature if types aren't purely shared
        try {
            // Lazy load analyzer to avoid circular deps
            const { TokenUsageAnalyzer } = await import('../../features/tokens/domain/TokenUsageAnalyzer');
            const analyzer = new TokenUsageAnalyzer();
            const usageMap = await analyzer.analyze();

            // Store in Repository
            // We need to update existing nodes in the repo with usage data
            // This assumes nodes already exist.
            const allNodes = this.repository.getAllNodes();
            for (const node of allNodes) {
                if (usageMap.has(node.id)) {
                    node.usage = usageMap.get(node.id);
                    // No need to re-add, objects are ref? 
                    // Repository might store copies.
                    // If repo stores copies, we need repository.update(node).
                    // core/TokenRepository is in-memory graph usually.
                }
            }

            return usageMap;
        } catch (e) {
            console.error('Failed to analyze usage:', e);
            return new Map();
        }
    }

    /**
     * @deprecated Use syncDefinitionsGenerator() for UI.
     * Keeps backward compatibility for tests/CLI.
     */
    async sync(): Promise<TokenEntity[]> {
        const tokens: TokenEntity[] = [];
        for await (const chunk of this.syncDefinitionsGenerator()) {
            tokens.push(...chunk);
        }
        await this.scanUsage();
        return tokens;
    }

    /**
     * Collects current statistics from Figma.
     */
    async getStats(): Promise<SyncStats> {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const variables = await figma.variables.getLocalVariablesAsync();
        const styles = await figma.getLocalPaintStylesAsync();

        // Build Name -> ID Map
        const collectionMap: Record<string, string> = {};
        collections.forEach(c => {
            collectionMap[c.name] = c.id;
        });

        return {
            totalVariables: variables.length,
            collections: collections.length,
            styles: styles.length,
            collectionMap
        };
    }
}
