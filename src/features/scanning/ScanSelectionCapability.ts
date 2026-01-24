import type { ICapability } from '../../core/interfaces/ICapability';
import type { AgentContext } from '../../core/AgentContext';
import { Result } from '../../shared/utils/Result';
import { Traverser } from '../../modules/perception/core/Traverser';
import { CompositeVisitor } from '../../modules/perception/visitors/CompositeVisitor';
import { TokenDiscoveryVisitor } from '../../modules/perception/visitors/TokenDiscoveryVisitor';
import { StatsVisitor } from '../../modules/perception/visitors/StatsVisitor';

export class ScanSelectionCapability implements ICapability {
    readonly id = 'scan-selection-v2';
    readonly commandId = 'SCAN_SELECTION';
    readonly description = 'Scans the current selection using Visitor Pattern v2.';

    canExecute(context: AgentContext): boolean {
        return context.selection.length > 0;
    }

    async execute(_payload: any, context: AgentContext): Promise<Result<any>> {
        console.log('[ScanCapability] Initializing Perception Engine v2...');

        // 1. Setup Visitors
        const traverser = new Traverser();
        const composite = new CompositeVisitor();

        const discovery = new TokenDiscoveryVisitor();
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

        console.log('[ScanCapability] Stats:', report);

        return Result.ok({
            stats: report,
            findings: {
                colors: findings.colors,
                fonts: findings.fonts,
                scannedCount: findings.stats.scanned
            }
        });
    }
}
