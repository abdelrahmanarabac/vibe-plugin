import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

import { AIModelError, AIModelOverloadedError } from '../../shared/errors/AppErrors';

export class AIService {
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

            } catch (error: unknown) {
                attempt++;
                const errorMessage = error instanceof Error ? error.message : String(error);

                if (errorMessage === 'Timeout') {
                    throw new AIModelError(`[${this.modelName}] Operation timed out after 10s.`);
                }
                if (this.isRetryableError(error) && attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const status = (error as any).status;
                    console.warn(`[${this.modelName}] Error ${status}. Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                if (this.isOverloadedError(error)) {
                    throw new AIModelOverloadedError();
                }

                throw new AIModelError(`[${this.modelName}] Generation failed: ${errorMessage}`);
            }
        }
        throw new AIModelError(`[${this.modelName}] Max retries exceeded.`);
    }

    private isOverloadedError(error: unknown): boolean {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        return e.status === 429 || e.message?.includes('overloaded');
    }

    private isRetryableError(error: unknown): boolean {
        // 429: Too Many Requests, 503: Service Unavailable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const e = error as any;
        return e.status === 429 || e.status === 503 || e.message?.includes('overloaded');
    }

    // Concrete implementation
    async generate(prompt: string): Promise<string> {
        return this.generateWithRetry(prompt);
    }
}
