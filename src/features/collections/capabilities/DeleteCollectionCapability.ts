import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/utils/Result";

type DeleteCollectionPayload = { name: string };
type DeleteCollectionResult = { message: string, deletedId?: string, deletedName: string };

export class DeleteCollectionCapability implements ICapability<DeleteCollectionPayload, DeleteCollectionResult> {
    readonly id = "delete-collection-v1";
    readonly commandId = "DELETE_COLLECTION";
    readonly description = "Deletes a variable collection from Figma";

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: DeleteCollectionPayload, _context: AgentContext): Promise<Result<DeleteCollectionResult>> {
        try {
            console.log('[DeleteCollectionCapability] Initiating deletion sequence for:', payload.name);

            const { name } = payload;

            if (!name) {
                return Result.fail("Collection name is required");
            }

            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            const collection = collections.find(c => c.name === name);

            if (!collection) {
                // Idempotent success: If it's not there, it's effectively deleted.
                console.log(`[DeleteCollectionCapability] Collection '${name}' not found. Already deleted.`);
                return Result.ok({
                    message: `✅ Collection '${name}' was already deleted`,
                    deletedName: name
                });
            }

            const collectionId = collection.id;

            // Perform the deletion
            collection.remove();

            console.log(`[Vibe] Deleted Collection: ${name} (${collectionId})`);

            // We explicitly return the ID and Name so the UI can do an optimistic update if it wants to,
            // or just plain confirmation.
            return Result.ok({
                message: `🗑️ Collection '${name}' Deleted`,
                deletedId: collectionId,
                deletedName: name
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[DeleteCollectionCapability] Critical Execution Error:', error);
            return Result.fail(`Failed to delete collection: ${message}`);
        }
    }
}
