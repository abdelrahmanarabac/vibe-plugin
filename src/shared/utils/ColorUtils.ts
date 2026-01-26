/**
 * THE VIBE COLOR ENGINE
 * Handles conversions and naming logic.
 */

// تحويل RGB إلى HSV
export function rgbToHsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

// تحويل HSV إلى RGB
export function hsvToRgb(h: number, s: number, v: number) {
    s /= 100; v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

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
