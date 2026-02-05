import type { PluginAction } from '../shared/types';
import type { AgentContext } from './AgentContext';
import type { CapabilityRegistry } from './CapabilityRegistry';
import { logger } from './services/Logger';


export class Dispatcher {
    private readonly registry: CapabilityRegistry;

    constructor(registry: CapabilityRegistry) {
        this.registry = registry;
    }

    /**
     * Routes an incoming message to the appropriate capability.
     */
    public async dispatch(msg: PluginAction, context: AgentContext): Promise<void> {
        // 1. Identify Capability
        const capability = this.registry.getByCommand(msg.type);

        if (!capability) {
            logger.warn('dispatcher', `No capability found for command: ${msg.type}`);
            return;
        }

        logger.debug('dispatcher', `Routing ${msg.type} -> ${capability.id}`);

        // 2. Validate Context
        if (!capability.canExecute(context)) {
            logger.warn('dispatcher', `Capability ${capability.id} declined execution context`);
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: `⚠️ Cannot execute ${msg.type} in current context.`, type: 'warning' }
            });
            return;
        }

        // 3. Extract Payload (Defensive)
        const hasPayload = (m: PluginAction): m is PluginAction & { payload: unknown } => 'payload' in m;
        const payload = hasPayload(msg) ? msg.payload : msg;

        // 4. Execute
        const result = await capability.execute(payload, context);

        // 5. Handle Outcome
        if (result.success) {
            this.sendSuccess(msg.type, result.value);
            this.handleSideEffects(result.value);
        } else {
            logger.error('dispatcher', 'Capability failed', { capability: capability.id, error: result.error });
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: `❌ Action failed: ${result.error}`, type: 'error' }
            });
        }
    }

    private sendSuccess<T>(type: string, payload: T) {
        figma.ui.postMessage({
            type: `${type}_SUCCESS`,
            payload: payload,
            timestamp: Date.now()
        });
    }

    private handleSideEffects(value: unknown) {
        if (value && typeof value === 'object' && 'message' in value) {
            const msg = (value as Record<string, unknown>).message;
            if (typeof msg === 'string') {
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: { message: msg, type: 'info' }
                });
            }
        }
    }
}
