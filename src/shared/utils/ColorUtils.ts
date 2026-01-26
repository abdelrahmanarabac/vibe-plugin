/**
 * THE VIBE COLOR ENGINE
 * Handles conversions and naming logic.
 */

// دالة تحويل من HSL لـ RGB
export function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    };
}

// دالة تنظيف الـ Hex عشان ترجع 6 حروف بس
export function toHex6(color: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

export const rgbToFigma = (r: number, g: number, b: number) => {
    return { r: r / 255, g: g / 255, b: b / 255 };
};

// "Genius" Naming Map
export const NAMED_COLORS: Record<string, string> = {
    "#000000": "Void Black",
    "#FFFFFF": "Pure White",
    "#2563EB": "Vibe Blue",
    "#DC2626": "Alert Red",
    "#16A34A": "Success Green",
    "#F59E0B": "Warning Orange",
};

export const getColorName = async (hex: string): Promise<string> => {
    try {
        const { CloudColorNamer } = await import('../../modules/intelligence/CloudColorNamer');
        return await CloudColorNamer.findColor(hex);
    } catch (error) {
        console.error('[Shared ColorUtils] Cloud naming failed:', error);
        const cleanHex = hex.toUpperCase();
        return NAMED_COLORS[cleanHex] || "Custom Color";
    }
};
