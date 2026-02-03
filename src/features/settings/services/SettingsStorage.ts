/**
 * @module SettingsStorage
 * @description Persistence adapter for Vibe configuration.
 * @version 2.0.0 - Stripped down after redesign.
 * Delegates secret management to CryptoService (Zero-Trust).
 */
import { CryptoService } from '../../security/CryptoService';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { storage } from '../../../infrastructure/figma/StorageProxy';

export const SettingsStorage = {
    /**
     * Save the full settings object.
     * Secrets are diverted to the Secure Vault.
     * Preferences are saved as standard JSON.
     */
    saveSettings: async (settings: VibeSettings): Promise<void> => {
        try {
            // 1. Divert API Key to Secure Vault if session is active.
            if (CryptoService.isSessionActive()) {
                const currentVault = await CryptoService.loadSecrets() || {};
                const nextVault = {
                    ...currentVault,
                    apiKey: settings.apiKey ?? currentVault.apiKey,
                };

                if (nextVault.apiKey) {
                    await CryptoService.saveSecrets(nextVault);
                }
            } else {
                if (settings.apiKey) {
                    console.warn("[SettingsStorage] Skipping Secrets Save: Session Locked.");
                }
            }

            // 2. Save Preferences (modelTier only, secrets omitted)
            const preferences = {
                modelTier: settings.modelTier,
            };

            await storage.setItem('VIBE_PREFERENCES', JSON.stringify(preferences));

        } catch (error) {
            console.error("[SettingsStorage] Save Failed:", error);
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
                    console.warn("[SettingsStorage] Corrupt Settings JSON, using defaults.");
                }
            }

            // 2. Fetch Secrets (If Unlocked)
            let loadedApiKey: string | null = null;
            if (CryptoService.isSessionActive()) {
                try {
                    const secrets = await CryptoService.loadSecrets();
                    loadedApiKey = secrets?.apiKey ?? null;
                } catch (e) {
                    console.warn("[SettingsStorage] Vault Access Failed:", e);
                }
            }

            // 3. Merge and return
            return {
                ...DEFAULT_SETTINGS,
                ...loadedPreferences,
                apiKey: loadedApiKey,
            };

        } catch (error) {
            console.error("[SettingsStorage] Load Failed:", error);
            return DEFAULT_SETTINGS;
        }
    }
};
