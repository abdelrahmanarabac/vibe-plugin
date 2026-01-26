import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/utils/Result";

export class CreateCollectionCapability implements ICapability {
    readonly id = "create-collection-v1";
    readonly commandId = "CREATE_COLLECTION";
    readonly description = "Creates a new variable collection in Figma";

    canExecute(_context: AgentContext): boolean {
        return true; // Available in any context
    }

    async execute(payload: { name: string }, _context: AgentContext): Promise<Result<any>> {
        try {
            // 1. Validate name
            const name = payload.name || "New Collection";

            // 2. Create collection via Figma API
            const collection = figma.variables.createVariableCollection(name);

            // 3. Ensure a default mode exists for better UX
            if (collection.modes.length === 0) {
                collection.addMode("Default");
            }

            return Result.ok({
                message: `✅ Collection '${name}' Created`,
                collectionId: collection.id
            });

        } catch (error: any) {
            console.error('[CreateCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to create collection: ${error.message}`);
        }
    }
}
