/**
 * 🔧 Token Worker Manager
 * 
 * Easy-to-use wrapper for the Token Processing Worker.
 * Handles worker lifecycle and provides type-safe API.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TokenEntity } from '../../core/types';
import type { WorkerMessage, WorkerResponse, FilterCriteria } from '../../workers/token.worker';

// Define a type for the worker message event
type WorkerMessageEvent = MessageEvent<WorkerResponse & { _id?: number }>;

export class TokenWorkerManager {
    private worker: Worker | null = null;
    private messageId = 0;
    private pendingRequests = new Map<number, {
        resolve: (value: any) => void;
        reject: (error: Error) => void;
    }>();

    /**
     * Initialize the worker
     */
    init(): void {
        if (this.worker) return;

        try {
            // Create worker from file
            // Note: In Vite/Webpack for Figma plugins, we usually need a specific loader or URL handling
            // Assuming standard Vite URL import for now.
            this.worker = new Worker(
                new URL('../../workers/token.worker.ts', import.meta.url),
                { type: 'module' }
            );

            // Handle messages from worker
            this.worker.onmessage = (event: WorkerMessageEvent) => {
                const { _id, type, payload } = event.data;

                if (!_id) {
                    console.warn('[TokenWorker] Received message without ID', event.data);
                    return;
                }

                const request = this.pendingRequests.get(_id);
                if (!request) {
                    console.warn('[TokenWorker] No pending request for ID', _id);
                    return;
                }

                this.pendingRequests.delete(_id);

                if (type === 'ERROR') {
                    request.reject(new Error((payload as any).message));
                } else {
                    request.resolve(payload);
                }
            };

            // Handle worker errors
            this.worker.onerror = (error) => {
                console.error('[TokenWorker] Worker error:', error);
                this.pendingRequests.forEach(({ reject }) => {
                    reject(new Error('Worker error'));
                });
                this.pendingRequests.clear();
            };

            console.log('[TokenWorker] Worker initialized');

        } catch (e) {
            console.error('[TokenWorker] Failed to init worker:', e);
        }
    }

    /**
     * Send message to worker and get response
     */
    private async sendMessage<T>(message: WorkerMessage): Promise<T> {
        if (!this.worker) {
            // Try to init if missing
            this.init();
            if (!this.worker) {
                // Fallback or error? For now error.
                throw new Error('Worker not initialized.');
            }
        }

        return new Promise<T>((resolve, reject) => {
            const id = ++this.messageId;

            this.pendingRequests.set(id, { resolve, reject });

            this.worker!.postMessage({
                ...message,
                _id: id
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                if (this.pendingRequests.has(id)) {
                    this.pendingRequests.delete(id);
                    reject(new Error('Worker request timeout'));
                }
            }, 30000);
        });
    }

    /**
     * Index tokens for fast search
     */
    async indexTokens(tokens: TokenEntity[]): Promise<void> {
        // console.log(`[TokenWorker] Indexing ${tokens.length} tokens in background...`);
        await this.sendMessage({
            type: 'INDEX_TOKENS',
            payload: tokens
        });
    }

    /**
     * Search tokens using worker
     */
    async search(query: string, tokens: TokenEntity[]): Promise<TokenEntity[]> {
        if (!query.trim()) return tokens;

        return this.sendMessage<TokenEntity[]>({
            type: 'SEARCH',
            payload: { query, tokens }
        });
    }

    /**
     * Analyze token dependencies
     */
    async analyzeDependencies(
        tokenId: string,
        tokens: TokenEntity[]
    ): Promise<{ ancestors: TokenEntity[]; descendants: TokenEntity[] }> {
        return this.sendMessage({
            type: 'ANALYZE_DEPENDENCIES',
            payload: { tokenId, tokens }
        });
    }

    /**
     * Filter tokens by criteria
     */
    async filterTokens(filter: FilterCriteria, tokens: TokenEntity[]): Promise<TokenEntity[]> {
        return this.sendMessage<TokenEntity[]>({
            type: 'FILTER_TOKENS',
            payload: { filter, tokens }
        });
    }

    /**
     * Terminate worker
     */
    terminate(): void {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.pendingRequests.clear();
        }
    }
}

// Singleton instance
export const tokenWorker = new TokenWorkerManager();

// Auto-initialize on import
tokenWorker.init();

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        tokenWorker.terminate();
    });
}
