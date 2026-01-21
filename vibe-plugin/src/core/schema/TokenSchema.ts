export type TokenScope = "ALL_SCOPES" | "TEXT_CONTENT" | "FRAME_FILL" | "STROKE_COLOR" | "EFFECT_COLOR";

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBA extends RGB {
    a: number;
}

export interface ColorToken {
    name: string;
    value: RGB | string;
    description?: string;
    scope?: TokenScope[];
    scopes?: string[]; // "ALL_SCOPES" | "GAP" | "CORNER_RADIUS" etc.
}

export interface TypographyToken {
    name: string;
    value: {
        fontFamily: string;
        fontWeight: string | number;
        fontSize: number;
        lineHeight?: number | string;
        letterSpacing?: number | string;
    };
    description?: string;
    scopes?: string[];
}

export interface NumberToken {
    name: string;
    value: number;
    description?: string;
    scopes?: string[];
}

// Unified Token Type for the Collection
export type VibeToken =
    | { type: 'COLOR'; data: ColorToken }
    | { type: 'TYPOGRAPHY'; data: TypographyToken }
    | { type: 'NUMBER'; data: NumberToken };

export interface TokenCollection {
    name: string;
    tokens: VibeToken[];
    modes?: string[]; // Future proofing for Dark Mode
}

// Helper to check if a value is a valid Hex Color
export function isValidHex(hex: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// Helper to convert Hex to RGB (normalized 0-1)
export function hexToRgb(hex: string): RGB {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    const num = parseInt(c.join(''), 16);
    return {
        r: ((num >> 16) & 255) / 255,
        g: ((num >> 8) & 255) / 255,
        b: (num & 255) / 255
    };
}
