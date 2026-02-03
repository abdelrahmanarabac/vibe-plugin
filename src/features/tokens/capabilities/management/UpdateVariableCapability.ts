import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../../features/governance/VariableManager';
import { HarmonyValidator } from '../../../../features/intelligence/HarmonyValidator';
import { TraceLineageCapability } from '../../../../features/intelligence/capabilities/TraceLineageCapability';

import type { VariableValue } from '../../../../core/types';

type UpdatePayload = { id: string; value: VariableValue };
type UpdateResult = { updated: boolean; id: string };

export class UpdateVariableCapability implements ICapability<UpdatePayload, UpdateResult> {
    readonly id = 'update-variable-v1';
    readonly commandId = 'UPDATE_VARIABLE';
    readonly description = 'Updates the value of an existing variable.';

    private variableManager: VariableManager;
    private lineageTracer: TraceLineageCapability;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
        this.lineageTracer = new TraceLineageCapability();
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: UpdatePayload, context: AgentContext): Promise<Result<UpdateResult>> {
        try {
            const { id, value } = payload;

            if (!id || value === undefined) {
                return Result.fail('Missing id or value');
            }

            // 🔮 Harmony Healer: Pre-flight Check
            const targetToken = context.repository.getTokens().get(id);
            if (targetToken && targetToken.$type === 'color') {
                // 1. Trace Dependents
                const lineageResult = await this.lineageTracer.execute({ tokenId: id }, context);
                if (lineageResult.success && lineageResult.value) {
                    const dependents = lineageResult.value.descendants || [];

                    // 2. Validate Contrast
                    // Only run contrast check if the new value is a string (color hex)
                    if (typeof value === 'string') {
                        const issues = HarmonyValidator.validateContrast(targetToken, value, dependents);
                        if (issues.length > 0) {
                            // For now, we allow it but return warnings. In strict mode, we would fail.
                            console.warn('[Harmony Healer] Detected contrast regressions:', issues);
                            // We could return Result.fail here if we wanted to block.
                        }
                    }
                }
            }

            await this.variableManager.updateVariable(id, value);
            return Result.ok({ updated: true, id });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during update';
            return Result.fail(message);
        }
    }
}
