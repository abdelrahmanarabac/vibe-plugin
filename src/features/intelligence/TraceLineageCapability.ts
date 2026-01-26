import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import { type TokenEntity } from '../../core/types';

export interface LineageResult {
    target: TokenEntity;
    ancestors: TokenEntity[];
    descendants: TokenEntity[];
}

export class TraceLineageCapability implements ICapability {
    readonly id = 'trace-lineage';
    readonly commandId = 'TRACE_LINEAGE';
    readonly description = 'Traces the full ancestry and descendants of a token.';

    canExecute(context: AgentContext): boolean {
        return !!context.repository;
    }

    async execute(payload: { tokenId: string }, context: AgentContext): Promise<Result<LineageResult>> {
        const { tokenId } = payload;
        const { repository } = context;

        if (!repository) return Result.fail('Repository not initialized');

        const targetToken = repository.getNode(tokenId);
        if (!targetToken) {
            return Result.fail(`Token ${tokenId} not found in graph`);
        }

        // 1. Get Deep Ancestry (Upstream)
        // Uses the new getAncestry method we added to TokenRepository
        const ancestors = repository.getAncestry(tokenId);

        // 2. Get Deep Impact (Downstream)
        const descendants = repository.getImpact(tokenId);

        return Result.ok({
            target: targetToken,
            ancestors,
            descendants
        });
    }
}
