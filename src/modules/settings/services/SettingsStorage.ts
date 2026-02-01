import { CryptoService } from '../../security/CryptoService';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { storage } from '../../security/StorageProxy';

/**
 * 💾 SettingsStorage
 * Persistence adapter for Vibe configuration.
 * Delegates secret management to CryptoService (Zero-Trust).
 */
export const SettingsStorage = {
    /**
     * Save the full settings object.
     * Secrets are diverted to the Secure Vault.
     * Preferences are saved as standard JSON.
     */
    saveSettings: async (settings: VibeSettings): Promise<void> => {
        try {
            // 1. Divert Secret to Secure Vault
            // Only update if key is present/changed.
            if (settings.apiKey) {
                // If session is active, save it.
                // If session is NOT active, this will THROW.
                // The UI (SecurityGate) guarantees session is active before we get here?
                // OR SettingsPage handles the error.
                if (CryptoService.isSessionActive()) {
                    await CryptoService.saveAPIKey(settings.apiKey);
                } else {
                    console.warn("Skipping API Key save: Session Locked.");
                    // We knowingly skip saving the key if locked to prevent errors,
                    // but ideally, this shouldn't happen if Gate is working.
                }
            }

            // 2. Save Preferences (Excluding Secrets)
            const preferences = {
                modelTier: settings.modelTier,
                standards: settings.standards,
                governance: settings.governance
                // apiKey is deliberately OMITTED from plaintext storage
            };

            await storage.setItem('VIBE_PREFERENCES', JSON.stringify(preferences));

        } catch (error) {
            console.error("Settings Save Failed:", error);
            throw new Error("Failed to persist settings.");
        }
    },

    /**
     * Load settings.
     * Rehydrates secrets from Secure Vault if Session is Active.
     */
    loadSettings: async (): Promise<VibeSettings> => {
        try {
            // 1. Fetch Preferences
            const rawPrefs = await storage.getItem('VIBE_PREFERENCES');
            let loadedPreferences: Partial<VibeSettings> = {};

            if (rawPrefs) {
                try {
                    loadedPreferences = JSON.parse(rawPrefs);
                } catch {
                    console.warn("Corrupt Settings JSON, using defaults.");
                }
            }

            // 2. Fetch Secret (If Unlocked)
            let loadedApiKey: string | null = null;
            if (CryptoService.isSessionActive()) {
                try {
                    loadedApiKey = await CryptoService.loadAPIKey();
                } catch (e) {
                    console.warn("Vault Access Failed during Settings Load:", e);
                }
            }

            // 3. Merge
            return {
                ...DEFAULT_SETTINGS,
                ...loadedPreferences,
                apiKey: loadedApiKey,
                // Deep merge standards/governance to ensure no missing keys
                standards: { ...DEFAULT_SETTINGS.standards, ...loadedPreferences.standards },
                governance: { ...DEFAULT_SETTINGS.governance, ...loadedPreferences.governance }
            };

        } catch (error) {
            console.error("Settings Load Failed:", error);
            return DEFAULT_SETTINGS;
        }
    }
};
