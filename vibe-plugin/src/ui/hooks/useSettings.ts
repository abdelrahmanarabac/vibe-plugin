import { useState, useEffect, useCallback } from 'react';
import { SettingsService } from '../../infra/SettingsService';

export interface SettingsViewModel {
    apiKey: string | null;
    isLoading: boolean;
    saveApiKey: (key: string) => Promise<void>;
}

/**
 * ViewModel for managing application settings.
 * Handles loading and saving the API key from persistent storage.
 */
export function useSettings(): SettingsViewModel {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const key = await SettingsService.loadApiKey();
                setApiKey(key);
            } catch (error) {
                console.error('Failed to load settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Action to save API key
    const saveApiKey = useCallback(async (key: string) => {
        try {
            await SettingsService.saveApiKey(key);
            setApiKey(key);
        } catch (error) {
            console.error('Failed to save API key:', error);
            throw error;
        }
    }, []);

    return {
        apiKey,
        isLoading,
        saveApiKey
    };
}
