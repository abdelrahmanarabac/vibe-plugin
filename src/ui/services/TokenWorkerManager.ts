import type { TokenEntity } from '../../core/types';

/**
 * 🛠️ TokenWorkerManager
 * 
 * Orchestrates communication between the UI Thread and the Token Background Worker.
 * Handles:
 * - Distributed Indexing (off-loading heavy work)
 * - Semantic & Fuzzy Search
 * - Usage Analysis delegation
 */
export class TokenWorkerManager {
    private worker: Worker | null = null;
    private searchCallbacks: Map<string, (results: TokenEntity[]) => void> = new Map();

    constructor() {
        this.initWorker();
    }

    private initWorker() {
        try {
            // Check if we are in a browser-like environment
            if (typeof Worker !== 'undefined') {
                // In Vite, we use ?worker to load it
                this.worker = new Worker(new URL('../../workers/token.worker.ts', import.meta.url), {
                    type: 'module'
                });

                this.worker.onmessage = this.handleWorkerMessage.bind(this);
                this.worker.onerror = (err) => {
                    console.error('[TokenWorkerManager] Worker Error:', err);
                };
            }
        } catch (error) {
            console.error('[TokenWorkerManager] Failed to initialize worker:', error);
        }
    }

    private handleWorkerMessage(event: MessageEvent) {
        const { type, payload, jobId } = event.data;

        switch (type) {
            case 'SEARCH_RESULTS':
                if (jobId && this.searchCallbacks.has(jobId)) {
                    this.searchCallbacks.get(jobId)!(payload);
                    this.searchCallbacks.delete(jobId);
                }
                break;
            case 'INDEX_COMPLETE':
                console.log('[TokenWorkerManager] Indexing complete');
                break;
            case 'ERROR':
                console.error('[TokenWorkerManager] Worker Reported Error:', payload);
                break;
        }
    }

    /**
     * Send tokens to worker for background indexing
     */
    async indexTokens(tokens: TokenEntity[]): Promise<void> {
        if (!this.worker) return;

        this.worker.postMessage({
            type: 'INDEX_TOKENS',
            payload: tokens
        });
    }

    /**
     * Perform search in background thread
     */
    async search(query: string, fallbackTokens: TokenEntity[]): Promise<TokenEntity[]> {
        if (!this.worker) {
            // Fallback to simple UI-thread search if worker failed
            const q = query.toLowerCase();
            return fallbackTokens.filter(t =>
                t.name.toLowerCase().includes(q) ||
                t.path.join('/').toLowerCase().includes(q)
            );
        }

        const jobId = Math.random().toString(36).substring(7);

        return new Promise((resolve) => {
            this.searchCallbacks.set(jobId, resolve);
            this.worker!.postMessage({
                type: 'SEARCH',
                payload: query,
                jobId
            });

            // Safety timeout
            setTimeout(() => {
                if (this.searchCallbacks.has(jobId)) {
                    this.searchCallbacks.delete(jobId);
                    resolve([]);
                }
            }, 5000);
        });
    }

    /**
     * Terminate worker
     */
    destroy() {
        this.worker?.terminate();
        this.worker = null;
    }
}

// Singleton instance
export const tokenWorker = new TokenWorkerManager();
