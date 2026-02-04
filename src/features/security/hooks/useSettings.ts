import { useState } from 'react';

export interface SettingsViewModel {
    isLoading: boolean;
    // Keeping interface minimal for now as we stripped API Key logic
}

/**
 * 🔒 useSettings
 * ViewModel for managing application settings.
 * UPDATE: API Key management removed.
 */
export function useSettings(): SettingsViewModel {
    const [isLoading] = useState(false);

    return {
        isLoading
    };
}
