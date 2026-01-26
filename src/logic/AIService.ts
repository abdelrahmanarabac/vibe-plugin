import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    }

    async generateTokens(prompt: string, retries = 3): Promise<string> {
        for (let i = 0; i < retries; i++) {
            try {
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error: any) {
                const isRetryable = error.message.includes('503') || error.message.includes('429');

                if (isRetryable && i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
                    console.warn(`⚠️ AI Busy (503). Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }

                console.error("AI Generation Error:", error);
                const msg = error instanceof Error ? error.message : JSON.stringify(error);
                throw new Error(`AI Fail: ${msg}`);
            }
        }
        throw new Error("AI Busy. Max retries exceeded.");
    }
}
