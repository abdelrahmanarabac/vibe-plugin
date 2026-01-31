import { encryptAPIKey, decryptAPIKey } from '../../security/CryptoService';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';

/**
 * 💾 SettingsStorage
 * Persistence adapter for Vibe configuration.
 * Handles Encryption for Secrets and JSON serialization for Preferences.
 */
export const SettingsStorage = {
    /**
     * Save the full settings object.
     * Encrypts the API key if it's being updated/present.
     */
    saveSettings: async (settings: VibeSettings): Promise<void> => {
        try {
            // 1. Handle API Key Encryption independently
            if (settings.apiKey) {
                // Check if it's already encrypted? No, assumes we get raw key here from UI
                // But we don't want to double-encrypt if we actulaly have the encrypted version.
                // Strategy: The UI should pass the RAW key only if changed.
                // Actually, simplest is to re-encrypt.
                const encryptedKey = await encryptAPIKey(settings.apiKey);
                parent.postMessage({
                    pluginMessage: {
                        type: 'STORAGE_SET',
                        key: 'GEMINI_API_KEY',
                        value: encryptedKey
                    }
                }, '*');
            }

            // 2. Save the rest of the settings as a JSON blob
            const preferences = {
                modelTier: settings.modelTier,
                standards: settings.standards,
                governance: settings.governance
            };

            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_SET',
                    key: 'VIBE_PREFERENCES',
                    value: JSON.stringify(preferences)
                }
            }, '*');

        } catch (error) {
            console.error("Settings Save Failed:", error);
            throw new Error("Failed to persist settings.");
        }
    },

    /**
     * Load settings from Figma client storage.
     */
    loadSettings: (): Promise<VibeSettings> => {
        return new Promise((resolve) => {
            // We need to fetch TWO keys: GEMINI_API_KEY and VIBE_PREFERENCES.
            // This is async. We'll chain them or use Promise.all logic if we could, 
            // but postMessage is event-based. We'll do a sequential fetch for simplicity 
            // or modify the backend to support 'STORAGE_GET_ALL' (Out of scope).
            // Let's rely on individual fetches.

            // Request 1: Preferences
            parent.postMessage({ pluginMessage: { type: 'STORAGE_GET', key: 'VIBE_PREFERENCES' } }, '*');

            // Request 2: API Key
            parent.postMessage({ pluginMessage: { type: 'STORAGE_GET', key: 'GEMINI_API_KEY' } }, '*');

            let loadedApiKey: string | null = null;
            let loadedPreferences: Partial<VibeSettings> = {};
            let keysLoaded = 0;

            const listener = async (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (!msg) return;

                if (msg.type === 'STORAGE_GET_SUCCESS' || msg.type === 'STORAGE_GET_RESPONSE') {
                    // Handle Preferences
                    if (msg.key === 'VIBE_PREFERENCES' || msg.payload?.key === 'VIBE_PREFERENCES') {
                        const raw = msg.value || msg.payload?.value;
                        if (raw) {
                            try {
                                loadedPreferences = JSON.parse(raw);
                            } catch {
                                console.warn("Corrupt Settings JSON, using defaults.");
                            }
                        }
                        keysLoaded++;
                    }

                    // Handle API Key
                    if (msg.key === 'GEMINI_API_KEY' || msg.payload?.key === 'GEMINI_API_KEY') {
                        const rawKey = msg.value || msg.payload?.value;
                        if (rawKey) {
                            try {
                                loadedApiKey = await decryptAPIKey(rawKey);
                            } catch (e) {
                                console.warn("Key Decryption Failed:", e);
                                loadedApiKey = null;
                            }
                        }
                        keysLoaded++;
                    }

                    // Check Completion (We sent 2 requests)
                    if (keysLoaded >= 2) {
                        window.removeEventListener('message', listener);

                        // Merge with Defaults
                        const finalSettings: VibeSettings = {
                            ...DEFAULT_SETTINGS,
                            ...loadedPreferences,
                            apiKey: loadedApiKey,
                            // Deep merge standards/governance to ensure no missing keys
                            standards: { ...DEFAULT_SETTINGS.standards, ...loadedPreferences.standards },
                            governance: { ...DEFAULT_SETTINGS.governance, ...loadedPreferences.governance }
                        };
                        resolve(finalSettings);
                    }
                }
            };

            window.addEventListener('message', listener);

            // Timeout safety
            setTimeout(() => {
                window.removeEventListener('message', listener);
                // Return what we have
                const finalSettings: VibeSettings = {
                    ...DEFAULT_SETTINGS,
                    ...loadedPreferences,
                    apiKey: loadedApiKey,
                    standards: { ...DEFAULT_SETTINGS.standards, ...loadedPreferences.standards },
                    governance: { ...DEFAULT_SETTINGS.governance, ...loadedPreferences.governance }
                };
                resolve(finalSettings);
            }, 2000);
        });
    }
};
