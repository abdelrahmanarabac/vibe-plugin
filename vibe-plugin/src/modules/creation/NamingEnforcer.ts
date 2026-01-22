import { ai } from '../../core/services/AIFactory';

export class NamingEnforcer {
    private pattern: RegExp;
    private patternDescription: string;

    constructor(pattern: string) {
        this.patternDescription = pattern;

        if (pattern.startsWith('^')) {
            this.pattern = new RegExp(pattern);
        } else {
            const regexStr = pattern
                .replace(/\$context/g, '[a-z0-9]+')
                .replace(/\$element/g, '[a-z0-9]+')
                .replace(/\$state/g, '[a-z0-9]+')
                .replace(/\-/g, '\\-');
            this.pattern = new RegExp(`^${regexStr}$`);
        }
    }

    validate(name: string): boolean {
        return this.pattern.test(name);
    }

    async suggestCorrection(invalidName: string): Promise<string> {
        const prompt = `
      Rule: Token names must match the pattern "${this.patternDescription}".
      Task: Fix the invalid name "${invalidName}" to strictly follow the pattern.
      Output: Return JSON only: { "suggestedName": "string" }
    `;

        try {
            const response = await ai.generate(prompt, { tier: 'LITE' });

            // Simple cleanup to handle markdown code blocks if AI adds them
            const jsonStr = response.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(jsonStr);
            return parsed.suggestedName || invalidName;
        } catch (e) {
            console.error("Failed to parse AI naming suggestion", e);
            return invalidName;
        }
    }
}
