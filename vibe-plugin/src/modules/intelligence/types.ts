export type TokenValue = string | number | Record<string, any>;

export type TokenType = 'color' | 'spacing' | 'borderRadius' | 'typography' | 'boxShadow' | 'fontFamily' | 'fontSize' | 'fontWeight';

export interface VibeToken {
    name: string;
    $value: TokenValue;
    $type: TokenType;
    description?: string;
    tags?: string[];
}

export interface DesignNode {
    id: string;
    type: string;
    name: string;
    fills?: readonly Paint[];
    strokes?: readonly Paint[];
    effects?: readonly Effect[];
    fontName?: FontName;
    fontSize?: number;
    fontWeight?: number;
    letterSpacing?: LetterSpacing;
    lineHeight?: LineHeight;
    cornerRadius?: number | typeof figma.mixed;
    width?: number;
    height?: number;
}

export interface ScannedPrimitive {
    id: string;
    name: string;
    $value: any;
    $type: TokenType;
    usageCount?: number;
}

export interface AgentContext {
    apiKey: string;
    vibe: string;
    primitives: ScannedPrimitive[];
    history: string[];
}
