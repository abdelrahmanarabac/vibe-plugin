import type { TokenEntity } from '../../core/types';
import { TokenRepository } from '../../core/TokenRepository';

const PAGE_NAME = '📘 Token Docs';
const SPACING = 40;

// Vibe Design System Constants for Docs
const COLORS = {
    HEADER_BG: { r: 0.1, g: 0.1, b: 0.12 }, // #1a1a1f
    HEADER_TEXT: { r: 1, g: 1, b: 1 },
    CARD_BG: { r: 1, g: 1, b: 1 },
    CARD_STROKE: { r: 0.9, g: 0.9, b: 0.92 },
    TEXT_PRIMARY: { r: 0.1, g: 0.1, b: 0.12 },
    TEXT_SECONDARY: { r: 0.5, g: 0.5, b: 0.55 },
    CHIP_BG: { r: 0.96, g: 0.96, b: 0.98 },
    CHIP_TEXT: { r: 0.3, g: 0.3, b: 0.35 }
};

export class DocsRenderer {
    private repository: TokenRepository;

    constructor(repository: TokenRepository) {
        this.repository = repository;
    }

    /**
     * Main entry point to generate documentation.
     * Creates/Resets page and renders all visible tokens.
     */
    async generateDocs(): Promise<void> {
        // Load fonts required for the Vibe aesthetic
        await Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            figma.loadFontAsync({ family: "Inter", style: "Medium" }),
            figma.loadFontAsync({ family: "Inter", style: "Bold" }),
            figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
        ]);

        const page = this.getOrCreatePage();
        figma.currentPage = page;

        // Clear existing docs
        page.children.forEach(child => child.remove());

        // 1. Header Section
        const header = this.createHeader();
        page.appendChild(header);

        // 2. Token Grid Container
        const grid = figma.createFrame();
        grid.name = "Token Grid";
        grid.layoutMode = "HORIZONTAL";
        grid.layoutWrap = "WRAP";
        grid.itemSpacing = 24;
        grid.counterAxisSpacing = 24;
        grid.fills = []; // Transparent
        grid.y = 200;
        grid.x = SPACING;
        grid.resize(1200, 1000); // Initial size, auto-grow

        // 3. Render Tokens
        const tokens = this.repository.getTokens();
        // Sort: Type -> Name
        const sortedTokens = Array.from(tokens.values()).sort((a, b) => {
            const typeCompare = a.$type.localeCompare(b.$type);
            if (typeCompare !== 0) return typeCompare;
            return a.name.localeCompare(b.name);
        });

        for (const token of sortedTokens) {
            const card = await this.createTokenCard(token);
            grid.appendChild(card);
        }

        page.appendChild(grid);
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: '✨ Vibe Documentation Generated', type: 'success' }
        });
    }

    private getOrCreatePage(): PageNode {
        const existing = figma.root.children.find(p => p.name === PAGE_NAME);
        if (existing) return existing;
        const page = figma.createPage();
        page.name = PAGE_NAME;
        return page;
    }

    private createHeader(): FrameNode {
        const frame = figma.createFrame();
        frame.name = "Header";
        frame.resize(1400, 160);
        frame.fills = [{ type: 'SOLID', color: COLORS.HEADER_BG }];
        frame.cornerRadius = 0; // Full bleed look, or rounded if preferred

        // Title Group
        const textGroup = figma.createFrame();
        textGroup.fills = [];
        textGroup.layoutMode = 'VERTICAL';
        textGroup.itemSpacing = 8;
        textGroup.x = 60;
        textGroup.y = 48;

        const title = figma.createText();
        title.characters = "Design System Documentation";
        title.fontSize = 42;
        title.fontName = { family: "Inter", style: "Bold" };
        title.fills = [{ type: 'SOLID', color: COLORS.HEADER_TEXT }];
        textGroup.appendChild(title);

        const subtitle = figma.createText();
        subtitle.characters = `Generated via Vibe Token OS • ${new Date().toLocaleDateString()}`;
        subtitle.fontSize = 14;
        subtitle.fontName = { family: "Inter", style: "Medium" };
        subtitle.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.65 } }];
        textGroup.appendChild(subtitle);

        frame.appendChild(textGroup);
        return frame;
    }

    /**
     * Creates a premium card for a token.
     */
    private async createTokenCard(token: TokenEntity): Promise<FrameNode> {
        const frame = figma.createFrame();
        frame.name = token.name;
        frame.layoutMode = "VERTICAL";
        frame.itemSpacing = 12;
        frame.paddingLeft = 20;
        frame.paddingRight = 20;
        frame.paddingTop = 20;
        frame.paddingBottom = 20;
        frame.cornerRadius = 16;
        frame.strokeWeight = 1;
        frame.strokes = [{ type: 'SOLID', color: COLORS.CARD_STROKE }];
        frame.fills = [{ type: 'SOLID', color: COLORS.CARD_BG }];
        frame.resize(280, 100); // Auto-height via layout

        // -- Header Row (Chip + Name) --
        const headerRow = figma.createFrame();
        headerRow.layoutMode = 'HORIZONTAL';
        headerRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
        // headerRow.width = 240; // Removed: Controlled by layoutAlign: STRETCH
        headerRow.layoutAlign = 'STRETCH';
        headerRow.fills = [];

        // Type Chip
        const chip = figma.createFrame();
        chip.layoutMode = "HORIZONTAL";
        chip.paddingLeft = 8;
        chip.paddingRight = 8;
        chip.paddingTop = 4;
        chip.paddingBottom = 4;
        chip.cornerRadius = 6;
        chip.fills = [{ type: 'SOLID', color: COLORS.CHIP_BG }];

        const typeText = figma.createText();
        typeText.characters = token.$type;
        typeText.fontSize = 10;
        typeText.fontName = { family: "Inter", style: "Semi Bold" };
        typeText.fills = [{ type: 'SOLID', color: COLORS.CHIP_TEXT }];
        chip.appendChild(typeText);

        headerRow.appendChild(chip);
        frame.appendChild(headerRow);

        // Name
        const name = figma.createText();
        name.characters = token.name;
        name.fontSize = 16;
        name.fontName = { family: "Inter", style: "Bold" };
        name.fills = [{ type: 'SOLID', color: COLORS.TEXT_PRIMARY }];
        frame.appendChild(name);

        // -- Preview Section --
        if (token.$type === 'color') {
            const previewRow = figma.createFrame();
            previewRow.layoutMode = 'HORIZONTAL';
            previewRow.itemSpacing = 12;
            previewRow.counterAxisAlignItems = 'CENTER';
            previewRow.fills = [];

            const swatch = figma.createEllipse();
            swatch.resize(48, 48);
            swatch.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.1 }];
            swatch.strokeWeight = 1;

            const resolved = this.resolveColorValue(token);
            swatch.fills = [{ type: 'SOLID', color: resolved.rgb }];

            previewRow.appendChild(swatch);

            // Value Text
            const valueCol = figma.createFrame();
            valueCol.layoutMode = 'VERTICAL';
            valueCol.itemSpacing = 4;
            valueCol.fills = [];

            const hexText = figma.createText();
            hexText.characters = resolved.hex.toUpperCase();
            hexText.fontSize = 14;
            hexText.fontName = { family: "Inter", style: "Medium" };
            hexText.fills = [{ type: 'SOLID', color: COLORS.TEXT_PRIMARY }];
            valueCol.appendChild(hexText);

            if (resolved.isAlias) {
                const aliasText = figma.createText();
                aliasText.characters = `🔗 ${resolved.path.join(' → ')}`;
                aliasText.fontSize = 10;
                aliasText.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
                valueCol.appendChild(aliasText);
            }

            previewRow.appendChild(valueCol);
            frame.appendChild(previewRow);
        } else {
            // Generic Value Display
            const valText = figma.createText();
            valText.characters = String(token.$value);
            valText.fontSize = 14;
            valText.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
            frame.appendChild(valText);
        }

        // -- Description --
        if (token.$description) {
            const separator = figma.createLine();
            separator.strokeWeight = 1;
            separator.strokes = [{ type: 'SOLID', color: COLORS.CARD_STROKE }];
            separator.layoutAlign = 'STRETCH';
            frame.appendChild(separator);

            const desc = figma.createText();
            desc.characters = token.$description;
            desc.fontSize = 11;
            desc.lineHeight = { value: 16, unit: 'PIXELS' };
            desc.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
            frame.appendChild(desc);
        }

        return frame;
    }

    /**
     * Recursive Alias Resolution
     * Returns the final RGB color and the path taken to get there.
     */
    private resolveColorValue(token: TokenEntity, depth = 0): { rgb: RGB, hex: string, isAlias: boolean, path: string[] } {
        // Fallback for recursion limit
        if (depth > 8) {
            return { rgb: { r: 0, g: 0, b: 0 }, hex: '#000000', isAlias: true, path: ['RECURSION_LIMIT'] };
        }

        // Primitive
        if (token.$value !== 'ALIAS') {
            const hex = String(token.$value).startsWith('#') ? String(token.$value) : '#CCCCCC';
            return {
                rgb: this.hexToRgb(hex),
                hex: hex,
                isAlias: false,
                path: []
            };
        }

        // Alias
        if (token.dependencies && token.dependencies.length > 0) {
            const aliasId = token.dependencies[0]; // Assuming primary dependency is the alias target
            const targetToken = this.repository.getNode(aliasId);

            if (targetToken) {
                const resolved = this.resolveColorValue(targetToken, depth + 1);
                return {
                    rgb: resolved.rgb,
                    hex: resolved.hex,
                    isAlias: true,
                    path: [targetToken.name, ...resolved.path]
                };
            }
        }

        // Broken Alias
        return { rgb: { r: 1, g: 0.2, b: 0.2 }, hex: '#FF3333', isAlias: true, path: ['BROKEN_LINK'] };
    }

    private hexToRgb(hex: string): RGB {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substring(0, 2), 16) / 255;
        const g = parseInt(clean.substring(2, 4), 16) / 255;
        const b = parseInt(clean.substring(4, 6), 16) / 255;
        return {
            r: isNaN(r) ? 0.5 : r,
            g: isNaN(g) ? 0.5 : g,
            b: isNaN(b) ? 0.5 : b
        };
    }
}
