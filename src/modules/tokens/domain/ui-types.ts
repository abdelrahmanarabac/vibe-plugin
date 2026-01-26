export type TokenType = 'color' | 'spacing' | 'sizing' | 'radius' | 'number' | 'string';
export type ColorScope = 'single' | 'scale' | 'scale-custom';

export interface TokenFormData {
    name: string;
    type: TokenType;
    value: string | { mobile: string; tablet: string; desktop: string };
    scope?: ColorScope;
    range?: [number, number];
    ratio?: string;
    activeModes?: ('mobile' | 'tablet' | 'desktop')[];
}

export interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: any; extensions?: any }) => void;
}
