import type { TokenRepository } from './TokenRepository';

/**
 * The Context Object passed to every capability.
 * Contains references to the Core Brain (Graph) and Environment.
 */
export interface AgentContext {
    /**
     * The Single Source of Truth for Design Tokens.
     */
    readonly repository: TokenRepository;

    /**
     * Access to Figma Environment (Selection, etc).
     * Note: In a pure clean architecture, this might be an abstraction,
     * but for the plugin context, we allow constrained access.
     */
    readonly selection: readonly SceneNode[];

    /**
     * Current Page reference
     */
    readonly page: PageNode;

    /**
     * User ID or Session Meta
     */
    readonly session: {
        timestamp: number;
    }
}
