import type { IAIService } from "./interfaces/IAIService";
import type { UserIntent } from "./types";

/**
 * 🧠 IntentEngine
 * The System 1 (Fast) vs System 2 (Slow) router.
 * Decides IF we need to Generate, Modify, or Answer.
 */
export class IntentEngine {
    private ai: IAIService;
    constructor(ai: IAIService) {
        this.ai = ai;
    }

    /**
     * Classifies a natural language query into an actionable Intent.
     */
    async classify(query: string): Promise<UserIntent> {
        // 1. Fast Path: Heuristics / Keyword Matching (System 1)

        // 🧠 Zero-Shot Rename Detection
        const RENAME_COLLECTION_REGEX = /(?:rename|change)\s+(?:collection|group)\s+(?:from\s+)?['"]?([^'"]+)['"]?\s+to\s+['"]?([^'"]+)['"]?/i;
        const renameMatch = query.match(RENAME_COLLECTION_REGEX);
        if (renameMatch) {
            return {
                type: 'RENAME_COLLECTION',
                confidence: 1.0,
                originalQuery: query,
                payload: {
                    oldName: renameMatch[1],
                    newName: renameMatch[2]
                }
            };
        }

        // Check for strong verbs indicating generation
        if (query.match(/generate|create|scaffold|make a theme|build/i)) {
            // If it has "system", "theme", "tokens" -> GENERATE
            if (query.match(/system|theme|tokens|palette/i)) {
                return { type: 'GENERATE_SYSTEM', confidence: 0.9, originalQuery: query };
            }
        }

        // Check for modification verbs
        if (query.match(/change|update|set|modify|make/i)) {
            // e.g., "Make the primary color red"
            return { type: 'MODIFY_TOKEN', confidence: 0.8, originalQuery: query };
        }

        // 2. Slow Path: LLM Analysis (System 2)
        // If heuristics are ambiguous, we ask the AI (Lite model)
        try {
            const prompt = `
                SYSTEM ROLE: Intent Classifier.
                Classify user query: "${query}"
                Categories: [GENERATE_SYSTEM, MODIFY_TOKEN, ANSWER_QUESTION].
                Return ONLY the Category Name.
            `;

            const result = await this.ai.generateTokens(prompt);
            const cleanResult = result.trim().toUpperCase();

            if (cleanResult.includes('GENERATE')) return { type: 'GENERATE_SYSTEM', confidence: 0.95, originalQuery: query };
            if (cleanResult.includes('MODIFY')) return { type: 'MODIFY_TOKEN', confidence: 0.95, originalQuery: query };
            return { type: 'ANSWER_QUESTION', confidence: 0.8, originalQuery: query };

        } catch (e) {
            console.warn("Intent System 2 Failed, defaulting to Question.", e);
            return { type: 'ANSWER_QUESTION', confidence: 0.5, originalQuery: query };
        }
    }
}
