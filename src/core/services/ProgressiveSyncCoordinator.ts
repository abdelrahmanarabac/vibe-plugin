import { logger } from './Logger';
import type { TokenEntity } from '../types';

export interface SyncProgress {
    phase: 'definitions' | 'usage' | 'complete';
    current: number;
    total: number;
    percentage: number;
    chunksProcessed: number;
    estimatedTimeRemaining?: number;
}

export interface SyncChunk {
    tokens: TokenEntity[];
    chunkIndex: number;
    isLast: boolean;
}

/**
 * 🧠 ProgressiveSyncCoordinator (Ghobghabi Edition)
 * * Implements "Context-Driven Sync" with Adaptive Frame Budgeting & Minimal Overhead.
 * - Respects 16ms frame budget (60fps target).
 * - Batches chunks dynamically to avoid yield thrashing AND small chunk spam.
 * - Yields preemptively if processing gets heavy.
 * - Eliminates dead code (MIN_CHUNK_SIZE was unused!).
 */
export class ProgressiveSyncCoordinator {
    private isRunning = false;
    private shouldCancel = false;
    private startTime = 0;
    private processedCount = 0;

    // ⚡ GHOBGHABI CONFIG: Adaptive Budgeting
    private readonly FRAME_BUDGET_MS = 12; // Leave 4ms overhead for UI rendering
    private readonly MIN_FLUSH_SIZE = 50;  // Avoid sending tiny chunks (reduce postMessage overhead)
    private readonly MAX_FLUSH_SIZE = 200; // Hard cap to prevent memory spikes

    private onProgress?: (progress: SyncProgress) => void;
    private onChunk?: (chunk: SyncChunk) => void;
    private onComplete?: () => void;
    private onError?: (error: Error) => void;

    async start(
        syncGenerator: AsyncGenerator<TokenEntity[]>,
        options: {
            onProgress?: (progress: SyncProgress) => void;
            onChunk?: (chunk: SyncChunk) => void;
            onComplete?: () => void;
            onError?: (error: Error) => void;
            estimatedTotal?: number;
        }
    ): Promise<void> {
        if (this.isRunning) {
            logger.warn('sync-coordinator', 'Sync already running');
            return;
        }

        this.isRunning = true;
        this.shouldCancel = false;
        this.startTime = Date.now();
        this.processedCount = 0;

        this.onProgress = options.onProgress;
        this.onChunk = options.onChunk;
        this.onComplete = options.onComplete;
        this.onError = options.onError;

        try {
            await this.processGenerator(syncGenerator, options.estimatedTotal);
        } catch (error) {
            // 🔍 ENHANCED ERROR LOGGING
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            const errorName = error instanceof Error ? error.name : 'Unknown';

            logger.error('sync-coordinator', 'Sync failed', {
                error,
                errorName,
                errorMessage,
                errorStack
            });

            console.error('[ProgressiveSyncCoordinator] Full error details:', {
                name: errorName,
                message: errorMessage,
                stack: errorStack,
                raw: error
            });

            this.onError?.(error instanceof Error ? error : new Error(String(error)));
        } finally {
            this.isRunning = false;
        }
    }

    cancel(): void {
        if (!this.isRunning) return;
        this.shouldCancel = true;
    }

    private async processGenerator(
        generator: AsyncGenerator<TokenEntity[]>,
        estimatedTotal?: number
    ): Promise<void> {
        let chunkIndex = 0;
        let pendingTokens: TokenEntity[] = [];
        let lastYieldTime = Date.now();

        for await (const incomingChunk of generator) {
            if (this.shouldCancel) {
                logger.info('sync-coordinator', 'Sync canceled');
                return;
            }

            // 🛡️ SAFETY: Prevent ReferenceError if generator yields null/undefined/non-array
            if (!incomingChunk || !Array.isArray(incomingChunk)) {
                logger.warn('sync-coordinator', 'Skipping invalid chunk (not an array)', { chunk: incomingChunk });
                continue;
            }

            // 1. Accumulate tokens
            pendingTokens.push(...incomingChunk);

            const now = Date.now();
            const timeInFrame = now - lastYieldTime;

            // ⚡ GHOBGHABI LOGIC: 
            // Yield if we exceeded frame budget OR hit hard cap.
            // But ONLY if we have enough to meet minimum flush size.
            const shouldYield =
                timeInFrame >= this.FRAME_BUDGET_MS ||
                pendingTokens.length >= this.MAX_FLUSH_SIZE;

            if (shouldYield && pendingTokens.length >= this.MIN_FLUSH_SIZE) {
                await this.flushChunk(pendingTokens, ++chunkIndex, false, estimatedTotal);
                pendingTokens = []; // Clear buffer

                // 🛑 Force yield to main thread to let UI breathe
                await this.yieldToMain();
                lastYieldTime = Date.now(); // Reset frame timer
            }
        }

        // Flush remaining tokens (even if < MIN_FLUSH_SIZE, because it's the last batch)
        if (pendingTokens.length > 0) {
            await this.flushChunk(pendingTokens, ++chunkIndex, true, estimatedTotal);
        }

        this.onComplete?.();
        logger.info('sync-coordinator', `Sync complete: ${this.processedCount} tokens in ${Date.now() - this.startTime}ms`);
    }

    private async flushChunk(
        tokens: TokenEntity[],
        index: number,
        isLast: boolean,
        total?: number
    ): Promise<void> {
        this.processedCount += tokens.length;

        // Send to UI
        this.onChunk?.({
            tokens,
            chunkIndex: index,
            isLast
        });

        // Update Stats
        this.notifyProgress('definitions', total);
    }

    /**
     * Yield control to main thread
     * Uses setTimeout to break the microtask queue
     */
    private async yieldToMain(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }

    private notifyProgress(phase: SyncProgress['phase'], total?: number): void {
        if (!this.onProgress) return;

        const elapsed = Date.now() - this.startTime;
        const rate = elapsed > 0 ? this.processedCount / (elapsed / 1000) : 0;
        const remaining = total ? total - this.processedCount : 0;

        this.onProgress({
            phase,
            current: this.processedCount,
            total: total || this.processedCount,
            percentage: total ? Math.min(100, (this.processedCount / total) * 100) : 0,
            chunksProcessed: 0, // Deprecated/Not relevant in dynamic mode
            estimatedTimeRemaining: rate > 0 ? (remaining / rate) * 1000 : undefined
        });
    }
}
