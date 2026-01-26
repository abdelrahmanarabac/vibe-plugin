export type TokenType = 'color' | 'spacing' | 'sizing' | 'radius' | 'number' | 'string';
export type ColorScope = 'single' | 'scale' | 'scale-custom';

export interface TokenModeValue {
    mobile: string;
    tablet: string;
    desktop: string;
}

export interface TokenFormData {
    name: string;
    type: TokenType;
    value: string | TokenModeValue;
    extensions: {
        scope?: ColorScope;
        range?: [number, number];
        ratio?: string;
        activeModes?: ('mobile' | 'tablet' | 'desktop')[];
    };
}

export interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TokenFormData) => void;
}
