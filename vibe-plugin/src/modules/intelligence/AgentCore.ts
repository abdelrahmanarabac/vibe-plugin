import type { IAIService } from "./interfaces/IAIService";
import { SemanticIntelligence } from "./SemanticIntelligence";
import { QualityGate } from "./QualityGate";
import type { AgentContext, VibeToken } from "./types";
import { MemoryService } from "./MemoryService";

/**
 * ⚡ AgentCore
 * The "Brain" of the operation.
 * Orchestrates the Thinking -> Acting -> Healing loop.
 */
export class AgentCore {
    private ai: IAIService;
    // @ts-ignore
    private _memory: MemoryService;

    constructor(aiService: IAIService, memoryService?: MemoryService) {
        this.ai = aiService;
        this._memory = memoryService || new MemoryService();
    }

    /**
     * The Main Event Loop.
     * 1. Constructs Prompt
     * 2. Calls AI
     * 3. Validates (QualityGate)
     * 4. Heals if necessary
     * 5. Returns final tokens
     */
    async processedThinking(context: AgentContext, onProgress: (msg: string) => void): Promise<VibeToken[]> {

        // 1. 🧠 Perception & Planning
        onProgress("Thinking... 🧠");
        const prompt = SemanticIntelligence.buildMappingPrompt(context.primitives, context.vibe);

        // 2. ⚡ Generation (System 1)
        onProgress("Drafting Design System... 📝");
        const rawResponse = await this.ai.generateTokens(prompt);
        let tokens = SemanticIntelligence.parseResponse(rawResponse);

        // 3. 🛡️ Quality Assurance (System 2)
        onProgress("Auditing & Validating... 🛡️");
        const errors = QualityGate.validate(tokens);

        if (errors.length > 0) {
            console.warn("Quality Gate Issues:", errors);

            // 4. 🚑 Self-Healing
            onProgress("Self-Healing Defects... 🚑");
            tokens = QualityGate.heal(tokens, errors);

            // Re-validate strictly? For now, we trust the heal or accept best effort.
        }

        onProgress("Finalizing... ✨");
        return tokens;
    }
}
