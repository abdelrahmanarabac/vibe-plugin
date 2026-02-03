/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import type { DesignSystemConfig, ConfigContextType } from './ConfigTypes';
export type { DesignSystemConfig, ConfigContextType };

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: DesignSystemConfig = {
    metadata: {
        name: 'Vibe Tokens Design System',
        version: '1.0.0',
        createdAt: new Date().toISOString()
    },
    brand: {
        primaryColor: '#00E5FF', // Electric Cyan from brand
        name: 'Brand Primary'
    },
    typography: {
        fontFamily: 'Inter',
        scaleRatio: 1.25, // Major Third
        baseSize: 16
    },
    layout: {
        gridBase: 4
    },
    advanced: {
        includeSemantics: true,
        multiMode: false
    }
};

// ============================================================================
// CONTEXT
// ============================================================================

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'vibe-tokens-config';

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<DesignSystemConfig>(DEFAULT_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load config from Figma storage on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                parent.postMessage({
                    pluginMessage: { type: 'LOAD_SETTINGS', key: STORAGE_KEY }
                }, '*');
            } catch (e) {
                console.error('Failed to load config:', e);
                setIsLoaded(true);
            }
        };

        loadConfig();

        // Listen for loaded config
        const handleMessage = (event: MessageEvent) => {
            const msg = event.data.pluginMessage;
            if (msg?.type === 'SETTINGS_LOADED' && msg.key === STORAGE_KEY) {
                if (msg.value) {
                    setConfig({ ...DEFAULT_CONFIG, ...msg.value });
                }
                setIsLoaded(true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Persist config whenever it changes
    useEffect(() => {
        if (isLoaded) {
            parent.postMessage({
                pluginMessage: {
                    type: 'SAVE_SETTINGS',
                    key: STORAGE_KEY,
                    value: config
                }
            }, '*');
        }
    }, [config, isLoaded]);

    const updateConfig = (updates: Partial<DesignSystemConfig>) => {
        setConfig(prev => {
            // Deep merge for nested updates
            const merged = { ...prev };

            if (updates.metadata) merged.metadata = { ...prev.metadata, ...updates.metadata };
            if (updates.brand) merged.brand = { ...prev.brand, ...updates.brand };
            if (updates.typography) merged.typography = { ...prev.typography, ...updates.typography };
            if (updates.layout) merged.layout = { ...prev.layout, ...updates.layout };
            if (updates.advanced) merged.advanced = { ...prev.advanced, ...updates.advanced };

            return merged;
        });
    };

    const resetConfig = () => {
        setConfig({
            ...DEFAULT_CONFIG,
            metadata: {
                ...DEFAULT_CONFIG.metadata,
                createdAt: new Date().toISOString()
            }
        });
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig, isLoaded }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};
