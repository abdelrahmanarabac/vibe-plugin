import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../governance/VariableManager';

export class SyncTokensCapability implements ICapability {
    readonly id = 'sync-tokens-v1';
    readonly commandId = 'SYNC_TOKENS';
    readonly description = 'Synchronizes all local variables from Figma to the Token Repository.';

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
