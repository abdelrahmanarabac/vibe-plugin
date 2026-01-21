// src/infra/SettingsService.ts

export const SettingsService = {
    saveApiKey: async (key: string) => {
        parent.postMessage({
            pluginMessage: {
                type: 'STORAGE_SET',
                key: 'GEMINI_API_KEY',
                value: key
            }
        }, '*');
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
                    resolve(msg.value || "");
                }
            };
            window.addEventListener('message', listener);
        });
    }
};
