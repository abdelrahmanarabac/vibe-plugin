import { BaseAIService } from './BaseAIService';

export class FlashService extends BaseAIService {
    constructor(apiKey: string) {
        super(apiKey, 'gemini-2.0-flash');
    }

    async generate(prompt: string): Promise<string> {
        return this.generateWithRetry(prompt);
    }
}
