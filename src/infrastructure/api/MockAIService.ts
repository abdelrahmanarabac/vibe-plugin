import type { IAIService, AIOptions } from '../../core/interfaces/IAIService';

/**
 * 🎭 MockAIService
 * A placeholder service that replaces the live Gemini integration.
 * Used to comply with Figma's "No API Key" restrictions for the public release.
 */
export class MockAIService implements IAIService {

    constructor() {
        console.log('[Vibe] Mock AI Service Initialized (AI Disabled).');
    }

    async generate(prompt: string, _options?: AIOptions): Promise<string> {
        console.warn('[MockAI] Generate called with:', prompt);
        return "AI capabilities are currently disabled in this version of Vibe.";
    }

    async generateJSON<T>(prompt: string, _schema?: unknown): Promise<T> {
        console.warn('[MockAI] GenerateJSON called with:', prompt);
        // Return an empty object cast as T. 
        // This might break strict consumers if they expect specific fields, 
        // but typically the UI handles null/empty gracefully or we can improve this if needed.
        return {} as T;
    }

    async analyzeImage(_imageBytes: Uint8Array, _prompt: string): Promise<string> {
        console.warn('[MockAI] AnalyzeImage called.');
        return "Visual analysis is disabled.";
    }
}
