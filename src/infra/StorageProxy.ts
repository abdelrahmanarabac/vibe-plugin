/**
 * StorageProxy for Figma Plugin UI
 * 
 * PROBLEM: localStorage is NOT available in Figma plugin iframes (sandboxed data: URLs)
 * SOLUTION: Proxy all storage operations to the controller thread via postMessage
 * 
 * The controller thread uses figma.clientStorage (async API).
 */

type StorageCallback = (value: string | null) => void;

class FigmaStorageProxy {
    private pendingRequests: Map<string, StorageCallback> = new Map();

    constructor() {
        // Listen for responses from controller
        window.addEventListener('message', (event) => {
            const { type, key, value } = event.data.pluginMessage || {};

            if (type === 'STORAGE_GET_RESPONSE') {
                const callback = this.pendingRequests.get(key);
                if (callback) {
                    callback(value);
                    this.pendingRequests.delete(key);
                }
            }
        });
    }

    /**
     * Async getItem (because figma.clientStorage is async)
     */
    async getItem(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            this.pendingRequests.set(key, resolve);
            parent.postMessage({
                pluginMessage: { type: 'STORAGE_GET', key }
            }, '*');
        });
    }

    /**
     * Async setItem
     */
    async setItem(key: string, value: string): Promise<void> {
        parent.postMessage({
            pluginMessage: { type: 'STORAGE_SET', key, value }
        }, '*');
    }

    /**
     * Async removeItem
     */
    async removeItem(key: string): Promise<void> {
        parent.postMessage({
            pluginMessage: { type: 'STORAGE_REMOVE', key }
        }, '*');
    }
}

// Singleton instance
export const storage = new FigmaStorageProxy();
