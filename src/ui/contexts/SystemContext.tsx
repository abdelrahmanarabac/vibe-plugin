import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export type SystemMessageType = 'info' | 'success' | 'error' | 'warning';

export interface SystemMessage {
    id: string;
    text: string;
    type: SystemMessageType;
    duration?: number;
}

export interface SyncProgressState {
    current: number;
    total: number;
    phase: string;
}

interface SystemContextType {
    message: SystemMessage | null;
    post: (text: string, type?: SystemMessageType, duration?: number) => void;
    clear: () => void;
    // 🌊 Sync State
    isSyncing: boolean;
    syncProgress: SyncProgressState | null;
    setSyncing: (isSyncing: boolean) => void;
    setSyncProgress: (progress: SyncProgressState | null) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<SystemMessage | null>(null);
    const [isSyncing, setSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState<SyncProgressState | null>(null);

    const post = useCallback((text: string, type: SystemMessageType = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setMessage({ id, text, type, duration });

        if (duration > 0) {
            setTimeout(() => {
                setMessage(current => (current?.id === id ? null : current));
            }, duration);
        }
    }, []);

    const clear = useCallback(() => {
        setMessage(null);
    }, []);

    // 🎧 Global Listener for Sync Events from Plugin
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload, phase } = event.data.pluginMessage || {};

            if (type === 'SYNC_PHASE_START') {
                setSyncing(true);
                setSyncProgress({ current: 0, total: 0, phase: phase || 'initializing' });
            } else if (type === 'SYNC_PROGRESS') {
                setSyncProgress(payload);
            } else if (type === 'SYNC_PHASE_COMPLETE' && phase === 'done') {
                setSyncing(false);
                setSyncProgress(null);
                post('Sync Completed Successfully', 'success');
            } else if (type === 'SYNC_CANCELLED') {
                setSyncing(false);
                setSyncProgress(null);
                post('Sync Cancelled', 'info');
            } else if (type === 'ERROR') {
                setSyncing(false);
                setSyncProgress(null);
                // Error is usually handled by postMessage directly in controller, but just in case
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [post]);

    return (
        <SystemContext.Provider value={{
            message, post, clear,
            isSyncing, syncProgress, setSyncing, setSyncProgress
        }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystemContext() {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystemContext must be used within a SystemProvider');
    }
    return context;
}

// Deprecated alias for backward compatibility if needed, but per strict rules preferring the new name
export const useSystem = useSystemContext;
