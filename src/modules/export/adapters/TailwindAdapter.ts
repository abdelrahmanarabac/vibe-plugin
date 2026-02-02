import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 🌊 Tailwind Adapter
 * 
 * **Purpose:**
 * Exports tokens as Tailwind CSS theme configuration.
 * 
 * **Format:**
 * ```javascript
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: {
 *           500: "#FF0000",
 *         },
 *       },
 *       spacing: {
 *         large: "24px",
 *       },
 *     },
 *   },
 * };
 * ```
 * 
 * **Use Cases:**
 * - Tailwind CSS projects
 * - Utility-first design systems
 * - JIT mode theme configuration
 */
export class TailwindAdapter implements ITokenAdapter {
    public readonly formatId = 'tailwind';
    public readonly description = 'Tailwind CSS Theme Config';

    /**
     * Exports tokens to Tailwind config format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildTailwindConfig(tokens);

            return {
                filename: 'tailwind.tokens.js',
                content,
                mimeType: 'text/javascript',
                format: 'tailwind'
            };
        } catch (error) {
            throw new Error(
                `Tailwind export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete Tailwind config file
     */
    private buildTailwindConfig(tokens: TokenEntity[]): string {
        const themeExtend = this.buildThemeExtend(tokens);

        return `/**
 * 🎨 Design Tokens (Tailwind CSS)
 * 
 * Auto-generated Tailwind theme configuration.
 * Import this into your tailwind.config.js:
 * 
 * const tokens = require('./tailwind.tokens');
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...tokens.theme.extend
 *     }
 *   }
 * }
 */

module.exports = {
  theme: {
    extend: ${this.stringifyObject(themeExtend, 3)}
  }
};
`;
    }

    /**
     * Builds theme.extend object by categorizing tokens
     */
    private buildThemeExtend(tokens: TokenEntity[]): Record<string, unknown> {
        const extend: Record<string, unknown> = {};

        // Group tokens by Tailwind theme key
        for (const token of tokens) {
            const category = this.mapToTailwindCategory(token.$type);
            if (!category) continue;

            if (!extend[category]) {
                extend[category] = {};
            }

            this.addTokenToCategory(extend[category] as Record<string, unknown>, token);
        }

        return extend;
    }

    /**
     * Maps token type to Tailwind theme category
     */
    private mapToTailwindCategory(type: string): string | null {
        const mapping: Record<string, string> = {
            'color': 'colors',
            'dimension': 'spacing',
            'fontFamily': 'fontFamily',
            'fontSize': 'fontSize',
            'fontWeight': 'fontWeight',
            'lineHeight': 'lineHeight',
            'letterSpacing': 'letterSpacing',
            'borderRadius': 'borderRadius',
            'borderWidth': 'borderWidth',
            'boxShadow': 'boxShadow',
            'duration': 'transitionDuration',
            'cubicBezier': 'transitionTimingFunction'
        };

        return mapping[type] || null;
    }

    /**
     * Adds token to category object (nested structure)
     */
    private addTokenToCategory(category: Record<string, unknown>, token: TokenEntity): void {
        let current = category;

        // Navigate/create nested structure from path
        for (const segment of token.path) {
            if (!current[segment]) {
                current[segment] = {};
            }
            current = current[segment] as Record<string, unknown>;
        }

        // Set final value
        current[token.name] = this.formatValue(token);
    }

    /**
     * Formats value for Tailwind config
     */
    private formatValue(token: TokenEntity): string {
        const value = token.$value;
        const type = token.$type;

        // Type-specific formatting
        switch (type) {
            case 'dimension':
                return typeof value === 'number' ? `${value}px` : String(value);

            case 'duration':
                return typeof value === 'number' ? `${value}ms` : String(value);

            case 'cubicBezier':
                if (Array.isArray(value)) {
                    return `cubic-bezier(${value.join(', ')})`;
                }
                return String(value);

            default:
                return String(value);
        }
    }

    /**
     * Stringifies object with proper indentation for JS module
     */
    private stringifyObject(obj: Record<string, unknown>, depth: number): string {
        const indent = '  '.repeat(depth);
        const innerIndent = '  '.repeat(depth + 1);

        const entries = Object.entries(obj).map(([key, value]) => {
            const safeKey = this.isSafeIdentifier(key) ? key : `"${key}"`;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${innerIndent}${safeKey}: ${this.stringifyObject(value as Record<string, unknown>, depth + 1)}`;
            }

            // String values need quotes
            const formattedValue = typeof value === 'string' ? `"${value}"` : value;
            return `${innerIndent}${safeKey}: ${formattedValue}`;
        });

        return `{\n${entries.join(',\n')}\n${indent}}`;
    }

    /**
     * Checks if string is safe JavaScript identifier
     */
    private isSafeIdentifier(str: string): boolean {
        return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str) && !this.isReservedWord(str);
    }

    /**
     * Checks if string is JavaScript reserved word
     */
    private isReservedWord(str: string): boolean {
        const reserved = ['break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'];
        return reserved.includes(str);
    }
}
