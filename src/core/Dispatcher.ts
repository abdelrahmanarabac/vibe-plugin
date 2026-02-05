import type { PluginAction } from '../shared/types';
import type { AgentContext } from './AgentContext';
import type { CapabilityRegistry } from './CapabilityRegistry';
import { logger } from './services/Logger';
import { ProgressiveSyncCoordinator } from './services/ProgressiveSyncCoordinator';

export class Dispatcher {
    private readonly registry: CapabilityRegistry;
    private readonly syncCoordinator: ProgressiveSyncCoordinator;

    constructor(registry: CapabilityRegistry) {
        this.registry = registry;
        this.syncCoordinator = new ProgressiveSyncCoordinator();
    }

    /**
     * Routes an incoming message to the appropriate capability.
     */
    public async dispatch(msg: PluginAction, context: AgentContext): Promise<void> {
        // 🚀 Special handling for SYNC commands
        if (msg.type === 'SYNC_TOKENS' || msg.type === 'SYNC_VARIABLES') {
            return this.handleProgressiveSync(msg, context);
        }

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

    /**
     * 🚀 Handle progressive sync with streaming
     */
    private async handleProgressiveSync(msg: PluginAction, context: AgentContext): Promise<void> {
        // Get the sync capability
        const capability = this.registry.getByCommand(msg.type);
        if (!capability) {
            logger.error('dispatcher', 'Sync capability not found');
            return;
        }

        // Check if we can execute
        if (!capability.canExecute(context)) {
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: '⚠️ Cannot sync in current context', type: 'warning' }
            });
            return;
        }

        try {
            // Get the sync generator from SyncService
            // Note: Assuming CompositionRoot is available via dynamic import or similar mechanism 
            // if we want to avoid circular deps, OR if context provides access to services.
            // Using dynamic import for CompositionRoot to access the singleton.
            const { CompositionRoot } = await import('./CompositionRoot');
            const root = CompositionRoot.getInstance();
            const generator = root.syncService.syncDefinitionsGenerator();

            // Estimate total (optional, can be passed from UI)
            const stats = await root.syncService.getStats();
            const estimatedTotal = stats.totalVariables;

            // Start progressive sync
            await this.syncCoordinator.start(generator, {
                estimatedTotal,

                onProgress: (progress) => {
                    figma.ui.postMessage({
                        type: 'SYNC_PROGRESS',
                        payload: progress
                    });
                },

                onChunk: (chunk) => {
                    figma.ui.postMessage({
                        type: 'SYNC_CHUNK',
                        payload: chunk
                    });
                },

                onComplete: () => {
                    figma.ui.postMessage({
                        type: 'SYNC_COMPLETE',
                        payload: {
                            totalTokens: context.repository.getAllNodes().length,
                            message: '✅ Sync complete!'
                        }
                    });

                    // Start usage analysis in background (non-blocking)
                    this.lazyLoadUsageAnalysis();
                },

                onError: (error) => {
                    logger.error('dispatcher', 'Progressive sync failed', { error });
                    figma.ui.postMessage({
                        type: 'OMNIBOX_NOTIFY',
                        payload: {
                            message: `❌ Sync failed: ${error.message}`,
                            type: 'error'
                        }
                    });
                }
            });

        } catch (error) {
            logger.error('dispatcher', 'Failed to start progressive sync', { error });
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: {
                    message: '❌ Failed to start sync',
                    type: 'error'
                }
            });
        }
    }

    /**
     * 🧠 Lazy load usage analysis (runs in background after definitions loaded)
     */
    private async lazyLoadUsageAnalysis(): Promise<void> {
        try {
            const { CompositionRoot } = await import('./CompositionRoot');
            const root = CompositionRoot.getInstance();

            // Notify UI that usage analysis started
            figma.ui.postMessage({
                type: 'USAGE_ANALYSIS_STARTED',
                payload: { message: '🔍 Analyzing token usage...' }
            });

            // Run usage analysis (can be slow, but runs after UI is already populated)
            await root.syncService.scanUsage();

            // Notify completion
            figma.ui.postMessage({
                type: 'USAGE_ANALYSIS_COMPLETE',
                payload: { message: '✅ Usage analysis complete' }
            });

        } catch (error) {
            logger.error('dispatcher', 'Usage analysis failed', { error });
            // Don't show error to user - it's a background task
        }
    }

    /**
     * Cancel ongoing sync
     */
    public cancelSync(): void {
        this.syncCoordinator.cancel();
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: '⏹️ Sync canceled', type: 'info' }
        });
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
