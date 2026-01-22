import type { ComponentType } from './types';

export type Density = 'COMFORTABLE' | 'COMPACT';

/**
 * 📐 AutoLayoutEngine
 * Handles the spatial logic (padding, gaps, alignment) based on "Density Vibe".
 */
export class AutoLayoutEngine {

    /**
     * Applies standard Vibe layout rules to a frame.
     */
    applyLayout(node: FrameNode, type: ComponentType, density: Density = 'COMFORTABLE'): void {
        node.layoutMode = 'HORIZONTAL'; // Default, adjusted below

        const spacing = this.getSpacing(type, density);

        node.paddingLeft = spacing.paddingX;
        node.paddingRight = spacing.paddingX;
        node.paddingTop = spacing.paddingY;
        node.paddingBottom = spacing.paddingY;
        node.itemSpacing = spacing.gap;

        // Default constraints
        node.primaryAxisAlignItems = 'CENTER';
        node.counterAxisAlignItems = 'CENTER';
        node.primaryAxisSizingMode = 'AUTO';
        node.counterAxisSizingMode = 'AUTO';

        // Type-specific adjustments
        if (type === 'CARD') {
            node.layoutMode = 'VERTICAL';
            node.primaryAxisAlignItems = 'MIN'; // Top
            node.counterAxisAlignItems = 'MIN'; // Left
        }
    }

    /**
     * Calculates precise pixel values for spacing.
     */
    private getSpacing(type: ComponentType, density: Density): { paddingX: number, paddingY: number, gap: number } {
        // Base Unit: 4px
        const multiplier = density === 'COMFORTABLE' ? 1 : 0.75;

        if (type === 'BUTTON') {
            // Comfortable: 16px/32px? standard is usually 12/24
            // Let's stick to Vibe defaults: 12px Y, 24px X
            return {
                paddingY: Math.round(12 * multiplier),
                paddingX: Math.round(24 * multiplier),
                gap: Math.round(8 * multiplier)
            };
        }

        if (type === 'CARD') {
            return {
                paddingY: Math.round(24 * multiplier),
                paddingX: Math.round(24 * multiplier),
                gap: Math.round(16 * multiplier)
            };
        }

        return { paddingX: 16, paddingY: 16, gap: 8 };
    }
}
