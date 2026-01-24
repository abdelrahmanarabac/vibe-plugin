import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import type { VariableManager } from '../../modules/governance/VariableManager';

export class CreateVariableCapability implements ICapability {
    readonly id = 'create-variable-v1';
    // Mapped to both legacy and new command IDs if needed, but registry handles one-to-one.
    // We will register multiple instances or aliases if needed, but for now strict mapping.
    readonly commandId = 'CREATE_VARIABLE';
    readonly description = 'Creates a new design token (variable) in Figma.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { name: string; type: 'color' | 'number' | 'string'; value: any }, _context: AgentContext): Promise<Result<any>> {
        try {
            await this.variableManager.createVariable(payload.name, payload.type, payload.value);
            return Result.ok({ created: true, name: payload.name });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
