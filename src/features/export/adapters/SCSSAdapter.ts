import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 🎨 SCSS Adapter
 * 
 * **Purpose:**
 * Exports tokens as Sass (SCSS) variables.
 * 
 * **Format:**
 * ```scss
 * // Design Tokens
 * $color-primary-500: #FF0000;
 * $spacing-large: 24px;
 * $font-family-base: "Inter", sans-serif;
 * ```
 * 
 * **Use Cases:**
 * - Sass/SCSS projects
 * - Compatibility with existing Sass themes
 * - Stylesheets that need variable substitution
 */
export class SCSSAdapter implements ITokenAdapter {
    public readonly formatId = 'scss';
    public readonly description = 'SCSS Variables (Sass)';

    /**
     * Exports tokens to SCSS format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildSCSSFile(tokens);

            return {
                filename: 'tokens.scss',
                content,
                mimeType: 'text/x-scss',
                format: 'scss'
            };
        } catch (error) {
            throw new Error(
                `SCSS export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete SCSS file content
     */
    private buildSCSSFile(tokens: TokenEntity[]): string {
        const header = `/**
 * 🎨 Design Tokens (SCSS Variables)
 * 
 * Auto-generated Sass variables.
 * DO NOT EDIT MANUALLY.
 */

`;

        const variables = tokens
            .map(token => this.buildVariable(token))
            .join('\n');

        return header + variables;
    }

    /**
     * Builds a single SCSS variable declaration
     */
    private buildVariable(token: TokenEntity): string {
        const name = this.buildVariableName(token);
        const value = this.formatValue(token);

        return `$${name}: ${value};`;
    }

    /**
     * Builds kebab-case variable name from token path
     */
    private buildVariableName(token: TokenEntity): string {
        const segments = [...token.path, token.name];
        return segments
            .join('-')
            .toLowerCase()
            .replace(/\s+/g, '-');
    }

    /**
     * Formats value for SCSS output
     */
    private formatValue(token: TokenEntity): string {
        const value = token.$value;
        const type = token.$type;

        // Handle alias references
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const aliasPath = value.slice(1, -1);
            const sassVarName = aliasPath.replace(/\//g, '-').replace(/\./g, '-');
            return `$${sassVarName}`;
        }

        // Type-specific formatting
        switch (type) {
            case 'dimension':
                return typeof value === 'number' ? `${value}px` : String(value);

            case 'fontFamily':
                // Wrap font families in quotes
                if (typeof value === 'string') {
                    return value.includes(' ')
                        ? `"${value}"`
                        : value;
                }
                return String(value);

            case 'duration':
                return typeof value === 'number' ? `${value}ms` : String(value);

            case 'cubicBezier':
                if (Array.isArray(value)) {
                    return `cubic-bezier(${value.join(', ')})`;
                }
                return String(value);

            default:
                // Colors, strings, numbers
                if (typeof value === 'string') {
                    // Don't quote hex colors
                    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
                        return value;
                    }
                    return value;
                }
                return String(value);
        }
    }
}
