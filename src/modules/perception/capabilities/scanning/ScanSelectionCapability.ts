import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/utils/Result';
import { Traverser } from '../../core/Traverser';
import { CompositeVisitor } from '../../visitors/CompositeVisitor';
import { TokenDiscoveryVisitor } from '../../visitors/TokenDiscoveryVisitor';
import { StatsVisitor } from '../../visitors/StatsVisitor';

export class ScanSelectionCapability implements ICapability {
    readonly id = 'scan-selection-v2';
    readonly commandId = 'SCAN_SELECTION';
    readonly description = 'Scans the current selection using Visitor Pattern v2.';

    canExecute(context: AgentContext): boolean {
        return context.selection.length > 0;
    }

    async execute(_payload: any, context: AgentContext): Promise<Result<any>> {
        console.log('[ScanCapability] Initializing Perception Engine v2...');

        // 0. Hydrate Knowledge (Get existing tokens for Drift Detection)
        // We convert the graph to a simple Hex Map for the visitor
        const existingTokens: Record<string, string> = {};
        const graph = context.repository.getTokens();
        for (const [_, token] of graph.entries()) {
            if (token.$type === 'color' && typeof token.$value === 'string') {
                existingTokens[token.name] = token.$value;
            }
        }

        // 1. Setup Visitors
        const traverser = new Traverser();
        const composite = new CompositeVisitor();

        // Inject existing tokens into Discovery Visitor
        const discovery = new TokenDiscoveryVisitor(existingTokens);
        const stats = new StatsVisitor();

        composite.add(discovery);
        composite.add(stats);

        // 2. Traverse (One Pass, Multiple Checks)
        console.time('Traversal');
        traverser.traverse(context.selection, composite);
        console.timeEnd('Traversal');

        // 3. Aggregate Results
        const findings = discovery.getFindings();
        const report = stats.getReport();

        if (findings.drifts.length > 0) {
            console.warn(`[Design Gravity] Detected ${findings.drifts.length} color drifts.`);
        }

        console.log('[ScanCapability] Stats:', report);

        return Result.ok({
            stats: report,
            findings: {
                colors: findings.colors,
                fonts: findings.fonts,
                drifts: findings.drifts,
                scannedCount: findings.stats.scanned
            }
        });
    }
}
