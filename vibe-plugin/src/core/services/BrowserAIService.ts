import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { IAIService, AIOptions } from '../../core/interfaces/IAIService';

export class BrowserAIService implements IAIService {
    private client: GoogleGenerativeAI;
    private model: GenerativeModel;
    private liteModel: GenerativeModel;
    private visionModel: GenerativeModel;

    constructor(config: { apiKey: string; model?: string }) {
        if (!config.apiKey) {
            console.warn("⚠️ BrowserAIService initialized without API Key.");
        }
        this.client = new GoogleGenerativeAI(config.apiKey);
        this.model = this.client.getGenerativeModel({ model: config.model || "gemini-2.0-flash" });
        this.liteModel = this.client.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        this.visionModel = this.client.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        try {
            const targetModel = (options?.tier === 'LITE') ? this.liteModel : this.model;

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

    async generateJSON<T>(prompt: string, _schema?: any): Promise<T> {
        const jsonPrompt = `${prompt} \n\n IMPORTANT: Return ONLY valid JSON. No markdown formatting.`;
        const text = await this.generate(jsonPrompt, { temperature: 0.2, tier: 'LITE' });

        let cleaned = text.trim();
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

    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        try {
            const result = await this.visionModel.generateContent([
                prompt,
                { inlineData: { data: btoa(String.fromCharCode(...new Uint8Array(imageBytes))), mimeType: "image/png" } }
            ]);
            return result.response.text();
        } catch (error: any) {
            console.error("Vision Analysis Failed:", error);
            throw new Error(`Vision Error: ${error.message}`);
        }
    }
}
