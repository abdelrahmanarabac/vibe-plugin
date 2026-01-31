/**
 * 🔄 EventLoop
 * Manages background processes and polling intervals alongside the main thread.
 * Decouples "Infrastructure" (setInterval) from "Application Logic" (Controller).
 */
export class EventLoop {
    private syncIntervalId: number | null = null;
    private lastVariableHash: string = '';
    private lastCollectionHash: string = '';
    private readonly INTERVAL_MS = 1000;

    // Explicitly declare property to satisfy erasableSyntaxOnly
    private onSyncNeeded: () => Promise<void>;

    constructor(
        onSyncNeeded: () => Promise<void>
    ) {
        this.onSyncNeeded = onSyncNeeded;
    }

    public setCallback(callback: () => Promise<void>) {
        this.onSyncNeeded = callback;
    }

    /**
     * Starts the background synchronization loop.
     */
    public start(): void {
        if (this.syncIntervalId !== null) return;

        console.log('[EventLoop] Starting background sync...');

        this.syncIntervalId = setInterval(async () => {
            await this.tick();
        }, this.INTERVAL_MS) as unknown as number;
    }

    /**
     * Stops the background synchronization loop.
     */
    public stop(): void {
        if (this.syncIntervalId !== null) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            console.log('[EventLoop] Background sync stopped.');
        }
    }

    /**
     * Single tick of the event loop.
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
                    console.log('[EventLoop] Change detected in variables.');
                    hasChanges = true;
                }
                this.lastVariableHash = currentHash;
            }

            if (currentCollectionHash !== this.lastCollectionHash) {
                if (this.lastCollectionHash !== '') {
                    console.log('[EventLoop] Change detected in collections.');
                    hasChanges = true;
                }
                this.lastCollectionHash = currentCollectionHash;
            }

            if (hasChanges) {
                console.log('[EventLoop] Triggering sync due to external changes.');
                await this.onSyncNeeded();
            }

        } catch (error) {
            console.error('[EventLoop] Error in tick:', error);
        }
    }

    /**
     * Computes a fingerprint of the current variables to detect changes/diffs.
     */
    private computeVariableHash(variables: Variable[]): string {
        return variables.map(v => {
            try {
                // We use ID + Name + Type + Values to detect structural or content changes
                return `${v.id}:${v.name}:${v.resolvedType}:${JSON.stringify(v.valuesByMode)}`;
            } catch {
                // Fallback for safety
                return v.id;
            }
        }).join('|');
    }

    /**
     * Computes a fingerprint of the current collections to detect renames or creations.
     */
    private computeCollectionHash(collections: VariableCollection[]): string {
        return collections.map(c => {
            try {
                // ID + Name + Modes check
                return `${c.id}:${c.name}:${c.modes.length}`;
            } catch {
                return c.id;
            }
        }).join('|');
    }
}
