import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { VibeToken } from '../core/schema/TokenSchema';
import { SemanticMapper } from '../features/color/SemanticMapper';
import { LayoutGenerator } from '../features/layout/LayoutGenerator';
import { TypeGenerator } from '../features/typography/TypeGenerator';

interface TokenContextType {
    collectionName: string;
    setCollectionName: (name: string) => void;
    tokens: VibeToken[];
    addToken: (token: VibeToken) => void;
    clearTokens: () => void;
    generateCollection: () => void;
    isGenerating: boolean;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<VibeToken[]>([]);
    const [collectionName, setCollectionName] = useState("Vibe System");
    const [isGenerating, setIsGenerating] = useState(false);

    const addToken = (token: VibeToken) => {
        setTokens(prev => [...prev, token]);
    };

    const clearTokens = () => {
        setTokens([]);
    };

    const generateCollection = () => {
        setIsGenerating(true);

        // 🔮 INTENT: In the future, this comes from the "Perception" or "User Input"
        // For now, we simulate a seed based on the user's Vibe or a default.
        // If the 'tokens' state is empty, we GENERATE the Vibe System.
        // If 'tokens' has items (from AI), we might want to respect them.

        // Strategy for v0.2: Always regenerate heavily based on Vibe.
        // Ideally we sniff the hex from the "vibe" string if possible, or default.
        const seedColor = "#0080FF"; // Default Blue

        // 1. Semantic Colors
        const colorTokens = SemanticMapper.generateSystem({ primary: seedColor });

        // 2. Layout (Spacing/Radius)
        const layoutTokens = LayoutGenerator.generate();

        // 3. Typography
        const typeTokens = TypeGenerator.generate();

        const systemTokens = [
            ...colorTokens,
            ...layoutTokens,
            ...typeTokens
        ];

        // Add to local state for preview
        setTokens(systemTokens);

        // Dispatch to Controller
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_TOKENS',
                payload: {
                    name: collectionName,
                    tokens: systemTokens
                }
            }
        }, '*');

        setTimeout(() => setIsGenerating(false), 2000);
    };

    return (
        <TokenContext.Provider value={{
            collectionName,
            setCollectionName,
            tokens,
            addToken,
            clearTokens,
            generateCollection,
            isGenerating
        }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useTokens = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useTokens must be used within a TokenProvider");
    }
    return context;
};
