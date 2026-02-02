import { CryptoService } from './CryptoService';

export const SettingsService = {
    saveApiKey: async (key: string) => {
        try {
            await CryptoService.saveSecrets({ apiKey: key });
        } catch (error) {
            console.error("Encryption Failed:", error);
            throw new Error("Failed to secure API Key.");
        }
    },

    loadApiKey: async (): Promise<string> => {
        try {
            const secrets = await CryptoService.loadSecrets();
            return secrets?.apiKey || "";
        } catch (error) {
            console.warn("SettingsService: Failed to load secrets", error);
            return "";
        }
    }
};
