export type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case' | 'PascalCase';
export type ColorSpace = 'HSL' | 'RGB' | 'OKLCH' | 'HEX';
export type OutputFormat = 'JSON' | 'CSS' | 'SCSS' | 'Swift' | 'Kotlin';
export type ModelTier = 'AUTO' | 'LITE' | 'SMART';

export interface GovernanceSettings {
    accessibilityLevel: 'AA' | 'AAA';
    semanticStrictness: number; // 0-100
}

export interface TokenStandards {
    namingConvention: NamingConvention;
    colorSpace: ColorSpace;
    outputFormat: OutputFormat;
}

export interface VibeSettings {
    // Engine
    apiKey: string | null;
    supabase?: {
        url: string;
        anonKey: string;
    } | null;
    modelTier: ModelTier;

    // Standards
    standards: TokenStandards;

    // Governance
    governance: GovernanceSettings;
}

export const DEFAULT_SETTINGS: VibeSettings = {
    apiKey: null,
    supabase: null,
    modelTier: 'AUTO',
    standards: {
        namingConvention: 'kebab-case',
        colorSpace: 'HSL',
        outputFormat: 'CSS'
    },
    governance: {
        accessibilityLevel: 'AA',
        semanticStrictness: 80
    }
};
