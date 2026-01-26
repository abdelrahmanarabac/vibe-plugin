import { useState, useCallback } from 'react';
import type { TokenEntity } from '../../core/types';
import { TokenCompiler } from '../../modules/tokens/logic/TokenCompiler';

/**
 * 🎣 useTokenCompiler
 * React hook to orchestrate token compilation.
 * Bridges the UI state with the logic layer.
 */
export function useTokenCompiler() {
    const [isCompiling, setIsCompiling] = useState(false);
    const [compiledTokens, setCompiledTokens] = useState<TokenEntity[]>([]);

    const compile = useCallback((tokens: TokenEntity[]) => {
        setIsCompiling(true);

        // Simulating the non-blocking nature that would exist with a Worker
        try {
            const result = TokenCompiler.compileBatch(tokens);
            setCompiledTokens(result);
        } catch (error) {
            console.error('[Compiler] Compilation failed:', error);
        } finally {
            setIsCompiling(false);
        }
    }, []);

    return { compile, isCompiling, compiledTokens };
}
