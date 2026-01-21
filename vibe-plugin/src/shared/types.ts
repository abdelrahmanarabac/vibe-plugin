export type PluginAction =
    | { type: 'SCAN_VARS' }
    | { type: 'SCAN_SELECTION' }
    | { type: 'SCAN_IMAGE' }
    | { type: 'SYNC_GRAPH' }
    | { type: 'GENERATE_DOCS' }
    | { type: 'CREATE_COMPONENT'; recipe: { type: string; variant: string } }
    | { type: 'CREATE_VARIABLE'; payload: { name: string; type: 'color' | 'number' | 'string'; value: any } }
    | { type: 'UPDATE_VARIABLE'; id: string; newValue: any }
    | { type: 'UPDATE_VARIABLE'; id: string; newValue: any }
    | { type: 'RENAME_COLLECTION'; payload: { oldName: string; newName: string } }
    | { type: 'RENAME_COLLECTIONS'; payload: { dryRun: boolean } }
    | { type: 'RENAME_COLLECTION_BY_ID'; payload: { collectionId: string } }
    | { type: 'PREVIEW_CLASSIFICATIONS' }
    | { type: 'NOTIFY'; message: string }
    | { type: 'RESIZE_WINDOW'; width: number; height: number }
    | { type: 'STORAGE_GET'; key: string }
    | { type: 'STORAGE_SET'; key: string; value: any }
    | { type: 'STORAGE_REMOVE'; key: string }
    | { type: 'MEMORY_SAVE'; key: string; data: any }
    | { type: 'MEMORY_LOAD'; key: string }
    | { type: 'CREATE_TOKENS'; payload: { name: string; tokens: any[] } };

export type PluginEvent =
    | { type: 'SCAN_COMPLETE'; payload: any }
    | { type: 'SCAN_RESULT'; primitives: any[] }
    | { type: 'SCAN_IMAGE_RESULT'; bytes: Uint8Array }
    | { type: 'GRAPH_SYNCED'; tokens: any[] }
    | { type: 'VARIABLE_CREATED'; payload: { id: string; name: string } }
    | { type: 'VARIABLE_UPDATED'; id: string }
    | { type: 'RENAME_COLLECTIONS_RESULT'; payload: any }
    | { type: 'RENAME_COLLECTION_RESULT'; payload: { collectionId: string; success: boolean } }
    | { type: 'PREVIEW_CLASSIFICATIONS_RESULT'; payload: any }
    | { type: 'STORAGE_GET_RESPONSE'; key: string; value: any }
    | { type: 'MEMORY_LOAD_RESPONSE'; key: string; data: any }
    | { type: 'ERROR'; message: string }
    | { type: 'IMPACT_REPORT'; payload: any };
