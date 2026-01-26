import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IAIService, AIOptions, ModelTier } from "../../core/interfaces/IAIService";

/**
 * 🤖 GeminiService (Infrastructure Adapter)
 * Implementation of IAIService using the Google Generative AI SDK.
 * Handles model selection, retries, and high-stakes error management.
 * 
 * @revision 2026.1 - Upgraded to 2.5 and 3.0 Flash models.
 */
export class GeminiService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private liteModel: any;
    private smartModel: any;
    private visionModel: any;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error("GeminiService: API Key is required for initialization.");
        }

        this.genAI = new GoogleGenerativeAI(apiKey);

        /**
         * 🚨 MODEL CONFIGURATION (VIBE v3.0)
         * Using definitive 2026 identifiers per user mandate.
         */
        this.liteModel = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        this.smartModel = this.genAI.getGenerativeModel({ model: "gemini-3-flash" });
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

    /**
     * Standard text generation with exponential backoff.
     */
    async generate(prompt: string, options?: AIOptions): Promise<string> {
        const tier = options?.tier || 'LITE';
        const retries = options?.retries || 3;

        for (let i = 0; i < retries; i++) {
            try {
                const model = this.getModel(tier);

                const generationConfig = {
                    temperature: options?.temperature ?? 0.7,
                    maxOutputTokens: options?.maxTokens,
                    stopSequences: options?.stopSequences
                };

                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig
                });

                const response = await result.response;
                const text = response.text();

                if (!text) {
                    throw new Error("AI returned an empty response.");
                }

                return text;
            } catch (error: any) {
                // Handling specific 2026 API error structures
                if (error.status === 404 || error.message?.includes('404')) {
                    throw new Error(`AI Model NotFound (404): The selected model tier [${tier}] is not available in your region or API version.`);
                }

                if (error.message?.includes('403') || error.status === 403) {
                    throw new Error("AI Access Forbidden (403): Invalid API Key or restricted permissions.");
                }

                const isRetryable = error.status === 429 || error.status === 503 || error.message?.includes('503');

                if (isRetryable && i < retries - 1) {
                    const delay = Math.pow(2, i) * 1000;
                    console.warn(`⚠️ [Gemini] Resource Busy. Retrying [${tier}] in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    continue;
                }

                console.error("Gemini Execution Failure:", error);
                throw error;
            }
        }
        throw new Error("Gemini execution failed after maximum retries.");
    }

    /**
     * Generates a structural JSON response (Strict Mode).
     */
    async generateJSON<T>(prompt: string, _schema?: any): Promise<T> {
        const jsonPrompt = `${prompt} \n\n IMPORTANT: Return ONLY valid JSON. No markdown code blocks.`;
        const text = await this.generate(jsonPrompt, { temperature: 0.1, tier: 'LITE' });

        let cleaned = text.trim();
        // Remove markdown noise
        cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            return JSON.parse(cleaned) as T;
        } catch (e) {
            console.error("JSON Parse Failure. Text received:", text);
            throw new Error("Gemini returned invalid JSON structure.");
        }
    }

    /**
     * Multimodal analysis (Vision Engine).
     */
    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        try {
            const model = this.getModel('VISION');
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: btoa(Array.from(imageBytes, b => String.fromCharCode(b)).join('')),
                        mimeType: "image/png"
                    }
                }
            ]);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Vision Analysis Error:", error);
            throw new Error(`Vision Capability Error: ${error.message}`);
        }
    }
}
