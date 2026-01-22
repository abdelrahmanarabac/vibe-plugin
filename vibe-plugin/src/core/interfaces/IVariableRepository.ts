/**
 * IVariableRepository - Repository Pattern for Figma Variables
 * 
 * Abstracts Figma API calls, allowing:
 * 1. Domain logic to be tested without Figma
 * 2. Easy swapping of implementations (mock, real, cached)
 * 3. Clear separation of concerns (Domain vs Infrastructure)
 * 
 * Implementation: FigmaVariableRepository in src/infra/
 */

import type { TokenEntity } from '../types';

export interface IVariableRepository {
    /**
     * Fetch all local variables as TokenEntities
     */
    getAll(): Promise<TokenEntity[]>;

    /**
     * Fetch a single variable by ID
     */
    getById(id: string): Promise<TokenEntity | null>;

    /**
     * Create a new variable
     */
    create(token: TokenEntity): Promise<void>;

    /**
     * Update an existing variable
     */
    update(id: string, updates: Partial<TokenEntity>): Promise<void>;

    /**
     * Delete a variable
     */
    delete(id: string): Promise<void>;

    /**
     * Batch operation: sync all variables in a collection
     */
    syncCollection(collectionId: string): Promise<TokenEntity[]>;
}
