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
     * Performs a full synchronization from Figma variables to the internal Graph.
     * Returns the synced tokens.
     */
    async sync(): Promise<TokenEntity[]> {
        const tokens = await this.variableManager.syncFromFigma();

        // 🧠 Usage Analysis Injection
        // We enrich the tokens with usage data during sync to ensure the Repository
        // explicitly holds the usage state as part of the Token Entity.
        try {
            // Lazy load analyzer to avoid circular deps if any
            const { TokenUsageAnalyzer } = await import('../../features/tokens/domain/TokenUsageAnalyzer');
            const analyzer = new TokenUsageAnalyzer();
            const usageMap = await analyzer.analyze();

            tokens.forEach(t => {
                if (usageMap.has(t.id)) {
                    t.usage = usageMap.get(t.id);
                }
            });
        } catch (e) {
            console.error('Failed to analyze usage during sync:', e);
        }

        // Update Graph
        this.repository.reset();
        tokens.forEach(t => this.repository.addNode(t));

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
