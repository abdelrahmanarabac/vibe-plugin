import { BrowserAIService } from './BrowserAIService';
import { CachedAIService } from '../../infra/api/CachedAIService';
import type { IAIService } from '../../core/interfaces/IAIService';

export class AIFactory {
    private static instance: IAIService;
    private static apiKey: string = import.meta.env.VITE_GEMINI_API_KEY || ''; // Use import.meta.env for Vite

    public static initialize(key: string) {
        this.apiKey = key;
        // Reset instance to force recreation with new key
        if (this.instance) {
            this.instance = new BrowserAIService({
                apiKey: this.apiKey,
                model: 'gemini-2.0-flash'
            });
        }
    }

    public static getInstance(): IAIService {
        if (!this.instance) {
            if (!this.apiKey) {
                console.warn("AIFactory: Initializing without API Key. AI features will fail until initialized.");
            }

            const baseService = new BrowserAIService({
                apiKey: this.apiKey,
                model: 'gemini-2.0-flash', // Optimized for speed as requested
            });

            // Decorate with Caching
            this.instance = new CachedAIService(baseService);
        }
        return this.instance;
    }
}

export const ai = AIFactory.getInstance();
