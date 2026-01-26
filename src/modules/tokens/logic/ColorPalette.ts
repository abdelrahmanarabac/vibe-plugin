import { colord } from 'colord';

/**
 * 🎨 ColorPalette Logic
 * Generates semantic scales (50-950) from a base color.
 */
export class ColorPalette {
    /**
     * Generates a 11-stop scale (50-950) for a given base color.
     * Uses 500 as the midpoint anchor.
     */
    static generateScale(baseHex: string): Record<number, string> {
        const base = colord(baseHex);
        const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
        const scale: Record<number, string> = {};

        stops.forEach(stop => {
            if (stop === 500) {
                scale[stop] = base.toHex();
            } else if (stop < 500) {
                // Tints (Mix with White)
                // 50 -> 450/500 = 0.9 mix (mostly white)
                // 400 -> 100/500 = 0.2 mix (mostly base)
                const weight = (500 - stop) / 500;
                scale[stop] = base.mix('#ffffff', weight * 0.9).toHex(); // 0.9 to prevent pure white at 50 if base is light
            } else {
                // Shades (Mix with Black)
                // 600 -> 100/500 = 0.2 mix
                // 950 -> 450/500 = 0.9 mix
                const weight = (stop - 500) / 450; // Use 450 to reach 950
                scale[stop] = base.mix('#000000', weight * 0.8).toHex();
            }
        });

        return scale;
    }
}
