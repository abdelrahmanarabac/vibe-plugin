import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../../core/types';

/**
 * 🌪️ TailwindExporter
 * Generates Tailwind CSS configuration from the token graph.
 * Implements recursive object nesting based on token paths.
 */
export class TailwindExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const colors: Record<string, any> = {};

        tokens.filter(t => t.$type === 'color').forEach(token => {
            const parts = [...token.path, token.name];
            let current = colors;

            parts.forEach((part: string, index: number) => {
                if (index === parts.length - 1) {
                    current[part] = token.$value;
                } else {
                    current[part] = current[part] || {};
                    // Ensure current is still treated as an object for the next iteration
                    if (typeof current[part] === 'object' && current[part] !== null) {
                        current = current[part];
                    }
                }
            });
        });

        const output = `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 2)}\n    }\n  }\n}`;

        return {
            filename: 'tailwind.config.js',
            content: output,
            language: 'javascript'
        };
    }
}
