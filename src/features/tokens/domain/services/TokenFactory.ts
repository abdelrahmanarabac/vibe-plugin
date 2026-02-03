import type { TokenEntity, TokenType } from '../../../../core/types';

/**
 * 🏭 TokenFactory
 * Standardized factory for creating TokenEntity (W3C Standard).
 */
export class TokenFactory {
    static create(props: {
        name: string;
        path: string[];
        value: string | number;
        type: TokenType;
        description?: string;
    }): TokenEntity {
        const id = `token-${Math.random().toString(36).substr(2, 9)}`;

        return {
            id,
            name: props.name,
            path: props.path,
            $value: props.value,
            $type: props.type,
            $description: props.description,
            $extensions: {
                figma: {
                    scopes: ['ALL_SCOPES'],
                    collectionId: 'default',
                    modeId: 'default',
                    resolvedType: props.type === 'color' ? 'COLOR' : 'FLOAT'
                }
            },
            dependencies: [],
            dependents: []
        };
    }
}
