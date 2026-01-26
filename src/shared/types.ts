export type PluginAction =
    | { type: 'REQUEST_GRAPH' }
    | { type: 'REQUEST_STATS' }
    | { type: 'SCAN_VARS' }
    | { type: 'SYNC_GRAPH' }
    | { type: 'SYNC_VARIABLES' }
    | { type: 'GENERATE_DOCS' }
    | { type: 'CREATE_VARIABLE'; payload: { name: string; type: 'color' | 'number' | 'string'; value: any } }
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
    | { type: 'CREATE_TOKENS'; payload: { name: string; tokens: any[] } }
    | { type: 'CREATE_TOKEN'; payload: { name: string; type: 'color' | 'number' | 'string'; value: any } }
    | { type: 'UPDATE_TOKEN'; id: string; newValue: any }
    | { type: 'RENAME_TOKEN'; payload: { id: string; newName: string } }
    | { type: 'CREATE_STYLE'; payload: { name: string; type: 'typography' | 'effect' | 'grid'; value: any } };

export type PluginEvent =
    | { type: 'SCAN_COMPLETE'; payload: any }
    | { type: 'SCAN_RESULT'; primitives: any[] }
    | { type: 'GRAPH_SYNCED'; tokens: any[]; timestamp?: number }
    | { type: 'GRAPH_UPDATED'; tokens: any[]; timestamp: number }
    | { type: 'STATS_UPDATED'; payload: { totalVariables: number; collections: number; styles: number } }
    | { type: 'VARIABLE_CREATED'; payload: { id: string; name: string } }
    | { type: 'VARIABLE_UPDATED'; id: string }
    | { type: 'RENAME_COLLECTIONS_RESULT'; payload: any }
    | { type: 'RENAME_COLLECTION_RESULT'; payload: { collectionId: string; success: boolean } }
    | { type: 'PREVIEW_CLASSIFICATIONS_RESULT'; payload: any }
    | { type: 'STORAGE_GET_RESPONSE'; key: string; value: any }
    | { type: 'MEMORY_LOAD_RESPONSE'; key: string; data: any }
    | { type: 'ERROR'; message: string }
    | { type: 'IMPACT_REPORT'; payload: any };
