export type TokenType =
    | 'color'
    | 'dimension'
    | 'fontFamily'
    | 'fontWeight'
    | 'duration'
    | 'cubicBezier';

export type VariableScope =
    | 'ALL_SCOPES'
    | 'FRAME_FILL'
    | 'TEXT_FILL'
    | 'STROKE_COLOR'
    | 'EFFECT_COLOR';

export type RGB = { r: number; g: number; b: number };
export type RGBA = RGB & { a: number };
export type VariableValue = string | number | boolean | RGB | RGBA;

export interface ComponentUsage {
    id: string;
    name: string;
}

export interface StyleUsage {
    id: string;
    name: string;
}

export interface TokenUsageStats {
    /** 
     * Qualitative list of components using this token.
     */
    usedInComponents: ComponentUsage[];

    /** 
     * Qualitative list of styles using this token.
     */
    usedInStyles: StyleUsage[];

    /** 
     * Qualitative impact estimate (e.g. instances of components).
     */
    affectedInstancesCount: number;

    /**
     * Total raw usage count across the entire file (including Frames, Text, etc.).
     */
    totalRawUsage: number;

    /** 
     * Dependency chain for deep analysis.
     */
    dependencyChain: string[];
}

export type TokenUsageMap = Map<string, TokenUsageStats>;

export interface TokenEntity {
    id: string;                    // Figma Variable ID
    name: string;                  // "primary-500"
    path: string[];                // ["Colors", "Brand"]
    $value: string | number;       // W3C standard
    $type: TokenType;
    $description?: string;
    $extensions: {
        figma: {
            scopes: VariableScope[];
            collectionId: string;
            modeId: string;
            resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
        }
    };
    dependencies: string[];        // Token IDs this references
    dependents: string[];          // Token IDs that reference this

    /**
     * 📊 Usage Analytics
     * Added for qualitative usage insights (e.g. "Used in Button/Primary").
     * Populated by TokenUsageAnalyzer.
     */
    usage?: TokenUsageStats;
}
