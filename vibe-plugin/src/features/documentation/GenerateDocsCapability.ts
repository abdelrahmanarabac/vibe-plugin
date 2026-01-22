import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import type { DocsRenderer } from '../../modules/documentation/DocsRenderer';
import type { VariableManager } from '../../modules/governance/VariableManager';

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

    async execute(_payload: any, _context: AgentContext): Promise<Result<any>> {
        try {
            // Ensure data is fresh before generating docs
            await this.variableManager.syncFromFigma();
            await this.docsRenderer.generateDocs();
            return Result.ok({ generated: true });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
