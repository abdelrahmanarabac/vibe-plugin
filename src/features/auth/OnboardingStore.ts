/**
 * Onboarding Store
 * Manages persistent onboarding state via Figma ClientStorage Bridge
 * 
 * NOTE: Uses message passing to figma.clientStorage because localStorage
 * is disabled in the Figma UI 'data:' context.
 */

import { useState, useEffect } from 'react';

// ============================================================================
// 📊 STATE SCHEMA
// ============================================================================

/**
 * Persistent onboarding state schema
 */
export interface OnboardingState {
    /**
     * Schema version for future migrations
     */
    schemaVersion: number;

    /**
     * Has the user accepted Terms & Privacy?
     */
    hasAcceptedTerms: boolean;

    /**
     * Which version of terms did they accept?
     */
    termsVersion: number;

    /**
     * Timestamp of terms acceptance
     */
    acceptedAt?: string;

    /**
     * Has the user completed their first authenticated session?
     */
    hasCompletedFirstSession: boolean;

    /**
     * Timestamp of first session
     */
    firstSessionAt?: string;

    /**
     * Has the user seen the welcome celebration?
     */
    hasSeenWelcome: boolean;
}

// ============================================================================
// 🔐 CONSTANTS
// ============================================================================

const STORAGE_KEY = 'vibe_onboarding_state';
const CURRENT_SCHEMA_VERSION = 1;
const CURRENT_TERMS_VERSION = 1;

const DEFAULT_STATE: OnboardingState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    hasAcceptedTerms: false,
    termsVersion: 0,
    hasCompletedFirstSession: false,
    hasSeenWelcome: false
};

// ============================================================================
// 💾 STORAGE ADAPTER
// ============================================================================

/**
 * Storage adapter interface
 */
interface StorageAdapter<T> {
    load(): Promise<T | null>;
    save(data: T): Promise<void>;
    clear(): Promise<void>;
}

/**
 * Bridge-based storage adapter (Communication with Plugin Sandbox)
 * 
 * Sends messages to the controller (main thread) to access figma.clientStorage,
 * which is persistent across sessions and shared across the plugin.
 */
class BridgeStorageAdapter<T> implements StorageAdapter<T> {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    /**
     * Load data via 'STORAGE_GET' message
     */
    async load(): Promise<T | null> {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                cleanup();
                console.warn(`[BridgeStorageAdapter] Timeout loading ${this.key}`);
                resolve(null); // Return null on timeout to allow safe implementation defaults
            }, 3000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_GET_RESPONSE' && msg.key === this.key) {
                    cleanup();
                    try {
                        // Figma storage returns the raw object/value directly
                        resolve(msg.value as T);
                    } catch (e) {
                        console.error(`[BridgeStorageAdapter] Failed to parse ${this.key}`, e);
                        resolve(null);
                    }
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_GET', key: this.key } }, '*');
        });
    }

    /**
     * Save data via 'STORAGE_SET' message
     */
    async save(data: T): Promise<void> {
        return new Promise((resolve) => {
            // Optimistic timeout - we assume success if no error, but we wait for ACK
            const timeoutId = setTimeout(() => {
                cleanup();
                console.warn(`[BridgeStorageAdapter] Timeout saving ${this.key} (Assume Success)`);
                resolve();
            }, 3000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_SET_SUCCESS' && msg.key === this.key) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_SET', key: this.key, value: data } }, '*');
        });
    }

    /**
     * Clear data via 'STORAGE_REMOVE' message
     */
    async clear(): Promise<void> {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                cleanup();
                resolve();
            }, 1000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_REMOVE_SUCCESS' && msg.key === this.key) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: this.key } }, '*');
        });
    }
}

// ============================================================================
// 🏪 ONBOARDING STORE CLASS
// ============================================================================

/**
 * Singleton store for managing onboarding state
 */
export class OnboardingStore {
    private state: OnboardingState;
    private storage: StorageAdapter<OnboardingState>;
    private initialized: boolean;
    private subscribers: Set<(state: OnboardingState) => void>;

    constructor() {
        // Use BridgeStorageAdapter instead of LocalStorageAdapter
        this.storage = new BridgeStorageAdapter<OnboardingState>(STORAGE_KEY);
        this.state = DEFAULT_STATE;
        this.initialized = false;
        this.subscribers = new Set();
    }

    /**
     * Initialize the store by loading persisted state
     * MUST be called before any other method
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            console.warn('[OnboardingStore] Already initialized, skipping');
            return;
        }

        console.log('[OnboardingStore] Initializing via Bridge...');
        const stored = await this.storage.load();

        if (!stored) {
            console.log('[OnboardingStore] No existing state found (or first load), using defaults');
            this.state = DEFAULT_STATE;
        } else if (stored.schemaVersion !== CURRENT_SCHEMA_VERSION) {
            console.warn('[OnboardingStore] Schema version mismatch, applying migration');
            this.state = this.migrate(stored);
        } else {
            console.log('[OnboardingStore] Loaded persisted state');
            this.state = stored;
        }

        this.initialized = true;
        this.notify();
    }

    /**
     * Save current state to storage
     */
    private async save(): Promise<void> {
        try {
            await this.storage.save(this.state);
            console.log('[OnboardingStore] State saved successfully');
        } catch (error) {
            console.error('[OnboardingStore] Failed to save state:', error);
            throw error;
        }
    }

    /**
     * Migrate old schema versions to current schema
     */
    private migrate(oldState: Partial<OnboardingState>): OnboardingState {
        console.log('[OnboardingStore] Migrating from version:', oldState.schemaVersion);

        // For now, just merge with defaults
        // In future, implement version-specific migrations here
        return {
            ...DEFAULT_STATE,
            ...oldState,
            schemaVersion: CURRENT_SCHEMA_VERSION
        };
    }

    /**
     * Notify all subscribers of state changes
     */
    private notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // ========================================================================
    // 🔄 PUBLIC API - Getters
    // ========================================================================

    /**
     * Get current state (read-only)
     */
    getState(): Readonly<OnboardingState> {
        return this.state;
    }

    /**
     * Is the store initialized?
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Does the user need to see the Terms screen?
     */
    needsTermsAcceptance(): boolean {
        return !this.state.hasAcceptedTerms ||
            this.state.termsVersion < CURRENT_TERMS_VERSION;
    }

    /**
     * Is this the user's first authenticated session?
     * Used to trigger the "Welcome" celebration overlay
     */
    isFirstSession(): boolean {
        return !this.state.hasCompletedFirstSession || !this.state.hasSeenWelcome;
    }

    // ========================================================================
    // 🔄 PUBLIC API - Actions
    // ========================================================================

    /**
     * Mark terms as accepted
     */
    async acceptTerms(): Promise<void> {
        console.log('[OnboardingStore] Accepting terms...');
        this.state = {
            ...this.state,
            hasAcceptedTerms: true,
            termsVersion: CURRENT_TERMS_VERSION,
            acceptedAt: new Date().toISOString()
        };

        await this.save();
        this.notify();
    }

    /**
     * Mark first session as complete (after successful auth)
     */
    async completeFirstSession(): Promise<void> {
        if (this.state.hasCompletedFirstSession) {
            return; // Already completed
        }

        console.log('[OnboardingStore] Completing first session...');
        this.state = {
            ...this.state,
            hasCompletedFirstSession: true,
            firstSessionAt: new Date().toISOString()
        };

        await this.save();
        this.notify();
    }

    /**
     * Mark welcome celebration as seen
     */
    async markWelcomeSeen(): Promise<void> {
        this.state = {
            ...this.state,
            hasSeenWelcome: true
        };

        await this.save();
        this.notify();
    }

    /**
     * Reset all onboarding state (for testing/debugging)
     */
    async reset(): Promise<void> {
        this.state = DEFAULT_STATE;
        await this.storage.clear();
        this.notify();
        console.log('[OnboardingStore] State reset to defaults');
    }

    // ========================================================================
    // 🔔 SUBSCRIPTION SYSTEM
    // ========================================================================

    /**
     * Subscribe to state changes
     * Returns unsubscribe function
     */
    subscribe(callback: (state: OnboardingState) => void): () => void {
        this.subscribers.add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }
}

// ============================================================================
// 🎯 SINGLETON INSTANCE
// ============================================================================

/**
 * Global singleton instance
 */
export const onboardingStore = new OnboardingStore();

// Expose to window for debugging
if (typeof window !== 'undefined') {
    (window as any).__VIBE_ONBOARDING_STORE__ = onboardingStore;
}

// ============================================================================
// ⚛️ REACT HOOK
// ============================================================================

/**
 * React hook for onboarding state
 * Automatically subscribes to changes and re-renders
 */
export const useOnboarding = () => {
    const [state, setState] = useState<OnboardingState>(onboardingStore.getState());

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = onboardingStore.subscribe((newState) => {
            setState(newState);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    return {
        // State indicators
        needsTerms: onboardingStore.needsTermsAcceptance(),
        isFirstSession: onboardingStore.isFirstSession(),

        // Raw state (for advanced use)
        state,

        // Actions
        acceptTerms: () => onboardingStore.acceptTerms(),
        completeFirstSession: () => onboardingStore.completeFirstSession(),
        markWelcomeSeen: () => onboardingStore.markWelcomeSeen(),
        reset: () => onboardingStore.reset()
    };
};
