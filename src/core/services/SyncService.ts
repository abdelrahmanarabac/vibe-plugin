import { TokenRepository } from '../TokenRepository';
import { VariableManager } from '../../modules/governance/VariableManager';

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
    async sync(): Promise<any[]> {
        const tokens = await this.variableManager.syncFromFigma();

        // Update Graph
        this.repository.reset();
        tokens.forEach(t => this.repository.addNode(t));

        return tokens;
    }

    /**
     * Collects current statistics from Figma.
     */
    async getStats() {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const variables = await figma.variables.getLocalVariablesAsync();
        const styles = await figma.getLocalPaintStylesAsync();

        return {
            totalVariables: variables.length,
            collections: collections.length,
            styles: styles.length
        };
    }
}
