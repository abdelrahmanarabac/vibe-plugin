import type { TokenEntity } from '../domain/entities/Token';

export class TokenCompiler {

    /**
     * Resolves a single token's value against a registry of tokens.
     */
    static compile(token: TokenEntity, tokenMap: Map<string, TokenEntity>, visited = new Set<string>()): TokenEntity {
        if (!token.isAlias || typeof token.value !== 'string') {
            return token;
        }

        if (visited.has(token.id)) {
            console.warn(`Circular dependency detected in ${token.id}`);
            return token;
        }
        visited.add(token.id);

        const rawValue = token.value as string;
        // Regex to find {alias}
        // const aliasRegex = /{([^}]+)}/g;

        // Single Alias Replacement (Optimization: Direct lookup)
        const match = rawValue.match(/^{([^}]+)}$/);
        if (match) {
            const aliasId = match[1];
            const target = tokenMap.get(aliasId);
            if (target) {
                // Recursive resolution
                const resolvedTarget = this.compile(target, tokenMap, new Set(visited));
                return {
                    ...token,
                    resolvedValue: resolvedTarget.resolvedValue ?? resolvedTarget.value
                };
            }
        }

        // String Interpolation (e.g. "1px solid {colors.red}")
        // For now, simpler implementation:
        return token;
    }

    static compileBatch(tokens: TokenEntity[]): TokenEntity[] {
        const map = new Map(tokens.map(t => [t.id, t]));
        return tokens.map(t => this.compile(t, map));
    }
}
