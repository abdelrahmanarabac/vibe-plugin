import { BaseAIService } from './BaseAIService';

export class Flash3Service extends BaseAIService {
    constructor(apiKey: string) {
        super(apiKey, 'gemini-3-flash');
    }

    async generate(prompt: string): Promise<string> {
        return this.generateWithRetry(prompt);
    }
}
