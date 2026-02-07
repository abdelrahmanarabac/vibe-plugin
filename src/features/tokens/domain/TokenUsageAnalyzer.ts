import type { TokenUsageMap } from '../../../core/types';
import { logger } from '../../../core/services/Logger';

// ⚡ PERFORMANCE: Non-Blocking Yield (12ms budget per frame to keep UI responsive)
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export class TokenUsageAnalyzer {
    private usageCache: TokenUsageMap | null = null;
    private lastAnalysisTimestamp: number = 0;

    constructor() { }

    /**
     * 🕵️♂️ Real Usage Analysis (Optimized)
     * Now uses Sets for O(1) lookups and strictly manages time budget.
     */
    public async analyze(force: boolean = false): Promise<TokenUsageMap> {
        // 1. Cache Layer
        const now = Date.now();
        if (!force && this.usageCache && (now - this.lastAnalysisTimestamp < 5000)) {
            logger.debug('analyzer', 'Returning cached usage stats');
            return this.usageCache;
        }

        logger.info('analyzer', 'Starting Optimized Graph Scan...');
        // const startTime = Date.now(); // Removed unused

        // 2. Efficient Data Structures (Temporary Maps for O(1) Access)
        // Map<TokenID, { raw: number, components: Set<string>, styles: Set<string> }>
        const tempStats = new Map<string, {
            raw: number;
            compIds: Set<string>;
            styleIds: Set<string>;
            componentDetails: Map<string, { id: string, name: string }>;
            styleDetails: Map<string, { id: string, name: string }>;
        }>();

        const getTemp = (id: string) => {
            if (!tempStats.has(id)) {
                tempStats.set(id, {
                    raw: 0,
                    compIds: new Set(),
                    styleIds: new Set(),
                    componentDetails: new Map(),
                    styleDetails: new Map()
                });
            }
            return tempStats.get(id)!;
        };

        // 3. Traversal Logic
        let nodesProcessed = 0;
        let frameStartTime = Date.now();
        const TIME_BUDGET_MS = 10; // Strict 10ms budget

        // A. Process Styles (Fast)
        const styles = await figma.getLocalPaintStylesAsync();
        for (const style of styles) {
            const boundVars = (style as any).boundVariables;
            if (boundVars) {
                this.extractBindings(boundVars, (varId) => {
                    const t = getTemp(varId);
                    t.raw++;
                    if (!t.styleIds.has(style.id)) {
                        t.styleIds.add(style.id);
                        t.styleDetails.set(style.id, { id: style.id, name: style.name });
                    }
                });
            }
        }

        // B. Process Node Graph (Heavy)
        // Using Iterative Stack to avoid recursion limits
        const stack: (SceneNode | PageNode)[] = [...figma.root.children]; // Start with Pages

        // Instance tracking for Propagation Phase
        // InstanceID -> ComponentID
        const instanceInheritance: { inst: string, main: string }[] = [];

        while (stack.length > 0) {
            const node = stack.pop()!;
            nodesProcessed++;

            // 🛑 Yield Check
            if (nodesProcessed % 50 === 0) { // Check every 50 nodes
                if (Date.now() - frameStartTime > TIME_BUDGET_MS) {
                    await yieldToMain();
                    frameStartTime = Date.now();
                }
            }

            // 1. Direct Bindings
            if ('boundVariables' in node) {
                const boundVars = (node as any).boundVariables;
                if (boundVars) {
                    const isComponent = node.type === 'COMPONENT' || node.type === 'COMPONENT_SET';
                    this.extractBindings(boundVars, (varId) => {
                        const t = getTemp(varId);
                        t.raw++;
                        if (isComponent) {
                            if (!t.compIds.has(node.id)) {
                                t.compIds.add(node.id);
                                t.componentDetails.set(node.id, { id: node.id, name: node.name });
                            }
                        }
                    });
                }
            }

            // 2. Track Instances
            if (node.type === 'INSTANCE' && node.mainComponent) {
                // Optimization: Don't await mainComponent details if possible, but we need ID
                instanceInheritance.push({ inst: node.id, main: node.mainComponent.id });
            }

            // 3. Stack Children
            if ('children' in node) {
                // Push in reverse to maintain visual order in traversal (optional but nice)
                const children = (node as any).children;
                for (let i = children.length - 1; i >= 0; i--) {
                    stack.push(children[i]);
                }
            }
        }

        // C. Propagation Phase (Instance Impact)
        // Map ComponentID -> Set<TokenID>
        const componentTokens = new Map<string, Set<string>>();

        // Build reverse lookup
        for (const [tokenId, stat] of tempStats.entries()) {
            for (const compId of stat.compIds) {
                if (!componentTokens.has(compId)) componentTokens.set(compId, new Set());
                componentTokens.get(compId)!.add(tokenId);
            }
        }

        // Calculate impact
        // Map<TokenID, InstanceCount>
        const instanceImpact = new Map<string, number>();

        for (const { main } of instanceInheritance) {
            const tokensUsed = componentTokens.get(main);
            if (tokensUsed) {
                for (const tokenId of tokensUsed) {
                    const current = instanceImpact.get(tokenId) || 0;
                    instanceImpact.set(tokenId, current + 1);
                }
            }

            // Yield periodically during this phase too
            if (nodesProcessed++ % 1000 === 0) await yieldToMain();
        }

        // 4. Final Serialization
        const finalMap: TokenUsageMap = new Map();

        for (const [id, t] of tempStats.entries()) {
            finalMap.set(id, {
                totalRawUsage: t.raw,
                usedInComponents: Array.from(t.componentDetails.values()),
                usedInStyles: Array.from(t.styleDetails.values()),
                affectedInstancesCount: instanceImpact.get(id) || 0,
                dependencyChain: []
            });
        }

        this.usageCache = finalMap;
        this.lastAnalysisTimestamp = Date.now();

        logger.info('analyzer', `Scan complete. ${nodesProcessed} nodes processed.`);
        return finalMap;
    }

    /**
     * Helper to parse Figma's messy boundVariables object
     */
    private extractBindings(bindings: any, callback: (id: string) => void) {
        if (!bindings) return;
        for (const key in bindings) {
            const value = bindings[key];
            if (Array.isArray(value)) {
                for (const v of value) {
                    if (v && v.id) callback(v.id);
                }
            } else if (value && value.id) {
                callback(value.id);
            }
        }
    }

    /**
     * Slices the cached global usage for a specific chunk of tokens.
     * This fulfills the "Usage per Chunk" requirement without re-scanning.
     */
    public getUsageForChunk(tokenIds: string[]): TokenUsageMap {
        const chunkMap: TokenUsageMap = new Map();
        if (!this.usageCache) return chunkMap;

        for (const id of tokenIds) {
            if (this.usageCache.has(id)) {
                chunkMap.set(id, this.usageCache.get(id)!);
            }
        }
        return chunkMap;
    }

    public invalidateCache() {
        this.usageCache = null;
    }
}
