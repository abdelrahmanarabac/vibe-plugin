import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';

import type { VariableValue } from '../../../../core/types';

type UpdatePayload = { id: string; value: VariableValue };
type UpdateResult = { updated: boolean; id: string };

export class UpdateVariableCapability implements ICapability<UpdatePayload, UpdateResult> {
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

    async execute(payload: UpdatePayload, _context: AgentContext): Promise<Result<UpdateResult>> {
        try {
            const { id, value } = payload;

            if (!id || value === undefined) {
                return Result.fail('Missing id or value');
            }

            // Perform the update
            await this.variableManager.updateVariable(id, value);
            return Result.ok({ updated: true, id });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during update';
            return Result.fail(message);
        }
    }
}
