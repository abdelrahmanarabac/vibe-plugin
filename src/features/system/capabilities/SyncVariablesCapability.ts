import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';
import type { SyncService } from '../../../core/services/SyncService';

import type { TokenEntity } from '../../../core/types';

export class SyncVariablesCapability implements ICapability {
    readonly id = 'system-sync-variables';
    readonly commandId = 'SYNC_VARIABLES';
    readonly description = 'Synchronizes variables (alias for REQUEST_GRAPH).';

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<TokenEntity[]>> {
        try {
            const tokens = await this.syncService.sync();
            return Result.ok(tokens);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Sync variables failed';
            return Result.fail(message);
        }
    }
}
