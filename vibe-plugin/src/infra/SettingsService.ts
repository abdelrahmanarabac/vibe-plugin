// src/infra/SettingsService.ts

export const SettingsService = {
    saveApiKey: async (key: string) => {
        parent.postMessage({ pluginMessage: { type: 'SAVE_SETTINGS', key: 'GEMINI_API_KEY', value: key } }, '*');
    },

    loadApiKey: (): Promise<string> => {
        return new Promise((resolve) => {
            // 1. Send Request
            parent.postMessage({ pluginMessage: { type: 'LOAD_SETTINGS', key: 'GEMINI_API_KEY' } }, '*');

            // 2. Listen for Response (One-time listener)
            const listener = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg?.type === 'SETTINGS_LOADED' && msg.key === 'GEMINI_API_KEY') {
                    window.removeEventListener('message', listener);
                    resolve(msg.value || "");
                }
            };
            window.addEventListener('message', listener);
        });
    }
};
