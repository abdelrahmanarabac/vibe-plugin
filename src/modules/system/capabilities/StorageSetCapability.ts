import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

type StorageSetPayload = { key: string; value: unknown };

export class StorageSetCapability implements ICapability<StorageSetPayload, void> {
    readonly id = 'system-storage-set';
    readonly commandId = 'STORAGE_SET';
    readonly description = 'Saves a value to client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: StorageSetPayload, _context: AgentContext): Promise<Result<void>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            await figma.clientStorage.setAsync(payload.key, payload.value);

            // Special notification logic from original controller (could be moved to UI or kept here)
            if (payload.key === 'VIBE_API_KEY') {
                figma.notify('✅ API Key Saved');
            }

            return Result.ok(undefined);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Storage set failed';
            return Result.fail(message);
        }
    }
}
