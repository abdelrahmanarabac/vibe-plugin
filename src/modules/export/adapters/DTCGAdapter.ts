import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';


/**
 * 🌍 DTCGAdapter - W3C Design Tokens Community Group Specification Adapter
 * 
 * **Purpose:**
 * Transforms Vibe's flat TokenEntity[] array into the nested, hierarchical structure
 * defined by the W3C Design Tokens Format Specification (DTCG).
 * 
 * **W3C DTCG Spec Compliance:**
 * - Uses `$value` and `$type` keys (per spec)
 * - Preserves `$description` for documentation
 * - Converts flat paths into nested JSON objects
 * - Handles alias references using `{path.to.token}` syntax
 * 
 * **References:**
 * - Spec: https://tr.designtokens.org/format/
 * - GitHub: https://github.com/design-tokens/community-group
 * 
 * **Strategic Value:**
 * This adapter provides interoperability with:
 * - Figma Tokens Studio
 * - Supernova
 * - Knapsack
 * - Any DTCG-compliant design system tool
 */
export class DTCGAdapter implements ITokenAdapter {
    public readonly formatId = 'dtcg';
    public readonly description = 'W3C Design Tokens Community Group Format (JSON)';

    /**
     * Export tokens to W3C DTCG JSON format
     * 
     * **Transformation Logic:**
     * 1. Group tokens by their path hierarchy
     * 2. Build nested object structure via deep merge
     * 3. Convert each token to DTCG-compliant object
     * 4. Serialize to formatted JSON
     * 
     * @param tokens - Fully resolved token entities
     * @returns Promise<TokenExportResult> with JSON content
     */
    public async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        // Edge case: Empty token array
        if (tokens.length === 0) {
            return {
                filename: 'design-tokens.json',
                content: '{}',
                mimeType: 'application/json',
                format: this.formatId
            };
        }

        // Build nested DTCG object structure
        const dtcgObject = this.buildNestedStructure(tokens);

        // Serialize with pretty-print for human readability
        const content = JSON.stringify(dtcgObject, null, 2);

        return {
            filename: 'design-tokens.json',
            content,
            mimeType: 'application/json',
            format: this.formatId
        };
    }

    /**
     * Constructs the nested DTCG object from flat token array
     * 
     * **Algorithm:**
     * - Uses reduce() to accumulate nested structure
     * - For each token, navigate/create path hierarchy
     * - Insert token data at leaf node
     * 
     * **Example:**
     * Input: [{ path: ["color", "primary"], name: "500", $value: "#FF0000" }]
     * Output: { color: { primary: { "500": { $value: "#FF0000", $type: "color" } } } }
     * 
     * @param tokens - Input token entities
     * @returns Nested DTCG-compliant object
     */
    private buildNestedStructure(tokens: TokenEntity[]): Record<string, unknown> {
        return tokens.reduce((acc, token) => {
            // Navigate to the correct nesting level
            let current = acc;

            // Traverse path hierarchy (e.g., ["Colors", "Brand"])
            for (const segment of token.path) {
                if (!current[segment]) {
                    current[segment] = {};
                }
                current = current[segment] as Record<string, unknown>;
            }

            // Insert token at leaf node
            current[token.name] = this.toDTO(token);

            return acc;
        }, {} as Record<string, unknown>);
    }

    /**
     * Converts TokenEntity to DTCG Data Transfer Object
     * 
     * **W3C Spec Mapping:**
     * - $value: The actual value (color, dimension, etc.)
     * - $type: Token type (color, dimension, fontFamily, etc.)
     * - $description: Optional human-readable description
     * 
     * **Alias Handling:**
     * If $value is a reference (e.g., "{color/primary/500}"), preserve as-is.
     * DTCG spec allows alias references using this syntax.
     * 
     * @param token - Source token entity
     * @returns DTCG-compliant object
     */
    private toDTO(token: TokenEntity): Record<string, unknown> {
        const dto: Record<string, unknown> = {
            $value: this.serializeValue(token.$value),
            $type: token.$type
        };

        // Add optional description if present
        if (token.$description) {
            dto.$description = token.$description;
        }

        return dto;
    }

    /**
     * Serializes token values to DTCG-compliant formats
     * 
     * **Type-Specific Serialization:**
     * - Strings: Pass through (including aliases "{...}")
     * - Numbers: Pass through
     * - Objects (RGB/RGBA): Not in $value (handled by Figma extensions)
     * 
     * **Why This Method?**
     * Future-proofing for complex value transformations:
     * - Color space conversions
     * - Unit normalization
     * - Alias resolution (if needed)
     * 
     * @param value - Raw token value
     * @returns Serialized value for DTCG spec
     */
    private serializeValue(value: string | number): string | number {
        // Preserve aliases (e.g., "{color/primary/500}")
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            return value;
        }

        // Pass through primitive values
        return value;
    }
}
