import { describe, it, expect } from 'vitest';
import { CapabilityRegistry } from '../src/core/CapabilityRegistry';
import type { ICapability } from '../src/core/interfaces/ICapability';
import { Result } from '../src/shared/utils/Result';

describe('CapabilityRegistry', () => {
    it('should register and retrieve a capability', () => {
        const registry = new CapabilityRegistry();
        const mockCap: ICapability = {
            id: 'test-cap',
            commandId: 'TEST_CMD',
            canExecute: () => true,
            execute: async () => Result.ok(true)
        };

        registry.register(mockCap);

        expect(registry.get('test-cap')).toBe(mockCap);
        expect(registry.getByCommand('TEST_CMD')).toBe(mockCap);
    });

    it('should return undefined for unknown commands', () => {
        const registry = new CapabilityRegistry();
        expect(registry.getByCommand('UNKNOWN')).toBeUndefined();
    });
});
