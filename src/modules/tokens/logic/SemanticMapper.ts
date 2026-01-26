import { ColorPalette } from './ColorPalette';
import type { TokenEntity, TokenType } from '../../../core/types';

/**
 * 🗺️ SemanticMapper
 * Generates high-level semantic tokens from a base palette.
 * Uses the Unified TokenEntity (W3C Standard).
 */
export class SemanticMapper {
    /**
     * Generates a system of tokens based on a set of core functional colors.
     */
    static generateSystem(core: { primary: string; secondary?: string; accent?: string }): TokenEntity[] {
        const primaryScale = ColorPalette.generateScale(core.primary);
        const tokens: TokenEntity[] = [];

        const createToken = (name: string, path: string[], value: string | number, type: TokenType): TokenEntity => ({
            id: `temp-${Math.random().toString(36).substr(2, 9)}`,
            name,
            path,
            $value: value,
            $type: type,
            $extensions: {
                figma: {
                    scopes: ['ALL_SCOPES'],
                    collectionId: 'temp',
                    modeId: 'default',
                    resolvedType: type === 'color' ? 'COLOR' : 'FLOAT'
                }
            },
            dependencies: [],
            dependents: []
        });

        // 1. Functional Colors (Linked to the generated scale)
        tokens.push(createToken('main', ['sys', 'color', 'primary'], core.primary, 'color'));

        // Add stops to the system
        Object.entries(primaryScale).forEach(([stop, hex]) => {
            tokens.push(createToken(stop, ['sys', 'color', 'primary'], hex, 'color'));
        });

        // 2. Semantic Aliases (Note: In a real graph these would have dependencies)
        tokens.push(createToken('brand', ['sys', 'color', 'surface'], '{sys/color/primary/500}', 'color'));
        tokens.push(createToken('brand', ['sys', 'color', 'text'], '{sys/color/primary/700}', 'color'));

        return tokens;
    }
}
