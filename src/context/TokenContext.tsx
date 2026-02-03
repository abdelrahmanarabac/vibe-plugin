/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { TokenEntity } from '../core/types';
import { SemanticMapper } from '../features/tokens/domain/services/SemanticMapper';

// 1. Valid Interface Separation
interface TokenState {
    collectionName: string;
    tokens: TokenEntity[];
    isGenerating: boolean;
}

interface TokenActions {
    setCollectionName: (name: string) => void;
    addToken: (token: TokenEntity) => void;
    clearTokens: () => void;
    generateCollection: () => void;
}

// 2. Split Contexts
const TokenDataCtx = createContext<TokenState | undefined>(undefined);
const TokenActionsCtx = createContext<TokenActions | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [collectionName, setCollectionName] = useState("Vibe System");
    const [isGenerating, setIsGenerating] = useState(false);

    // 3. Memoize Actions (Stable References)
    const actions = useMemo<TokenActions>(() => ({
        setCollectionName: (name: string) => setCollectionName(name),

        addToken: (token: TokenEntity) => {
            setTokens(prev => [...prev, token]);
        },

        clearTokens: () => {
            setTokens([]);
        },

        generateCollection: () => {
            setIsGenerating(true);
            const seedColor = "#0080FF";

            const systemTokens = SemanticMapper.generateSystem({ primary: seedColor });

            setTokens(systemTokens);

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
        }
    }), [collectionName]);

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

// Legacy support
export const useTokensLegacy = () => {
    const state = useTokenState();
    const actions = useTokenActions();
    return { ...state, ...actions };
};
