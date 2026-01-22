import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../tokens/domain/entities/Token';

export class TailwindExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const colors: Record<string, any> = {};

        // Naive hierarchy builder
        tokens.filter(t => t.type === 'color').forEach(token => {
            const parts = token.name.split('.');
            let current = colors;
            parts.forEach((part, index) => {
                if (index === parts.length - 1) {
                    current[part] = token.resolvedValue ?? token.value;
                } else {
                    current[part] = current[part] || {};
                    current = current[part];
                }
            });
        });

        const output = `module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 2)}
    }
  }
}`;

        return {
            filename: 'tailwind.config.js',
            content: output,
            language: 'javascript'
        };
    }
}
