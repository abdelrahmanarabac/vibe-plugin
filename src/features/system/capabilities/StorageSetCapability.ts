import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

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

            // Special notification logic via Omnibox
            if (payload.key === 'VIBE_API_KEY') {
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: {
                        message: '✅ API Key Saved',
                        type: 'success'
                    }
                });
            }

            return Result.ok(undefined);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Storage set failed';
            return Result.fail(message);
        }
    }
}
