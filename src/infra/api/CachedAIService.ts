import type { IAIService, AIOptions } from '../../core/interfaces/IAIService';

export class CachedAIService implements IAIService {
    private service: IAIService;
    private readonly CACHE_PREFIX = 'vibe_ai_cache_';
    private readonly EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(service: IAIService) {
        this.service = service;
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        const tier = options?.tier || 'LITE';
        const key = `${this.CACHE_PREFIX}${this.hash(prompt + tier)}`;

        const cached = await this.getFromCache(key);
        if (cached) {
            console.log('[CachedAI] Hit:', key);
            return cached;
        }

        console.log('[CachedAI] Miss. Generating...');
        const result = await this.service.generate(prompt, options);

        await this.saveToCache(key, result);
        return result;
    }

    async generateJSON<T>(prompt: string, schema?: any): Promise<T> {
        // We handle JSON caching as pure text
        const key = `${this.CACHE_PREFIX}JSON_${this.hash(prompt)}`;

        const cached = await this.getFromCache(key);
        if (cached) {
            console.log('[CachedAI] JSON Hit');
            return JSON.parse(cached) as T;
        }

        const result = await this.service.generateJSON<T>(prompt, schema);
        await this.saveToCache(key, JSON.stringify(result));
        return result;
    }

    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        return this.service.analyzeImage(imageBytes, prompt);
    }

    private async getFromCache(key: string): Promise<string | null> {
        try {
            const data = await figma.clientStorage.getAsync(key);
            if (!data) return null;

            const { value, timestamp } = data;
            if (Date.now() - timestamp > this.EXPIRATION_MS) {
                await figma.clientStorage.deleteAsync(key);
                return null;
            }
            return value;
        } catch (e) {
            return null;
        }
    }

    private async saveToCache(key: string, value: string): Promise<void> {
        try {
            await figma.clientStorage.setAsync(key, { value, timestamp: Date.now() });
        } catch (e) {
            console.error('[CachedAI] Failed to save', e);
        }
    }

    private hash(str: string): string {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        return (hash >>> 0).toString(16);
    }
}
