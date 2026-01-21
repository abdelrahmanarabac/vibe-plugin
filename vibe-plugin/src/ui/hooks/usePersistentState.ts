import { useState, useRef, useEffect } from 'react';

/**
 * ⚡ High-Performance Persistence Hook
 * Decouples UI state from I/O operations using Debounce.
 * Prevents main-thread freezing during rapid typing.
 */
export function usePersistentState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(initialValue);
    const timeoutRef = useRef<number | null>(null);
    const isFirstMount = useRef(true);

    // 1. Initial Load
    useEffect(() => {
        // Request initial value from controller
        parent.postMessage({ pluginMessage: { type: 'STORAGE_GET', key } }, '*');

        const handleMessage = (event: MessageEvent) => {
            const { type, key: msgKey, value } = event.data?.pluginMessage || {};
            if (type === 'STORAGE_GET_RESPONSE' && msgKey === key && value !== null) {
                setState(value);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [key]);

    const setDebouncedState = (newValue: T) => {
        // 2. Optimistic UI Update (Instant Feedback)
        setState(newValue);

        // 3. Debounce I/O (Wait 800ms)
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_SET',
                    key,
                    value: newValue
                }
            }, '*');
        }, 800);
    };

    return [state, setDebouncedState] as const;
}
