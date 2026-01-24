import type { TokenEntity } from '../../tokens/domain/entities/Token';

export interface ExportResult {
    filename: string;
    content: string;
    language: string;
}

export abstract class TokenExporter {
    abstract execute(tokens: TokenEntity[]): ExportResult;

    protected formatName(name: string): string {
        return name.toLowerCase().replace(/\./g, '-');
    }
}
