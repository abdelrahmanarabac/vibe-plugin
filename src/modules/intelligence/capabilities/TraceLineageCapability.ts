import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';
import type { TokenEntity } from '../../../core/types';

type TraceLineagePayload = { tokenId: string };
type TraceLineageResult = { target: TokenEntity; ancestors: TokenEntity[]; descendants: TokenEntity[] };

export class TraceLineageCapability implements ICapability<TraceLineagePayload, TraceLineageResult> {
    readonly id = 'trace-lineage-v1';
    readonly commandId = 'TRACE_LINEAGE';
    readonly description = 'Traces the ancestry and impact of a specific token.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: TraceLineagePayload, context: AgentContext): Promise<Result<TraceLineageResult>> {
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
