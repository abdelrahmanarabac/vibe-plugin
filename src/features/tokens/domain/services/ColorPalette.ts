import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

/**
 * 🎨 ColorPalette Logic
 * Generates semantic scales (50-950) from a base color.
 */
export class ColorPalette {
    /**
     * Generates a color scale from a base color.
     * 
     * @param baseHex - The base color in hex format
     * @param min - Minimum stop value (default: 50)
     * @param max - Maximum stop value (default: 950)
     * @returns Record of stop values to hex colors
     */
    static generateScale(baseHex: string, min: number = 50, max: number = 950): Record<number, string> {
        const base = colord(baseHex);

        if (!base.isValid()) {
            console.error(`[ColorPalette] Invalid base color: ${baseHex}`);
            throw new Error(`Invalid base color for scale: ${baseHex}`);
        }

        // Generate stops based on range
        const stops = this.generateStops(min, max);
        const scale: Record<number, string> = {};

        // Find the midpoint (500 is always the anchor if within range)
        const midpoint = 500;
        const usesMidpoint = midpoint >= min && midpoint <= max;

        stops.forEach(stop => {
            if (stop === midpoint && usesMidpoint) {
                // Exact base color at 500
                scale[stop] = base.toHex();
            } else if (stop < midpoint) {
                // Tints (Mix with White)
                // Lighter as we approach min
                const weight = (midpoint - stop) / (midpoint - min);
                scale[stop] = base.mix('#ffffff', weight * 0.9).toHex();
            } else {
                // Shades (Mix with Black)
                // Darker as we approach max
                const weight = (stop - midpoint) / (max - midpoint);
                scale[stop] = base.mix('#000000', weight * 0.8).toHex();
            }
        });

        return scale;
    }

    /**
     * Generates appropriate stop values for a given range.
     * Uses standard values (50, 100, 200, etc.) when possible,
     * or generates evenly-spaced stops for custom ranges.
     */
    private static generateStops(min: number, max: number): number[] {
        // Standard stops
        const standardStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        // If range matches standard, use standard stops
        if (min === 50 && max === 950) {
            return standardStops;
        }

        // Filter standard stops that fall within range
        const validStandardStops = standardStops.filter(s => s >= min && s <= max);

        // If we have at least 3 valid stops, use them
        if (validStandardStops.length >= 3) {
            return validStandardStops;
        }

        // Otherwise, generate evenly-spaced stops
        // Aim for ~10 stops, but at least 5
        const rangeSize = max - min;
        const desiredStops = Math.max(5, Math.min(11, Math.floor(rangeSize / 50)));

        const step = rangeSize / (desiredStops - 1);
        const stops: number[] = [];

        for (let i = 0; i < desiredStops; i++) {
            const stop = Math.round(min + (step * i));
            stops.push(stop);
        }

        return stops;
    }
}
