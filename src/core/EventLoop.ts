/**
 * 🔄 EventLoop
 * Manages background processes and polling intervals alongside the main thread.
 * Decouples "Infrastructure" (setInterval) from "Application Logic" (Controller).
 */
export class EventLoop {
    private syncIntervalId: number | null = null;
    private lastVariableHash: string = '';
    private readonly INTERVAL_MS = 1000;

    // Explicitly declare property to satisfy erasableSyntaxOnly
    private readonly onSyncNeeded: () => Promise<void>;

    constructor(
        onSyncNeeded: () => Promise<void>
    ) {
        this.onSyncNeeded = onSyncNeeded;
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
            // Check for potential changes in Figma variables
            // Note: This relies on the global 'figma' object, which is acceptable for this Plugin-specific core component.
            const vars = await figma.variables.getLocalVariablesAsync();
            const currentHash = this.computeVariableHash(vars);

            if (currentHash !== this.lastVariableHash) {
                // Change detected
                if (this.lastVariableHash !== '') {
                    // Log only if it's not the initial load check
                    console.log('[EventLoop] Change detected in variables. Triggering sync.');
                }
                this.lastVariableHash = currentHash;
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
            } catch (e) {
                // Fallback for safety
                return v.id;
            }
        }).join('|');
    }
}
