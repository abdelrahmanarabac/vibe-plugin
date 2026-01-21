/**
 * THE VIBE COLOR ENGINE
 * Handles conversions and naming logic.
 */

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

export const getColorName = (hex: string) => {
    const cleanHex = hex.toUpperCase();
    return NAMED_COLORS[cleanHex] || "Custom Color"; // Placeholder for genius logic
};
