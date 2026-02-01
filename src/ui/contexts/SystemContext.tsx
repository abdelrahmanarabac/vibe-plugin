import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type SystemMessageType = 'info' | 'success' | 'error' | 'warning';

export interface SystemMessage {
    id: string;
    text: string;
    type: SystemMessageType;
    duration?: number;
}

interface SystemContextType {
    message: SystemMessage | null;
    post: (text: string, type?: SystemMessageType, duration?: number) => void;
    clear: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<SystemMessage | null>(null);

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

    return (
        <SystemContext.Provider value={{ message, post, clear }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystem() {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
}
