import { logger } from './services/Logger';

/**
 * 🔄 SyncEngine
 * Orchestrates background synchronization between the Plugin environment and the UI.
 * Monitors for external changes (Figma variables, collections) and triggers updates.
 */
export class SyncEngine {
    // 🧠 Core Principle: Passive Execution Only
    // No setInterval. No auto-tick. No background polling.

    // 💀 neutered: callback is no longer stored or used.
    constructor(_onSyncNeeded: () => Promise<void>) {
        // no-op
    }

    public setCallback(_callback: () => Promise<void>) {
        // no-op
    }

    /**
     * @deprecated Background polling is BANNED by Core Directive.
     * This method is kept for interface compatibility but is a NO-OP.
     */
    public start(): void {
        logger.debug('sync', 'SyncEngine.start() called but neutralized (Manual Sync Only).');
    }

    /**
     * @deprecated Background polling is BANNED by Core Directive.
     */
    public stop(): void {
        // No-op
    }

    // 💀 Dead Code Removal: tick(), computeVariableHash(), computeCollectionHash()
    // We do NOT check for drift. We Wait for the Switch.
}
