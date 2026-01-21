import type { VibeToken } from "./types";

export interface ProjectMemory {
    projectId: string;
    approvedTokens: VibeToken[];
    lastUpdated: number;
}

export class MemoryService {
    private cache: ProjectMemory | null = null;
    private initialized = false;

    constructor() { }

    async init() {
        if (this.initialized) return;
        this.cache = await this.loadFromStorage();
        this.initialized = true;
    }

    private loadFromStorage(): Promise<ProjectMemory> {
        return new Promise((resolve) => {
            parent.postMessage({ pluginMessage: { type: 'MEMORY_LOAD', key: 'VIBE_MEMORY' } }, '*');

            const listener = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg?.type === 'MEMORY_LOAD_RESPONSE') {
                    window.removeEventListener('message', listener);
                    resolve(msg.data || { projectId: 'default', approvedTokens: [], lastUpdated: Date.now() });
                }
            };
            window.addEventListener('message', listener);
        });
    }

    async saveDecision(token: VibeToken) {
        if (!this.cache) await this.init();

        // Add to cache
        this.cache?.approvedTokens.push(token);
        this.cache!.lastUpdated = Date.now();

        // Persist
        parent.postMessage({
            pluginMessage: {
                type: 'MEMORY_SAVE',
                key: 'VIBE_MEMORY',
                data: this.cache
            }
        }, '*');
    }

    async retrieveContext(query: string): Promise<VibeToken[]> {
        if (!this.cache) await this.init();

        // Naive Semantic Search (Exact Match on Name or Type for now)
        // In Phase 4, we will add real Vector Dot Product here.
        return this.cache?.approvedTokens.filter(t =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.$type.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) || [];
    }

    async getHistory(): Promise<VibeToken[]> {
        if (!this.cache) await this.init();
        return this.cache?.approvedTokens || [];
    }
}
