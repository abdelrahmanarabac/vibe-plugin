import type { ScannedPrimitive } from "./types";

/**
 * 👁️ PerceptionEngine
 * The sensory system of the Agent.
 * Responsible for traversing the Figma document, understanding node structures,
 * and extracting raw design primitives (Colors, Typography, Spacing, Radius).
 */
export class PerceptionEngine {

    /**
     * Scans the provided nodes (or current selection) and extracts primitives.
     * Implements "Auto-Discovery" logic if no nodes are provided directly.
     */
    static scan(nodes: ReadonlyArray<SceneNode>): ScannedPrimitive[] {
        const foundPrimitives: ScannedPrimitive[] = [];
        const seenValues = new Set<string>();

        const register = (p: ScannedPrimitive) => {
            const key = `${p.$type}:${JSON.stringify(p.$value)}`;
            if (!seenValues.has(key)) {
                seenValues.add(key);
                foundPrimitives.push(p);
            }
        };

        // Recursive traversal function
        const traverse = (node: SceneNode) => {
            if (!('visible' in node) || !node.visible) return;

            // 1. 🎨 Color Extraction (Solid Fills)
            if ('fills' in node && Array.isArray(node.fills)) {
                for (const fill of node.fills) {
                    if (fill.type === 'SOLID') {
                        const hex = this.rgbToHex(fill.color.r, fill.color.g, fill.color.b);
                        // Optional: Extract opacity if needed, for now sticking to solid hex
                        register({
                            id: `raw.color.${hex}`,
                            name: `Color ${hex}`,
                            $value: hex,
                            $type: 'color'
                        });
                    }
                }
            }

            // 2. 🔠 Typography Extraction
            if (node.type === 'TEXT' && node.fontName !== figma.mixed) {
                const fontName = node.fontName as FontName;
                const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 16;
                const lineHeight = node.lineHeight !== figma.mixed ? node.lineHeight : { value: 100, unit: 'PERCENT' };
                const letterSpacing = node.letterSpacing !== figma.mixed ? node.letterSpacing : { value: 0, unit: 'PIXELS' };

                // Register Family
                register({
                    id: `raw.fontFamily.${fontName.family}`,
                    name: fontName.family,
                    $value: fontName.family,
                    $type: 'fontFamily'
                });

                // Register Full Typography Style
                register({
                    id: `raw.typography.${node.id}`,
                    name: `Type ${fontSize}px`,
                    $value: {
                        fontFamily: fontName.family,
                        fontWeight: fontName.style,
                        fontSize: fontSize,
                        lineHeight: lineHeight,
                        letterSpacing: letterSpacing
                    },
                    $type: 'typography'
                });
            }

            // 3. 📐 Corner Radius Extraction
            if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
                const val = node.cornerRadius;
                register({
                    id: `raw.radius.${val}`,
                    name: `Radius ${val}`,
                    $value: val,
                    $type: 'borderRadius'
                });
            }

            // 4. 🌫️ Effects (Shadows) - V3.0 Feature
            if ('effects' in node && Array.isArray(node.effects)) {
                for (const effect of node.effects) {
                    if (effect.type === 'DROP_SHADOW' && effect.visible) {
                        const hex = this.rgbToHex(effect.color.r, effect.color.g, effect.color.b);
                        const alpha = effect.color.a.toFixed(2);
                        // Simplified shadow representation for now
                        const shadowValue = `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${hex}${alpha !== '1.00' ? ` (Opacity: ${alpha})` : ''}`;

                        register({
                            id: `raw.shadow.${node.id}`, // specific to node for now unless we dedupe by value string
                            name: `Shadow`,
                            $value: shadowValue,
                            $type: 'boxShadow'
                        });
                    }
                }
            }

            // Traverse Children
            if ('children' in node) {
                // @ts-ignore - children checking is safe here due to 'children' in node check
                for (const child of node.children) {
                    traverse(child);
                }
            }
        };

        nodes.forEach(traverse);

        return foundPrimitives;
    }

    /**
     * Helper: Convert Figma RGB (0-1) to Hex
     */
    private static rgbToHex(r: number, g: number, b: number): string {
        const to255 = (n: number) => Math.floor(n * 255);
        const toHex = (n: number) => to255(n).toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
}
