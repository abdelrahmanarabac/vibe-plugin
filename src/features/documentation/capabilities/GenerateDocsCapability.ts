import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { DocsRenderer } from '../DocsRenderer';
import type { VariableManager } from '../../governance/VariableManager';

export class GenerateDocsCapability implements ICapability {
    readonly id = 'generate-docs-v1';
    readonly commandId = 'GENERATE_DOCS';
    readonly description = 'Generates documentation for the current token system.';

    private docsRenderer: DocsRenderer;
    private variableManager: VariableManager;

    constructor(
        docsRenderer: DocsRenderer,
        variableManager: VariableManager
    ) {
        this.docsRenderer = docsRenderer;
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<{ generated: boolean }>> {
        try {
            // Ensure data is fresh before generating docs
            await this.variableManager.syncFromFigma();
            await this.docsRenderer.generateDocs();
            return Result.ok({ generated: true });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message);
        }
    }
}
