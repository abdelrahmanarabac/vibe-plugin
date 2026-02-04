/**
 * @module SettingsStorage
 * @description Persistence adapter for Vibe configuration.
 * @version 2.0.0 - Stripped down after redesign.
 * Delegates secret management to CryptoService (Zero-Trust).
 */

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
            // Preferences are saved as standard JSON.
            // Currently VibeSettings is empty/internal, but we keep the structure.
            await storage.setItem('VIBE_PREFERENCES', JSON.stringify(settings));

        } catch (error) {
            console.error("[SettingsStorage] Save Failed:", error);
            throw new Error("Failed to persist settings.");
        }
    },

    /**
     * Load settings.
     * Rehydrates preferences from storage.
     */
    loadSettings: async (): Promise<VibeSettings> => {
        try {
            // 1. Fetch Preferences
            const rawPrefs = await storage.getItem('VIBE_PREFERENCES');
            let loadedPreferences: VibeSettings = DEFAULT_SETTINGS;

            if (rawPrefs) {
                try {
                    loadedPreferences = JSON.parse(rawPrefs);
                } catch {
                    console.warn("[SettingsStorage] Corrupt Settings JSON, using defaults.");
                }
            }

            return {
                ...DEFAULT_SETTINGS,
                ...loadedPreferences,
            };

        } catch (error) {
            console.error("[SettingsStorage] Load Failed:", error);
            return DEFAULT_SETTINGS;
        }
    }
}
