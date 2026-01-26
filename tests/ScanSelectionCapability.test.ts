import { describe, it, expect } from 'vitest';
import { ScanSelectionCapability } from '../src/modules/perception/capabilities/scanning/ScanSelectionCapability';
import type { AgentContext } from '../src/core/AgentContext';

describe('ScanSelectionCapability', () => {
    // Mock Context
    const mockContext: AgentContext = {
        repository: {
            getGraph: () => new Map()
        } as any,
        selection: [{
            id: '1',
            name: 'Rect',
            type: 'RECTANGLE',
            width: 100,
            height: 100,
            fills: [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
        }] as any,
        page: {} as any,
        session: { timestamp: Date.now() }
    };

    it('should identify as SCAN_SELECTION', () => {
        const cap = new ScanSelectionCapability();
        expect(cap.commandId).toBe('SCAN_SELECTION');
        expect(cap.id).toBe('scan-selection-v2');
    });

    it('should return true canExecute when selection exists', () => {
        const cap = new ScanSelectionCapability();
        expect(cap.canExecute(mockContext)).toBe(true);
    });

    it('should execute and return structured findings (v2)', async () => {
        const cap = new ScanSelectionCapability();
        const result = await cap.execute({}, mockContext);

        expect(result.success).toBe(true);

        if (result.success) {
            // Validate V2 Structure: { stats, findings: { ... } }
            expect(result.value).toHaveProperty('stats');
            expect(result.value).toHaveProperty('findings');

            // Validate Findings Content
            const { findings } = result.value;
            expect(findings.scannedCount).toBe(1);
            expect(findings.colors).toBeDefined();
            expect(findings.fonts).toBeDefined();
        }
    });

    it('should fail canExecute when selection is empty', () => {
        const cap = new ScanSelectionCapability();
        const emptyContext = { ...mockContext, selection: [] };
        expect(cap.canExecute(emptyContext)).toBe(false);
    });
});
