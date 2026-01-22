import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../tokens/domain/entities/Token';

export class CSSVariablesExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const lines = [':root {'];

        tokens.forEach(token => {
            if (token.type === 'color' || token.type === 'number' || token.type === 'string') {
                const name = `--${this.formatName(token.name)}`;
                const value = token.resolvedValue ?? token.value;
                lines.push(`  ${name}: ${value};`);
            }
        });

        lines.push('}');

        return {
            filename: 'variables.css',
            content: lines.join('\n'),
            language: 'css'
        };
    }
}
