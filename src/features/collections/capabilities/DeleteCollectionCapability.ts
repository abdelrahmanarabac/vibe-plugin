import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/lib/result";
import type { SyncService } from "../../../core/services/SyncService";

type DeleteCollectionPayload = { name: string; id?: string };
type DeleteCollectionResult = {
    message: string,
    deletedId?: string,
    deletedName: string,
    collectionMap: Record<string, string>
};

export class DeleteCollectionCapability implements ICapability<DeleteCollectionPayload, DeleteCollectionResult> {
    readonly id = "delete-collection-v1";
    readonly commandId = "DELETE_COLLECTION";
    readonly description = "Deletes a variable collection from Figma (Zombie-Proof)";

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: DeleteCollectionPayload, _context: AgentContext): Promise<Result<DeleteCollectionResult>> {
        console.log('[DeleteCollectionCapability] Attempting Nuclear Delete:', payload);
        const { name, id } = payload;

        try {
            // STEP 1: Attempt Deletion (The "Try" Phase)
            // We do not fail if this fails. We just want to ensure it's gone.

            let collection: VariableCollection | null = null;

            if (id) {
                collection = await figma.variables.getVariableCollectionByIdAsync(id);
            } else if (name) {
                const collections = await figma.variables.getLocalVariableCollectionsAsync();
                collection = collections.find(c => c.name === name) || null;
            }

            if (collection) {
                collection.remove();
                console.log(`[Vibe] Collection '${collection.name}' removed from Figma.`);
            } else {
                console.warn(`[DeleteCollectionCapability] Collection not found (Zombie). treating as success.`);
            }

        } catch (error) {
            // STEP 2: Swallow the Error (The "Ignore" Phase)
            // If Figma throws "Invalid ID" or anything else, we don't care. The goal is "It's gone".
            console.error('[DeleteCollectionCapability] Deletion error swallowed:', error);
        }

        // STEP 3: Aggressive Sync (The "Refresh" Phase)
        // We force a stats refresh to get the absolute truth from Figma.
        const freshStats = await this.syncService.getStats();

        // STEP 4: Return Trith
        return Result.ok({
            message: `🗑️ Collection '${name}' Processed`,
            deletedId: id,
            deletedName: name,
            collectionMap: freshStats.collectionMap // FRESH DATA
        });
    }
}
