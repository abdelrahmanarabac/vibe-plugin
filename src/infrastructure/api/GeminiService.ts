import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IAIService, AIOptions } from '../../core/interfaces/IAIService';
import { SafeBinary } from '../../modules/security/SafeBinary';

/**
 * 🤖 GeminiService
 * Infrastructure adapter for Google's Gemini Models.
 * Optimized for high-speed token generation and structural analysis.
 */
export class GeminiService implements IAIService {
    private genAI: GoogleGenerativeAI;
    private flashLite = "gemini-2.0-flash-lite-001"; // ⚡ Ultra-fast L7 standard
    private flash3 = "gemini-2.0-flash";          // 🧠 Highly complex logic

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generate(prompt: string, options?: AIOptions): Promise<string> {
        const modelName = options?.tier === 'SMART' ? this.flash3 : this.flashLite;
        const model = this.genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: options?.temperature ?? 0.7,
                maxOutputTokens: options?.maxTokens ?? 2048,
            }
        });

        return result.response.text();
    }

    async generateJSON<T>(prompt: string, _schema?: unknown): Promise<T> {
        const model = this.genAI.getGenerativeModel({
            model: this.flash3,
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        // Defense: Validate JSON structure if schema is provided (Future enhancement)
        return JSON.parse(result.response.text()) as T;
    }

    async analyzeImage(imageBytes: Uint8Array, prompt: string): Promise<string> {
        const model = this.genAI.getGenerativeModel({ model: this.flash3 });

        // SECURE IMPLEMENTATION:
        // Use SafeBinary for deterministic, stack-safe Base64 conversion
        const base64 = SafeBinary.toBase64(imageBytes);

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64, mimeType: 'image/png' } }
        ]);

        return result.response.text();
    }
}
