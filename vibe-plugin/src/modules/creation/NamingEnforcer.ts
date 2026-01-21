import { AIOrchestrator } from '../ai/AIOrchestrator';

export class NamingEnforcer {
    private pattern: RegExp;
    private aiOrchestrator: AIOrchestrator;
    private patternDescription: string;

    constructor(pattern: string, ai: AIOrchestrator) {
        // pattern example: "$context-$element-$state"
        // simple conversion to regex (this is a simplified implementation)
        // In a real scenario, we might want a more robust parser or user-provided regex.
        // For now, let's assume the user passes a valid regex string or a simple wildcard syntax.

        this.patternDescription = pattern;

        // Convert simplified syntax to regex if needed, or assume it's regex
        // For MVP, if it starts with ^, treat as regex. Else, treat as strict string pattern
        if (pattern.startsWith('^')) {
            this.pattern = new RegExp(pattern);
        } else {
            // Fallback for "$context-$element-$state" style
            const regexStr = pattern
                .replace(/\$context/g, '[a-z0-9]+')
                .replace(/\$element/g, '[a-z0-9]+')
                .replace(/\$state/g, '[a-z0-9]+')
                .replace(/\-/g, '\\-');
            this.pattern = new RegExp(`^${regexStr}$`);
        }

        this.aiOrchestrator = ai;
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

        const response = await this.aiOrchestrator.execute('naming-correction', prompt);

        try {
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
