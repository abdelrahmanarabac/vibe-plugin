import { FlashLiteService } from './FlashLiteService';
import { FlashService } from './FlashService';
import { Flash3Service } from './Flash3Service';

export type AITask =
    | 'naming-correction'      // Flash-lite
    | 'color-suggestion'       // Flash-lite
    | 'nl-command'             // Flash (Natural Language)
    | 'scale-generation'       // Flash
    | 'semantic-description'   // Flash
    | 'code-generation'        // Flash-3
    | 'brand-extraction'       // Flash-3
    | 'advanced-refactor';     // Flash-3

export class AIOrchestrator {
    private flashLite: FlashLiteService;
    private flash: FlashService;
    private flash3: Flash3Service;

    constructor(apiKey: string) {
        this.flashLite = new FlashLiteService(apiKey);
        this.flash = new FlashService(apiKey);
        this.flash3 = new Flash3Service(apiKey);
    }

    async execute(task: AITask, prompt: string): Promise<string> {
        switch (task) {
            case 'naming-correction':
            case 'color-suggestion':
                return this.flashLite.generate(prompt);

            case 'nl-command':
            case 'scale-generation':
            case 'semantic-description':
                return this.flash.generate(prompt);

            case 'code-generation':
            case 'brand-extraction':
            case 'advanced-refactor':
                return this.flash3.generate(prompt);

            default:
                throw new Error(`Unknown task: ${task}`);
        }
    }
}
