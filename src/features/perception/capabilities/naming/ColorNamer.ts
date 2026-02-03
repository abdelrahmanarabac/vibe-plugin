import { ColorScience, type LAB } from './ColorScience';
import { ColorRepository } from '../../../../infrastructure/supabase/ColorRepository';
import type { RemoteColor } from '../../../../infrastructure/supabase/ColorRepository';
import { HueAnalyzer } from './HueBuckets';

export type NamedColor = { name: string; hex: string; lab: LAB };

export interface NamingResult {
    name: string;
    confidence: number; // 0 to 1
    source: 'exact' | 'db_perfect' | 'db_approx' | 'algo_fallback';
    deltaE?: number;
}

export class ColorNamer {
    private static instance: ColorNamer;
    private colors: NamedColor[] = [];
    private isInitialized = false;

    private constructor() { }

    public static get(): ColorNamer {
        if (!ColorNamer.instance) {
            ColorNamer.instance = new ColorNamer();
        }
        return ColorNamer.instance;
    }

    public async init() {
        if (this.isInitialized) return true;

        try {
            const remotes = await ColorRepository.fetchAll();
            if (remotes && remotes.length > 0) {
                this.colors = remotes.map((r: RemoteColor) => ({
                    name: r.name,
                    hex: r.hex,
                    lab: ColorScience.hexToLab(r.hex)
                }));
                this.isInitialized = true;
                console.log(`🎨 Vibe Architect: Intelligent Engine active with ${this.colors.length} nodes.`);
                return true;
            }
        } catch (e) {
            console.error("[ColorNamer] Initialization failed:", e);
        }
        return false;
    }

    public isReady(): boolean {
        return this.isInitialized;
    }

    /**
     * The Multi-Stage Naming Pipeline
     * Goal: 99%+ Semantic Accuracy
     */
    public name(hex: string): NamingResult {
        const inputHex = hex.toLowerCase().trim();
        const inputLab = ColorScience.hexToLab(inputHex);

        // STAGE 1: Exact Match (100% Accuracy)
        const exact = this.colors.find(c => c.hex.toLowerCase() === inputHex);
        if (exact) {
            return { name: exact.name, confidence: 1.0, source: 'exact' };
        }

        if (!this.isInitialized || this.colors.length === 0) {
            return this.algorithmicFallback(inputHex, inputLab);
        }

        // STAGE 2: High Confidence CIEDE2000 (95%+ accuracy)
        const results = this.colors.map(c => ({
            name: c.name,
            deltaE: ColorScience.deltaE2000(inputLab, c.lab),
            hex: c.hex
        })).sort((a, b) => a.deltaE - b.deltaE);

        const best = results[0];
        if (best.deltaE <= 2.3) {
            return { name: best.name, confidence: 0.95, source: 'db_perfect', deltaE: best.deltaE };
        }

        // STAGE 3: Weighted Hue Priority (For "good enough" naming)
        const weightedResults = this.colors.map(c => ({
            name: c.name,
            deltaE: ColorScience.weightedDeltaE(inputLab, c.lab, { L: 1.0, C: 1.0, H: 2.5 }),
            hex: c.hex
        })).sort((a, b) => a.deltaE - b.deltaE);

        const weightedBest = weightedResults[0];
        if (weightedBest.deltaE <= 20.0) {
            return {
                name: weightedBest.name,
                confidence: Math.max(0.6, 0.9 - (weightedBest.deltaE / 50)),
                source: 'db_approx',
                deltaE: weightedBest.deltaE
            };
        }

        // STAGE 4: Algorithmic Fallback (Safety Net)
        return this.algorithmicFallback(inputHex, inputLab);
    }

    private algorithmicFallback(hex: string, lab: LAB): NamingResult {
        const family = HueAnalyzer.getFamily(hex);
        const shade = HueAnalyzer.getShade(lab.L);
        return {
            name: `${family}-${shade}`,
            confidence: 0.5,
            source: 'algo_fallback'
        };
    }

    public analyze(hex: string) {
        const result = this.name(hex);
        const lab = ColorScience.hexToLab(hex);

        return {
            hex,
            ...result,
            lab,
            family: HueAnalyzer.getFamily(hex),
            shade: HueAnalyzer.getShade(lab.L),
            dbSize: this.colors.length
        };
    }
}

/**
 * Public Singleton API
 */
export const vibeColor = {
    name: (hex: string) => ColorNamer.get().name(hex).name,
    fullResult: (hex: string) => ColorNamer.get().name(hex),
    info: (hex: string) => ColorNamer.get().analyze(hex),
    isReady: () => ColorNamer.get().isReady(),
    init: () => ColorNamer.get().init()
};
