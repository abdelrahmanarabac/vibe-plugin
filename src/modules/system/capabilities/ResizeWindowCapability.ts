import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

export class ResizeWindowCapability implements ICapability {
    readonly id = 'system-resize-window';
    readonly commandId = 'RESIZE_WINDOW';
    readonly description = 'Resizes the plugin window.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: { width: number; height: number }, _context: AgentContext): Promise<Result<void>> {
        try {
            if (payload && typeof payload.width === 'number' && typeof payload.height === 'number') {
                figma.ui.resize(payload.width, payload.height);
                return Result.ok(undefined);
            }
            return Result.fail('Invalid resize dimensions');
        } catch (e: any) {
            return Result.fail(e.message);
        }
    }
}
