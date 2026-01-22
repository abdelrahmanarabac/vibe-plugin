import type { AgentContext, IFigmaAdapter, IAIService, IStorageAdapter, ILogger, SessionInfo } from './interfaces/ICapability';
import { TokenGraph } from './TokenGraph';

/**
 * AgentContextFactory - Dependency Injection Container Builder
 * 
 * Creates the AgentContext with all injected dependencies.
 * This centralizes dependency wiring and makes testing easier.
 */

interface AgentContextConfig {
    graph: TokenGraph;
    figmaAdapter: IFigmaAdapter;
    aiService: IAIService;
    storage: IStorageAdapter;
    logger: ILogger;
    session?: SessionInfo;
}

/**
 * Creates an AgentContext with all dependencies
 */
export function createAgentContext(config: AgentContextConfig): AgentContext {
    return {
        graph: config.graph,
        figmaAdapter: config.figmaAdapter,
        aiService: config.aiService,
        storage: config.storage,
        logger: config.logger,
        session: config.session || createDefaultSession(),
    };
}

/**
 * Creates a default session (for initial bootstrap)
 */
function createDefaultSession(): SessionInfo {
    return {
        userId: 'anonymous',
        sessionId: generateSessionId(),
        startTime: Date.now(),
    };
}

/**
 * Generates a unique session ID
 */
function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
