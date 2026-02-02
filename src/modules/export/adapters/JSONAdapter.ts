import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 📄 JSON Adapter
 * 
 * **Purpose:**
 * Exports tokens as simple JSON key-value format (flat structure).
 * 
 * **Format:**
 * ```json
 * {
 *   "color-primary-500": "#FF0000",
 *   "spacing-large": 24,
 *   "font-family-base": "Inter"
 * }
 * ```
 * 
 * **Use Cases:**
 * - Simple config files
 * - Non-hierarchical token systems
 * - Quick prototyping
 */
export class JSONAdapter implements ITokenAdapter {
    public readonly formatId = 'json';
    public readonly description = 'Simple JSON Adapter (Flat Key-Value)';

    /**
     * Exports tokens to simple JSON format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const json = this.buildFlatObject(tokens);
            const content = JSON.stringify(json, null, 2);

            return {
                filename: 'tokens.json',
                content,
                mimeType: 'application/json',
                format: 'json'
            };
        } catch (error) {
            throw new Error(
                `JSON export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds flat key-value object from tokens
     * 
     * **Naming:**
     * - Concatenates path + name with dashes
     * - Example: ["color", "primary"] + "500" → "color-primary-500"
     */
    private buildFlatObject(tokens: TokenEntity[]): Record<string, string | number> {
        const result: Record<string, string | number> = {};

        for (const token of tokens) {
            const key = this.buildKey(token);
            result[key] = token.$value;
        }

        return result;
    }

    /**
     * Builds flat key from token path and name
     */
    private buildKey(token: TokenEntity): string {
        const segments = [...token.path, token.name];
        return segments
            .join('-')
            .toLowerCase()
            .replace(/\s+/g, '-');
    }
}
