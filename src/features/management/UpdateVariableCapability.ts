import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../governance/VariableManager';

export class UpdateVariableCapability implements ICapability {
    readonly id = 'update-variable-v1';
    readonly commandId = 'UPDATE_VARIABLE';
    readonly description = 'Updates the value of an existing variable.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: any, _context: AgentContext): Promise<Result<any>> {
        try {
            // Context: payload might be nested or flat depending on controller normalization.
            // We expect normalized payload here from the controller adapter.
            const { id, value } = payload;

            if (!id || value === undefined) {
                return Result.fail('Missing id or value');
            }

            await this.variableManager.updateVariable(id, value);
            return Result.ok({ updated: true, id });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
