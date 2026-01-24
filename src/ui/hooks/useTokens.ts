import { useState, useEffect, useCallback } from 'react';
import { type TokenEntity } from '../../core/types';

interface TokenStats {
    totalVariables: number;
    collections: number;
    styles: number;
    lastSync: number;
}

export interface TokensViewModel {
    tokens: TokenEntity[];
    stats: TokenStats;
    isSynced: boolean;
    liveIndicator: boolean;
    updateToken: (id: string, value: string) => void;
}

/**
 * ViewModel for managing token state and synchronization.
 * Listens for messages from the Figma controller and updates local state.
 */
export function useTokens(): TokensViewModel {
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [stats, setStats] = useState<TokenStats>({
        totalVariables: 0,
        collections: 0,
        styles: 0,
        lastSync: 0
    });
    const [isSynced, setIsSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'GRAPH_UPDATED') {
                // 🔴 FIX: Robustly check if payload exists and is an array
                if (Array.isArray(payload)) {
                    console.log(`[UI] Received ${payload.length} tokens from Controller.`);
                    setTokens(payload);
                    setIsSynced(true);

                    // Trigger "LIVE" flash
                    setLiveIndicator(true);
                    setTimeout(() => setLiveIndicator(false), 2000);
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
                // Handle scan completion - update tokens and stats
                if (payload.tokens) {
                    setTokens(payload.tokens);
                }
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
        };

        window.addEventListener('message', handleMessage);

        // 🔴 FIX: Added slight delay to ensure Figma is ready to receive the message
        setTimeout(() => {
            parent.postMessage({ pluginMessage: { type: 'REQUEST_GRAPH' } }, '*');
            parent.postMessage({ pluginMessage: { type: 'REQUEST_STATS' } }, '*');
        }, 100);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    // Optimistic update for UI, would send message to controller in real app
    const updateToken = useCallback((id: string, value: string) => {
        setTokens(current =>
            current.map(t => t.id === id ? { ...t, value } : t)
        );
        // In a full implementation, this would sync back to Figma
        parent.postMessage({ pluginMessage: { type: 'UPDATE_TOKEN', id, value } }, '*');
    }, []);

    return {
        tokens,
        stats,
        isSynced,
        liveIndicator,
        updateToken
    };
}
