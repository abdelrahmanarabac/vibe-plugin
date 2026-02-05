export type PluginAction =
    | { type: 'REQUEST_GRAPH' }
    | { type: 'REQUEST_STATS' }
    | { type: 'PING' }
    | { type: 'SCAN_VARS' }
    | { type: 'SCAN_VARS' }
    | { type: 'SYNC_GRAPH' }
    | { type: 'SYNC_VARIABLES' }
    // 🛑 Manual Sync Control
    | { type: 'SYNC_START' }
    | { type: 'SYNC_CANCEL' }
    | { type: 'SCAN_USAGE' }
    | { type: 'GENERATE_DOCS' }
    | { type: 'CREATE_VARIABLE'; payload: { name: string; type: 'color' | 'number' | 'string'; value: string | number | { r: number; g: number; b: number; a?: number } } }
    | { type: 'UPDATE_VARIABLE'; id: string; newValue: string | number | { r: number; g: number; b: number; a?: number } }
    | { type: 'RENAME_COLLECTION'; payload: { oldName: string; newName: string } }
    | { type: 'RENAME_COLLECTIONS'; payload: { dryRun: boolean } }
    | { type: 'RENAME_COLLECTION_BY_ID'; payload: { collectionId: string } }
    | { type: 'PREVIEW_CLASSIFICATIONS' }
    | { type: 'NOTIFY'; message: string }
    | { type: 'STORAGE_GET'; key: string }
    | { type: 'STORAGE_SET'; key: string; value: unknown }
    | { type: 'STORAGE_REMOVE'; key: string }
    | { type: 'MEMORY_SAVE'; key: string; data: unknown }
    | { type: 'MEMORY_LOAD'; key: string }
    | { type: 'CREATE_TOKENS'; payload: { name: string; tokens: unknown[] } }
    | { type: 'CREATE_TOKEN'; payload: { name: string; type: 'color' | 'number' | 'string'; value: string | number | { r: number; g: number; b: number; a?: number } } }
    | { type: 'UPDATE_TOKEN'; id: string; newValue: string | number | { r: number; g: number; b: number; a?: number } }
    | { type: 'RENAME_TOKEN'; payload: { id: string; newName: string } }
    | { type: 'CREATE_COLLECTION'; payload: { name: string } }
    | { type: 'CREATE_STYLE'; payload: { name: string; type: 'typography' | 'effect' | 'grid'; value: string | number | { r: number; g: number; b: number; a?: number } } };

export type PluginEvent =
    | { type: 'SCAN_COMPLETE'; payload: unknown }
    | { type: 'SCAN_RESULT'; primitives: unknown[] }
    | { type: 'GRAPH_SYNCED'; tokens: unknown[]; timestamp?: number }
    | { type: 'GRAPH_UPDATED'; tokens: unknown[]; timestamp: number }
    | { type: 'STATS_UPDATED'; payload: { totalVariables: number; collections: number; styles: number } }
    | { type: 'VARIABLE_CREATED'; payload: { id: string; name: string } }
    | { type: 'VARIABLE_UPDATED'; id: string }
    | { type: 'RENAME_COLLECTIONS_RESULT'; payload: unknown }
    | { type: 'RENAME_COLLECTION_RESULT'; payload: { collectionId: string; success: boolean } }
    | { type: 'PREVIEW_CLASSIFICATIONS_RESULT'; payload: unknown }
    | { type: 'STORAGE_GET_RESPONSE'; key: string; value: unknown }
    | { type: 'MEMORY_LOAD_RESPONSE'; key: string; data: unknown }
    | { type: 'ERROR'; message: string }
    | { type: 'IMPACT_REPORT'; payload: unknown }
    | { type: 'SYNC_CANCELLED' }
    // 🌊 Progressive Sync Events
    | { type: 'SYNC_PHASE_START'; phase: 'definitions' | 'usage' }
    | { type: 'SYNC_CHUNK'; tokens: unknown[]; progress: number }
    | { type: 'SYNC_PHASE_COMPLETE'; phase: 'definitions' | 'usage' };
