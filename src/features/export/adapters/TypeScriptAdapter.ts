import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 📘 TypeScript Adapter
 * 
 * **Purpose:**
 * Exports tokens as TypeScript const object with type definitions.
 * 
 * **Format:**
 * ```typescript
 * export const tokens = {
 *   color: {
 *     primary: {
 *       500: "#FF0000",
 *     },
 *   },
 * } as const;
 * 
 * export type TokenPaths = "color.primary.500" | ...;
 * ```
 * 
 * **Use Cases:**
 * - TypeScript projects
 * - Type-safe token references
 * - Autocomplete in IDEs
 */
export class TypeScriptAdapter implements ITokenAdapter {
    public readonly formatId = 'typescript';
    public readonly description = 'TypeScript Const Exports with Types';

    /**
     * Exports tokens to TypeScript format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildTypeScriptFile(tokens);

            return {
                filename: 'tokens.ts',
                content,
                mimeType: 'text/typescript',
                format: 'typescript'
            };
        } catch (error) {
            throw new Error(
                `TypeScript export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete TypeScript file content
     */
    private buildTypeScriptFile(tokens: TokenEntity[]): string {
        const nestedObject = this.buildNestedObject(tokens);
        const tokenPaths = this.extractTokenPaths(tokens);

        return `/**
 * 🎨 Design Tokens
 * 
 * Auto-generated TypeScript token definitions.
 * DO NOT EDIT MANUALLY.
 */

export const tokens = ${this.stringifyObject(nestedObject, 0)} as const;

/**
 * Type-safe token path union
 */
export type TokenPath = ${tokenPaths.map(p => `"${p}"`).join(' | ')};

/**
 * Extract token value by path
 */
export type TokenValue<T extends TokenPath> = 
  T extends keyof typeof tokens
    ? typeof tokens[T]
    : string | number;
`;
    }

    /**
     * Builds nested object structure from flat token array
     */
    private buildNestedObject(tokens: TokenEntity[]): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const token of tokens) {
            let current = result;

            // Navigate/create nested structure
            for (const segment of token.path) {
                if (!current[segment]) {
                    current[segment] = {};
                }
                current = current[segment] as Record<string, unknown>;
            }

            // Set final value
            current[token.name] = this.formatValue(token.$value);
        }

        return result;
    }

    /**
     * Formats value for TypeScript output
     */
    private formatValue(value: string | number): string {
        if (typeof value === 'number') {
            return String(value);
        }
        return `"${value}"`;
    }

    /**
     * Stringifies object with proper indentation
     */
    private stringifyObject(obj: Record<string, unknown>, depth: number): string {
        const indent = '  '.repeat(depth);
        const innerIndent = '  '.repeat(depth + 1);

        const entries = Object.entries(obj).map(([key, value]) => {
            const safeKey = this.isSafeIdentifier(key) ? key : `"${key}"`;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${innerIndent}${safeKey}: ${this.stringifyObject(value as Record<string, unknown>, depth + 1)}`;
            }

            return `${innerIndent}${safeKey}: ${value}`;
        });

        return `{\n${entries.join(',\n')},\n${indent}}`;
    }

    /**
     * Checks if string is safe JavaScript identifier
     */
    private isSafeIdentifier(str: string): boolean {
        return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
    }

    /**
     * Extracts dot-notation paths for type union
     */
    private extractTokenPaths(tokens: TokenEntity[]): string[] {
        return tokens.map(token => {
            return [...token.path, token.name].join('.');
        });
    }
}
