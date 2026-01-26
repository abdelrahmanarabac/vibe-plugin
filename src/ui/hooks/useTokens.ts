import { useState, useEffect, useCallback } from 'react';
import { type TokenEntity } from '../../core/types';
import { type SceneNodeAnatomy } from '../../modules/perception/visitors/HierarchyVisitor';

interface TokenStats {
    totalVariables: number;
    collections: number;
    styles: number;
    lastSync: number;
}

export interface TokensViewModel {
    tokens: TokenEntity[];
    anatomy: SceneNodeAnatomy[];
    stats: TokenStats;
    isSynced: boolean;
    liveIndicator: boolean;
    updateToken: (id: string, value: string) => void;
    scanAnatomy: () => void;
    traceLineage: (tokenId: string) => void;
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
        lastSync: 0
    });
    const [isSynced, setIsSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);

    const [lineageData, setLineageData] = useState<{ target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'GRAPH_UPDATED') {
                if (Array.isArray(payload)) {
                    setTokens(payload);
                    setIsSynced(true);
                    setLiveIndicator(true);
                    setTimeout(() => setLiveIndicator(false), 2000);
                }
            }

            if (type === 'ANATOMY_UPDATED' || (type === 'GET_ANATOMY_SUCCESS')) {
                if (payload && Array.isArray(payload.anatomy)) {
                    setAnatomy(payload.anatomy);
                }
            }

            if (type === 'STATS_UPDATED') {
                setStats({
                    totalVariables: payload.totalVariables ?? 0,
                    collections: payload.collections ?? 0,
                    styles: payload.styles ?? 0,
                    lastSync: Date.now()
                });
            }

            if (type === 'SCAN_COMPLETE') {
                if (payload.tokens) setTokens(payload.tokens);
                if (payload.anatomy) setAnatomy(payload.anatomy);
                if (payload.stats) {
                    setStats({
                        totalVariables: payload.stats.totalVariables ?? 0,
                        collections: payload.stats.collections ?? 0,
                        styles: payload.stats.styles ?? 0,
                        lastSync: Date.now()
                    });
                }
                setIsSynced(true);
                setLiveIndicator(true);
                setTimeout(() => setLiveIndicator(false), 2000);
            }

            if (type === 'TRACE_LINEAGE_SUCCESS') {
                if (payload && payload.target) {
                    setLineageData(payload);
                }
            }
        };

        window.addEventListener('message', handleMessage);

        setTimeout(() => {
            parent.postMessage({ pluginMessage: { type: 'REQUEST_GRAPH' } }, '*');
            parent.postMessage({ pluginMessage: { type: 'REQUEST_STATS' } }, '*');
        }, 100);

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

    const traceLineage = useCallback((tokenId: string) => {
        parent.postMessage({ pluginMessage: { type: 'TRACE_LINEAGE', payload: { tokenId } } }, '*');
    }, []);

    return {
        tokens,
        anatomy,
        stats,
        isSynced,
        liveIndicator,
        lineageData,
        updateToken,
        scanAnatomy,
        traceLineage
    };
}

