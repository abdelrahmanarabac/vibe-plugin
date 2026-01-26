import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../governance/VariableManager';

export class RenameVariableCapability implements ICapability {
    readonly id = 'rename-variable-v1';
    readonly commandId = 'RENAME_TOKEN'; // Adapting to the specific command ID used in UI
    readonly description = 'Renames an existing variable.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { id: string; newName: string }, _context: AgentContext): Promise<Result<any>> {
        try {
            await this.variableManager.renameVariable(payload.id, payload.newName);
            return Result.ok({ renamed: true, id: payload.id, newName: payload.newName });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
