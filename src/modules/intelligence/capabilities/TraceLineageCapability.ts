import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

export class TraceLineageCapability implements ICapability {
    readonly id = 'trace-lineage-v1';
    readonly commandId = 'TRACE_LINEAGE';
    readonly description = 'Traces the ancestry and impact of a specific token.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { tokenId: string }, context: AgentContext): Promise<Result<any>> {
        const { tokenId } = payload;
        const target = context.repository.getNode(tokenId);

        if (!target) {
            return Result.fail(`Token ${tokenId} not found in repository.`);
        }

        const ancestors = context.repository.getAncestry(tokenId);
        const descendants = context.repository.getImpact(tokenId);

        return Result.ok({
            target,
            ancestors,
            descendants
        });
    }
}
