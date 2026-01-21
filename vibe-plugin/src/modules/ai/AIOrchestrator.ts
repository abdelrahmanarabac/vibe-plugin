import { GeminiService } from '../../infra/api/GeminiService';
import { MemoryService } from '../intelligence/MemoryService';

export type AITask =
    | 'naming-correction'
    | 'color-suggestion'
    | 'nl-command'
    | 'scale-generation'
    | 'semantic-description'
    | 'code-generation'
    | 'brand-extraction'
    | 'advanced-refactor';

export class AIOrchestrator {
    private ai: GeminiService;
    private memory: MemoryService;

    constructor(apiKey: string) {
        this.ai = new GeminiService(apiKey);
        this.memory = new MemoryService();
    }

    async execute(task: AITask, prompt: string): Promise<string> {
        // Retrieve Context (if applicable)
        let context = "";
        if (['nl-command', 'color-suggestion', 'semantic-description'].includes(task)) {
            const history = await this.memory.retrieveContext(prompt);
            if (history.length > 0) {
                const examples = history.map(h => `${h.name}: ${JSON.stringify(h.$value)}`).join('\n');
                context = `\n[Project Context - Mimic this style]:\n${examples}\n`;
            }
        }

        const finalPrompt = prompt + context;

        switch (task) {
            case 'naming-correction':
            case 'color-suggestion':
                return this.ai.generate(finalPrompt, 'LITE');

            case 'nl-command':
            case 'scale-generation':
            case 'semantic-description':
                return this.ai.generate(finalPrompt, 'LITE'); // Using Lite for now for speed, can upgrade to SMART

            case 'code-generation':
            case 'brand-extraction':
            case 'advanced-refactor':
                return this.ai.generate(finalPrompt, 'SMART'); // "Smart" maps to Flash 2.0/3.0

            default:
                throw new Error(`Unknown task: ${task}`);
        }
    }
}
