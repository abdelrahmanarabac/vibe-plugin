import type { VibeToken } from "../../core/schema/TokenSchema";

interface TypeConfig {
    fontFamily: string;
    baseSize: number; // e.g. 16
    scaleRatio: number; // e.g. 1.25 (Major Third)
}

export class TypeGenerator {

    static generate(config: TypeConfig = { fontFamily: "Inter", baseSize: 16, scaleRatio: 1.25 }): VibeToken[] {
        const tokens: VibeToken[] = [];
        const { fontFamily, baseSize, scaleRatio } = config;

        // Helper for rounded px values
        const size = (step: number) => Math.round(baseSize * Math.pow(scaleRatio, step));

        // 1. Headings (Display & H1-H6)
        const headings = [
            { name: 'display', level: 6, weight: 'Bold', lh: 1.1 },
            { name: 'h1', level: 5, weight: 'Bold', lh: 1.1 },
            { name: 'h2', level: 4, weight: 'Bold', lh: 1.2 },
            { name: 'h3', level: 3, weight: 'SemiBold', lh: 1.2 },
            { name: 'h4', level: 2, weight: 'SemiBold', lh: 1.3 },
            { name: 'h5', level: 1, weight: 'SemiBold', lh: 1.4 },
            { name: 'h6', level: 0, weight: 'SemiBold', lh: 1.4 },
        ];

        headings.forEach(h => {
            tokens.push({
                type: 'TYPOGRAPHY',
                data: {
                    name: `typography/${h.name}`,
                    value: {
                        fontFamily,
                        fontWeight: h.weight,
                        fontSize: size(h.level),
                        lineHeight: h.lh
                    },
                    description: `${h.name} (${size(h.level)}px)`
                }
            });
        });

        // 2. Body Text
        tokens.push({
            type: 'TYPOGRAPHY',
            data: {
                name: `typography/body/base`,
                value: { fontFamily, fontWeight: 'Regular', fontSize: baseSize, lineHeight: 1.5 },
                description: 'Body Base'
            }
        });
        tokens.push({
            type: 'TYPOGRAPHY',
            data: {
                name: `typography/body/small`,
                value: { fontFamily, fontWeight: 'Regular', fontSize: size(-1), lineHeight: 1.5 },
                description: 'Body Small'
            }
        });

        return tokens;
    }
}
