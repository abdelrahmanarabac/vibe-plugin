import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { IAIService, AIOptions } from '../ports/IAIService';

export class BrowserAIService implements IAIService {
    private client: GoogleGenerativeAI;
    private model: GenerativeModel;
    private liteModel: GenerativeModel;

    constructor(config: { apiKey: string; model?: string }) {
        if (!config.apiKey) {
            console.warn("⚠️ BrowserAIService initialized without API Key.");
        }
        this.client = new GoogleGenerativeAI(config.apiKey);
        this.model = this.client.getGenerativeModel({ model: config.model || "gemini-2.0-flash" });
        this.liteModel = this.client.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        try {
            const targetModel = (options?.context === 'LITE') ? this.liteModel : this.model;

            const result = await targetModel.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: options?.temperature ?? 0.7,
                    maxOutputTokens: options?.maxTokens,
                    stopSequences: options?.stopSequences
                }
            });

            return result.response.text();
        } catch (error: any) {
            console.error("AI Generation Failed:", error);
            throw new Error(`AI Service Error: ${error.message}`);
        }
    }

    async generateJSON<T>(prompt: string, schema?: any): Promise<T> {
        const jsonPrompt = `${prompt} \n\n IMPORTANT: Return ONLY valid JSON. No markdown formatting.`;
        const text = await this.generate(jsonPrompt, { temperature: 0.2 });

        let cleaned = text.trim();
        // Remove markdown code blocks if present
        if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
        if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
        if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);

        try {
            return JSON.parse(cleaned) as T;
        } catch (e) {
            console.error("JSON Parse Error:", cleaned);
            throw new Error("Failed to parse AI response as JSON");
        }
    }

    async stream(prompt: string, onChunk: (chunk: string) => void): Promise<void> {
        try {
            const result = await this.model.generateContentStream(prompt);
            for await (const chunk of result.stream) {
                const text = chunk.text();
                onChunk(text);
            }
        } catch (error) {
            console.error("AI Stream Error:", error);
        }
    }
}
