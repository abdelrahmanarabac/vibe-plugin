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

export class TokenDiscoveryVisitor implements IVisitor {
    private existingTokens: Map<string, LAB>;

    public result: DiscoveryResult = {
        colors: new Set(),
        fonts: new Set(),
        drifts: [],
        stats: { total: 0, scanned: 0 }
    };

    constructor(existingTokens: Record<string, string> = {}) {
        this.existingTokens = new Map();
        for (const [name, hex] of Object.entries(existingTokens)) {
            // 🛡️ Safety: Validate Hex before processing
            if (colord(hex).isValid()) {
                this.existingTokens.set(name, ColorScience.hexToLab(hex));
            }
        }
    }

    visit(node: SceneNode, _context: TraversalContext): void {
        this.result.stats.total++;

        // 🛡️ Safety: Check if 'fills' exists on the node type
        if ('fills' in node && node.fills !== figma.mixed) {
            // Explicit cast only after check
            const fills = node.fills as ReadonlyArray<Paint>;
            for (const fill of fills) {
                if (fill.type === 'SOLID') {
                    const hex = this.rgbToHex(fill.color);
                    this.result.colors.add(hex);
                    this.result.stats.scanned++;
                    this.checkDrift(hex, node.id);
                }
            }
        }

        if (node.type === 'TEXT') {
            const fontName = node.fontName;
            if (fontName && fontName !== figma.mixed) {
                this.result.fonts.add(`${fontName.family} ${fontName.style}`);
                this.result.stats.scanned++;
            }
        }
    }

    private checkDrift(hex: string, nodeId: string) {
        if (this.existingTokens.size === 0) return;

        // Optimize: skip extremely common colors like white/black if needed? 
        // For now, full check.

        const currentLab = ColorScience.hexToLab(hex);
        let bestMatch: { name: string; dE: number } | null = null;

        for (const [name, tokenLab] of this.existingTokens.entries()) {
            const dE = ColorScience.deltaE2000(currentLab, tokenLab);

            if (dE < 0.1) return; // Exact match, logic exit

            if (!bestMatch || dE < bestMatch.dE) {
                bestMatch = { name, dE };
            }
        }

        // Logic: 0.5 < dE < 2.5 is the drift "danger zone"
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

    getFindings() {
        return {
            colors: Array.from(this.result.colors),
            fonts: Array.from(this.result.fonts),
            drifts: this.result.drifts,
            stats: this.result.stats
        };
    }
}
