import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
    id: number;
    message: string;
    type: ToastType;
}

let toastId = 0;
let toastListeners: ((toasts: ToastState[]) => void)[] = [];
let currentToasts: ToastState[] = [];

export const showToast = (message: string, type: ToastType = 'info') => {
    const newToast: ToastState = {
        id: toastId++,
        message,
        type
    };

    currentToasts = [...currentToasts, newToast];
    toastListeners.forEach(listener => listener(currentToasts));
};

export const useToasts = () => {
    const [toasts, setToasts] = useState<ToastState[]>(currentToasts);

    useEffect(() => {
        toastListeners.push(setToasts);
        return () => {
            toastListeners = toastListeners.filter(l => l !== setToasts);
        };
    }, []);

    const removeToast = (id: number) => {
        currentToasts = currentToasts.filter(t => t.id !== id);
        toastListeners.forEach(listener => listener(currentToasts));
    };

    return { toasts, removeToast };
};
