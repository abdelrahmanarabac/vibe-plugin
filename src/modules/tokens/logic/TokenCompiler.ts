import type { TokenEntity } from '../../../core/types';

/**
 * ⚙️ TokenCompiler
 * Resolves aliases and computes final values for the token graph.
 * Strictly adheres to the purified TokenEntity schema.
 */
export class TokenCompiler {

    /**
     * Resolves a single token's value against a registry of tokens.
     */
    static compile(token: TokenEntity, tokenMap: Map<string, TokenEntity>, visited = new Set<string>()): TokenEntity {
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
            // In a real system, we'd lookup by full path or ID.
            // For this implementation, we assume the tokenMap is keyed by ID.
            const target = Array.from(tokenMap.values()).find(t => {
                const fullPath = [...t.path, t.name].join('/');
                return fullPath === aliasPath;
            });

            if (target) {
                const resolvedTarget = this.compile(target, tokenMap, new Set(visited));
                return {
                    ...token,
                    $value: resolvedTarget.$value
                };
            }
        }

        return token;
    }

    static compileBatch(tokens: TokenEntity[]): TokenEntity[] {
        const map = new Map(tokens.map(t => [t.id, t]));
        return tokens.map(t => this.compile(t, map));
    }
}
