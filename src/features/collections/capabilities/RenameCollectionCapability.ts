import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/utils/Result";

type RenameCollectionPayload = { oldName: string; newName: string };
type RenameCollectionResult = { message: string; collectionId: string };

export class RenameCollectionCapability implements ICapability<RenameCollectionPayload, RenameCollectionResult> {
    readonly id = "rename-collection-v1";
    readonly commandId = "RENAME_COLLECTION";
    readonly description = "Renames an existing variable collection in Figma";

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: RenameCollectionPayload, _context: AgentContext): Promise<Result<RenameCollectionResult>> {
        try {
            const { oldName, newName } = payload;

            if (!oldName || !newName) {
                return Result.fail("Both oldName and newName are required");
            }

            let collections = await figma.variables.getLocalVariableCollectionsAsync();
            let collection = collections.find(c => c.name === oldName);

            // Double Check Strategy: Force Refetch if not found (Race Condition Guard)
            if (!collection) {
                console.log(`[RenameCollectionCapability] Collection '${oldName}' not found in cache. Refetching...`);
                // Wait a tick to allow Figma internal state to settle
                await new Promise(resolve => setTimeout(resolve, 50));
                collections = await figma.variables.getLocalVariableCollectionsAsync();
                collection = collections.find(c => c.name === oldName);
            }

            if (!collection) {
                console.warn(`[RenameCollectionCapability] Collection '${oldName}' vanished.`);
                return Result.fail(`Collection '${oldName}' not found`);
            }

            collection.name = newName;

            console.log(`[Vibe] Renamed Collection: ${oldName} -> ${newName}`);

            return Result.ok({
                message: `✅ Collection renamed to '${newName}'`,
                collectionId: collection.id
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[RenameCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to rename collection: ${message}`);
        }
    }
}
