import { TokenGraph } from '../../core/TokenGraph';
import type { ComponentVariant } from './types';
import { StyleResolver } from './StyleResolver';
import { AutoLayoutEngine } from './AutoLayoutEngine';

/**
 * 🏗️ ComponentBuilder
 * The "Factory" that turns Tokens into Figma Nodes.
 */
export class ComponentBuilder {
    // @ts-ignore
    private graph: TokenGraph;
    private styleResolver: StyleResolver;
    private layoutEngine: AutoLayoutEngine;

    constructor(graph: TokenGraph) {
        this.graph = graph;
        this.styleResolver = new StyleResolver(graph);
        this.layoutEngine = new AutoLayoutEngine();
    }

    /**
     * Generates a Button component based on the Project Vibe.
     */
    async createButton(variant: ComponentVariant = 'PRIMARY'): Promise<FrameNode> {
        // 1. Resolve Tokens (Simulation for Phase 4.1)
        // In the future, this will query the graph for 'button.primary.bg', etc.
        // For now, we assume standard semantic names.

        console.log(`🏗️ Building Button: ${variant}`);

        // 2. Create the Frame (AutoLayout)
        const button = figma.createFrame();
        button.name = `Button/${variant}`;
        button.name = `Button/${variant}`;

        // Use AutoLayout Engine
        this.layoutEngine.applyLayout(button, 'BUTTON', 'COMFORTABLE');

        // Default Vibe Styling (Hardcoded for scaffolding, dynamic in Phase 4.2)
        button.cornerRadius = 8;

        // 3. Apply Colors (Dynamic Resolution)
        let fillToken = '';
        let borderToken = '';

        switch (variant) {
            case 'PRIMARY':
                fillToken = 'button/primary/bg';
                break;
            case 'SECONDARY':
                borderToken = 'button/secondary/border';
                break;
        }

        // Apply Fill
        if (fillToken) {
            // Check for explicit "color/" prefix vs. standard token path
            const resolved = await this.styleResolver.resolveFill(fillToken)
                || await this.styleResolver.resolveFill(`color/${fillToken}`); // Try prefix

            if (typeof resolved === 'string') {
                button.fillStyleId = resolved;
            } else if (resolved) {
                button.fills = [resolved];
            } else {
                // Fallback for demo
                button.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.4, b: 0.8 } }];
            }
        } else {
            button.fills = []; // Transparent for Secondary/Ghost
        }

        // Apply Border
        if (borderToken) {
            const resolved = await this.styleResolver.resolveFill(borderToken);
            if (typeof resolved === 'string') {
                button.strokeStyleId = resolved;
            } else if (resolved) {
                button.strokes = [resolved];
            } else {
                button.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
            }
            button.strokeWeight = 1;
        }

        // 4. Content (Text)
        await figma.loadFontAsync({ family: "Inter", style: "Medium" });
        const label = figma.createText();
        label.characters = "Click Me";
        label.fontName = { family: "Inter", style: "Medium" };
        label.fontSize = 14;

        // TODO: Use StyleResolver for text styles once implemented

        let textColor: RGB = { r: 0.2, g: 0.2, b: 0.2 };
        if (variant === 'PRIMARY') textColor = { r: 1, g: 1, b: 1 };

        label.fills = [{ type: 'SOLID', color: textColor }];

        button.appendChild(label);

        return button;
    }
}
