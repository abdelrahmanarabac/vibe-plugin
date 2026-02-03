/**
 * 🧵 String Manipulation Utilities
 * 
 * **Purpose:**
 * Helper functions for converting strings between different casing conventions.
 * Used primarily by Export Adapters to format token names and keys.
 */

/**
 * Converts a string to kebab-case
 * e.g., "Primary Color" -> "primary-color"
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // split camelCase
        .replace(/[\s_]+/g, '-')             // replace spaces and underscores
        .toLowerCase();
}

/**
 * Converts a string to camelCase
 * e.g., "primary-color" -> "primaryColor"
 */
export function toCamelCase(str: string): string {
    return str
        .replace(/[-_]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, c => c.toLowerCase());
}

/**
 * Converts a string to snake_case
 * e.g., "primary-color" -> "primary_color"
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2') // split camelCase
        .replace(/[\s-]+/g, '_')             // replace spaces and hyphens
        .toLowerCase();
}

/**
 * Applies the requested naming convention to a key
 */
export function applyNamingConvention(key: string, convention: 'kebab-case' | 'camelCase' | 'snake_case'): string {
    switch (convention) {
        case 'camelCase': return toCamelCase(key);
        case 'snake_case': return toSnakeCase(key);
        case 'kebab-case':
        default:
            return toKebabCase(key);
    }
}
