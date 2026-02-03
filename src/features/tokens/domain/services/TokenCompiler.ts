import type { TokenEntity } from '../../../../core/types';

/**
 * ⚙️ TokenCompiler
 * Resolves aliases and computes final values for the token graph.
 * Strictly adheres to the purified TokenEntity schema.
 */
export class TokenCompiler {

    /**
     * Resolves a single token's value against a registry of tokens.
     */
    static compile(
        token: TokenEntity,
        tokenMap: Map<string, TokenEntity>,
        pathIndex: Map<string, TokenEntity>,
        visited = new Set<string>()
    ): TokenEntity {
        const value = token.$value;

        if (typeof value !== 'string' || !value.startsWith('{')) {
            return token;
        }

        if (visited.has(token.id)) {
            console.warn(`Circular dependency detected in ${token.id}`);
            return token;
        }
        visited.add(token.id);

        // Regex to find {segment/segment/name}
        const match = value.match(/^{([^}]+)}$/);
        if (match) {
            const aliasPath = match[1];
            // Optimization: Lookup by Path using pre-computed index
            const target = pathIndex.get(aliasPath);

            if (target) {
                const resolvedTarget = this.compile(target, tokenMap, pathIndex, new Set(visited));
                return {
                    ...token,
                    $value: resolvedTarget.$value
                };
            }
        }

        return token;
    }

    static compileBatch(tokens: TokenEntity[]): TokenEntity[] {
        const tokenMap = new Map(tokens.map(t => [t.id, t]));

        // Build Path Index for O(1) lookup
        const pathIndex = new Map<string, TokenEntity>();
        tokens.forEach(t => {
            const fullPath = [...t.path, t.name].join('/');
            pathIndex.set(fullPath, t);
        });

        return tokens.map(t => this.compile(t, tokenMap, pathIndex));
    }
}
