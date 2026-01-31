import { describe, it, expect } from 'vitest';
import { ColorPalette } from '../src/modules/tokens/domain/services/ColorPalette';

describe('ColorPalette', () => {
    it('should throw error for invalid hex', () => {
        // invalid hex
        expect(() => ColorPalette.generateScale('invalid')).toThrow();

        // empty string
        expect(() => ColorPalette.generateScale('')).toThrow();
    });

    it('should handle short hex strings', () => {
        const result = ColorPalette.generateScale('#fa0'); // Orange
        // fa0 -> ffaa00. 
        expect(result[500]).toBe('#ffaa00');
    });
});
