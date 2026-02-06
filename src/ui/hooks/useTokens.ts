import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { uiSyncManager } from '../services/UISyncManager';
import type { TokenEntity } from '../../core/types';
import { type SceneNodeAnatomy } from '../../features/perception/visitors/HierarchyVisitor';
import type { TokenFormData } from '../../features/tokens/domain/ui-types';

interface TokenStats {
    totalVariables: number;
    collections: number;
    styles: number;
    collectionNames: string[];
    collectionMap?: Record<string, string>;
    lastSync: number;
}

export interface TokensViewModel {
    tokens: TokenEntity[];
    anatomy: SceneNodeAnatomy[];
    stats: TokenStats;
    isSynced: boolean;
    liveIndicator: boolean;
    isSyncing: boolean;
    syncProgress: number;
    syncStatus: string;
    scanUsage: () => void;
    updateToken: (id: string, value: string) => void;
    createToken: (data: TokenFormData) => Promise<boolean>;
    scanAnatomy: () => void;
    createCollection: (name: string) => Promise<string | null>;
    renameCollection: (oldName: string, newName: string) => void;
    deleteCollection: (name: string) => Promise<void>;
    traceLineage: (tokenId: string) => void;
    syncVariables: () => void;
    resetSync: () => void;
    lineageData: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

export function useTokens(): TokensViewModel {
    // 1. Core State
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [syncState, setSyncState] = useState(uiSyncManager.getState());
    const [anatomy, setAnatomy] = useState<SceneNodeAnatomy[]>([]);

    // 2. Raw Stats from Backend
    const [backendStats, setBackendStats] = useState<TokenStats>({
        totalVariables: 0,
        collections: 0,
        styles: 0,
        collectionNames: [],
        lastSync: 0
    });

    const [isSynced, setIsSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);
    const [lineageData, setLineageData] = useState<{ target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null>(null);

    // Refs for Promises
    const creationPromise = useRef<((success: boolean) => void) | null>(null);
    const collectionPromise = useRef<((id: string | null) => void) | null>(null);
    const deletePromise = useRef<{ resolve: () => void, reject: (reason?: Error | string) => void } | null>(null);

    // ⚡ Computed Stats (FIX #1: Source of Truth Unification)
    // بنخلي الرقم يعتمد على اللي موجود فعلياً في الميموري لو متاح
    const stats = useMemo(() => {
        return {
            ...backendStats,
            // لو عندنا توكنز فعلية، نستخدم عددهم، غير كده نستخدم اللي جاي من الباك إند
            totalVariables: tokens.length > 0 ? tokens.length : backendStats.totalVariables
        };
    }, [tokens.length, backendStats]);

    // ⚡ Subscribe to UISyncManager
    useEffect(() => {
        const unsubState = uiSyncManager.onStateChange(setSyncState);
        const unsubTokens = uiSyncManager.onTokensUpdate(setTokens);
        return () => {
            unsubState();
            unsubTokens();
        };
    }, []);

    // ⚡ Message Handling
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'ANATOMY_UPDATED' || (type === 'GET_ANATOMY_SUCCESS')) {
                if (payload && Array.isArray(payload.anatomy)) {
                    setAnatomy(payload.anatomy);
                }
            }

            if (type === 'STATS_UPDATED' || type === 'REQUEST_STATS_SUCCESS') {
                setBackendStats({
                    totalVariables: payload.totalVariables ?? 0,
                    collections: payload.collections ?? 0,
                    styles: payload.styles ?? 0,
                    collectionNames: payload.collectionNames ?? [],
                    collectionMap: payload.collectionMap ?? {},
                    lastSync: Date.now()
                });
            }

            if (type === 'TRACE_LINEAGE_SUCCESS') {
                if (payload && payload.target) {
                    setLineageData(payload);
                }
            }

            if (type === 'CREATE_VARIABLE_SUCCESS') {
                omnibox.show('Token created successfully', { type: 'success' });
                creationPromise.current?.(true);
            }
            if (type === 'CREATE_VARIABLE_ERROR') {
                omnibox.show(payload.message, { type: 'error' });
                creationPromise.current?.(false);
            }

            if (type === 'CREATE_COLLECTION_SUCCESS') {
                omnibox.show(`Collection created`, { type: 'success' });
                if (payload.collectionMap) {
                    setBackendStats(prev => ({
                        ...prev,
                        collections: payload.collections ? payload.collections.length : prev.collections,
                        collectionNames: payload.collections || prev.collectionNames,
                        collectionMap: payload.collectionMap,
                        lastSync: Date.now()
                    }));
                }
                collectionPromise.current?.(payload.collectionId);
                collectionPromise.current = null;
            }

            if (type === 'CREATE_COLLECTION_ERROR') {
                omnibox.show(payload.message || 'Failed to create collection', { type: 'error' });
                collectionPromise.current?.(null);
                collectionPromise.current = null;
            }

            if (type === 'DELETE_COLLECTION_SUCCESS') {
                const deletedName = payload.deletedName || 'Collection';
                omnibox.show(`${deletedName} deleted`, { type: 'success' });

                if (payload.collectionMap) {
                    setBackendStats(prev => ({
                        ...prev,
                        collections: Object.keys(payload.collectionMap).length,
                        collectionNames: Object.keys(payload.collectionMap),
                        collectionMap: payload.collectionMap,
                        lastSync: Date.now()
                    }));
                }

                if (deletePromise.current) {
                    deletePromise.current.resolve();
                    deletePromise.current = null;
                }
            }

            if (type === 'DELETE_COLLECTION_ERROR' || (type === 'OMNIBOX_NOTIFY' && payload.type === 'error' && deletePromise.current)) {
                omnibox.show(payload.message || 'Failed to delete collection', { type: 'error' });

                if (deletePromise.current) {
                    deletePromise.current.reject(payload.message);
                    deletePromise.current = null;
                }
            }

            // ⚡ FIX #2: KILL THE SPINNER
            if (type === 'SYNC_COMPLETE') {
                // 1. وقف مؤشر التحميل في الـ Manager فوراً
                uiSyncManager.reset();

                // 2. تحديث الحالة المحلية
                setIsSynced(true); // خليها true عشان نعرف إننا خلصنا
                setLiveIndicator(true);

                omnibox.show('Sync Complete', { type: 'success', duration: 2000 });
                setTimeout(() => setLiveIndicator(false), 2000);
            }

            if (type === 'SYNC_CANCELLED') {
                uiSyncManager.reset();
                setIsSynced(false);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const scanAnatomy = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'GET_ANATOMY' } }, '*');
    }, []);

    const updateToken = useCallback((id: string, value: string) => {
        setTokens(current =>
            current.map(t => t.id === id ? { ...t, $value: value } : t)
        );
        parent.postMessage({ pluginMessage: { type: 'UPDATE_TOKEN', id, value } }, '*');
    }, []);

    const createToken = useCallback((data: TokenFormData) => {
        return new Promise<boolean>((resolve) => {
            omnibox.show(`Creating ${data.name}...`, { type: 'loading', duration: 0 });
            creationPromise.current = resolve;
            parent.postMessage({ pluginMessage: { type: 'CREATE_VARIABLE', payload: data } }, '*');
        });
    }, []);

    const traceLineage = useCallback((tokenId: string) => {
        parent.postMessage({ pluginMessage: { type: 'TRACE_LINEAGE', payload: { tokenId } } }, '*');
    }, []);

    const createCollection = useCallback((name: string) => {
        return new Promise<string | null>((resolve) => {
            omnibox.show(`Creating ${name}...`, { type: 'loading', duration: 0 });
            collectionPromise.current = resolve;
            parent.postMessage({ pluginMessage: { type: 'CREATE_COLLECTION', payload: { name } } }, '*');
        });
    }, []);

    const renameCollection = useCallback((oldName: string, newName: string) => {
        omnibox.show(`Renaming ${oldName}...`, { type: 'loading', duration: 0 });
        parent.postMessage({ pluginMessage: { type: 'RENAME_COLLECTION', payload: { oldName, newName } } }, '*');
    }, []);

    const deleteCollection = useCallback((name: string) => {
        return new Promise<void>((resolve, reject) => {
            omnibox.show(`Deleting ${name}...`, { type: 'loading', duration: 0 });
            deletePromise.current = { resolve, reject };
            const id = backendStats.collectionMap?.[name]; // Use backendStats here
            parent.postMessage({ pluginMessage: { type: 'DELETE_COLLECTION', payload: { name, id } } }, '*');
        });
    }, [backendStats.collectionMap]);

    const scanUsage = useCallback(() => {
        omnibox.show('Scanning usage...', { type: 'loading', duration: 0 });
        parent.postMessage({ pluginMessage: { type: 'SCAN_USAGE' } }, '*');
    }, []);

    const syncVariables = useCallback(() => {
        setIsSynced(false);
        omnibox.show('Starting sync...', { type: 'loading', duration: 0 });

        // Pass known count to help manager estimate progress
        uiSyncManager.startSync(backendStats.totalVariables || undefined);

        parent.postMessage({ pluginMessage: { type: 'SYNC_TOKENS' } }, '*');
    }, [backendStats.totalVariables]);

    const resetSync = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'SYNC_CANCEL' } }, '*');
        uiSyncManager.reset();
        setIsSynced(false);
        omnibox.show('Sync cancelled', { type: 'info' });
    }, []);

    return {
        tokens,
        anatomy,
        stats, // This is now the Computed Stats
        isSynced,
        liveIndicator,
        lineageData,
        isSyncing: syncState.isLoading,
        syncProgress: syncState.progress,
        syncStatus: `${syncState.loadedTokens} / ${syncState.totalTokens || '?'} tokens`,
        scanUsage,
        updateToken,
        createToken,
        createCollection,
        renameCollection,
        deleteCollection,
        scanAnatomy,
        traceLineage,
        syncVariables,
        resetSync
    };
}
