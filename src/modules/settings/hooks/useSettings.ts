import { useState, useEffect, useCallback } from 'react';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { SettingsStorage } from '../services/SettingsStorage';

export interface SettingsViewModel {
    settings: VibeSettings;
    isLoading: boolean;
    updateSettings: (partial: Partial<VibeSettings>) => Promise<void>;
    updateStandard: <K extends keyof VibeSettings['standards']>(key: K, value: VibeSettings['standards'][K]) => Promise<void>;
    updateGovernance: <K extends keyof VibeSettings['governance']>(key: K, value: VibeSettings['governance'][K]) => Promise<void>;
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
                console.error("Failed to load settings", err);
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

    // Deep Update Helpers
    const updateStandard = useCallback(async <K extends keyof VibeSettings['standards']>(key: K, value: VibeSettings['standards'][K]) => {
        const newSettings = {
            ...settings,
            standards: { ...settings.standards, [key]: value }
        };
        setSettings(newSettings);
        await SettingsStorage.saveSettings(newSettings);
    }, [settings]);

    const updateGovernance = useCallback(async <K extends keyof VibeSettings['governance']>(key: K, value: VibeSettings['governance'][K]) => {
        const newSettings = {
            ...settings,
            governance: { ...settings.governance, [key]: value }
        };
        setSettings(newSettings);
        await SettingsStorage.saveSettings(newSettings);
    }, [settings]);

    const wipeMemory = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        // We might also want to clear preferences?
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Memory Wiped' } }, '*');
    }, []);

    return {
        settings,
        isLoading,
        updateSettings,
        updateStandard,
        updateGovernance,
        wipeMemory
    };
}
