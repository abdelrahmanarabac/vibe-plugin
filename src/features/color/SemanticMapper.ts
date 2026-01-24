import { ColorPalette } from "./ColorPalette";
import type { ColorScale } from "./ColorPalette";
import type { VibeToken } from "../../core/schema/TokenSchema";

interface PaletteConfig {
    primary: string;
    // Optional overrides, otherwise defaults are used
    neutral?: string;
    error?: string;
    warning?: string;
    success?: string;
    info?: string;
}

/**
 * 🔗 SemanticMapper
 * Responsible for mapping "Meaning" to "Raw Values".
 * Generates both the PRIMITIVE Scales and the SEMANTIC Aliases.
 */
export class SemanticMapper {

    static generateSystem(config: PaletteConfig): VibeToken[] {
        const tokens: VibeToken[] = [];
        const defaults = ColorPalette.getDefaults();

        // 1. Generate Primitive Scales (The "Palette")
        // -----------------------------------------------------
        const palettes: Record<string, ColorScale> = {
            'brand': ColorPalette.generateScale(config.primary),
            'neutral': ColorPalette.generateScale(config.neutral || defaults.neutral),
            'red': ColorPalette.generateScale(config.error || defaults.error),
            'amber': ColorPalette.generateScale(config.warning || defaults.warning),
            'green': ColorPalette.generateScale(config.success || defaults.success),
            'blue': ColorPalette.generateScale(config.info || defaults.info),
        };

        // Emit Primitives
        Object.entries(palettes).forEach(([name, scale]) => {
            Object.entries(scale).forEach(([stop, hex]) => {
                tokens.push({
                    type: "COLOR",
                    data: {
                        name: `primitives/${name}/${stop}`,
                        value: hex,
                        description: `Raw ${name} ${stop}`
                    }
                });
            });
        });

        // 2. Generate Semantic Aliases (The "Meaning")
        // -----------------------------------------------------
        // Helper to create an Alias Token
        const alias = (name: string, targetPath: string, desc: string): VibeToken => ({
            type: "COLOR",
            data: {
                name: `semantics/${name}`,
                value: {
                    // This is the special structure controller.ts must handle
                    isAlias: true,
                    target: targetPath
                } as any,
                description: desc
            }
        });

        // A. Brand Integration
        tokens.push(alias("brand/primary", "primitives/brand/500", "Main Brand Color"));
        tokens.push(alias("brand/on-primary", "primitives/brand/50", "Text on Brand Color"));

        // B. Feedback States (Standard: Error, Warning, Success)
        tokens.push(alias("feedback/error", "primitives/red/500", "Critical Errors"));
        tokens.push(alias("feedback/warning", "primitives/amber/500", "Warnings/Cautions"));
        tokens.push(alias("feedback/success", "primitives/green/500", "Completion/Success"));
        tokens.push(alias("feedback/info", "primitives/blue/500", "Information"));

        // C. Surface Application
        tokens.push(alias("surface/page", "primitives/neutral/50", "Main Page Background"));
        tokens.push(alias("surface/card", "primitives/neutral/50", "Card Background (Flat)"));
        tokens.push(alias("surface/overlay", "primitives/neutral/950", "Modal Overlay"));

        // D. Text/Content
        tokens.push(alias("content/primary", "primitives/neutral/900", "Headings & Body"));
        tokens.push(alias("content/secondary", "primitives/neutral/500", "Subtitles"));
        tokens.push(alias("content/disabled", "primitives/neutral/300", "Disabled Text"));

        return tokens;
    }
}
