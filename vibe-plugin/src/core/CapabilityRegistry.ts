import type { ICapability, AgentContext, CapabilityError } from './interfaces/ICapability';
import type { PluginAction } from '../shared/types';
import type { Result } from '../shared/utils/Result';
import { err } from '../shared/utils/Result';

/**
 * CapabilityRegistry - The Plugin System Router
 * 
 * Replaces the massive switch statement in controller.ts with a clean,
 * extensible plugin architecture.
 * 
 * Features:
 * - Dynamic capability registration
 * - Automatic command routing
 * - Precondition validation
 * - Structured error handling
 * 
 * @example
 * ```typescript
 * const registry = new CapabilityRegistry();
 * registry.register(new ScanCapability());
 * registry.register(new RenameCapability());
 * 
 * const result = await registry.dispatch(action, context);
 * if (result.isErr()) {
 *   console.error(result.error);
 * }
 * ```
 */
export class CapabilityRegistry {
    private capabilities = new Map<string, ICapability>();
    private commandMap = new Map<string, ICapability>();

    /**
     * Register a new capability
     * @throws if duplicate command handlers detected
     */
    register(capability: ICapability): void {
        // Prevent duplicate capability IDs
        if (this.capabilities.has(capability.id)) {
            throw new Error(
                `Capability '${capability.id}' is already registered. ` +
                `Each capability must have a unique ID.`
            );
        }

        // Map each command type to this capability
        for (const commandType of capability.handles) {
            if (this.commandMap.has(commandType)) {
                const existing = this.commandMap.get(commandType)!;
                throw new Error(
                    `Command '${commandType}' already handled by '${existing.id}'. ` +
                    `Cannot register duplicate handler '${capability.id}'.`
                );
            }
            this.commandMap.set(commandType, capability);
        }

        this.capabilities.set(capability.id, capability);

        console.log(
            `[Registry] Registered capability '${capability.displayName}' ` +
            `handling: [${capability.handles.join(', ')}]`
        );
    }

    /**
     * Unregister a capability (useful for testing or hot-reload)
     */
    unregister(capabilityId: string): boolean {
        const capability = this.capabilities.get(capabilityId);
        if (!capability) return false;

        // Remove command mappings
        for (const commandType of capability.handles) {
            this.commandMap.delete(commandType);
        }

        this.capabilities.delete(capabilityId);
        return true;
    }

    /**
     * Main dispatch method - routes command to appropriate capability
     */
    async dispatch(
        action: PluginAction,
        context: AgentContext
    ): Promise<Result<unknown, CapabilityError>> {
        const startTime = performance.now();

        // Find handler for this command type
        const capability = this.commandMap.get(action.type);

        if (!capability) {
            const error = new CapabilityError(
                'NO_HANDLER',
                `No capability registered to handle command: ${action.type}`,
                'error',
                false
            );
            return err(error);
        }

        // Precondition check
        if (!capability.canExecute(context)) {
            const error = new CapabilityError(
                'PRECONDITION_FAILED',
                `Capability '${capability.id}' cannot execute in current state`,
                'warning',
                true
            );
            context.logger.warn(
                `Precondition failed for ${action.type}`,
                { capabilityId: capability.id }
            );
            return err(error);
        }

        // Execute capability
        try {
            context.logger.info(
                `Executing ${action.type}`,
                { capabilityId: capability.id }
            );

            const result = await capability.execute(action, context);

            const duration = performance.now() - startTime;
            context.logger.info(
                `Completed ${action.type} in ${duration.toFixed(2)}ms`,
                { capabilityId: capability.id, success: result.isOk() }
            );

            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            context.logger.error(
                `Capability '${capability.id}' threw unexpected error`,
                error as Error,
                { action: action.type, duration }
            );

            // Wrap raw errors
            const capabilityError = new CapabilityError(
                'EXECUTION_ERROR',
                error instanceof Error ? error.message : String(error),
                'critical',
                false
            );

            return err(capabilityError);
        }
    }

    /**
     * Get all registered capabilities (for debugging/UI)
     */
    getAll(): ICapability[] {
        return Array.from(this.capabilities.values());
    }

    /**
     * Get capability by ID
     */
    get(id: string): ICapability | undefined {
        return this.capabilities.get(id);
    }

    /**
     * Check if a command type is handled
     */
    hasHandler(commandType: string): boolean {
        return this.commandMap.has(commandType);
    }
}
