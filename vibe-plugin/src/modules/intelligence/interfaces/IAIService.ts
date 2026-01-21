export interface IAIService {
    generateTokens(prompt: string, retries?: number): Promise<string>;
}
