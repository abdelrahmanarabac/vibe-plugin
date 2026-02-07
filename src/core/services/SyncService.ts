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
    async *syncDefinitionsGenerator(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]> {
        // Yield from Variable Manager (which yields from Repo)
        for await (const chunk of this.variableManager.syncGenerator(abortSignal)) {
            yield chunk;
        }
    }

    /**
     * 🌊 Progressive Sync with Integrated Incremental Usage
     * Phase 1: Definitions
     * Phase 2: Usage Analysis (Incremental)
     */
    async *syncWithUsageGenerator(
        abortSignal?: AbortSignal
    ): AsyncGenerator<{
        tokens: TokenEntity[];
        usageMap?: any;
        chunkIndex: number;
        isLast: boolean;
        phase: 'definitions' | 'usage';
    }> {
        // Phase 1: Definitions
        let chunkIndex = 0;
        for await (const chunk of this.variableManager.syncGenerator(abortSignal)) {
            if (abortSignal?.aborted) return;

            yield {
                tokens: chunk,
                chunkIndex: chunkIndex++,
                isLast: false,
                phase: 'definitions'
            };
        }

        // Phase 2: Usage Analysis (REMOVED - Handled by Controller Pre-calculation)
        // We yield a final "complete" signal or just end.
        // The controller will detect end of iteration.
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

    /**
     * ☁️ Cloud Sync (Worker Proxy)
     * Pushes generic token data to the persistent store via Cloudflare Worker.
     */
    async pushToCloud(tokens: TokenEntity[]): Promise<boolean> {
        try {
            // Lazy load to ensure minimal bundle size if not used
            const { VibeWorkerClient } = await import('../../infrastructure/network/VibeWorkerClient');

            // 🛑 Chunking strategy could be implemented here if payload is too large
            // For now, we push the whole batch as the worker snippet implies simple proxy
            const { error } = await VibeWorkerClient.syncTokens(tokens);

            if (error) {
                console.error('[SyncService] Cloud push failed:', error);
                return false;
            }
            return true;
        } catch (e) {
            console.error('[SyncService] Cloud push exception:', e);
            return false;
        }
    }
}
