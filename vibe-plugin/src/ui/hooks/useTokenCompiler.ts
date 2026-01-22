import { useState, useEffect, useRef } from 'react';
import { TokenEntity } from '../../modules/tokens/domain/entities/Token';
// Note: In Vite, use 'import ...?worker'
// import CompilerWorker from '../../workers/CompilerWorker?worker'; 

export function useTokenCompiler() {
    const [isCompiling, setIsCompiling] = useState(false);
    const [compiledTokens, setCompiledTokens] = useState<TokenEntity[]>([]);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        // Initialize Worker
        // For standard Vite setup:
        // workerRef.current = new CompilerWorker();

        // Fallback for raw Setup if simple import doesn't work in this specific env:
        // workerRef.current = new Worker(new URL('../../workers/CompilerWorker.ts', import.meta.url));

        // Mock for now until Worker loader is confirmed
        // workerRef.current = ...

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const compile = (tokens: TokenEntity[]) => {
        setIsCompiling(true);
        if (workerRef.current) {
            workerRef.current.postMessage({ action: 'COMPILE_ALL', tokens });
            workerRef.current.onmessage = (e) => {
                if (e.data.type === 'COMPILATION_COMPLETE') {
                    setCompiledTokens(e.data.payload);
                    setIsCompiling(false);
                }
            };
        } else {
            console.warn("Worker not initialized. Falling back to main thread.");
            // Dynamic import to avoid circular dependency issues if any, or just direct
            import('../../modules/tokens/logic/TokenCompiler').then(({ TokenCompiler }) => {
                const result = TokenCompiler.compileBatch(tokens);
                setCompiledTokens(result);
                setIsCompiling(false);
            });
        }
    };

    return { compile, isCompiling, compiledTokens };
}
