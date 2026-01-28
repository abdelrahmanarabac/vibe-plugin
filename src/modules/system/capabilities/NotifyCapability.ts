import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

export class NotifyCapability implements ICapability {
    readonly id = 'system-notify';
    readonly commandId = 'NOTIFY';
    readonly description = 'Displays a notification in Figma.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { message: string } | any, _context: AgentContext): Promise<Result<void>> {
        try {
            const message = typeof payload === 'string' ? payload : payload?.message;
            if (message) {
                figma.notify(message);
                return Result.ok(undefined);
            }
            return Result.fail('No message provided');
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
