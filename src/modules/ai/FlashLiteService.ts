import { BaseAIService } from './BaseAIService';

export class FlashLiteService extends BaseAIService {
    constructor(apiKey: string) {
        super(apiKey, 'gemini-2.0-flash-lite');
    }

    async generate(prompt: string): Promise<string> {
        // Flash-lite is optimized for speed. logic can be specific here if needed.
        return this.generateWithRetry(prompt);
    }
}
