import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../../features/governance/VariableManager';

type RenamePayload = { id: string; newName: string };
type RenameResult = { renamed: boolean; id: string; newName: string };

export class RenameVariableCapability implements ICapability<RenamePayload, RenameResult> {
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

    async execute(payload: RenamePayload, _context: AgentContext): Promise<Result<RenameResult>> {
        try {
            await this.variableManager.renameVariable(payload.id, payload.newName);
            return Result.ok({ renamed: true, id: payload.id, newName: payload.newName });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during rename';
            return Result.fail(message);
        }
    }
}
