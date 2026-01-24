import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import type { VariableManager } from '../../modules/governance/VariableManager';

export class SyncGraphCapability implements ICapability {
    readonly id = 'sync-graph-v1';
    readonly commandId = 'SYNC_GRAPH';
    readonly description = 'Synchronizes all local variables from Figma to the Token Graph.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true; // Always allowed
    }

    async execute(_payload: any, _context: AgentContext): Promise<Result<any>> {
        try {
            const tokens = await this.variableManager.syncFromFigma();
            return Result.ok({
                tokens,
                count: tokens.length,
                timestamp: Date.now()
            });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
