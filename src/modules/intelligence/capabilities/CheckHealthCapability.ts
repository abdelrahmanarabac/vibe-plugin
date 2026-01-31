import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';
import { QualityGate } from '../QualityGate';
import { TokenRepository } from '../../../core/TokenRepository';
import type { VibeToken, TokenType as VibeTokenType } from '../types';

export class CheckHealthCapability implements ICapability {
    readonly id = 'intelligence-check-health';
    readonly commandId = 'CHECK_HEALTH';
    readonly description = 'Runs a quality check on the current token graph.';

    private repository: TokenRepository;

    constructor(repository: TokenRepository) {
        this.repository = repository;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<{ errors: unknown[]; score: number; timestamp: number }>> {
        try {
            const entities = this.repository.getAllNodes();

            // Map to VibeToken for QualityGate
            const tokens: VibeToken[] = entities.map(e => ({
                name: e.name,
                $value: e.$value,
                $type: e.$type as unknown as VibeTokenType, // Conversional cast between Core and Intelligence domains
                description: e.$description
            }));

            const errors = QualityGate.validate(tokens);

            return Result.ok({
                errors,
                score: Math.max(0, 100 - (errors.length * 5)),
                timestamp: Date.now()
            });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message);
        }
    }
}
