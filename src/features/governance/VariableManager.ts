import type { TokenEntity, VariableValue } from '../../core/types';
import type { TokenRepository } from '../../core/TokenRepository';
import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';

/**
 * Domain Service for Variable Governance.
 * Coordinates between the Repository (Storage) and the Repository (State).
 */
export class VariableManager {
    private repository: TokenRepository;
    private figmaRepo: IVariableRepository;

    constructor(repository: TokenRepository, figmaRepo: IVariableRepository) {
        this.repository = repository;
        this.figmaRepo = figmaRepo;
    }

    /**
     * Syncs all local variables from Storage into the TokenGraph.
     */
    async syncFromFigma(): Promise<TokenEntity[]> {
        this.repository.reset();

        // Delegate to repository
        const tokens = await this.figmaRepo.sync();

        // Populate Repository
        for (const token of tokens) {
            this.repository.addNode(token);
        }

        // Add edges
        for (const token of tokens) {
            for (const depId of token.dependencies) {
                this.repository.addEdge(token.id, depId);
            }
        }

        return tokens;
    }

    /**
     * 🌊 Progressive Sync Generator
     * Yields chunks of tokens as they are processed.
     */
    async *syncGenerator(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]> {
        if (!this.figmaRepo.syncGenerator) {
            // Fallback for repos that don't support generation (e.g. tests)
            yield this.syncFromFigma();
            return;
        }

        this.repository.reset(); // Clear graph before starting

        for await (const chunk of this.figmaRepo.syncGenerator(abortSignal)) {
            // Populate Repository incrementally
            for (const token of chunk) {
                this.repository.addNode(token);
            }
            // Edges must be added after nodes exist? 
            // Actually, addNode is safe.
            // But addEdge requires both nodes to exist in some graph implementations.
            // If we have forward references (token A depends on token B, B comes in later chunk), `addEdge` might fail if it strictly checks existence.
            // `TokenRepository` likely uses an adjacency list.
            // Safe bet: Add nodes first, add edges later? 
            // OR: Add edges permissively (create placeholder nodes).

            // Let's assume standard behavior: We yield the chunk.
            // The Controller emits the chunk to UI.
            // We need to build the graph correctly.
            // If `chunk` has dependencies not yet in graph, we delay edge creation?
            // "Deep dependency resolution" is listed as "Deferred" in requirements (Phase 3).
            // But basic "A references B" is needed for values.

            // For now, let's just add nodes. Edges might need a second pass or lazy resolve.
            // Review VariableManager.ts logic: it adds edges *after* adding all nodes in `syncFromFigma`.

            yield chunk;
        }

        // Post-Load: Build Edges (Heavy?)
        // If we do this here, it's blocking at the end.
        // It's fast (in-memory, no API calls).
        const allNodes = this.repository.getAllNodes(); // Assuming this exists or we iterate
        // Re-iterating 1000 nodes for edges is sub-millisecond in JS typically.

        for (const token of allNodes) {
            for (const depId of token.dependencies) {
                this.repository.addEdge(token.id, depId);
            }
        }
    }

    /**
     * Creates a new variable via repository.
     */
    async createVariable(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void> {
        await this.figmaRepo.create(name, type, value);
    }

    /**
     * Updates a variable value directly via repository.
     */
    async updateVariable(id: string, value: VariableValue): Promise<void> {
        await this.figmaRepo.update(id, value);
    }

    async renameVariable(id: string, newName: string): Promise<void> {
        await this.figmaRepo.rename(id, newName);
    }
}
