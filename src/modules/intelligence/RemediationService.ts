import { type IAIService } from '../../core/interfaces/IAIService';
import { type TokenEntity } from '../../core/types';
import { HarmonyValidator, type Issue } from './HarmonyValidator';

/**
 * 🩹 RemediationService
 * The "Self-Healing" Doctor.
 * Uses HarmonyValidator to find issues, and AI to fix them.
 */
export class RemediationService {
    private ai: IAIService;

    constructor(ai: IAIService) {
        this.ai = ai;
    }

    /**
     * analyze
     * Returns a list of issues for a given token.
     */
    analyze(token: TokenEntity): Issue[] {
        return HarmonyValidator.validate(token);
    }

    /**
     * suggestFix
     * Uses Generative AI to suggest a correction for an issue.
     */
    async suggestFix(token: TokenEntity, issue: Issue): Promise<string | null> {
        if (issue.type === 'NAMING') {
            // Use AI to suggest a better name
            const prompt = `Fix this design token name to follow "category-element-variant" (kebab-case) convention.
            Current Name: "${token.name}"
            Value: "${token.$value}"
            Context: It is a design token.
            Respond ONLY with the fixed name.`;

            const response = await this.ai.generate(prompt, { tier: 'LITE' });
            return response.trim();
        }

        if (issue.type === 'CONTRAST') {
            // Future: Suggest a color with better contrast
            return null;
        }

        return null;
    }
}
