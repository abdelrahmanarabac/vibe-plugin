import type { VibeToken } from "../../core/schema/TokenSchema";

export class LayoutGenerator {

    // Standard 4px Grid
    static readonly SPACING_STEPS = {
        '0': 0,
        '0.5': 2,
        '1': 4,
        '1.5': 6,
        '2': 8,
        '3': 12,
        '4': 16,
        '5': 20,
        '6': 24,
        '8': 32,
        '10': 40,
        '12': 48,
        '16': 64,
        '20': 80,
        '24': 96,
        '32': 128,
        '40': 160,
        '48': 192,
        '56': 224,
        '64': 256
    };

    static readonly RADIUS_STEPS = {
        'none': 0,
        'sm': 2,
        'md': 4,
        'lg': 8,
        'xl': 12,
        '2xl': 16,
        '3xl': 24,
        'full': 9999
    };

    static generate(): VibeToken[] {
        const tokens: VibeToken[] = [];

        // 1. Spacing Tokens (Scoped to Gap, Padding, Width/Height)
        Object.entries(this.SPACING_STEPS).forEach(([key, val]) => {
            tokens.push({
                type: 'NUMBER',
                data: {
                    name: `space/${key}`,
                    value: val,
                    description: `${val}px`,
                    scopes: ["GAP", "PADDING", "WIDTH_HEIGHT"]
                }
            });
        });

        // 2. Radius Tokens (Scoped to Corner Radius only)
        Object.entries(this.RADIUS_STEPS).forEach(([key, val]) => {
            tokens.push({
                type: 'NUMBER',
                data: {
                    name: `radius/${key}`,
                    value: val,
                    description: `${val}px`,
                    scopes: ["CORNER_RADIUS"]
                }
            });
        });

        return tokens;
    }
}
