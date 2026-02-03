/**
 * @module useSettings
 * @description Hook for accessing and updating Vibe Plugin settings.
 * @version 2.0.0 - Stripped down after redesign.
 */
import { useState, useEffect, useCallback } from 'react';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { SettingsStorage } from '../services/SettingsStorage';

export interface SettingsViewModel {
    settings: VibeSettings;
    isLoading: boolean;
    updateSettings: (partial: Partial<VibeSettings>) => Promise<void>;
    wipeMemory: () => void;
}

export function useSettings(): SettingsViewModel {
    const [settings, setSettings] = useState<VibeSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await SettingsStorage.loadSettings();
                setSettings(data);
            } catch (err) {
                console.error("[useSettings] Failed to load settings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // Generic Update
    const updateSettings = useCallback(async (partial: Partial<VibeSettings>) => {
        const newSettings = { ...settings, ...partial };
        setSettings(newSettings);
        await SettingsStorage.saveSettings(newSettings);
    }, [settings]);

    const wipeMemory = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Memory Wiped' } }, '*');
    }, []);

    return {
        settings,
        isLoading,
        updateSettings,
        wipeMemory
    };
}
