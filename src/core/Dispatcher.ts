import type { PluginAction } from '../shared/types';
import type { AgentContext } from './AgentContext';
import type { CapabilityRegistry } from './CapabilityRegistry';

/**
 * ⚡ Dispatcher
 * The central nervous system for routing UI messages to specific Capabilities.
 * Enforces a strict boundary between "Action" (UI) and "Execution" (Domain).
 */
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
            console.warn(`[Dispatcher] No capability found for command: ${msg.type}`);
            return;
        }

        console.log(`[Dispatcher] Routing ${msg.type} -> ${capability.id}`);

        // 2. Validate Context
        if (!capability.canExecute(context)) {
            console.warn(`[Dispatcher] Capability ${capability.id} declined execution context.`);
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
            console.error(`[Dispatcher] Capability failed:`, result.error);
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: `❌ Action failed: ${result.error}`, type: 'error' }
            });
        }
    }

    private sendSuccess(type: string, payload: any) {
        figma.ui.postMessage({
            type: `${type}_SUCCESS`,
            payload: payload,
            timestamp: Date.now()
        });
    }

    private handleSideEffects(value: any) {
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
