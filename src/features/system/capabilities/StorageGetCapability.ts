import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

type StorageGetPayload = { key: string };
type StorageGetResult = { key: string; value: unknown };

export class StorageGetCapability implements ICapability<StorageGetPayload, StorageGetResult> {
    readonly id = 'system-storage-get';
    readonly commandId = 'STORAGE_GET';
    readonly description = 'Retrieves a value from client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: StorageGetPayload, _context: AgentContext): Promise<Result<StorageGetResult>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            const value = await figma.clientStorage.getAsync(payload.key);
            // We return the key and value so the UI knows what was requested
            // Dispatcher will send STORAGE_GET_SUCCESS with this payload.
            return Result.ok({ key: payload.key, value: value || null });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Storage get failed';
            return Result.fail(message);
        }
    }
}
