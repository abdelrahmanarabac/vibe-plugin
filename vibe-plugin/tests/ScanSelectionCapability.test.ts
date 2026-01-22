import { describe, it, expect } from 'vitest';
import { ScanSelectionCapability } from '../src/features/scanning/ScanSelectionCapability';
import type { AgentContext } from '../src/core/AgentContext';

describe('ScanSelectionCapability', () => {
    // Mock Context
    const mockContext: AgentContext = {
        graph: {} as any,
        selection: [{ id: '1', name: 'Rect', type: 'RECTANGLE', width: 100, height: 100 }] as any,
        page: {} as any,
        session: { timestamp: Date.now() }
    };

    it('should identify as SCAN_SELECTION', () => {
        const cap = new ScanSelectionCapability();
        expect(cap.commandId).toBe('SCAN_SELECTION');
    });

    it('should return true canExecute when selection exists', () => {
        const cap = new ScanSelectionCapability();
        expect(cap.canExecute(mockContext)).toBe(true);
    });

    it('should execute and return primitives', async () => {
        const cap = new ScanSelectionCapability();
        const result = await cap.execute({}, mockContext);

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.value.scannedCount).toBe(1);
            expect(result.value.primitives[0].name).toBe('Rect');
        }
    });

    it('should fail canExecute when selection is empty', () => {
        const cap = new ScanSelectionCapability();
        const emptyContext = { ...mockContext, selection: [] };
        expect(cap.canExecute(emptyContext)).toBe(false);
    });
});
