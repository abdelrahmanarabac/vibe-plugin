export interface AIOptions {
    temperature?: number;
    maxTokens?: number;
    context?: any;
    stopSequences?: string[];
}

export interface AIResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface IAIService {
    generate(prompt: string, options?: AIOptions): Promise<string>;
    generateJSON<T>(prompt: string, schema?: any): Promise<T>;
    stream(prompt: string, onChunk: (chunk: string) => void): Promise<void>;
}
