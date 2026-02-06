/**
 * 🎨 UISyncManager (UI Thread)
 * 
 * Manages progressive sync on the UI side with:
 * - Incremental DOM updates
 * - Virtual scrolling integration
 * - Optimistic rendering
 * - Background index building
 */

import type { TokenEntity } from '../../core/types';
import { tokenWorker } from './TokenWorkerManager';

export interface TokenChunk {
    tokens: TokenEntity[];
    chunkIndex: number;
    isLast: boolean;
}

export interface SyncState {
    isLoading: boolean;
    phase: 'idle' | 'definitions' | 'usage' | 'indexing' | 'complete';
    progress: number;
    totalTokens: number;
    loadedTokens: number;
    estimatedRemaining?: number;
}

export class UISyncManager {
    private tokens: TokenEntity[] = [];
    private tokenIndex = new Map<string, number>(); // Fast lookup: id -> array index
    private existingIds = new Set<string>(); // ✅ NEW: Track added token IDs for deduplication
    private searchIndex: Map<string, Set<number>> = new Map(); // keyword -> token indices

    private state: SyncState = {
        isLoading: false,
        phase: 'idle',
        progress: 0,
        totalTokens: 0,
        loadedTokens: 0
    };

    private subscribers: Set<(state: SyncState) => void> = new Set();
    private tokenSubscribers: Set<(tokens: TokenEntity[]) => void> = new Set();

    /**
     * Subscribe to sync state changes
     */
    onStateChange(callback: (state: SyncState) => void): () => void {
        this.subscribers.add(callback);
        callback(this.state); // Immediate call with current state

        return () => this.subscribers.delete(callback);
    }

    /**
     * Subscribe to token updates (for virtual scroll)
     */
    onTokensUpdate(callback: (tokens: TokenEntity[]) => void): () => void {
        this.tokenSubscribers.add(callback);
        callback(this.tokens); // Immediate call

        return () => this.tokenSubscribers.delete(callback);
    }

    /**
     * Start receiving chunks from plugin
     */
    startSync(estimatedTotal?: number): void {
        this.tokens = [];
        this.tokenIndex.clear();
        this.existingIds.clear(); // ✅ RESET: Clear the deduplication set
        this.searchIndex.clear();

        this.updateState({
            isLoading: true,
            phase: 'definitions',
            progress: 0,
            totalTokens: estimatedTotal || 0,
            loadedTokens: 0
        });

        // Listen for chunks from plugin
        window.addEventListener('message', this.handleMessage);
    }

    /**
     * Handle incoming chunk from plugin
     */
    private handleMessage = (event: MessageEvent): void => {
        const msg = event.data.pluginMessage;

        if (!msg) return;

        switch (msg.type) {
            case 'SYNC_CHUNK':
                this.handleChunk(msg.payload);
                break;
            case 'SYNC_PROGRESS':
                this.handleProgress(msg.payload);
                break;
            case 'SYNC_COMPLETE':
                this.handleComplete();
                break;
            case 'USAGE_ANALYSIS_STARTED':
                this.updateState({ phase: 'usage' });
                break;
            case 'USAGE_ANALYSIS_COMPLETE':
                this.updateState({ phase: 'complete' });
                break;
        }
    };

    /**
     * Process incoming token chunk
     */
    private handleChunk(chunk: TokenChunk): void {
        const startIndex = this.tokens.length;
        const newTokens: TokenEntity[] = [];

        // ✅ FILTER: Only add tokens we haven't seen before
        for (const token of chunk.tokens) {
            if (!this.existingIds.has(token.id)) {
                this.existingIds.add(token.id);
                newTokens.push(token);
            }
        }

        if (newTokens.length === 0) return; // Skip if all tokens are duplicates

        // Add confirmed unique tokens
        this.tokens.push(...newTokens);

        // Build fast lookup index for NEW tokens only
        newTokens.forEach((token, i) => {
            this.tokenIndex.set(token.id, startIndex + i);
        });

        // ✅ CRITICAL: Update total if we got more than expected
        const newTotal = Math.max(
            this.state.totalTokens,
            this.tokens.length
        );

        // Update state
        this.updateState({
            totalTokens: newTotal,
            loadedTokens: this.tokens.length,
            progress: newTotal > 0
                ? Math.min(100, (this.tokens.length / newTotal) * 100)
                : 0
        });

        // ✅ Notify subcribers immediately
        this.notifyTokenSubscribers();

        // Background indexing (non-blocking) - Only index NEW tokens
        tokenWorker.indexTokens(newTokens).catch(console.error);
    }

    /**
     * Handle progress update
     */
    private handleProgress(progress: {
        current: number;
        total: number;
        percentage: number;
        estimatedTimeRemaining?: number;
    }): void {
        this.updateState({
            totalTokens: progress.total,
            loadedTokens: progress.current,
            progress: progress.percentage,
            estimatedRemaining: progress.estimatedTimeRemaining
        });
    }

    /**
     * Handle sync completion
     */
    private handleComplete(): void {
        // ✅ FIX: Make sure we have the final count
        const finalCount = this.tokens.length;

        this.updateState({
            isLoading: false,  // ← Stop spinner
            phase: 'complete',
            progress: 100,
            totalTokens: finalCount,      // ← Update to actual
            loadedTokens: finalCount
        });

        // ✅ Final notification to ensure UI updates
        this.notifyTokenSubscribers();

        console.log(`[UISyncManager] Sync complete: ${finalCount} tokens loaded`);
    }

    /**
     * Fast search using worker
     */
    async search(query: string): Promise<TokenEntity[]> {
        if (!query) return this.tokens;

        this.updateState({ isLoading: true }); // Show spinner on search? Maybe not needed if fast.
        try {
            return await tokenWorker.search(query, this.tokens);
        } finally {
            this.updateState({ isLoading: false });
        }
    }

    /**
     * Get token by ID (O(1) lookup)
     */
    getTokenById(id: string): TokenEntity | undefined {
        const index = this.tokenIndex.get(id);
        return index !== undefined ? this.tokens[index] : undefined;
    }

    /**
     * Get all tokens (for virtual scroll)
     */
    getTokens(): TokenEntity[] {
        return this.tokens;
    }

    /**
     * Get current state
     */
    getState(): SyncState {
        return { ...this.state };
    }

    /**
     * Update state and notify subscribers
     */
    private updateState(partial: Partial<SyncState>): void {
        this.state = { ...this.state, ...partial };
        this.subscribers.forEach(sub => sub(this.state));
    }

    /**
     * Notify token subscribers
     */
    private notifyTokenSubscribers(): void {
        this.tokenSubscribers.forEach(sub => sub(this.tokens));
    }

    /**
     * Clear all data
     */
    reset(): void {
        this.tokens = [];
        this.tokenIndex.clear();
        this.searchIndex.clear();

        this.updateState({
            isLoading: false,
            phase: 'idle',
            progress: 0,
            totalTokens: 0,
            loadedTokens: 0
        });

        this.existingIds.clear(); // ✅ Extra safety: clear on reset

        window.removeEventListener('message', this.handleMessage);
    }
}

// Singleton instance
export const uiSyncManager = new UISyncManager();
