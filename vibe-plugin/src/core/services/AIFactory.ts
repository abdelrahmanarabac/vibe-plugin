import { GeminiService } from '../../infra/api/GeminiService';
import { CachedAIService } from '../../infra/api/CachedAIService';
import type { IAIService } from '../../core/interfaces/IAIService';

/**
 * 🧱 AIFactory (Domain/Application Service)
 * Centralized singleton factory for AI service lifecycle management.
 * Supports dynamic re-initialization to handle API key updates without plugin restarts.
 */
export class AIFactory {
    private static instance: IAIService | null = null;
    private static currentKey: string | null = null;

    /**
     * Retrieves the AI Service instance.
     * If the provided key differs from the internal state, it re-initializes the service.
     */
    public static getInstance(apiKey?: string | null): IAIService {
        const keyChanged = apiKey && apiKey !== this.currentKey;
        const needsInit = !this.instance || keyChanged;

        if (needsInit) {
            if (!apiKey) {
                // Return a "No-Op" or throwing service if no key is available yet
                // For now, we allow the constructor of GeminiService to throw if called.
                // But typically we wait for the UI to provide a key.
                console.warn("AIFactory: Attempting to get instance without valid API Key.");
            }

            this.currentKey = apiKey || null;

            // Core Implementation (Infrastructure Adapter)
            const baseService = new GeminiService(this.currentKey || 'stale-placeholder');

            // Layered Decorator: Caching
            this.instance = new CachedAIService(baseService);

            console.log(`[Vibe AI] Engine ${keyChanged ? 'Re-initialized' : 'Initialized'} with new configuration.`);
        }

        return this.instance!;
    }

    /**
     * Explicitly wipes the singleton instance.
     */
    public static reset() {
        this.instance = null;
        this.currentKey = null;
    }
}
