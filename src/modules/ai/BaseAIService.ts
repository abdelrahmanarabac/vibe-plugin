import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

import { AIModelError, AIModelOverloadedError } from '../../shared/errors/AppErrors';

export abstract class BaseAIService {
    protected model: GenerativeModel;
    protected modelName: string;

    constructor(apiKey: string, modelName: string) {
        const genAI = new GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
        this.model = genAI.getGenerativeModel({ model: modelName });
    }

    protected async generateWithRetry(prompt: string, maxRetries = 3): Promise<string> {
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                const timeoutPromise = new Promise<string>((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 10000)
                );

                const resultPromise = this.model.generateContent(prompt).then(res => res.response.text());

                // Race between generation and 10s timeout
                return await Promise.race([resultPromise, timeoutPromise]);

            } catch (error: any) {
                attempt++;
                if (error.message === 'Timeout') {
                    throw new AIModelError(`[${this.modelName}] Operation timed out after 10s.`);
                }
                if (this.isRetryableError(error) && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    console.warn(`[${this.modelName}] Error ${error.status}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                if (error.status === 429 || error.message?.includes('overloaded')) {
                    throw new AIModelOverloadedError();
                }

                throw new AIModelError(`[${this.modelName}] Generation failed: ${error.message}`);
            }
        }
        throw new AIModelError(`[${this.modelName}] Max retries exceeded.`);
    }

    private isRetryableError(error: any): boolean {
        // 429: Too Many Requests, 503: Service Unavailable
        return error.status === 429 || error.status === 503 || error.message?.includes('overloaded');
    }

    abstract generate(prompt: string): Promise<string>;
}
