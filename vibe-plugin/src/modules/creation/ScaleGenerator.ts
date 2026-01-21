import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import mixPlugin from 'colord/plugins/mix';
import { AIOrchestrator } from '../ai/AIOrchestrator';

extend([a11yPlugin, mixPlugin]);

export interface ColorScaleStep {
    name: string; // e.g., "primary-500"
    hex: string;
    contrastOnWhite: number;
    contrastOnBlack: number;
}

export class ScaleGenerator {
    private aiOrchestrator: AIOrchestrator;

    constructor(ai: AIOrchestrator) {
        this.aiOrchestrator = ai;
    }

    /**
     * Generates a 50-950 scale based on a single hex color.
     * Hybrid approach: Math (Base) -> AI (Refinement)
     */
    async generateScale(baseHex: string, namePrefix: string = 'primary'): Promise<ColorScaleStep[]> {
        if (!colord(baseHex).isValid()) {
            throw new Error(`Invalid base color: ${baseHex}`);
        }

        // 1. Generate Mathematical Baseline (Fast fallback if AI fails)
        const mathScale = this.generateMathScale(baseHex);

        // 2. Ask AI to "perceptually tune" it (The Vibe Magic)
        const prompt = `
      Task: Generate a 11-step perceptual color scale (50, 100, 200, ..., 900, 950) based on ${baseHex}.
      Constraint: The scale must be perceptually uniform. 500 should be close to the base color.
      Format: Return ONLY a JSON array of hex strings: ["#xxxxxx", ...]. No markdown, no text.
    `;

        try {
            const aiResponse = await this.aiOrchestrator.execute('scale-generation', prompt);
            const cleanJson = aiResponse.replace(/```json|```/g, '').trim();
            const aiHexes: string[] = JSON.parse(cleanJson);

            if (Array.isArray(aiHexes) && aiHexes.length >= 10) {
                // Map AI hexes to steps
                return this.mapHexesToSteps(aiHexes, namePrefix);
            }
        } catch (error) {
            console.warn('AI Scale generation failed, falling back to math scale.', error);
        }

        return this.mapHexesToSteps(mathScale, namePrefix);
    }

    private generateMathScale(baseHex: string): string[] {
        const color = colord(baseHex);
        // Simple mixing strategy: Mix with white for tints, black for shades
        const scale: string[] = [];

        // 50, 100, 200, 300, 400 (Tints)
        const tints = [0.95, 0.8, 0.6, 0.4, 0.2];
        tints.forEach(t => scale.push(color.mix('#ffffff', t).toHex()));

        // 500 (Base)
        scale.push(baseHex);

        // 600, 700, 800, 900, 950 (Shades)
        const shades = [0.2, 0.4, 0.6, 0.8, 0.9];
        shades.forEach(s => scale.push(color.mix('#000000', s).toHex()));

        return scale;
    }

    private mapHexesToSteps(hexes: string[], prefix: string): ColorScaleStep[] {
        const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        // Ensure we match lengths if possible, otherwise truncate/pad
        const result: ColorScaleStep[] = [];

        steps.forEach((step, index) => {
            const hex = hexes[index] || hexes[hexes.length - 1] || '#000000';
            result.push({
                name: `${prefix}-${step}`,
                hex: hex,
                contrastOnWhite: colord(hex).contrast('#ffffff'),
                contrastOnBlack: colord(hex).contrast('#000000')
            });
        });

        return result;
    }
}
