import type { IVisitor, TraversalContext } from '../core/IVisitor';

/**
 * 🌳 CompositeVisitor
 * Allows running multiple visitors in a single pass.
 */
export class CompositeVisitor implements IVisitor {
    private visitors: IVisitor[] = [];

    /**
     * Register a new visitor to the pipeline.
     */
    add(visitor: IVisitor): void {
        this.visitors.push(visitor);
    }

    visit(node: SceneNode, context: TraversalContext): void {
        for (const visitor of this.visitors) {
            visitor.visit(node, context);
        }
    }
}
