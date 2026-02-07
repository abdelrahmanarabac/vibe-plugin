import type { TokenUsageStats, TokenUsageMap } from '../../../core/types';
import { logger } from '../../../core/services/Logger';

/**
 * 🕵️ TokenUsageAnalyzer
 * 
 * CORE LOGIC ENGINE for determining Token Usage.
 * Mandates strict adherence to "Source of Truth" (Variable ID).
 * 
 * Rules:
 * 1. Variables -> Styles -> Components -> Instances (Traversal Order)
 * 2. No String Matching. ID only.
 * 3. Separate Source Usage vs Instance Impact.
 * 4. QUALITATIVE METRICS ONLY. No raw "Usage Counts".
 * 
 * ⚡ PERFORMANCE UPDATE:
 * - Uses iterative traversal (Stack-based) instead of recursion.
 * - Yields to main thread every X nodes to prevent UI freezing.
 */

// Helper Types for Figma API which might be missing in environment
type VariableBindings = { [key: string]: VariableAlias | VariableAlias[] };

// ⏳ Non-Blocking Yield Utility
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export class TokenUsageAnalyzer {

    /**
     * Cache for usage map to avoid expensive full-traversal on every call.
     * Should be invalidated on document changes.
     */
    private usageCache: TokenUsageMap | null = null;
    private lastAnalysisTimestamp: number = 0;

    constructor() { }

    /**
     * Executes the analysis protocol.
     * @param force - If true, bypasses cache and re-scans the document.
     */
    public async analyze(force: boolean = false): Promise<TokenUsageMap> {
        // 1. Check Cache (Performance Constraint)
        const now = Date.now();
        if (!force && this.usageCache && (now - this.lastAnalysisTimestamp < 2000)) {
            logger.debug('analyzer', 'Returning cached usage stats');
            return this.usageCache;
        }

        logger.info('analyzer', 'Starting Full Token Usage Analysis...');
        const startTime = Date.now();

        // 2. Initialize Map
        const usageMap: TokenUsageMap = new Map();

        // Helper to get or create stats
        const getStats = (tokenId: string): TokenUsageStats => {
            if (!usageMap.has(tokenId)) {
                usageMap.set(tokenId, {
                    usedInComponents: [], // Qualitative List {id, name}
                    usedInStyles: [],     // Qualitative List {id, name}
                    affectedInstancesCount: 0,
                    totalRawUsage: 0,
                    dependencyChain: []
                });
            }
            return usageMap.get(tokenId)!;
        };

        // Helper: Record Source Usage (Strict: Components & Styles ONLY)
        const recordSourceUsage = (tokenId: string, node: { id: string, name: string }, isComponent: boolean, isStyle: boolean) => {
            const stats = getStats(tokenId);

            // ALWAYS track raw usage (User Request: "How many times used")
            stats.totalRawUsage++;

            // STRICT RULE: Only track usage in Components or Styles. Ignored random Frames.
            if (!isComponent && !isStyle) return;

            // Only add Unique IDs (Qualitative set)
            if (isComponent) {
                if (!stats.usedInComponents.some(c => c.id === node.id)) {
                    stats.usedInComponents.push({ id: node.id, name: node.name });
                }
            }
            if (isStyle) {
                if (!stats.usedInStyles.some(s => s.id === node.id)) {
                    stats.usedInStyles.push({ id: node.id, name: node.name });
                }
            }
        };

        // Helper: Record Instance Impact
        const recordInstanceImpact = (tokenId: string) => {
            const stats = getStats(tokenId);
            stats.affectedInstancesCount++;
        };

        // === PHASE 1: STYLES (Fast) ===
        // Traverse all local paint styles
        const styles = await figma.getLocalPaintStylesAsync();
        for (const style of styles) {
            // Check paints for bound variables
            for (const paint of style.paints) {
                if (paint.type === 'SOLID' || paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_RADIAL') {
                    // Explicitly check for variable bindings in the style itself
                    // Note: This API surface might vary, but we look for boundVariables.
                    const s = style as any;
                    const boundVars = s.boundVariables as VariableBindings;

                    if (boundVars) {
                        // Iterate over all potential properties that can be bound
                        for (const key in boundVars) {
                            const variableAlias = boundVars[key];
                            // Check if it's an array (gradients) or single
                            if (Array.isArray(variableAlias)) {
                                // ⚡ PERFORMANCE: for...of avoids closure allocation
                                for (const a of variableAlias) {
                                    if (a && a.id) recordSourceUsage(a.id, { id: style.id, name: style.name }, false, true);
                                }
                            } else if (variableAlias && 'id' in variableAlias) {
                                recordSourceUsage(variableAlias.id, { id: style.id, name: style.name }, false, true);
                            }
                        }
                    }
                }
            }
        }

        await yieldToMain(); // Breathe after styles

        // === PHASE 2 & 3: NODES (Iterative & Yielding) ===
        // We traverse the document *once* to handle both.

        const instanceMap: { instanceId: string, componentId: string }[] = [];

        // ⚡ ITERATIVE STACK 
        // Start with pages
        const stack: (SceneNode | PageNode)[] = [...figma.root.children];

        let nodesProcessed = 0;
        // const YIELD_THRESHOLD = 500; // Legacy Count-based logic
        const TIME_BUDGET_MS = 12; // 12ms active work per frame (leaves 4ms for UI)
        let frameStartTime = Date.now();

        while (stack.length > 0) {
            const node = stack.pop()!;
            nodesProcessed++;

            // 🛑 BREATHE CHECK (Time-Based)
            const currentTime = Date.now();
            if (currentTime - frameStartTime > TIME_BUDGET_MS) {
                await yieldToMain();
                frameStartTime = Date.now(); // Reset timer after yielding
            }

            // 1. Check Binding on THIS node (Source Usage)
            if ('boundVariables' in node) {
                const n = node as any;
                const bindings = n.boundVariables as VariableBindings;
                if (bindings) {
                    for (const key in bindings) {
                        const alias = bindings[key];
                        if (alias) {
                            if (Array.isArray(alias)) {
                                // ⚡ PERFORMANCE: for...of avoids closure allocation in hot path
                                for (const a of alias) {
                                    if (a.id) recordSourceUsage(a.id, { id: node.id, name: node.name }, node.type === 'COMPONENT' || node.type === 'COMPONENT_SET', false);
                                }
                            } else if ('id' in alias) {
                                recordSourceUsage(alias.id, { id: node.id, name: node.name }, node.type === 'COMPONENT' || node.type === 'COMPONENT_SET', false);
                            }
                        }
                    }
                }
            }

            // 2. Handling Component Logic (Source Usage) involves the Component Node itself using variables.
            // 3. Handling Instance Impact (Secondary)

            if (node.type === 'INSTANCE') {
                // An instance *inherits* usage from its Main Component.
                const mainComponentId = node.mainComponent?.id; // Note: accessing mainComponent might be slow if not loaded? usually fine in plugin api.
                if (mainComponentId) {
                    instanceMap.push({ instanceId: node.id, componentId: mainComponentId });
                }
            }

            // Push children to stack
            if ('children' in node) {
                // We optimize by NOT pushing if children is empty or if it's a huge group we might want to check visibility?
                // For now, strict traversal.
                // Reverse loop push to maintain order? (Not critical for usage count, but nice for logic)
                for (const child of node.children) {
                    stack.push(child);
                }
            }
        }

        // === PHASE 4: RESOLVE INSTANCE IMPACT ===
        // Now we know which components use which tokens (from usageMap.usedInComponents).
        // identifying which tokens are used by which component:
        const componentToTokens = new Map<string, string[]>();

        for (const [tokenId, stats] of usageMap.entries()) {
            for (const comp of stats.usedInComponents) {
                if (!componentToTokens.has(comp.id)) {
                    if (!componentToTokens.has(comp.id)) {
                        componentToTokens.set(comp.id, []);
                    }
                    componentToTokens.get(comp.id)?.push(tokenId);
                }
            }
        }

        // Now iterate instances and attribute impact
        for (const { componentId } of instanceMap) {
            const tokenIds = componentToTokens.get(componentId);
            if (tokenIds) {
                for (const tid of tokenIds) {
                    recordInstanceImpact(tid);
                }
            }
        }

        const duration = Date.now() - startTime;
        logger.info('analyzer', `Analysis complete in ${duration}ms. Tracked ${usageMap.size} active tokens. Processed ${nodesProcessed} nodes.`, { count: usageMap.size });

        this.usageCache = usageMap;
        this.lastAnalysisTimestamp = Date.now();

        return usageMap;
    }

    /**
     * Clears the cache to force recalculation on next call.
     */
    public invalidateCache() {
        this.usageCache = null;
    }
}
