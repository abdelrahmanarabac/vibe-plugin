import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

export class StorageSetCapability implements ICapability {
    readonly id = 'system-storage-set';
    readonly commandId = 'STORAGE_SET';
    readonly description = 'Saves a value to client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { key: string; value: any }, _context: AgentContext): Promise<Result<void>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            await figma.clientStorage.setAsync(payload.key, payload.value);

            // Special notification logic from original controller (could be moved to UI or kept here)
            if (payload.key === 'VIBE_API_KEY') {
                figma.notify('✅ API Key Saved');
            }

            return Result.ok(undefined);
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
