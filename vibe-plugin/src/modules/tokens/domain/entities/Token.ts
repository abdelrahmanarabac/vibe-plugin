export type TokenValue = string | number | { [key: string]: any };

export interface TokenEntity {
    id: string; // "brand.primary"
    name: string; // "primary"
    value: TokenValue;
    type: 'color' | 'spacing' | 'typography' | 'borderRadius' | 'boxShadow' | 'number' | 'string';
    description?: string;
    path: string[]; // ['brand', 'primary']

    // Metadata for aliasing
    originalValue?: string; // "{colors.blue.500}"
    isAlias?: boolean;
    resolvedValue?: any;

    // Governance
    tags?: string[];
}
