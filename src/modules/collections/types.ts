// src/modules/collections/types.ts
export type CollectionType = 'Primitives' | 'Semantic' | 'Component' | 'Unknown';

export interface CollectionClassification {
    collectionId: string;
    currentName: string;
    proposedName: CollectionType;
    confidence: number;
    reason: string;
    variables: VariableInfo[];
}

export interface VariableInfo {
    id: string;
    name: string;
    type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
    hasAliases: boolean;
    scopes: ReadonlyArray<VariableScope>;
}

export interface RenameResult {
    success: boolean;
    renamedCount: number;
    skippedCount: number;
    errors: { collectionId: string; error: string }[];
}
