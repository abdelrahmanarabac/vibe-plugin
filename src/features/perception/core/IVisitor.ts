export interface TraversalContext {
    depth: number;
    parentId?: string;
    path: string; // e.g. "Frame 1 > Group 2 > Text 3"
}

export interface IVisitor {
    /**
     * Visit a node in the Figma tree.
     * @param node The current scene node.
     * @param context Metadata about the traversal state.
     */
    visit(node: SceneNode, context: TraversalContext): void;
}
