import type { IVisitor, TraversalContext } from '../core/IVisitor';

export interface SceneNodeAnatomy {
    id: string;
    name: string;
    type: string;
    parentId?: string;
    depth: number;
    tokens: {
        property: string;
        variableId: string;
    }[];
}

/**
 * 🦴 HierarchyVisitor
 * Captures the structural anatomy of Figma nodes and their token/variable bindings.
 */
export class HierarchyVisitor implements IVisitor {
    public nodes: SceneNodeAnatomy[] = [];

    visit(node: SceneNode, context: TraversalContext): void {
        const tokens: { property: string; variableId: string }[] = [];

        // Check for bound variables (Figma Native Variables)
        if ('boundVariables' in node && node.boundVariables) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bv = node.boundVariables as any;

            const extractId = (target: unknown): string | undefined => {
                if (!target) return undefined;

                // VariableAlias check
                if (typeof target === 'object' && 'id' in target) {
                    return (target as { id: string }).id;
                }

                // Array check
                if (Array.isArray(target) && target.length > 0 && target[0] && 'id' in target[0]) {
                    return (target[0] as { id: string }).id;
                }

                return undefined;
            };

            // 1. Fills
            const fillId = extractId(bv.fills);
            if (fillId) tokens.push({ property: 'fill', variableId: fillId });

            // 2. Strokes
            const strokeId = extractId(bv.strokes);
            if (strokeId) tokens.push({ property: 'stroke', variableId: strokeId });

            // 3. Layout & Geometry
            const spacingId = extractId(bv.itemSpacing);
            if (spacingId) tokens.push({ property: 'spacing', variableId: spacingId });

            const radiusId = extractId(bv.cornerRadius) || extractId(bv.topLeftRadius);
            if (radiusId) tokens.push({ property: 'radius', variableId: radiusId });

            const paddingId = extractId(bv.paddingTop) || extractId(bv.paddingLeft);
            if (paddingId) tokens.push({ property: 'padding', variableId: paddingId });

            // 4. Dimensions
            const widthId = extractId(bv.width);
            if (widthId) tokens.push({ property: 'width', variableId: widthId });

            const heightId = extractId(bv.height);
            if (heightId) tokens.push({ property: 'height', variableId: heightId });
        }

        this.nodes.push({
            id: node.id,
            name: node.name,
            type: node.type,
            parentId: context.parentId,
            depth: context.depth,
            tokens
        });
    }

    getAnatomy(): SceneNodeAnatomy[] {
        return this.nodes;
    }
}
