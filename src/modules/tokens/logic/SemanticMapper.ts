import { ColorPalette } from './ColorPalette';
import type { VibeToken } from '../../../core/schema/TokenSchema';

/**
 * 🗺️ SemanticMapper
 * Generates high-level semantic tokens from a base palette.
 */
export class SemanticMapper {
    /**
     * Generates a system of tokens based on a set of core functional colors.
     */
    static generateSystem(core: { primary: string; secondary?: string; accent?: string }): VibeToken[] {
        const primaryScale = ColorPalette.generateScale(core.primary);
        const tokens: VibeToken[] = [];

        // 1. Functional Colors (Linked to the generated scale)
        tokens.push({
            type: 'COLOR',
            data: {
                name: 'sys/color/primary/main',
                value: core.primary,
                description: 'Core primary brand color'
            }
        });

        // Add stops to the system
        Object.entries(primaryScale).forEach(([stop, hex]) => {
            tokens.push({
                type: 'COLOR',
                data: {
                    name: `sys/color/primary/${stop}`,
                    value: hex,
                    description: `Primary scale stop ${stop}`
                }
            });
        });

        // 2. Semantic Aliases
        tokens.push({
            type: 'COLOR',
            data: {
                name: 'sys/color/surface/brand',
                value: '{sys/color/primary/500}',
                description: 'Brand surface'
            }
        });

        tokens.push({
            type: 'COLOR',
            data: {
                name: 'sys/color/text/brand',
                value: '{sys/color/primary/700}',
                description: 'Brand emphasized text'
            }
        });

        return tokens;
    }
}
