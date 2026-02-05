import { useRef, useState, useEffect, useCallback } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { uiSyncManager } from '../services/UISyncManager'; // ⚡ USE THE MANAGER!
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

    // 🌊 Progressive State
    isSyncing: boolean;
    syncProgress: number;
    syncStatus: string;

    // 🌊 Lazy Triggers
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

/**
 * ⚡ OPTIMIZED useTokens Hook
 * 
 * Key Changes:
 * 1. Uses UISyncManager for progressive updates
 * 2. Immediate UI feedback (no blocking)
 * 3. Subscribes to token updates from manager
 */
export function useTokens(): TokensViewModel {
    // ⚡ Subscribe to UISyncManager
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [syncState, setSyncState] = useState(uiSyncManager.getState());

    const [anatomy, setAnatomy] = useState<SceneNodeAnatomy[]>([]);
    const [stats, setStats] = useState<TokenStats>({
        totalVariables: 0,
        collections: 0,
        styles: 0,
        collectionNames: [],
        lastSync: 0
    });
    const [isSynced, setIsSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);

    const [lineageData, setLineageData] = useState<{ target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null>(null);
    const creationPromise = useRef<((success: boolean) => void) | null>(null);
    const collectionPromise = useRef<((id: string | null) => void) | null>(null);
    const deletePromise = useRef<{ resolve: () => void, reject: (reason?: Error | string) => void } | null>(null);

    // ⚡ Subscribe to UISyncManager
    useEffect(() => {
        const unsubState = uiSyncManager.onStateChange(setSyncState);
        const unsubTokens = uiSyncManager.onTokensUpdate(setTokens);

        return () => {
            unsubState();
            unsubTokens();
        };
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'ANATOMY_UPDATED' || (type === 'GET_ANATOMY_SUCCESS')) {
                if (payload && Array.isArray(payload.anatomy)) {
                    setAnatomy(payload.anatomy);
                }
            }

            if (type === 'STATS_UPDATED' || type === 'REQUEST_STATS_SUCCESS') {
                setStats({
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
                if (creationPromise.current) {
                    creationPromise.current(true);
                    creationPromise.current = null;
                }
            }

            if (type === 'CREATE_VARIABLE_ERROR') {
                omnibox.show(payload.message || 'Failed to create token', { type: 'error' });

                if (creationPromise.current) {
                    creationPromise.current(false);
                    creationPromise.current = null;
                }
            }

            if (type === 'CREATE_COLLECTION_SUCCESS') {
                omnibox.show(`Collection created`, { type: 'success' });
                if (payload.collectionMap) {
                    setStats(prev => ({
                        ...prev,
                        collections: payload.collections ? payload.collections.length : prev.collections,
                        collectionNames: payload.collections || prev.collectionNames,
                        collectionMap: payload.collectionMap,
                        lastSync: Date.now()
                    }));
                }
                if (collectionPromise.current) {
                    collectionPromise.current(payload.collectionId);
                    collectionPromise.current = null;
                }
            }

            if (type === 'CREATE_COLLECTION_ERROR') {
                omnibox.show(payload.message || 'Failed to create collection', { type: 'error' });
                if (collectionPromise.current) {
                    collectionPromise.current(null);
                    collectionPromise.current = null;
                }
            }

            if (type === 'DELETE_COLLECTION_SUCCESS') {
                const deletedName = payload.deletedName || 'Collection';
                omnibox.show(`${deletedName} deleted`, { type: 'success' });

                if (payload.collectionMap) {
                    setStats(prev => ({
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

            // ⚡ Sync completion feedback
            if (type === 'SYNC_COMPLETE') {
                setIsSynced(false);
                setLiveIndicator(true);
                setTimeout(() => setLiveIndicator(false), 2000);
            }

            // 🛑 Manual Sync Cancelled Confirmation
            if (type === 'SYNC_CANCELLED') {
                setIsSynced(false);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
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
            parent.postMessage({
                pluginMessage: {
                    type: 'CREATE_VARIABLE',
                    payload: data
                }
            }, '*');
        });
    }, []);

    const traceLineage = useCallback((tokenId: string) => {
        parent.postMessage({ pluginMessage: { type: 'TRACE_LINEAGE', payload: { tokenId } } }, '*');
    }, []);

    const createCollection = useCallback((name: string) => {
        return new Promise<string | null>((resolve) => {
            omnibox.show(`Creating ${name}...`, { type: 'loading', duration: 0 });
            collectionPromise.current = resolve;
            parent.postMessage({
                pluginMessage: {
                    type: 'CREATE_COLLECTION',
                    payload: { name }
                }
            }, '*');
        });
    }, []);

    const renameCollection = useCallback((oldName: string, newName: string) => {
        omnibox.show(`Renaming ${oldName}...`, { type: 'loading', duration: 0 });
        parent.postMessage({
            pluginMessage: {
                type: 'RENAME_COLLECTION',
                payload: { oldName, newName }
            }
        }, '*');
    }, []);

    const deleteCollection = useCallback((name: string) => {
        return new Promise<void>((resolve, reject) => {
            omnibox.show(`Deleting ${name}...`, { type: 'loading', duration: 0 });
            deletePromise.current = { resolve, reject };

            const id = stats.collectionMap?.[name];

            parent.postMessage({
                pluginMessage: {
                    type: 'DELETE_COLLECTION',
                    payload: { name, id }
                }
            }, '*');
        });
    }, [stats.collectionMap]);

    const scanUsage = useCallback(() => {
        omnibox.show('Scanning usage...', { type: 'loading', duration: 0 });
        parent.postMessage({ pluginMessage: { type: 'SCAN_USAGE' } }, '*');
    }, []);

    const syncVariables = useCallback(() => {
        // ⚡ IMMEDIATE UI FEEDBACK
        setIsSynced(false);
        omnibox.show('Starting sync...', { type: 'loading', duration: 0 });

        // Start progressive sync via UISyncManager
        uiSyncManager.startSync(stats.totalVariables || undefined);

        // Tell plugin to start
        parent.postMessage({ pluginMessage: { type: 'SYNC_TOKENS' } }, '*');
    }, [stats.totalVariables]);

    const resetSync = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'SYNC_CANCEL' } }, '*');
        uiSyncManager.reset();
        setIsSynced(false);
        omnibox.show('Sync cancelled', { type: 'info' });
    }, []);

    return {
        tokens,
        anatomy,
        stats,
        isSynced,
        liveIndicator,
        lineageData,
        // 🌊 From UISyncManager
        isSyncing: syncState.isLoading,
        syncProgress: syncState.progress,
        syncStatus: `${syncState.loadedTokens} / ${syncState.totalTokens} tokens`,

        // 🌊 Lazy Triggers
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
