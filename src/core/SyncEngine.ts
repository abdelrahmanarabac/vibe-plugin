import { logger } from './services/Logger';

/**
 * 🔄 SyncEngine
 * Orchestrates background synchronization between the Plugin environment and the UI.
 * Monitors for external changes (Figma variables, collections) and triggers updates.
 */
export class SyncEngine {
    private syncIntervalId: number | null = null;
    private lastVariableHash: string = '';
    private lastCollectionHash: string = '';
    private readonly INTERVAL_MS = 1000;

    private onSyncNeeded: () => Promise<void>;

    constructor(onSyncNeeded: () => Promise<void>) {
        this.onSyncNeeded = onSyncNeeded;
    }

    public setCallback(callback: () => Promise<void>) {
        this.onSyncNeeded = callback;
    }

    /**
     * Ignatius the background synchronization engine.
     */
    public start(): void {
        if (this.syncIntervalId !== null) return;

        logger.info('sync', 'Ignition sequence started');

        this.syncIntervalId = setInterval(async () => {
            await this.tick();
        }, this.INTERVAL_MS) as unknown as number;
    }

    /**
     * Halts the synchronization engine.
     */
    public stop(): void {
        if (this.syncIntervalId !== null) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            logger.info('sync', 'Engine shutting down');
        }
    }

    /**
     * Execution tick.
     */
    private async tick(): Promise<void> {
        try {
            // Check for potential changes in Figma variables and Collections
            const vars = await figma.variables.getLocalVariablesAsync();
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            const currentHash = this.computeVariableHash(vars);
            const currentCollectionHash = this.computeCollectionHash(collections);

            let hasChanges = false;

            if (currentHash !== this.lastVariableHash) {
                if (this.lastVariableHash !== '') {
                    logger.debug('sync:drift', 'Variable drift detected');
                    hasChanges = true;
                }
                this.lastVariableHash = currentHash;
            }

            if (currentCollectionHash !== this.lastCollectionHash) {
                if (this.lastCollectionHash !== '') {
                    logger.debug('sync:drift', 'Collection drift detected');
                    hasChanges = true;
                }
                this.lastCollectionHash = currentCollectionHash;
            }

            if (hasChanges) {
                logger.debug('sync', 'Triggering synchronization protocol');
                await this.onSyncNeeded();
            }

        } catch (error) {
            logger.error('sync', 'Critical tick failure', { error });
        }
    }

    /**
     * Generates a structural fingerprint for variables.
     */
    private computeVariableHash(variables: Variable[]): string {
        return variables.map(v => {
            try {
                return `${v.id}:${v.name}:${v.resolvedType}:${JSON.stringify(v.valuesByMode)}`;
            } catch {
                return v.id;
            }
        }).join('|');
    }

    /**
     * Generates a structural fingerprint for collections.
     */
    private computeCollectionHash(collections: VariableCollection[]): string {
        return collections.map(c => {
            try {
                return `${c.id}:${c.name}:${c.modes.length}`;
            } catch {
                return c.id;
            }
        }).join('|');
    }
}
