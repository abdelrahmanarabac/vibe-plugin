import { CryptoService } from '../../security/CryptoService';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { storage } from '../../../infrastructure/figma/StorageProxy';

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
            // 1. Divert Secrets to Secure Vault
            // Only update if we have an active session to decrypt/encrypt.
            if (CryptoService.isSessionActive()) {
                // Fetch current state to avoid overwriting missing keys with null
                const currentVault = await CryptoService.loadSecrets() || {};

                const nextVault = {
                    apiKey: settings.apiKey || currentVault.apiKey,
                    supabase: settings.supabase || currentVault.supabase
                };

                // Only save if we have something valid to save
                if (nextVault.apiKey || nextVault.supabase) {
                    await CryptoService.saveSecrets(nextVault);
                }
            } else {
                if (settings.apiKey || settings.supabase) {
                    console.warn("Skipping Secrets Save: Session Locked.");
                }
            }

            // 2. Save Preferences (Excluding Secrets)
            const preferences = {
                modelTier: settings.modelTier,
                standards: settings.standards,
                governance: settings.governance
                // Secrets are deliberately OMITTED from plaintext storage
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

            // 2. Fetch Secrets (If Unlocked)
            let loadedSecrets: { apiKey?: string | null; supabase?: { url: string; anonKey: string } | null } | null = null;
            if (CryptoService.isSessionActive()) {
                try {
                    loadedSecrets = await CryptoService.loadSecrets();
                } catch (e) {
                    console.warn("Vault Access Failed during Settings Load:", e);
                }
            }

            // 3. Merge
            return {
                ...DEFAULT_SETTINGS,
                ...loadedPreferences,
                apiKey: loadedSecrets?.apiKey ?? null,
                supabase: loadedSecrets?.supabase ?? null,
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
