import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ColorNamer, vibeColor } from '../src/modules/perception/capabilities/naming/ColorNamer';
import { ColorScience } from '../src/modules/perception/capabilities/naming/ColorScience';
import { ColorRepository } from '../src/infrastructure/supabase/ColorRepository';

// Mock Repository
vi.mock('../src/infrastructure/supabase/ColorRepository', () => ({
    ColorRepository: {
        fetchAll: vi.fn()
    }
}));

describe('ColorNamer Intelligent Engine', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset singleton internal state for clean tests
        // @ts-expect-error - reaching into private for test reset
        ColorNamer.instance = undefined;
    });

    it('should handle exact matches with 100% confidence', async () => {
        vi.mocked(ColorRepository.fetchAll).mockResolvedValue([
            { name: 'vibe-purple', hex: '#6e62e5', created_at: '', id: 1, dataset_source: '' }
        ]);

        await vibeColor.init();
        const namer = ColorNamer.get();
        if (!namer) throw new Error('Namer not initialized');
        const result = namer.name('#6e62e5');

        expect(result.name).toBe('vibe-purple');
        expect(result.confidence).toBe(1.0);
        expect(result.source).toBe('exact');
    });

    it('should handle near matches using CIEDE2000', async () => {
        vi.mocked(ColorRepository.fetchAll).mockResolvedValue([
            { name: 'vibe-purple', hex: '#6e62e5', created_at: '', id: 1, dataset_source: '' }
        ]);

        await vibeColor.init();
        // Shift hex slightly
        const namer = ColorNamer.get();
        if (!namer) throw new Error('Namer not initialized');
        const result = namer.name('#6e62e6');

        expect(result.name).toBe('vibe-purple');
        expect(result.source).toBe('db_perfect');
        expect(result.confidence).toBe(0.95);
    });

    it('should fallback to algorithmic naming for unknown colors', async () => {
        vi.mocked(ColorRepository.fetchAll).mockResolvedValue([]); // Empty DB

        await vibeColor.init();
        const namer = ColorNamer.get();
        if (!namer) throw new Error('Namer not initialized');
        const result = namer.name('#ff0000');

        expect(result.name).toBe('red-500');
        expect(result.source).toBe('algo_fallback');
    });

    it('should use weighted hue priority for ambiguous colors', async () => {
        vi.mocked(ColorRepository.fetchAll).mockResolvedValue([
            { name: 'deep-blue', hex: '#000080', created_at: '', id: 1, dataset_source: '' }
        ]);

        await vibeColor.init();
        const namer = ColorNamer.get();
        if (!namer) throw new Error('Namer not initialized');
        const result = namer.name('#1a1a9a');

        // Log for calibration
        const lab1 = ColorScience.hexToLab('#000080');
        const lab2 = ColorScience.hexToLab('#1a1a9a');
        const de = ColorScience.deltaE2000(lab1, lab2);
        const wde = ColorScience.weightedDeltaE(lab1, lab2, { L: 1.0, C: 1.0, H: 2.5 });
        console.log(`DE: ${de}, WDE: ${wde}`);

        expect(result.name).toBe('deep-blue');
        expect(result.source).toBe('db_approx');
    });
});
