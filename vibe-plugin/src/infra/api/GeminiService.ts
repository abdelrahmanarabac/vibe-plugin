import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IAIService, AIOptions, ModelTier } from "../../core/interfaces/IAIService";

export class GeminiService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private liteModel: any;
    private smartModel: any;
    private visionModel: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Initialize models lazy or eager. Eager for now to match BrowserAIService pattern
        this.liteModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        this.smartModel = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        this.visionModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    private getModel(tier: ModelTier) {
        switch (tier) {
            case 'LITE': return this.liteModel;
            case 'SMART': return this.smartModel;
            case 'VISION': return this.visionModel;
            default: return this.liteModel;
        }
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        const tier = options?.tier || 'LITE';
        const retries = options?.retries || 3;

        for (let i = 0; i < retries; i++) {
            try {
                const model = this.getModel(tier);

                const generationConfig = {
                    temperature: options?.temperature,
                    maxOutputTokens: options?.maxTokens,
                    stopSequences: options?.stopSequences
                };

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig
                });
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                const isRetryable = error.message.includes('503') || error.message.includes('429');

                if (isRetryable && i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000;
                    console.warn(`⚠️ AI Busy (Tier: ${tier}). Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }

                console.error("AI Generation Error:", error);
                throw error;
            }
        }
        throw new Error("AI Busy. Max retries exceeded.");
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
            throw new Error("Failed to parse AI response as JSON");
        }
    }

    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        const model = this.getModel('VISION');
        const result = await model.generateContent([
            prompt,
            { inlineData: { data: btoa(String.fromCharCode(...new Uint8Array(imageBytes))), mimeType: "image/png" } }
        ]);
        const response = await result.response;
        return response.text();
    }
}
