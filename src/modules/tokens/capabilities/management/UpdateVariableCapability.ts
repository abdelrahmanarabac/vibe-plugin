import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../governance/VariableManager';
import { HarmonyValidator } from '../../../intelligence/HarmonyValidator';
import { TraceLineageCapability } from '../../../intelligence/capabilities/TraceLineageCapability';

export class UpdateVariableCapability implements ICapability {
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

    async execute(payload: any, context: AgentContext): Promise<Result<any>> {
        try {
            const { id, value } = payload;

            if (!id || value === undefined) {
                return Result.fail('Missing id or value');
            }

            // 🔮 Harmony Healer: Pre-flight Check
            const targetToken = context.repository.getGraph().get(id);
            if (targetToken && targetToken.$type === 'color') {
                // 1. Trace Dependents
                const lineageResult = await this.lineageTracer.execute({ tokenId: id, direction: 'downstream' }, context);
                if (lineageResult.success && lineageResult.value) {
                    const dependents = lineageResult.value.nodes || []; // Assuming nodes array returned

                    // 2. Validate Contrast
                    const issues = HarmonyValidator.validateContrast(targetToken, value, dependents);
                    if (issues.length > 0) {
                        // For now, we allow it but return warnings. In strict mode, we would fail.
                        console.warn('[Harmony Healer] Detected contrast regressions:', issues);
                        // We could return Result.fail here if we wanted to block.
                    }
                }
            }

            await this.variableManager.updateVariable(id, value);
            return Result.ok({ updated: true, id });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
