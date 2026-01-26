/**
 * SettingsService: Handles API key storage using Figma's secure clientStorage
 * Note: Web Crypto API is unavailable in Figma plugin iframes (no secure context)
 * Figma's clientStorage is already sandboxed and secure per-plugin
 */
export const SettingsService = {
    saveApiKey: async (key: string) => {
        try {
            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_SET',
                    key: 'VIBE_API_KEY',
                    value: key // Direct storage - clientStorage is already secure
                }
            }, '*');
        } catch (error) {
            console.error("Storage Failed:", error);
            throw new Error("Failed to save API Key.");
        }
    },

    loadApiKey: (): Promise<string> => {
        return new Promise((resolve) => {
            parent.postMessage({
                pluginMessage: {
                    type: 'STORAGE_GET',
                    key: 'VIBE_API_KEY'
                }
            }, '*');

            const listener = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg?.type === 'STORAGE_GET_RESPONSE' && msg.key === 'VIBE_API_KEY') {
                    window.removeEventListener('message', listener);
                    resolve(msg.value || "");
                }
            };
            window.addEventListener('message', listener);
        });
    }
};

