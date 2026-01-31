import type { IAIService } from '../../core/interfaces/IAIService';

/**
 * 📏 NamingEnforcer (Core Domain Logic)
 * Validates and suggests corrections for token names based on a regex pattern.
 */
export class NamingEnforcer {
    private pattern: RegExp;
    private patternDescription: string;

    constructor(pattern: string) {
        this.patternDescription = pattern;

        if (pattern.startsWith('^')) {
            this.pattern = new RegExp(pattern);
        } else {
            // Convert simple descriptive patterns to regex
            const regexStr = pattern
                .replace(/\$context/g, '[a-z0-9]+')
                .replace(/\$element/g, '[a-z0-9]+')
                .replace(/\$state/g, '[a-z0-9]+')
                .replace(/-/g, '\\-');
            this.pattern = new RegExp(`^${regexStr}$`);
        }
    }

    /**
     * Checks if a name matches the defined pattern.
     */
    validate(name: string): boolean {
        return this.pattern.test(name);
    }

    /**
     * Uses AI to suggest a matching name if the current one is invalid.
     * Expects an IAIService instance to be injected.
     */
    async suggestCorrection(invalidName: string, ai: IAIService): Promise<string> {
        const prompt = `
            Rule: Token names must match the pattern "${this.patternDescription}".
            Task: Fix the invalid name "${invalidName}" to strictly follow the pattern.
            Output: Return JSON only: { "suggestedName": "string" }
        `;

        try {
            const response = await ai.generate(prompt, { tier: 'LITE' });

            // Cleansing logic (Handled centrally in GeminiService usually, but keeping extra safety here)
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            return parsed.suggestedName || invalidName;
        } catch (e) {
            console.error("[NamingEnforcer] Failed to suggest correction:", e);
            return invalidName;
        }
    }
}
