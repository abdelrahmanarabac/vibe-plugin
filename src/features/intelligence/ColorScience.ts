import { colord } from 'colord';

export interface LAB {
    L: number;
    a: number;
    b: number;
}

/**
 * 🧪 ColorScience Engine (L7 standard)
 * Handles high-precision color space conversions and delta-E calculations.
 */
export class ColorScience {
    /**
     * Converts Hex to CIE-L*a*b* coordinates.
     * Standard: D65 Illuminant / 2° Observer.
     */
    static hexToLab(hex: string): LAB {
        const c = colord(hex).toRgb();
        return this.rgbToLab(c.r, c.g, c.b);
    }

    static rgbToLab(r: number, g: number, b: number): LAB {
        // 1. Normalize RGB to [0, 1]
        let nr = r / 255;
        let ng = g / 255;
        let nb = b / 255;

        // 2. Linearize RGB (Gamma removal)
        nr = nr > 0.04045 ? Math.pow((nr + 0.055) / 1.055, 2.4) : nr / 12.92;
        ng = ng > 0.04045 ? Math.pow((ng + 0.055) / 1.055, 2.4) : ng / 12.92;
        nb = nb > 0.04045 ? Math.pow((nb + 0.055) / 1.055, 2.4) : nb / 12.92;

        // 3. Convert to XYZ (D65)
        let x = (nr * 0.4124 + ng * 0.3576 + nb * 0.1805) * 100;
        let y = (nr * 0.2126 + ng * 0.7152 + nb * 0.0722) * 100;
        let z = (nr * 0.0193 + ng * 0.1192 + nb * 0.9505) * 100;

        // 4. XYZ to LAB
        x /= 95.047;
        y /= 100.000;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

        const L = 116 * y - 16;
        const a = 500 * (x - y);
        const labB = 200 * (y - z);

        return { L, a, b: labB };
    }

    /**
     * CIEDE2000 Algorithm (High Precision)
     * Returns a value where <= 1.0 is imperceptible to the human eye.
     */
    static deltaE2000(lab1: LAB, lab2: LAB): number {
        const { L: L1, a: a1, b: b1 } = lab1;
        const { L: L2, a: a2, b: b2 } = lab2;

        const avgL = (L1 + L2) / 2;
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        const avgC = (C1 + C2) / 2;

        const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
        const a1Prime = a1 * (1 + G);
        const a2Prime = a2 * (1 + G);

        const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
        const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
        const avgCPrime = (C1Prime + C2Prime) / 2;

        const h1Prime = (Math.atan2(b1, a1Prime) * 180) / Math.PI;
        const h2Prime = (Math.atan2(b2, a2Prime) * 180) / Math.PI;

        const deltaLPrime = L2 - L1;
        const deltaCPrime = C2Prime - C1Prime;

        let hDiff = h2Prime - h1Prime;
        if (C1Prime * C2Prime !== 0) {
            if (hDiff > 180) hDiff -= 360;
            else if (hDiff < -180) hDiff += 360;
        } else {
            hDiff = 0;
        }
        const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((hDiff / 2 * Math.PI) / 180);

        const avgHPrime = C1Prime * C2Prime === 0 ? h1Prime + h2Prime :
            Math.abs(h1Prime - h2Prime) <= 180 ? (h1Prime + h2Prime) / 2 :
                h1Prime + h2Prime < 360 ? (h1Prime + h2Prime + 360) / 2 : (h1Prime + h2Prime - 360) / 2;

        const T = 1 - 0.17 * Math.cos((avgHPrime - 30) * Math.PI / 180) +
            0.24 * Math.cos(2 * avgHPrime * Math.PI / 180) +
            0.32 * Math.cos((3 * avgHPrime + 6) * Math.PI / 180) -
            0.20 * Math.cos((4 * avgHPrime - 63) * Math.PI / 180);

        const SL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
        const SC = 1 + 0.045 * avgCPrime;
        const SH = 1 + 0.015 * avgCPrime * T;

        const deltaTheta = 30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));
        const RC = 2 * Math.sqrt(Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7)));
        const RT = -RC * Math.sin((2 * deltaTheta * Math.PI) / 180);

        const KL = 1, KC = 1, KH = 1;

        const deltaE = Math.sqrt(
            Math.pow(deltaLPrime / (KL * SL), 2) +
            Math.pow(deltaCPrime / (KC * SC), 2) +
            Math.pow(deltaHPrime / (KH * SH), 2) +
            RT * (deltaCPrime / (KC * SC)) * (deltaHPrime / (KH * SH))
        );

        return deltaE;
    }
}
