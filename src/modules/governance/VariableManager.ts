import type { TokenEntity } from '../../core/types';
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
     * Creates a new variable via repository.
     */
    async createVariable(name: string, type: 'color' | 'number' | 'string', value: any): Promise<void> {
        await this.figmaRepo.create(name, type, value);
    }

    /**
     * Updates a variable value directly via repository.
     */
    async updateVariable(id: string, value: any): Promise<void> {
        await this.figmaRepo.update(id, value);
    }

    async renameVariable(id: string, newName: string): Promise<void> {
        await this.figmaRepo.rename(id, newName);
    }
}
