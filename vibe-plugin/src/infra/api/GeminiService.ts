import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IAIService } from "../../modules/intelligence/interfaces/IAIService";

type ModelTier = 'LITE' | 'SMART' | 'VISION';

export class GeminiService implements IAIService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    private getModel(tier: ModelTier) {
        switch (tier) {
            case 'LITE': return this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
            case 'SMART': return this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            case 'VISION': return this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            default: return this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        }
    }

    async generateTokens(prompt: string, retries = 3): Promise<string> {
        return this.generate(prompt, 'LITE', retries);
    }

    async generate(prompt: string, tier: ModelTier = 'LITE', retries = 3): Promise<string> {
        for (let i = 0; i < retries; i++) {
            try {
                const model = this.getModel(tier);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                const isRetryable = error.message.includes('503') || error.message.includes('429');

                if (isRetryable && i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
                    console.warn(`⚠️ AI Busy (Tier: ${tier}). Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }

                // If LITE fails on busy, maybe fallback logic belongs in AgentCore, but for basic retry we throw.
                console.error("AI Generation Error:", error);
                const msg = error instanceof Error ? error.message : JSON.stringify(error);
                throw new Error(`AI Fail: ${msg}`);
            }
        }
        throw new Error("AI Busy. Max retries exceeded.");
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
