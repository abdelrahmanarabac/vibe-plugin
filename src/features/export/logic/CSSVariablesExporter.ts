import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../../core/types';

/**
 * 🎨 CSSVariablesExporter
 * Generates standard CSS Custom Properties from the token graph.
 * Strictly adheres to the purified TokenEntity schema.
 */
export class CSSVariablesExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const lines = [':root {'];

        tokens.forEach(token => {
            const name = `--${this.formatName(token.name)}`;
            const value = token.$value;
            lines.push(`  ${name}: ${value};`);
        });

        lines.push('}');

        return {
            filename: 'variables.css',
            content: lines.join('\n'),
            language: 'css'
        };
    }
}
