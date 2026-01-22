import type { TokenEntity } from '../entities/Token';

export class TokenFactory {
    static create(props: Partial<TokenEntity> & { name: string; value: any; type: any }): TokenEntity {
        const id = props.id || props.name;
        const path = id.split('.');

        // Basic Validation
        if (!props.name) throw new Error("Token must have a name");
        if (props.value === undefined) throw new Error(`Token ${props.name} must have a value`);

        return {
            id,
            name: props.name,
            value: props.value,
            type: props.type,
            description: props.description,
            path: path,
            originalValue: typeof props.value === 'string' && props.value.startsWith('{') ? props.value : undefined,
            isAlias: typeof props.value === 'string' && props.value.startsWith('{'),
            tags: props.tags || []
        };
    }

    static createFromFigmaVariable(variable: Variable): TokenEntity {
        // Implementation for Figma Variable conversion would go here
        // Placeholder for now as we don't have Figma types in this Node context easily without mocking
        return {
            id: variable.key,
            name: variable.name,
            value: 0, // Placeholder
            type: 'string', // Placeholder
            path: variable.name.split('/')
        } as any;
    }
}
