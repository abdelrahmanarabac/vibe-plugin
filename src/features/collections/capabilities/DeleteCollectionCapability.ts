import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/utils/Result";

type DeleteCollectionPayload = { name: string };
type DeleteCollectionResult = { message: string };

export class DeleteCollectionCapability implements ICapability<DeleteCollectionPayload, DeleteCollectionResult> {
    readonly id = "delete-collection-v1";
    readonly commandId = "DELETE_COLLECTION";
    readonly description = "Deletes a variable collection from Figma";

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: DeleteCollectionPayload, _context: AgentContext): Promise<Result<DeleteCollectionResult>> {
        try {
            const { name } = payload;

            if (!name) {
                return Result.fail("Collection name is required");
            }

            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            const collection = collections.find(c => c.name === name);

            if (!collection) {
                return Result.fail(`Collection '${name}' not found`);
            }

            collection.remove();

            console.log(`[Vibe] Deleted Collection: ${name}`);

            return Result.ok({
                message: `🗑️ Collection '${name}' Deleted`
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[DeleteCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to delete collection: ${message}`);
        }
    }
}
