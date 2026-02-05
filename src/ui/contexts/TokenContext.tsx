import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TokenEntity } from '../../core/types';
import { SemanticMapper } from '../../features/tokens/domain/services/SemanticMapper';

// 1. Valid Interface Separation
interface TokenState {
    collectionName: string;
    tokens: TokenEntity[];
    tokenUsage: Record<string, number>; // 🆕
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
    const [tokenUsage, setTokenUsage] = useState<Record<string, number>>({});
    const [collectionName, setCollectionName] = useState("Vibe System");
    const [isGenerating, setIsGenerating] = useState(false);

    // 👂 Listen for Sync/Cache Data
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'SCAN_COMPLETE') {
                // 📥 Hydrate from Cache or Live Scan
                setTokenUsage(payload.usage || {});
                console.log("[TokenContext] Usage data updated:", payload.isCached ? '(Cached)' : '(Live)');
            }
        };

        window.addEventListener('message', handleMessage);

        // 🚀 Trigger Startup Load
        parent.postMessage({ pluginMessage: { type: 'STARTUP' } }, '*');

        return () => window.removeEventListener('message', handleMessage);
    }, []);

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
        tokenUsage,
        collectionName,
        isGenerating
    }), [tokens, tokenUsage, collectionName, isGenerating]); // Added tokenUsage dep

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
