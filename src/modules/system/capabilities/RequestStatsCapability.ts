import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';
import type { SyncService } from '../../../core/services/SyncService';

import type { SyncStats } from '../../../core/services/SyncService';

export class RequestStatsCapability implements ICapability {
    readonly id = 'system-request-stats';
    readonly commandId = 'REQUEST_STATS';
    readonly description = 'Retrieves current system statistics.';

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<SyncStats>> {
        try {
            const stats = await this.syncService.getStats();
            return Result.ok(stats);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Stats request failed';
            return Result.fail(message);
        }
    }
}
