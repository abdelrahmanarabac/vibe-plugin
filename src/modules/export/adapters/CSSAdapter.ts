import type { TokenEntity, TokenType } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';


/**
 * 🎨 CSSAdapter - CSS Custom Properties (Variables) Exporter
 * 
 * **Purpose:**
 * Transforms TokenEntity[] into browser-compatible CSS custom properties.
 * Generates a `:root` block suitable for direct inclusion in stylesheets.
 * 
 * **Output Format:**
 * ```css
 * :root {
 *   --color-primary-500: #FF5733;
 *   --spacing-base: 8px;
 *   --font-family-heading: 'Inter', sans-serif;
 * }
 * ```
 * 
 * **Design Decisions:**
 * - **Naming:** kebab-case (CSS standard convention)
 * - **Prefix:** `--` (CSS custom property syntax)
 * - **Scope:** `:root` (global scope, highest specificity)
 * - **Units:** Auto-inject `px` for unitless dimensions
 * 
 * **Browser Compatibility:**
 * CSS Custom Properties are supported in all modern browsers (IE11+)
 */
export class CSSAdapter implements ITokenAdapter {
    public readonly formatId = 'css';
    public readonly description = 'CSS Custom Properties (Variables)';

    /**
     * Export tokens to CSS variables format
     * 
     * @param tokens - Fully resolved token entities
     * @returns Promise<TokenExportResult> with CSS content
     */
    public async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        // Edge case: Empty tokens
        if (tokens.length === 0) {
            return {
                filename: 'tokens.css',
                content: ':root {\n  /* No tokens available */\n}',
                mimeType: 'text/css',
                format: this.formatId
            };
        }

        // Generate CSS variable declarations
        const declarations = tokens
            .map(token => this.toDeclaration(token))
            .filter(Boolean) // Remove null/undefined from error cases
            .join('\n');

        // Wrap in :root selector
        const content = `:root {\n${declarations}\n}`;

        return {
            filename: 'tokens.css',
            content,
            mimeType: 'text/css',
            format: this.formatId
        };
    }

    /**
     * Converts a single TokenEntity to a CSS variable declaration
     * 
     * **Transformation Logic:**
     * 1. Build variable name from path + token name
     * 2. Serialize value based on token type
     * 3. Format as CSS declaration
     * 
     * **Example:**
     * Input: { path: ["color", "primary"], name: "500", $value: "#FF0000", $type: "color" }
     * Output: "  --color-primary-500: #FF0000;"
     * 
     * @param token - Source token entity
     * @returns CSS declaration string or null if invalid
     */
    private toDeclaration(token: TokenEntity): string | null {
        try {
            const variableName = this.buildVariableName(token);
            const value = this.serializeValue(token.$value, token.$type);

            return `  ${variableName}: ${value};`;
        } catch (error) {
            console.warn(`⚠️ Failed to convert token "${token.name}" to CSS:`, error);
            return null;
        }
    }

    /**
     * Builds CSS variable name from token path and name
     * 
     * **Naming Convention:**
     * - Prefix: `--` (CSS custom property syntax)
     * - Separator: `-` (kebab-case)
     * - Lowercase: CSS is case-sensitive, lowercase is standard
     * 
     * **Examples:**
     * - path: ["Color", "Primary"], name: "500" → `--color-primary-500`
     * - path: ["Spacing"], name: "Base" → `--spacing-base`
     * - path: [], name: "Accent" → `--accent`
     * 
     * @param token - Source token entity
     * @returns CSS variable name with `--` prefix
     */
    private buildVariableName(token: TokenEntity): string {
        // Combine path segments with token name
        const segments = [...token.path, token.name];

        // Convert to kebab-case
        const kebabCase = segments
            .map(segment => this.toKebabCase(segment))
            .join('-');

        return `--${kebabCase}`;
    }

    /**
     * Converts string to kebab-case
     * 
     * **Transformations:**
     * - "PrimaryColor" → "primary-color"
     * - "fontSize_lg" → "font-size-lg"
     * - "BRAND_500" → "brand-500"
     * 
     * @param str - Input string (any casing)
     * @returns kebab-case string
     */
    private toKebabCase(str: string): string {
        return str
            // Insert hyphen before uppercase letters
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            // Replace underscores and spaces with hyphens
            .replace(/[_\s]+/g, '-')
            // Convert to lowercase
            .toLowerCase()
            // Remove consecutive hyphens
            .replace(/-+/g, '-')
            // Trim leading/trailing hyphens
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Serializes token value to CSS-compatible format
     * 
     * **Type-Specific Serialization:**
     * - **color**: Pass through (hex/rgba/hsl)
     * - **dimension**: Add `px` if unitless number
     * - **fontFamily**: Wrap in quotes if contains spaces
     * - **fontWeight**: Pass through (numeric or keyword)
     * - **duration**: Add `ms` or `s` suffix
     * - **cubicBezier**: Format as `cubic-bezier(x1, y1, x2, y2)`
     * 
     * **Alias Handling:**
     * If value is a reference (e.g., "{color/primary}"), convert to CSS var reference:
     * `{color/primary}` → `var(--color-primary)`
     * 
     * @param value - Raw token value
     * @param type - Token type for context-aware formatting
     * @returns CSS-compatible value string
     */
    private serializeValue(value: string | number, type: TokenType): string {
        // Handle alias references
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            return this.convertAliasToVar(value);
        }

        // Type-specific serialization
        switch (type) {
            case 'color':
                return this.serializeColor(value);

            case 'dimension':
                return this.serializeDimension(value);

            case 'fontFamily':
                return this.serializeFontFamily(value);

            case 'fontWeight':
                return String(value);

            case 'duration':
                return this.serializeDuration(value);

            case 'cubicBezier':
                return this.serializeCubicBezier(value);

            default:
                return String(value);
        }
    }

    /**
     * Converts alias reference to CSS var() function
     * 
     * **Example:**
     * "{color/primary/500}" → "var(--color-primary-500)"
     * 
     * @param alias - Alias string in format "{path/to/token}"
     * @returns CSS var() reference
     */
    private convertAliasToVar(alias: string): string {
        // Remove braces
        const path = alias.slice(1, -1);

        // Convert path to kebab-case
        const variableName = path
            .split('/')
            .map(segment => this.toKebabCase(segment))
            .join('-');

        return `var(--${variableName})`;
    }

    /**
     * Serializes color values
     * Pass through as-is (assumes hex, rgb, rgba, hsl formats)
     */
    private serializeColor(value: string | number): string {
        return String(value);
    }

    /**
     * Serializes dimension values
     * Adds `px` unit if value is a unitless number
     */
    private serializeDimension(value: string | number): string {
        // If already has unit (e.g., "1.5rem", "100%"), pass through
        if (typeof value === 'string' && /[a-z%]/i.test(value)) {
            return value;
        }

        // Add `px` to unitless numbers
        return `${value}px`;
    }

    /**
     * Serializes font family values
     * Wraps in quotes if contains spaces or special characters
     */
    private serializeFontFamily(value: string | number): string {
        const str = String(value);

        // If contains spaces or commas, wrap in quotes (unless already quoted)
        if (/[\s,]/.test(str) && !str.startsWith('"') && !str.startsWith("'")) {
            return `"${str}"`;
        }

        return str;
    }

    /**
     * Serializes duration values
     * Adds `ms` suffix if unitless number
     */
    private serializeDuration(value: string | number): string {
        if (typeof value === 'string' && /[a-z]/i.test(value)) {
            return value; // Already has unit
        }

        return `${value}ms`;
    }

    /**
     * Serializes cubic-bezier values
     * 
     * **Expected Input Format:**
     * String: "0.4, 0.0, 0.2, 1.0"
     * 
     * **Output:**
     * "cubic-bezier(0.4, 0.0, 0.2, 1.0)"
     */
    private serializeCubicBezier(value: string | number): string {
        const str = String(value);

        // If already wrapped, pass through
        if (str.startsWith('cubic-bezier(')) {
            return str;
        }

        // Wrap in cubic-bezier() function
        return `cubic-bezier(${str})`;
    }
}
