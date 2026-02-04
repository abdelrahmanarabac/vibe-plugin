import { MockAIService } from '../../infrastructure/api/MockAIService';
import { CachedAIService } from '../../infrastructure/api/CachedAIService';
import type { IAIService } from '../../core/interfaces/IAIService';

/**
 * 🧱 AIFactory (Domain/Application Service)
 * Centralized singleton factory for AI service lifecycle management.
 * 
 * UPDATE: Switched to MockAIService (local-only) to comply with distribution policies.
 * External AI API dependencies have been removed.
 */
export class AIFactory {
    private static instance: IAIService | null = null;

    /**
     * Retrieves the AI Service instance.
     * @param _apiKey - Deprecated. Maintained for signature compatibility but ignored.
     */
    public static getInstance(_apiKey?: string | null): IAIService {
        if (!this.instance) {

            // Core Implementation (Local Mock)
            const baseService = new MockAIService();

            // Layered Decorator: Caching (Still useful locally if we add logic later)
            this.instance = new CachedAIService(baseService);

            console.log(`[Vibe AI] Engine Initialized (Generic/Mock Mode).`);
        }

        return this.instance;
    }

    /**
     * Explicitly wipes the singleton instance.
     */
    public static reset() {
        this.instance = null;
    }
}
