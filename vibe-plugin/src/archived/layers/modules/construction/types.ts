/**
 * 🏗️ Construction Types
 * Defines the recipes for generating Figma Components from Vibe Tokens.
 */

export type ComponentType = 'BUTTON' | 'CARD' | 'INPUT' | 'MODAL';

export type ComponentVariant = 'PRIMARY' | 'SECONDARY' | 'GHOST';

export interface ComponentRecipe {
    type: ComponentType;
    variant: ComponentVariant;
    tokens: {
        fill: string; // Token Name/ID (e.g., 'color/primary/bg')
        text: string; // Token Name/ID
        border?: string;
        radius: string;
        spacing: string;
    };
    layout: {
        padding: number;
        gap: number;
        align: 'CENTER' | 'LEFT' | 'RIGHT';
    };
}

export interface ConstructionContext {
    collectionId?: string; // If binding to variables
}
