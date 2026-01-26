import type { IVisitor, TraversalContext } from '../core/IVisitor';
import { colord } from 'colord';

export interface DiscoveryResult {
    colors: Set<string>;
    fonts: Set<string>;
    stats: {
        total: number;
        scanned: number;
    }
}

/**
 * 🕵️ TokenDiscoveryVisitor
 * Scans nodes for potential Design Tokens (Colors, Typography).
 */
export class TokenDiscoveryVisitor implements IVisitor {
    public result: DiscoveryResult = {
        colors: new Set(),
        fonts: new Set(),
        stats: { total: 0, scanned: 0 }
    };

    visit(node: SceneNode, _context: TraversalContext): void {
        this.result.stats.total++;

        // 1. Scan Fills (Colors)
        if ('fills' in node && node.fills !== figma.mixed) {
            for (const fill of node.fills as Paint[]) {
                if (fill.type === 'SOLID') {
                    const hex = this.rgbToHex(fill.color);
                    this.result.colors.add(hex);
                    this.result.stats.scanned++;
                }
            }
        }

        // 2. Scan Typography
        if (node.type === 'TEXT') {
            const fontName = node.fontName;
            if (fontName && fontName !== figma.mixed) {
                this.result.fonts.add(`${fontName.family} ${fontName.style}`);
                this.result.stats.scanned++;
            }
        }
    }

    private rgbToHex(rgb: RGB): string {
        return colord(rgb).toHex().toUpperCase();
    }

    /**
     * Returns the aggregated findings as arrays.
     */
    getFindings() {
        return {
            colors: Array.from(this.result.colors),
            fonts: Array.from(this.result.fonts),
            stats: this.result.stats
        };
    }
}
