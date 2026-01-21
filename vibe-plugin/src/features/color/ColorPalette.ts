import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import a11yPlugin from "colord/plugins/a11y";

extend([mixPlugin, a11yPlugin]);

export type ColorScale = Record<string, string>;

/**
 * 🎨 ColorPalette Engine
 * Generates a consistent 11-step scale (50-950) from a single seed color.
 * Uses a "Tint/Shade" mixing strategy with white/black to ensure consistency.
 */
export class ColorPalette {

    // Standard Distribution Key
    static readonly STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    /**
     * Generate a full tonal palette from a seed color.
     * @param hex The base color (usually mapped to 500 or nearest).
     * @param name The name of the palette (e.g., "primary", "neutral").
     */
    static generateScale(hex: string): ColorScale {
        const base = colord(hex);
        const scale: ColorScale = {};

        // We assume the Input Color is roughly the "500" or "600" weight.
        // To be safe, we mix with white for lower steps, and black for higher steps.

        // Simple linear mixing for v0.2.x
        // Future: Use LCH/OKLCH interpolation for better vibrancy.

        this.STOPS.forEach(stop => {
            let result;
            if (stop === 500) {
                result = base.toHex();
            } else if (stop < 500) {
                // Mix with White
                // 50 is 95% white, 400 is 10% white (simplified)
                const whiteMix = (500 - stop) / 500 * 0.9 + 0.05; // non-linear tweaks could go here
                result = base.mix("#ffffff", whiteMix).toHex();
            } else {
                // Mix with Black
                // 600 is 15% black, 950 is 85% black
                const blackMix = (stop - 500) / 500 * 0.85 + 0.05;
                result = base.mix("#000000", blackMix).toHex();
            }
            scale[stop] = result;
        });

        return scale;
    }

    /**
     * Generate standard defaults if user doesn't provide them.
     */
    static getDefaults() {
        return {
            error: "#EF4444",   // Red-500
            warning: "#F59E0B", // Amber-500
            success: "#10B981", // Emerald-500
            info: "#3B82F6",    // Blue-500
            neutral: "#64748B"  // Slate-500
        };
    }
}
