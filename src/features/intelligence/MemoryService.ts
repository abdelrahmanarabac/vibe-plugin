import type { VibeToken } from "./types";

export interface ProjectMemory {
    projectId: string;
    approvedTokens: VibeToken[];
    /**
     * 👻 Pattern Buffer (Ghost Architect)
     * Tracks the frequency of untokenized primitives.
     * Format: "type:value" -> Count
     */
    primitiveUsage: Record<string, number>;
    lastUpdated: number;
}

export class MemoryService {
    private cache: ProjectMemory | null = null;
    private initialized = false;

    constructor() { }

    async init() {
        if (this.initialized) return;
        this.cache = await this.loadFromStorage();
        if (!this.cache.primitiveUsage) {
            this.cache.primitiveUsage = {};
        }
        this.initialized = true;
    }

    private loadFromStorage(): Promise<ProjectMemory> {
        return new Promise((resolve) => {
            // Context Detection
            if (typeof figma !== 'undefined' && figma.clientStorage) {
                // 🎮 Controller Context (Direct Storage)
                figma.clientStorage.getAsync('VIBE_MEMORY').then(data => {
                    resolve(data || this.createDefault());
                });
            } else if (typeof window !== 'undefined') {
                // 🖥️ UI Context (PostMessage Proxy)
                parent.postMessage({ pluginMessage: { type: 'MEMORY_LOAD', key: 'VIBE_MEMORY' } }, '*');

                const listener = (event: MessageEvent) => {
                    const msg = event.data.pluginMessage;
                    if (msg?.type === 'MEMORY_LOAD_RESPONSE') {
                        window.removeEventListener('message', listener);
                        resolve(msg.data || this.createDefault());
                    }
                };
                window.addEventListener('message', listener);
            } else {
                resolve(this.createDefault());
            }
        });
    }

    private createDefault(): ProjectMemory {
        return { projectId: 'default', approvedTokens: [], primitiveUsage: {}, lastUpdated: Date.now() };
    }

    async saveDecision(token: VibeToken) {
        if (!this.cache) await this.init();
        this.cache?.approvedTokens.push(token);
        this.cache!.lastUpdated = Date.now();
        this.persist();
    }

    /**
     * 👻 Log Usage (Ghost Architect)
     * Increments the counter for a primitive value.
     */
    async logPrimitiveUsage(type: string, value: string) {
        if (!this.cache) await this.init();

        const key = `${type}:${value}`;
        this.cache!.primitiveUsage[key] = (this.cache!.primitiveUsage[key] || 0) + 1;

        // Persist logic (throttle in real app)
        await this.persist();
    }

    /**
     * 👻 Get Emerging Patterns
     * Returns values that have been used frequently (Threshold: 5 times).
     */
    async getEmergingPatterns(threshold = 5): Promise<Array<{ type: string; value: string; count: number }>> {
        if (!this.cache) await this.init();

        const patterns = [];
        for (const [key, count] of Object.entries(this.cache!.primitiveUsage)) {
            if (count >= threshold) {
                const [type, value] = key.split(':');
                patterns.push({ type, value, count });
            }
        }
        return patterns.sort((a, b) => b.count - a.count);
    }

    private async persist() {
        if (!this.cache) return;

        if (typeof figma !== 'undefined' && figma.clientStorage) {
            await figma.clientStorage.setAsync('VIBE_MEMORY', this.cache);
        } else if (typeof parent !== 'undefined' && parent.postMessage) {
            parent.postMessage({
                pluginMessage: {
                    type: 'MEMORY_SAVE',
                    key: 'VIBE_MEMORY',
                    data: this.cache
                }
            }, '*');
        }
    }

    async retrieveContext(query: string): Promise<VibeToken[]> {
        if (!this.cache) await this.init();
        return this.cache?.approvedTokens.filter(t =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.$type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) || [];
    }
}
