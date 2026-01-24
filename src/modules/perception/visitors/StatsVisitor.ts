import type { IVisitor, TraversalContext } from '../core/IVisitor';

/**
 * 📊 StatsVisitor
 * Counts node types for debugging and analytics.
 */
export class StatsVisitor implements IVisitor {
    public counts: Record<string, number> = {};

    visit(node: SceneNode, _context: TraversalContext): void {
        const type = node.type;
        this.counts[type] = (this.counts[type] || 0) + 1;
    }

    getReport(): string {
        return Object.entries(this.counts)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');
    }
}
