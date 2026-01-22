import { BrowserAIService } from './BrowserAIService';
import type { IAIService } from '../ports/IAIService';

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

            this.instance = new BrowserAIService({
                apiKey: this.apiKey,
                model: 'gemini-2.0-flash', // Optimized for speed as requested
                // "خليك في ال استراتيجية بتاعتك" -> Stick to Strategy: Speed & Quality
            });
        }
        return this.instance;
    }
}

export const ai = AIFactory.getInstance();
