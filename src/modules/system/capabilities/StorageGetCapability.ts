import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

export class StorageGetCapability implements ICapability {
    readonly id = 'system-storage-get';
    readonly commandId = 'STORAGE_GET';
    readonly description = 'Retrieves a value from client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { key: string }, _context: AgentContext): Promise<Result<{ key: string; value: any }>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            const value = await figma.clientStorage.getAsync(payload.key);
            // We return the key and value so the UI knows what was requested
            // Dispatcher will send STORAGE_GET_SUCCESS with this payload.
            return Result.ok({ key: payload.key, value: value || null });
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
