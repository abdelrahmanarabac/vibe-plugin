import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/utils/Result';

type ResizePayload = { width: number; height: number };

export class ResizeWindowCapability implements ICapability<ResizePayload, void> {
    readonly id = 'system-resize-window';
    readonly commandId = 'RESIZE_WINDOW';
    readonly description = 'Resizes the plugin window.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: ResizePayload, _context: AgentContext): Promise<Result<void>> {
        try {
            // Check if payload exists and has correct types (runtime check)
            if (payload && typeof payload.width === 'number' && typeof payload.height === 'number') {
                figma.ui.resize(payload.width, payload.height);
                return Result.ok(undefined);
            }
            return Result.fail('Invalid resize dimensions');
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Resize failed';
            return Result.fail(message);
        }
    }
}
