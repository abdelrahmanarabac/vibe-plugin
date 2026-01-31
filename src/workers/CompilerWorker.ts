import { TokenCompiler } from '../modules/tokens/domain/services/TokenCompiler';

// Web Worker Entry Point
self.onmessage = (e) => {
    const { tokens, action } = e.data;

    if (action === 'COMPILE_ALL') {
        const start = performance.now();
        try {
            // Offload heavy graph traversal
            const result = TokenCompiler.compileBatch(tokens);
            const end = performance.now();

            self.postMessage({
                type: 'COMPILATION_COMPLETE',
                payload: result,
                metrics: { time: end - start }
            });
        } catch (error: unknown) {
            self.postMessage({
                type: 'ERROR',
                message: error instanceof Error ? error.message : String(error)
            });
        }
    }
};
