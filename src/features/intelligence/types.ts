export type TokenValue = string | number | Record<string, unknown>;

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
    $value: TokenValue;
    $type: TokenType;
    usageCount?: number;
}

export type IntentType = 'GENERATE_SYSTEM' | 'MODIFY_TOKEN' | 'ANSWER_QUESTION' | 'RENAME_COLLECTION';

export interface UserIntent {
    type: IntentType;
    confidence: number;
    originalQuery: string;
    payload?: Record<string, unknown>;
}

export interface AgentContext {
    apiKey: string;
    vibe: string;
    primitives: ScannedPrimitive[];
    history: string[];
}
