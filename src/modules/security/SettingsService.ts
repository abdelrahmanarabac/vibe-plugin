import { encryptAPIKey, decryptAPIKey } from './CryptoService';

export const SettingsService = {
    saveApiKey: async (key: string) => {
        try {
            const encrypted = await encryptAPIKey(key);
            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_SET',
                    key: 'GEMINI_API_KEY',
                    value: encrypted
                }
            }, '*');
        } catch (error) {
            console.error("Encryption Failed:", error);
            throw new Error("Failed to secure API Key.");
        }
    },

    loadApiKey: (): Promise<string> => {
        return new Promise((resolve) => {
            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_GET',
                    key: 'GEMINI_API_KEY'
                }
            }, '*');

            const listener = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg?.type === 'STORAGE_GET_RESPONSE' && msg.key === 'GEMINI_API_KEY') {
                    window.removeEventListener('message', listener);

                    if (!msg.value) {
                        resolve("");
                        return;
                    }

                    decryptAPIKey(msg.value)
                        .then(decrypted => resolve(decrypted))
                        .catch(err => {
                            console.warn("Key Decryption Failed (Device mismatch or legacy key):", err);
                            resolve(""); // Treat as logged out if decryption fails
                        });
                }
            };
            window.addEventListener('message', listener);
        });
    }
};
