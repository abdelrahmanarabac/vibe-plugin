import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import type { VariableManager } from '../../../governance/VariableManager';

import { ColorPalette } from '../../domain/services/ColorPalette';

export class CreateVariableCapability implements ICapability {
    readonly id = 'create-variable-v1';
    readonly commandId = 'CREATE_VARIABLE';
    readonly description = 'Creates a new design token (variable) in Figma.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { name: string; type: 'color' | 'number' | 'string'; value: any; extensions?: any }, _context: AgentContext): Promise<Result<any>> {
        try {
            // Handle Color Scales
            if (payload.type === 'color' && payload.extensions?.scope && payload.extensions.scope.startsWith('scale')) {
                console.log('[CreateVariable] Generating Scale for:', payload.value);
                const scale = ColorPalette.generateScale(payload.value);
                console.log('[CreateVariable] Generated Scale:', scale);
                const createdNames: string[] = [];

                // Determine Range (Default 50-950 or Custom)
                let min = 50;
                let max = 950;

                if (payload.extensions.scope === 'scale-custom' && payload.extensions.range) {
                    [min, max] = payload.extensions.range;
                }

                // Create each stop
                for (const [stop, hex] of Object.entries(scale)) {
                    const stopNum = parseInt(stop);
                    if (stopNum >= min && stopNum <= max) {
                        const tokenName = `${payload.name}/${stop}`; // name/500
                        await this.variableManager.createVariable(tokenName, 'color', hex);
                        createdNames.push(tokenName);
                    }
                }

                return Result.ok({ created: true, names: createdNames, count: createdNames.length });
            }

            // Default: Single Variable
            await this.variableManager.createVariable(payload.name, payload.type, payload.value);
            return Result.ok({ created: true, name: payload.name });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
