import type { TokenEntity } from '../types';

/**
 * Repository Interface for Variable Management.
 * Decouples Business Logic from Figma API calls.
 */
export interface IVariableRepository {
    /**
     * Syncs all tokens from the external source (Figma)
     */
    sync(): Promise<TokenEntity[]>;
    syncGenerator?(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]>; // 🌊 Progressive Sync

    /**
     * Creates a new variable in the external source
     */
    create(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void>;

    /**
     * Updates an existing variable
     */
    update(id: string, value: VariableValue): Promise<void>;

    /**
     * Renames a variable
     */
    rename(id: string, newName: string): Promise<void>;

    /**
     * Moves a var to a specific collection (if supported)
     */
    move?(id: string, targetCollectionId: string): Promise<void>;
}
