export interface DesignSystemConfig {
    metadata: {
        name: string;
        version: string;
        createdAt: string;
    };
    brand: {
        primaryColor: string;
        name: string;
    };
    typography: {
        fontFamily: string;
        customFontName?: string;
        scaleRatio: number;
        baseSize: number;
    };
    layout: {
        gridBase: 4 | 8;
    };
    advanced: {
        includeSemantics: boolean;
        multiMode: boolean;
    };
}

export interface ConfigContextType {
    config: DesignSystemConfig;
    updateConfig: (updates: Partial<DesignSystemConfig>) => void;
    resetConfig: () => void;
    isLoaded: boolean;
}
