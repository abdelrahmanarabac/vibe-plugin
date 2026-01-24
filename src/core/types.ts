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
}
