import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';
import type { VariableValue } from '../../../../core/types';

import { ColorPalette } from '../../domain/services/ColorPalette';

type CreatePayload = {
    name: string;
    type: 'color' | 'number' | 'string';
    value: VariableValue;
    extensions?: {
        scope?: string;
        range?: [number, number];
        description?: string;
    }
};

type CreateResult = {
    created: boolean;
    names?: string[];
    count?: number;
    name?: string;
    message?: string;
};

/**
 * 🛠️ CreateVariableCapability
 * Handles the creation of design tokens with built-in intelligence for scales and naming conventions.
 */
export class CreateVariableCapability implements ICapability<CreatePayload, CreateResult> {
    readonly id = 'create-variable-v1';
    readonly commandId = 'CREATE_VARIABLE';
    readonly description = 'Creates a new design token (variable) in Figma.';

    private readonly variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        // Always executable, but we could restrict based on selection in future
        return true;
    }

    async execute(
        payload: CreatePayload,
        _context: AgentContext
    ): Promise<Result<CreateResult>> {
        try {
            const { name, type, value, extensions } = payload;

            // 1. Sanitize Input
            const cleanName = name.trim();
            if (!cleanName) {
                return Result.fail('Variable name cannot be empty.');
            }

            // 2. Handle Color Scales (Smart Expansion)
            if (type === 'color' && extensions?.scope?.startsWith('scale')) {
                return this.createColorScale(cleanName, value as string, extensions);
            }

            // 3. Default: Single Variable Creation
            await this.variableManager.createVariable(cleanName, type, value);

            // Add description if provided (Future: move to VariableManager)
            // Note: VariableManager.createVariable currently doesn't support description, 
            // but we should arguably add it there. For now, we assume basic creation.

            return Result.ok({
                created: true,
                name: cleanName,
                message: `✅ Created token: ${cleanName}`
            });

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during creation';
            console.error(`[CreateVariable] Failed:`, e);

            if (message.includes('duplicate variable name')) {
                return Result.fail('A token with this name already exists in this collection.');
            }

            return Result.fail(message);
        }
    }

    /**
     * Generates a stepped color scale (e.g. primary/50...950)
     */
    private async createColorScale(
        baseName: string,
        hex: string,
        extensions: NonNullable<CreatePayload['extensions']>
    ): Promise<Result<CreateResult>> {
        console.log(`[CreateVariable] Generating Scale for: ${baseName} (${hex})`);

        try {
            // Determine range
            let min = 50;
            let max = 950;

            if (extensions.scope === 'scale-custom' && extensions.range) {
                [min, max] = extensions.range;
                console.log(`[CreateVariable] Custom range detected: ${min}-${max}`);
            }

            // Generate scale with custom range support
            const scale = ColorPalette.generateScale(hex, min, max);
            const createdNames: string[] = [];

            // Create all stops from the generated scale
            for (const [stop, stopHex] of Object.entries(scale)) {
                const tokenName = `${baseName}/${stop}`;
                await this.variableManager.createVariable(tokenName, 'color', stopHex);
                createdNames.push(tokenName);
            }


            return Result.ok({
                created: true,
                names: createdNames,
                count: createdNames.length,
                message: `✅ Generated ${createdNames.length} scale tokens for ${baseName}`
            });

        } catch (error) {
            return Result.fail(`Failed to generate scale: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
