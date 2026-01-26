import type { IVisitor, TraversalContext } from '../core/IVisitor';
import { ColorScience, type LAB } from '../capabilities/naming/ColorScience';
import { colord } from 'colord';

export interface DiscoveryResult {
    colors: Set<string>;
    fonts: Set<string>;
    drifts: Array<{ hex: string; nearestToken: string; deltaE: number; layerId: string }>;
    stats: {
        total: number;
        scanned: number;
    }
}

/**
 * 🕵️ TokenDiscoveryVisitor
 * Scans nodes for potential Design Tokens (Colors, Typography).
 * Now enhanced with "Design Gravity" to detect color drift.
 */
export class TokenDiscoveryVisitor implements IVisitor {
    private existingTokens: Map<string, LAB>; // Hex -> LAB

    public result: DiscoveryResult = {
        colors: new Set(),
        fonts: new Set(),
        drifts: [],
        stats: { total: 0, scanned: 0 }
    };

    constructor(existingTokens: Record<string, string> = {}) {
        // Pre-calculate LAB for all existing tokens for fast dE checks
        this.existingTokens = new Map();
        for (const [name, hex] of Object.entries(existingTokens)) {
            this.existingTokens.set(name, ColorScience.hexToLab(hex));
        }
    }

    visit(node: SceneNode, _context: TraversalContext): void {
        this.result.stats.total++;

        // 1. Scan Fills (Colors)
        if ('fills' in node && node.fills !== figma.mixed) {
            for (const fill of node.fills as Paint[]) {
                if (fill.type === 'SOLID') {
                    const hex = this.rgbToHex(fill.color);
                    this.result.colors.add(hex);
                    this.result.stats.scanned++;

                    // 🧲 Design Gravity: Check for Drift
                    this.checkDrift(hex, node.id);
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

    private checkDrift(hex: string, nodeId: string) {
        // Don't check if we have no tokens
        if (this.existingTokens.size === 0) return;

        const currentLab = ColorScience.hexToLab(hex);
        let bestMatch: { name: string; dE: number } | null = null;

        for (const [name, tokenLab] of this.existingTokens.entries()) {
            const dE = ColorScience.deltaE2000(currentLab, tokenLab);

            // Exact match? Ignore (it's good)
            if (dE < 0.1) return;

            // Update best match
            if (!bestMatch || dE < bestMatch.dE) {
                bestMatch = { name, dE };
            }
        }

        // If best match is very close (Drift Threshold), flag it
        // 0.5 < dE < 2.5 is usually the "oops" zone
        if (bestMatch && bestMatch.dE > 0.5 && bestMatch.dE < 2.5) {
            this.result.drifts.push({
                hex,
                nearestToken: bestMatch.name,
                deltaE: bestMatch.dE,
                layerId: nodeId
            });
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
            drifts: this.result.drifts,
            stats: this.result.stats
        };
    }
}
