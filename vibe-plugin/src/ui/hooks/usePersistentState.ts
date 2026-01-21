// src/ui/hooks/usePersistentState.ts
import { useState, useEffect } from 'react';
import { SettingsService } from '../../infra/SettingsService';

export function usePersistentApiKey() {
    const [apiKey, setApiKey] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load on mount
    useEffect(() => {
        SettingsService.loadApiKey().then((val) => {
            if (val) setApiKey(val);
            setIsLoaded(true);
        });
    }, []);

    // Save on change (debounced slightly or just direct)
    const setAndSaveKey = (newKey: string) => {
        setApiKey(newKey);
        SettingsService.saveApiKey(newKey);
    };

    return { apiKey, setApiKey: setAndSaveKey, isLoaded };
}
