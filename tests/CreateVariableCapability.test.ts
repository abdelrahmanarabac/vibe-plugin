import { describe, it, expect, vi } from 'vitest';
import { CreateVariableCapability } from '../src/modules/tokens/capabilities/management/CreateVariableCapability';
import { VariableManager } from '../src/modules/governance/VariableManager';
import type { AgentContext } from '../src/core/AgentContext';

describe('CreateVariableCapability', () => {
    it('should generate a color scale successfully', async () => {
        // Mock Manager
        const mockManager = {
            createVariable: vi.fn().mockResolvedValue(undefined)
        } as unknown as VariableManager;

        const cap = new CreateVariableCapability(mockManager);

        const payload = {
            name: 'brand/blue',
            type: 'color' as const,
            value: '#0050E0', // Vibe Blue
            extensions: {
                scope: 'scale',
                range: [50, 950]
            }
        };

        const result = await cap.execute(payload, {} as AgentContext);

        if (!result.success) {
            console.error('Execution Failed:', result.error);
        }

        expect(result.success).toBe(true);
        // Expect 11 calls for stops 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
        expect(mockManager.createVariable).toHaveBeenCalledTimes(11);

        // Check a specific call to ensure naming is correct
        expect(mockManager.createVariable).toHaveBeenCalledWith(
            'brand/blue/500',
            'color',
            expect.stringMatching(/^#/)
        );
    });

    it('should handle custom ranges', async () => {
        // Mock Manager
        const mockManager = {
            createVariable: vi.fn().mockResolvedValue(undefined)
        } as unknown as VariableManager;

        const cap = new CreateVariableCapability(mockManager);

        const payload = {
            name: 'ui/surface',
            type: 'color' as const,
            value: '#FFFFFF',
            extensions: {
                scope: 'scale-custom',
                range: [100, 300] // Should create 100, 200, 300
            }
        };

        const result = await cap.execute(payload, {} as AgentContext);

        expect(result.success).toBe(true);
        // Stops: 100, 200, 300
        expect(mockManager.createVariable).toHaveBeenCalledTimes(3);
    });
});
