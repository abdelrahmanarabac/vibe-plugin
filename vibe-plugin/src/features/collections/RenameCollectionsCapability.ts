import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import type { CollectionRenamer } from '../../modules/collections/adapters/CollectionRenamer';

export class RenameCollectionsCapability implements ICapability {
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

    async execute(payload: { dryRun?: boolean }, _context: AgentContext): Promise<Result<any>> {
        try {
            const isDryRun = payload?.dryRun ?? false;
            const result = await this.renamer.renameAll(isDryRun);

            if (!result.success && !isDryRun) {
                return Result.fail('Rename failed with errors');
            }

            return Result.ok(result);
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
