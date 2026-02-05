import { useRef, useState, useEffect, useCallback } from 'react';
import { omnibox } from '../managers/OmniboxManager';
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
 * ViewModel for managing token state and synchronization.
 * Listens for messages from the Figma controller and updates local state.
 */
export function useTokens(): TokensViewModel {
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
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

    // 🌊 Progressive Sync State
    const [syncProgress, setSyncProgress] = useState(0);
    const [syncStatus, setSyncStatus] = useState<string>('Idle');
    const [isSyncing, setIsSyncing] = useState(false);

    const [lineageData, setLineageData] = useState<{ target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null>(null);
    const creationPromise = useRef<((success: boolean) => void) | null>(null);
    const collectionPromise = useRef<((id: string | null) => void) | null>(null);
    const deletePromise = useRef<{ resolve: () => void, reject: (reason?: Error | string) => void } | null>(null);
    const syncStartTime = useRef<number | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload, progress, phase, tokens: chunkTokens } = event.data.pluginMessage || {};

            // 🌊 Progressive Protocol Handlers
            if (type === 'SYNC_PHASE_START') {
                if (phase === 'definitions') {
                    setIsSyncing(true);
                    setTokens([]); // Clear previous to prevent stale mix
                    setSyncStatus('Fetching definitions...');
                    setSyncProgress(0);
                    if (!syncStartTime.current) syncStartTime.current = Date.now();
                }
            }

            if (type === 'SYNC_CHUNK') {
                if (Array.isArray(chunkTokens)) {
                    setTokens(prev => [...prev, ...chunkTokens]);
                    setSyncProgress(progress || 0);
                    setSyncStatus(`Loaded ${progress} tokens...`);
                }
            }

            if (type === 'SYNC_PHASE_COMPLETE') {
                if (phase === 'definitions') {
                    setSyncStatus('Finalizing...');
                    // Don't set isSyncing false yet, wait for Stats or GraphUpdated
                }
            }

            const MIN_DURATION = 1000; // 1 second minimum "Vibe" delay

            const finishSync = (fn: () => void) => {
                if (!syncStartTime.current) {
                    fn();
                    return;
                }
                const elapsed = Date.now() - syncStartTime.current;
                const remaining = Math.max(0, MIN_DURATION - elapsed);

                setTimeout(() => {
                    fn();
                    syncStartTime.current = null;
                }, remaining);
            };

            if (type === 'GRAPH_UPDATED' || type === 'REQUEST_GRAPH_SUCCESS' || type === 'SYNC_VARIABLES_SUCCESS') {
                const { isIncremental } = event.data.pluginMessage;

                if (Array.isArray(payload)) {
                    finishSync(() => {
                        // 🛑 OPTIMIZATION: If incremental sync, DO NOT overwrite bits we just chunk-loaded
                        if (!isIncremental) {
                            setTokens(payload);
                        }
                        setIsSynced(false); // 🛑 Momentary Switch: Turn OFF after completion
                        setIsSyncing(false); // Stop spinner
                        setSyncStatus('Idle');
                        setLiveIndicator(true);
                        setTimeout(() => setLiveIndicator(false), 2000);
                    });
                }
            }

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

            if (type === 'SCAN_COMPLETE') {
                finishSync(() => {
                    if (payload.tokens) setTokens(payload.tokens);
                    if (payload.anatomy) setAnatomy(payload.anatomy);
                    if (payload.stats) {
                        setStats({
                            totalVariables: payload.stats.totalVariables ?? 0,
                            collections: payload.stats.collections ?? 0,
                            styles: payload.stats.styles ?? 0,
                            collectionNames: payload.stats.collectionNames ?? [],
                            collectionMap: payload.stats.collectionMap ?? {},
                            lastSync: Date.now()
                        });
                    }
                    setIsSynced(false); // 🛑 Momentary Switch: Turn OFF after completion
                    setLiveIndicator(true);
                    setTimeout(() => setLiveIndicator(false), 2000);
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

            // 🛡️ GENERIC ERROR HANDLER (Fixes Stuck Loading)
            if (type === 'ERROR') {
                setIsSyncing(false);
                setSyncStatus('Error');
                setIsSynced(false);
                omnibox.show(payload.message || 'An error occurred', { type: 'error' });
            }

            if (type === 'DELETE_COLLECTION_ERROR' || (type === 'OMNIBOX_NOTIFY' && payload.type === 'error' && deletePromise.current)) {
                // If we get a generic error while deletion is pending, assume it's ours
                omnibox.show(payload.message || 'Failed to delete collection', { type: 'error' });

                if (deletePromise.current) {
                    deletePromise.current.reject(payload.message);
                    deletePromise.current = null;
                }
            }

            // 🛑 Manual Sync Cancelled Confirmation
            if (type === 'SYNC_CANCELLED') {
                setIsSyncing(false);
                setSyncStatus('Idle');
                setIsSynced(false); // Force "No" state on toggle
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

            // Smart Deletion: Lookup ID if available
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
        setIsSyncing(true); // 🛑 Immediate Feedback
        setSyncStatus('Scanning usage...');
        parent.postMessage({ pluginMessage: { type: 'SCAN_USAGE' } }, '*');
    }, []);

    const syncVariables = useCallback(() => {
        // 🛑 Explicit Manual Start
        setIsSynced(false);
        setIsSyncing(true); // Immediate UI feedback
        setSyncStatus('Starting engine...');
        syncStartTime.current = Date.now();

        parent.postMessage({ pluginMessage: { type: 'SYNC_START' } }, '*');
    }, []);

    const resetSync = useCallback(() => {
        // 🛑 Explicit Manual Cancel
        parent.postMessage({ pluginMessage: { type: 'SYNC_CANCEL' } }, '*');

        // Optimistic UI update (Controller will send SYNC_CANCELLED to confirm)
        setIsSyncing(false);
        setSyncStatus('Cancelling...');
        setIsSynced(false);
    }, []);

    return {
        tokens,
        anatomy,
        stats,
        isSynced,
        liveIndicator,
        lineageData,
        // 🌊 Exposed State
        isSyncing,
        syncProgress,
        syncStatus,

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

