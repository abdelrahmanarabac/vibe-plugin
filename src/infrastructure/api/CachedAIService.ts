import type { IAIService, AIOptions } from '../../core/interfaces/IAIService';

/**
 * 🧊 CachedAIService (Decorator Pattern)
 * Wraps another IAIService to provide LRU caching capabilities.
 * Reduces latency and cost for repetitive requests.
 */
export class CachedAIService implements IAIService {
    private cache = new Map<string, string>();
    private readonly MAX_CACHE_SIZE = 100;
    private inner: IAIService;

    constructor(inner: IAIService) {
        this.inner = inner;
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        const key = `gen:${prompt}:${options?.tier || 'LITE'}`;
        if (this.cache.has(key)) return this.cache.get(key)!;

        const result = await this.inner.generate(prompt, options);
        this.updateCache(key, result);
        return result;
    }

    async generateJSON<T>(prompt: string, schema?: unknown): Promise<T> {
        const key = `json:${prompt}`;
        if (this.cache.has(key)) return JSON.parse(this.cache.get(key)!) as T;

        const result = await this.inner.generateJSON<T>(prompt, schema);
        this.updateCache(key, JSON.stringify(result));
        return result;
    }

    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        // We don't cache images for now as they are memory intensive
        return this.inner.analyzeImage(imageBytes, prompt);
    }

    private updateCache(key: string, value: string) {
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}
