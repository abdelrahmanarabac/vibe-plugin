import type { TokenEntity } from '../../../core/types';

export interface ExportResult {
    filename: string;
    content: string;
    language: string;
}

/**
 * 📤 TokenExporter
 * Base abstract class for all exporters.
 * Purified to use the core TokenEntity definition.
 */
export abstract class TokenExporter {
    abstract execute(tokens: TokenEntity[]): ExportResult;

    protected formatName(name: string): string {
        return name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    }
}
