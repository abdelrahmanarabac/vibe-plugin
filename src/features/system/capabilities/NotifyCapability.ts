import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

type NotifyPayload = { message: string } | string;

export class NotifyCapability implements ICapability<NotifyPayload, void> {
    readonly id = 'system-notify';
    readonly commandId = 'NOTIFY';
    readonly description = 'Displays a notification in Figma.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: NotifyPayload, _context: AgentContext): Promise<Result<void>> {
        try {
            const message = typeof payload === 'string' ? payload : payload?.message;
            if (message) {
                // Send to UI for "Omnibox" display instead of native toast
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: {
                        message,
                        type: 'info'
                    }
                });
                return Result.ok(undefined);
            }
            return Result.fail('No message provided');
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Notification failed';
            return Result.fail(message);
        }
    }
}
