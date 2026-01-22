import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';

export class ScanSelectionCapability implements ICapability {
    readonly id = 'scan-selection-v1';
    readonly commandId = 'SCAN_SELECTION';
    readonly description = 'Scans the current selection for tokens and primitives.';

    canExecute(context: AgentContext): boolean {
        // Can only scan if something is selected
        return context.selection.length > 0;
    }

    async execute(payload: any, context: AgentContext): Promise<Result<any>> {
        void payload; // explicit ignore or remove if possible
        console.log('[ScanCapability] Executing on', context.selection.length, 'nodes');

        const primitives: any[] = [];

        // Basic POC Visitor (to be replaced by PerceptionEngine v2)
        for (const node of context.selection) {
            primitives.push(this.visit(node));
        }

        return Result.ok({
            scannedCount: primitives.length,
            primitives
        });
    }

    private visit(node: SceneNode): any {
        return {
            id: node.id,
            name: node.name,
            type: node.type,
            // Extract minimal data for POC
            width: node.width,
            height: node.height
        };
    }
}
