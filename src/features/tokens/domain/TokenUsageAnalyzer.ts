import type { TokenUsageMap } from '../../../core/types';
import { logger } from '../../../core/services/Logger';

// ⚡ PERFORMANCE: Time Budget Strategy
// We leave only 8ms for processing in each frame to maintain 60fps for the interface
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

interface RawUsageData {
    rawCount: number;
    compIds: Set<string>;
    styleIds: Set<string>;
    // Storing lightweight data only (Meta) to save memory until needed
    componentMeta: Map<string, { id: string, name: string }>;
    styleMeta: Map<string, { id: string, name: string }>;
}

export class TokenUsageAnalyzer {

    // 🧠 Temporary memory for raw numbers (very light on RAM)
    private rawCache: Map<string, RawUsageData> | null = null;
    private instanceImpactCache: Map<string, number> | null = null;
    private lastAnalysisTimestamp: number = 0;

    constructor() { }

    /**
     * 🏗️ PHASE 1: PREPARATION (The Heavy Scan)
     * Executed only once before starting.
     * Goal: Scan the structure (Graph Scan) and calculate links, without building final objects.
     */
    public async prepare(force: boolean = false): Promise<void> {
        const now = Date.now();
        // Cache Strategy: If we just scanned less than 5 seconds ago, don't recount
        if (!force && this.rawCache && (now - this.lastAnalysisTimestamp < 5000)) {
            logger.debug('analyzer', 'Using cached raw analysis (Hot Path)');
            return;
        }

        logger.info('analyzer', 'Starting Optimized Graph Scan (Preparation Phase)...');

        // Reset Caches
        this.rawCache = new Map();
        this.instanceImpactCache = new Map();

        // Quick helper to access or create raw data
        const getRaw = (id: string) => {
            if (!this.rawCache!.has(id)) {
                this.rawCache!.set(id, {
                    rawCount: 0,
                    compIds: new Set(),
                    styleIds: new Set(),
                    componentMeta: new Map(),
                    styleMeta: new Map()
                });
            }
            return this.rawCache!.get(id)!;
        };

        let nodesProcessed = 0;
        let frameStartTime = Date.now();
        const TIME_BUDGET = 8; // ms

        // === Step A: Styles (Very Fast) ===
        const styles = await figma.getLocalPaintStylesAsync();
        for (const style of styles) {
            const boundVars = (style as any).boundVariables;
            if (boundVars) {
                this.extractBindings(boundVars, (varId) => {
                    const r = getRaw(varId);
                    r.rawCount++;
                    if (!r.styleIds.has(style.id)) {
                        r.styleIds.add(style.id);
                        r.styleMeta.set(style.id, { id: style.id, name: style.name });
                    }
                });
            }
        }

        // === Step B: Node Graph (The Hard Work) ===
        // Using Stack instead of Recursion to avoid Stack Overflow and improve performance
        const stack: (SceneNode | PageNode)[] = [...figma.root.children];
        const instanceInheritance: { inst: string, main: string }[] = [];

        while (stack.length > 0) {
            const node = stack.pop()!;
            nodesProcessed++;

            // 🛑 Yielding Logic: Pause slightly every 50 nodes to let the UI breathe
            if (nodesProcessed % 50 === 0) {
                if (Date.now() - frameStartTime > TIME_BUDGET) {
                    await yieldToMain();
                    frameStartTime = Date.now();
                }
            }

            // 1. Direct Bindings (Variables bound directly)
            if ('boundVariables' in node) {
                const boundVars = (node as any).boundVariables;
                if (boundVars) {
                    const isComponent = node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
                    this.extractBindings(boundVars, (varId) => {
                        const r = getRaw(varId);
                        r.rawCount++;
                        if (isComponent) {
                            if (!r.compIds.has(node.id)) {
                                r.compIds.add(node.id);
                                r.componentMeta.set(node.id, { id: node.id, name: node.name });
                            }
                        }
                    });
                }
            }

            // 2. Instance Propagation (Prepare inheritance)
            if (node.type === 'INSTANCE' && node.mainComponent) {
                instanceInheritance.push({ inst: node.id, main: node.mainComponent.id });
            }

            // 3. Children Processing
            if ('children' in node) {
                const children = (node as any).children;
                // Reverse loop to maintain Stack order
                for (let i = children.length - 1; i >= 0; i--) {
                    stack.push(children[i]);
                }
            }
        }

        // === Step C: Resolve Propagation (Math) ===
        // Calculate impact of Instances based on Components
        const compToTokens = new Map<string, string[]>();

        // Reverse Map: Component -> Tokens
        for (const [tokenId, raw] of this.rawCache.entries()) {
            for (const compId of raw.compIds) {
                if (!compToTokens.has(compId)) compToTokens.set(compId, []);
                compToTokens.get(compId)!.push(tokenId);
            }
        }

        // Distribute Impact
        let processedInheritance = 0;
        for (const { main } of instanceInheritance) {
            const tokens = compToTokens.get(main);
            if (tokens) {
                for (const t of tokens) {
                    const cur = this.instanceImpactCache!.get(t) || 0;
                    this.instanceImpactCache!.set(t, cur + 1);
                }
            }
            // Yield here too because the Loop might be huge
            if (processedInheritance++ % 2000 === 0) await yieldToMain();
        }

        this.lastAnalysisTimestamp = Date.now();
        logger.info('analyzer', `Preparation complete. Scanned ${nodesProcessed} nodes.`);
    }

    /**
     * 🚀 PHASE 2: RESOLVE CHUNK (Just-In-Time)
     * Called inside the Loop for each Chunk.
     * Converts raw numbers to final UI format (expensive, but distributed).
     */
    public getUsageForChunk(tokenIds: string[]): TokenUsageMap {
        const chunkResult: TokenUsageMap = new Map();
        if (!this.rawCache) return chunkResult;

        for (const id of tokenIds) {
            if (this.rawCache.has(id)) {
                const raw = this.rawCache.get(id)!;
                const impact = this.instanceImpactCache?.get(id) || 0;

                // Only here do we create the heavy Arrays and Objects
                chunkResult.set(id, {
                    totalRawUsage: raw.rawCount,
                    usedInComponents: Array.from(raw.componentMeta.values()),
                    usedInStyles: Array.from(raw.styleMeta.values()),
                    affectedInstancesCount: impact,
                    dependencyChain: []
                });
            }
        }
        return chunkResult;
    }

    private extractBindings(bindings: any, callback: (id: string) => void) {
        if (!bindings) return;
        for (const key in bindings) {
            const val = bindings[key];
            if (Array.isArray(val)) {
                for (const v of val) if (v?.id) callback(v.id);
            } else if (val?.id) {
                callback(val.id);
            }
        }
    }

    // Helper for Background Save
    public getAllUsage(): TokenUsageMap {
        if (!this.rawCache) return new Map();
        return this.getUsageForChunk(Array.from(this.rawCache.keys()));
    }
}
