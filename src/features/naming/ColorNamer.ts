import { ColorScience } from './ColorScience';
import { ColorDB } from './ColorDB';

type MatchResult = { name: string; deltaE: number; hex: string };

export class ColorNamer {
    findClosest(hex: string, limit = 5): MatchResult[] {
        const inputLab = ColorScience.hexToLab(hex);
        const results = ColorDB.get().getAll().map(c => ({
            name: c.name,
            deltaE: ColorScience.deltaE2000(inputLab, c.lab),
            hex: c.hex
        }));

        return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, limit);
    }

    name(hex: string): string {
        const match = this.findClosest(hex, 1)[0];
        if (!match) return "unknown";

        if (match.deltaE <= 2.3) return match.name;      // Perfect
        if (match.deltaE <= 10) return match.name;       // Good
        return `~${match.name}`;                         // Approximate
    }

    analyze(hex: string) {
        const lab = ColorScience.hexToLab(hex);
        const name = this.name(hex);
        const closest = this.findClosest(hex, 5);

        return {
            hex,
            name,
            lab,
            closest,
            dbSize: ColorDB.get().count(),
            colorFamily: name.split('-')[0],
            shade: name.split('-')[1]
        };
    }

    /**
     * توليد ألوان متناغمة (Harmony)
     */
    harmony(hex: string): string[] {
        const baseName = this.name(hex).replace('~', '');
        const [family, shade] = baseName.split('-');

        if (!family || !shade) return [];

        const harmonies: string[] = [];
        const shadeNum = parseInt(shade);

        // Same family, different shades
        [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(s => {
            if (s !== shadeNum) {
                harmonies.push(`${family}-${s}`);
            }
        });

        // Complementary colors
        const complements: Record<string, string[]> = {
            'red': ['green', 'teal'],
            'blue': ['orange', 'amber'],
            'green': ['red', 'pink'],
            'purple': ['yellow', 'lime'],
            'pink': ['green', 'teal']
        };

        if (complements[family]) {
            complements[family].forEach(comp => {
                harmonies.push(`${comp}-${shade}`);
            });
        }

        return harmonies.slice(0, 8);
    }
}

// Singleton Public API
export const vibeColor = {
    name: (hex: string) => new ColorNamer().name(hex),
    closest: (hex: string, n = 5) => new ColorNamer().findClosest(hex, n),
    info: (hex: string) => new ColorNamer().analyze(hex),
    harmony: (hex: string) => new ColorNamer().harmony(hex)
};
