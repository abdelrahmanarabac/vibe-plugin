import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { VibeToken } from '../core/schema/TokenSchema';
import { SemanticMapper } from '../modules/tokens/logic/SemanticMapper';

// 1. Valid Interface Separation
interface TokenState {
    collectionName: string;
    tokens: VibeToken[];
    isGenerating: boolean;
}

interface TokenActions {
    setCollectionName: (name: string) => void;
    addToken: (token: VibeToken) => void;
    clearTokens: () => void;
    generateCollection: () => void;
}

// 2. Split Contexts
const TokenDataCtx = createContext<TokenState | undefined>(undefined);
const TokenActionsCtx = createContext<TokenActions | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<VibeToken[]>([]);
    const [collectionName, setCollectionName] = useState("Vibe System");
    const [isGenerating, setIsGenerating] = useState(false);

    // 3. Memoize Actions (Stable References)
    const actions = useMemo<TokenActions>(() => ({
        setCollectionName: (name: string) => setCollectionName(name),

        addToken: (token: VibeToken) => {
            setTokens(prev => [...prev, token]);
        },

        clearTokens: () => {
            setTokens([]);
        },

        generateCollection: () => {
            setIsGenerating(true);
            const seedColor = "#0080FF";

            const colorTokens = SemanticMapper.generateSystem({ primary: seedColor });
            // Archived Generators removed
            const systemTokens = [
                ...colorTokens
            ];

            setTokens(systemTokens);

            parent.postMessage({
                pluginMessage: {
                    type: 'CREATE_TOKENS',
                    payload: {
                        name: collectionName, // Closure capture warning: check dependency
                        tokens: systemTokens
                    }
                }
            }, '*');

            setTimeout(() => setIsGenerating(false), 2000);
        }
    }), [collectionName]); // Re-create actions only if collectionName changes (needed for generateCollection payload)

    // Optimization: If generateCollection depends on collectionName, we must include it in deps.
    // Ideally we pass name as arg to avoid re-creating the function, but for now this is better than 'everything'.

    const state = useMemo(() => ({
        tokens,
        collectionName,
        isGenerating
    }), [tokens, collectionName, isGenerating]);

    return (
        <TokenActionsCtx.Provider value={actions}>
            <TokenDataCtx.Provider value={state}>
                {children}
            </TokenDataCtx.Provider>
        </TokenActionsCtx.Provider>
    );
};

// 4. Granular Hooks
export const useTokenState = () => {
    const context = useContext(TokenDataCtx);
    if (!context) throw new Error("useTokenState must be used within a TokenProvider");
    return context;
};

export const useTokenActions = () => {
    const context = useContext(TokenActionsCtx);
    if (!context) throw new Error("useTokenActions must be used within a TokenProvider");
    return context;
};

// Legacy support (optional, but good for backward compat if needed temporarily)
export const useTokens = () => {
    const state = useTokenState();
    const actions = useTokenActions();
    return { ...state, ...actions };
};
