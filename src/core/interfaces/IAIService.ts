export type ModelTier = 'LITE' | 'SMART' | 'VISION';

export interface AIOptions {
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    tier?: ModelTier;
    retries?: number;
}

export interface IAIService {
    /**
     * Generates text content based on the prompt.
     */
    generate(prompt: string, options?: AIOptions): Promise<string>;

    /**
     * Generates structured JSON data.
     */
    generateJSON<T>(prompt: string, schema?: unknown): Promise<T>;

    /**
     * Analyzes an image and returns a text description.
     */
    analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string>;
}
