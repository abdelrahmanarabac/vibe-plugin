import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';
import { ProgressiveSyncCoordinator } from '../../../../core/services/ProgressiveSyncCoordinator';

export class SyncTokensCapability implements ICapability {
    readonly id = 'sync-tokens-v1';
    readonly commandId = 'SYNC_TOKENS';
    readonly description = 'Synchronizes all local variables from Figma to the Token Repository.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true; // Always allowed
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<{ count: number; timestamp: number }>> {
        console.log("🚀 Executing SyncTokensCapability (Ghobghabi Edition)...");

        // 🔒 SAFETY: Fail fast if API not available
        if (!figma.variables) {
            return Result.fail("Figma variables API not available. The plugin may be closing.");
        }

        const coordinator = new ProgressiveSyncCoordinator();

        return new Promise<Result<{ count: number; timestamp: number }>>((resolve) => {
            coordinator.start(this.variableManager.syncGenerator(), {
                onChunk: (chunk) => {
                    figma.ui.postMessage({
                        type: 'SYNC_CHUNK',
                        payload: {
                            tokens: chunk.tokens,
                            chunkIndex: chunk.chunkIndex,
                            isLast: chunk.isLast,
                            timestamp: Date.now()
                        }
                    });
                },
                onComplete: () => {
                    console.log("✅ Sync Complete via Coordinator.");
                    const timestamp = Date.now();

                    figma.ui.postMessage({
                        type: 'SYNC_COMPLETE',
                        payload: {
                            timestamp,
                            // Coordinator doesn't track total count in onComplete event args currently, 
                            // but UI tracks it via chunks. 
                            // We can optimize this later if needed.
                        }
                    });
                    resolve(Result.ok({ count: 0, timestamp })); // count 0 as placeholder since stream is async
                },
                onError: (error) => {
                    console.error("❌ SyncTokensCapability failed:", error);
                    resolve(Result.fail(error.message));
                }
            });
        });
    }
}
