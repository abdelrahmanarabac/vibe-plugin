/**
 * ═══════════════════════════════════════════════════════════════════════
 * VIBE COLOR SCIENCE ENGINE (CIE 1976 L*a*b* + CIEDE2000)
 * ═══════════════════════════════════════════════════════════════════════
 */
export type RGB = { r: number; g: number; b: number };
export type LAB = { L: number; a: number; b: number };

export class ColorScience {
    // CIE Constants (ISO/CIE 11664-4:2019)
    private static readonly EPSILON = 216 / 24389;
    private static readonly KAPPA = 24389 / 27;
    private static readonly REF_WHITE = { X: 0.95047, Y: 1.00000, Z: 1.08883 };

    // Memoization Cache
    private static labCache = new Map<string, LAB>();
    private static readonly CACHE_LIMIT = 2048;

    static hexToLab(hex: string): LAB {
        const key = hex.toLowerCase().replace('#', '');

        if (this.labCache.has(key)) {
            return this.labCache.get(key)!;
        }

        const rgb = this.hexToRgb(key);
        const lab = this.rgbToLab(rgb);

        if (this.labCache.size >= this.CACHE_LIMIT) {
            const firstKey = this.labCache.keys().next().value;
            if (firstKey) this.labCache.delete(firstKey);
        }

        this.labCache.set(key, lab);
        return lab;
    }

    private static hexToRgb(hex: string): RGB {
        // Handle short hex
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        const val = parseInt(hex, 16);
        return {
            r: (val >> 16) & 255,
            g: (val >> 8) & 255,
            b: val & 255
        };
    }

    private static rgbToLab({ r, g, b }: RGB): LAB {
        let R = r / 255, G = g / 255, B = b / 255;

        R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
        G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
        B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

        const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
        const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
        const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;

        const fx = this.fXYZ(X / this.REF_WHITE.X);
        const fy = this.fXYZ(Y / this.REF_WHITE.Y);
        const fz = this.fXYZ(Z / this.REF_WHITE.Z);

        return {
            L: 116 * fy - 16,
            a: 500 * (fx - fy),
            b: 200 * (fy - fz)
        };
    }

    private static fXYZ(t: number): number {
        return t > this.EPSILON ? Math.cbrt(t) : (this.KAPPA * t + 16) / 116;
    }

    static deltaE2000(lab1: LAB, lab2: LAB): number {
        const { L: L1, a: a1, b: b1 } = lab1;
        const { L: L2, a: a2, b: b2 } = lab2;

        const C1 = Math.hypot(a1, b1);
        const C2 = Math.hypot(a2, b2);
        const Cbar = (C1 + C2) / 2;

        const Cbar7 = Math.pow(Cbar, 7);
        const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)));

        const a1p = a1 * (1 + G);
        const a2p = a2 * (1 + G);

        const C1p = Math.hypot(a1p, b1);
        const C2p = Math.hypot(a2p, b2);

        const h1p = this.hueAngle(b1, a1p);
        const h2p = this.hueAngle(b2, a2p);

        const dLp = L2 - L1;
        const dCp = C2p - C1p;

        let dhp = h2p - h1p;
        if (C1p * C2p !== 0) {
            if (dhp > 180) dhp -= 360;
            else if (dhp < -180) dhp += 360;
        } else {
            dhp = 0;
        }

        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(this.deg2rad(dhp / 2));

        const Lpbar = (L1 + L2) / 2;
        const Cpbar = (C1p + C2p) / 2;

        let hpbar: number;
        if (C1p * C2p === 0) {
            hpbar = h1p + h2p;
        } else if (Math.abs(h1p - h2p) <= 180) {
            hpbar = (h1p + h2p) / 2;
        } else {
            hpbar = (h1p + h2p + 360) / 2;
            if (hpbar >= 360) hpbar -= 360;
        }

        const T = 1 - 0.17 * Math.cos(this.deg2rad(hpbar - 30)) +
            0.24 * Math.cos(this.deg2rad(2 * hpbar)) +
            0.32 * Math.cos(this.deg2rad(3 * hpbar + 6)) -
            0.20 * Math.cos(this.deg2rad(4 * hpbar - 63));

        const SL = 1 + (0.015 * Math.pow(Lpbar - 50, 2)) /
            Math.sqrt(20 + Math.pow(Lpbar - 50, 2));
        const SC = 1 + 0.045 * Cpbar;
        const SH = 1 + 0.015 * Cpbar * T;

        const dTheta = 30 * Math.exp(-Math.pow((hpbar - 275) / 25, 2));
        const RC = 2 * Math.sqrt(Math.pow(Cpbar, 7) / (Math.pow(Cpbar, 7) + 6103515625));
        const RT = -Math.sin(this.deg2rad(2 * dTheta)) * RC;

        return Math.sqrt(
            Math.pow(dLp / SL, 2) +
            Math.pow(dCp / SC, 2) +
            Math.pow(dHp / SH, 2) +
            RT * (dCp / SC) * (dHp / SH)
        );
    }

    private static hueAngle(b: number, a: number): number {
        const h = Math.atan2(b, a) * 180 / Math.PI;
        return h >= 0 ? h : h + 360;
    }

    private static deg2rad(deg: number): number {
        return deg * Math.PI / 180;
    }
}
