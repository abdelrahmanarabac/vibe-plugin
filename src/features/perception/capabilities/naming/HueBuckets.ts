/**
 * 🎨 HUE BUCKETS & SEMANTIC MAPPING
 * Used as an algorithmic fallback for the ColorNamer.
 */

export interface ColorFamily {
    name: string;
    hueStart: number; // 0-360
    hueEnd: number;
}

export const COLOR_FAMILIES: ColorFamily[] = [
    { name: 'red', hueStart: 345, hueEnd: 15 },
    { name: 'orange', hueStart: 15, hueEnd: 45 },
    { name: 'yellow', hueStart: 45, hueEnd: 70 },
    { name: 'lime', hueStart: 70, hueEnd: 90 },
    { name: 'green', hueStart: 90, hueEnd: 160 },
    { name: 'teal', hueStart: 160, hueEnd: 190 },
    { name: 'cyan', hueStart: 190, hueEnd: 210 },
    { name: 'blue', hueStart: 210, hueEnd: 250 },
    { name: 'indigo', hueStart: 250, hueEnd: 280 },
    { name: 'purple', hueStart: 280, hueEnd: 320 },
    { name: 'pink', hueStart: 320, hueEnd: 345 }
];

export class HueAnalyzer {
    /**
     * Converts RGB to HSL for easy hue classification
     */
    static getHue(hex: string): number {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0;

        if (max !== min) {
            const d = max - min;
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return Math.round(h * 360);
    }

    static getFamily(hex: string): string {
        const hue = this.getHue(hex);

        // Handle red wrap-around
        if (hue >= 345 || hue < 15) return 'red';

        const family = COLOR_FAMILIES.find(f => hue >= f.hueStart && hue < f.hueEnd);
        return family ? family.name : 'gray';
    }

    static getShade(L: number): string {
        if (L > 95) return '50';
        if (L > 90) return '100';
        if (L > 80) return '200';
        if (L > 70) return '300';
        if (L > 60) return '400';
        if (L > 50) return '500';
        if (L > 40) return '600';
        if (L > 30) return '700';
        if (L > 20) return '800';
        if (L > 10) return '900';
        return '950';
    }
}
