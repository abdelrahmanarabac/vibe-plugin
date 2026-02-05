import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { RenameResult } from '../types';
import type { CollectionRenamer } from '../adapters/CollectionRenamer';

type RenameCollectionsPayload = { dryRun?: boolean };

export class RenameCollectionsCapability implements ICapability<RenameCollectionsPayload, RenameResult> {
    readonly id = 'rename-collections-v1';
    readonly commandId = 'RENAME_COLLECTIONS';
    readonly description = 'Batch renames variable collections based on classification.';

    private renamer: CollectionRenamer;

    constructor(renamer: CollectionRenamer) {
        this.renamer = renamer;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: RenameCollectionsPayload, _context: AgentContext): Promise<Result<RenameResult>> {
        try {
            const isDryRun = payload?.dryRun ?? false;
            const result = await this.renamer.renameAll(isDryRun);

            if (!result.success && !isDryRun) {
                return Result.fail('Rename failed with errors');
            }

            return Result.ok(result);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message);
        }
    }
}
