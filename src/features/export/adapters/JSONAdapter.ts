import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult, ExportOptions } from '../interfaces/ITokenExporter';
import { applyNamingConvention } from '../logic/stringUtils';

/**
 * 📄 JSON Adapter
 * 
 * **Purpose:**
 * Exports tokens as simple JSON key-value format (flat structure).
 */
export class JSONAdapter implements ITokenAdapter {
    public readonly formatId = 'json';
    public readonly description = 'Simple JSON Adapter (Flat Key-Value)';

    /**
     * Exports tokens to simple JSON format
     */
    async export(tokens: TokenEntity[], options?: ExportOptions): Promise<TokenExportResult> {
        try {
            const convention = options?.namingConvention || 'kebab-case';
            const indent = this.getIndent(options?.indentation);

            const json = this.buildFlatObject(tokens, convention);
            const content = JSON.stringify(json, null, indent);

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

    private getIndent(indentation?: string): string | number {
        if (indentation === 'tab') return '\t';
        if (indentation === '4') return 4;
        return 2; // Default
    }

    /**
     * Builds flat key-value object from tokens
     */
    private buildFlatObject(tokens: TokenEntity[], convention: 'kebab-case' | 'camelCase' | 'snake_case'): Record<string, string | number> {
        const result: Record<string, string | number> = {};

        for (const token of tokens) {
            const key = this.buildKey(token, convention);
            result[key] = token.$value;
        }

        return result;
    }

    /**
     * Builds flat key from token path and name
     */
    private buildKey(token: TokenEntity, convention: 'kebab-case' | 'camelCase' | 'snake_case'): string {
        const segments = [...token.path, token.name];
        // Join with generic separator first
        const rawKey = segments.join('-');
        return applyNamingConvention(rawKey, convention);
    }
}
