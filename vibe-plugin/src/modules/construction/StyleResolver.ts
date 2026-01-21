import { TokenGraph } from '../../core/TokenGraph';

/**
 * 🎨 StyleResolver
 * Helper to link Abstract Vibe Tokens -> Concrete Figma Styles.
 */
export class StyleResolver {
    private graph: TokenGraph; // Graph is now USED

    constructor(graph: TokenGraph) {
        this.graph = graph;
    }

    /**
     * Resolves a Token to a PaintStyle ID (preferred) or a raw SolidPaint.
     */
    async resolveFill(tokenName: string): Promise<string | SolidPaint | null> {
        // 1. Check Local Figma Styles
        const styles = await figma.getLocalPaintStylesAsync();
        const match = styles.find(s => s.name === tokenName);

        if (match) return match.id;

        // 2. Fallback: Look up in Graph
        const token = this.graph.getNode(tokenName);
        if (token && typeof token.$value === 'string') {
            // Assume Hex for now (e.g. "#FF0000")
            return this.hexToFigma(token.$value);
        }

        return null;
    }

    /**
     * Resolves a Typography style.
     */
    async resolveText(tokenName: string): Promise<TextStyle | null> {
        const styles = await figma.getLocalTextStylesAsync();
        return styles.find(s => s.name === tokenName) || null;
    }

    /**
     * Helper: Convert Hex String to Figma RGB
     */
    private hexToFigma(hex: string): SolidPaint {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }

        const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
        const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
        const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

        return {
            type: 'SOLID',
            color: { r, g, b }
        };
    }
}
