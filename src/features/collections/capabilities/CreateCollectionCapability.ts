import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/utils/Result";
import type { SyncService } from "../../../core/services/SyncService";

type CreateCollectionPayload = { name: string };
type CreateCollectionResult = {
    message: string;
    collectionId: string;
    collections: string[];
    collectionMap: Record<string, string>; // Aggressive Sync Payload
};

export class CreateCollectionCapability implements ICapability<CreateCollectionPayload, CreateCollectionResult> {
    readonly id = "create-collection-v1";
    readonly commandId = "CREATE_COLLECTION";
    readonly description = "Creates a new variable collection in Figma";

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true; // Available in any context
    }

    async execute(payload: CreateCollectionPayload, _context: AgentContext): Promise<Result<CreateCollectionResult>> {
        try {
            // 1. Validate name
            const name = payload.name?.trim();
            if (!name) {
                return Result.fail("Collection name cannot be empty");
            }

            // 2. ISOLATION: Explicitly ignore Active Context
            figma.currentPage.selection = [];

            // 3. Create collection via Figma API
            const collection = figma.variables.createVariableCollection(name);

            // Restore selection? User said "Clear the selection", so we leave it cleared or restore if we want to be nice.
            // "Ensure it clears the selection or passes null". I'll leave it cleared to be safe against "Context Leak".

            // 4. Ensure a default mode exists for better UX
            if (collection.modes.length === 0) {
                collection.addMode("Default");
            }

            console.log(`[Vibe] Created Collection: ${collection.name} (ID: ${collection.id})`);

            // 5. AGGRESSIVE SYNC: Fetch fresh state immediately
            // The user said: "Chain Sync... Trigger a data refresh."
            const stats = await this.syncService.getStats();

            // We also trigger a token sync just in case, though strictly not needed for just a collection.
            // asking syncService to sync() usually sends a message, but here we just want the data.
            // We will return the updated collection names directly.

            return Result.ok({
                message: `✅ Collection '${name}' Created`,
                collectionId: collection.id,
                collections: Object.keys(stats.collectionMap),
                collectionMap: stats.collectionMap // FRESH DATA
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[CreateCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to create collection: ${message}`);
        }
    }
}
