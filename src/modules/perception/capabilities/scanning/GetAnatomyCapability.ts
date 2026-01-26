import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import { Traverser } from '../../core/Traverser';
import { HierarchyVisitor } from '../../visitors/HierarchyVisitor';

export class GetAnatomyCapability implements ICapability {
    readonly id = 'get-anatomy';
    readonly commandId = 'GET_ANATOMY';
    readonly description = 'Captures the structural hierarchy of selected nodes.';

    canExecute(context: AgentContext): boolean {
        return context.selection.length > 0;
    }

    async execute(_payload: any, context: AgentContext): Promise<Result<any>> {
        const traverser = new Traverser();
        const visitor = new HierarchyVisitor();

        traverser.traverse(context.selection, visitor);

        return Result.ok({
            anatomy: visitor.getAnatomy()
        });
    }
}
