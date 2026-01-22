import type { TokenEntity } from '../../core/types';
import type { TokenGraph } from '../../core/TokenGraph';
import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';

/**
 * Domain Service for Variable Governance.
 * Coordinates between the Repository (Storage) and the Graph (State).
 */
export class VariableManager {
    private graph: TokenGraph;
    private repository: IVariableRepository;

    constructor(graph: TokenGraph, repository: IVariableRepository) {
        this.graph = graph;
        this.repository = repository;
    }

    /**
     * Syncs all local variables from Storage into the TokenGraph.
     */
    async syncFromFigma(): Promise<TokenEntity[]> {
        this.graph.reset();

        // Delegate to repository
        const tokens = await this.repository.sync();

        // Populate Graph
        for (const token of tokens) {
            this.graph.addNode(token);
        }

        // Add edges
        for (const token of tokens) {
            for (const depId of token.dependencies) {
                this.graph.addEdge(token.id, depId);
            }
        }

        return tokens;
    }

    /**
     * Creates a new variable via repository.
     */
    async createVariable(name: string, type: 'color' | 'number' | 'string', value: any): Promise<void> {
        await this.repository.create(name, type, value);
    }

    /**
     * Updates a variable value directly via repository.
     */
    async updateVariable(id: string, value: any): Promise<void> {
        await this.repository.update(id, value);
    }

    async renameVariable(id: string, newName: string): Promise<void> {
        await this.repository.rename(id, newName);
    }
}
