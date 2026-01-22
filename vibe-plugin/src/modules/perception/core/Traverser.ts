import type { IVisitor, TraversalContext } from './IVisitor';

/**
 * 🚶 Traverser
 * Efficiently walks the Figma node tree and accepts visitors.
 * Handles recursion and context tracking.
 */
export class Traverser {

    /**
     * Walks a list of nodes (and their children) with the given visitor.
     */
    traverse(nodes: readonly SceneNode[], visitor: IVisitor): void {
        for (const node of nodes) {
            this.walk(node, visitor, {
                depth: 0,
                path: node.name
            });
        }
    }

    private walk(node: SceneNode, visitor: IVisitor, context: TraversalContext): void {
        // 1. Visit current node
        try {
            visitor.visit(node, context);
        } catch (e) {
            console.error(`[Traverser] Error visiting ${node.name}:`, e);
            // Continue traversal even if one node fails
        }

        // 2. Recurse if applicable (DFS)
        if ('children' in node) {
            // "children" property exists on Frame, Group, Component, Instance, etc.
            // but Typescript needs explicit check or type guard.
            const children = (node as ChildrenMixin).children;

            for (const child of children) {
                this.walk(child, visitor, {
                    depth: context.depth + 1,
                    parentId: node.id,
                    path: `${context.path} > ${child.name}`
                });
            }
        }
    }
}
