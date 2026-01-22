import type { Result } from '../../shared/utils/Result';
import type { PluginAction } from '../../shared/types';

/**
 * AgentContext - Dependency Injection Container
 * 
 * Provides all dependencies needed by capabilities through a single interface.
 * This allows easy mocking in tests and decouples capabilities from implementation details.
 */
export interface AgentContext {
    /** The core domain model - Token dependency graph */
    graph: any; // Will be TokenGraph once imported

    /** Adapter for Figma API operations */
    figmaAdapter: IFigmaAdapter;

    /** AI service for intelligent operations */
    aiService: IAIService;

    /** Persistent storage adapter */
    storage: IStorageAdapter;

    /** Logging service */
    logger: ILogger;

    /** Current session information */
    session: SessionInfo;
}

/**
 * ICapability - The Plugin System Contract
 * 
 * Every feature (Scanning, Renaming, Documentation) implements this interface.
 * The CapabilityRegistry routes commands to the appropriate capability.
 * 
 * @example
 * ```typescript
 * class ScanCapability implements ICapability {
 *   readonly id = 'scan.selection';
 *   readonly handles = ['SCAN_SELECTION'];
 *   
 *   canExecute(ctx) { return ctx.figmaAdapter.isReady(); }
 *   async execute(cmd, ctx) { ... }
 * }
 * ```
 */
export interface ICapability {
    /** Unique identifier (e.g., "scan.selection") */
    readonly id: string;

    /** Human-readable name for UI/debugging */
    readonly displayName: string;

    /** Command types this capability handles */
    readonly handles: ReadonlyArray<string>;

    /**
     * Precondition check - validates if capability can execute
     * @returns true if execution is allowed in current state
     */
    canExecute(context: AgentContext): boolean;

    /**
     * Main execution logic
     * @param command - The command to execute
     * @param context - Injected dependencies
     * @returns Result with success value or error
     */
    execute(
        command: PluginAction,
        context: AgentContext
    ): Promise<Result<unknown, CapabilityError>>;

    /**
     * Optional rollback for transactional operations
     * Called when capability fails and needs cleanup
     */
    rollback?(context: AgentContext): Promise<void>;
}

/**
 * CapabilityError - Structured error type for capability failures
 */
export class CapabilityError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly severity: 'warning' | 'error' | 'critical' = 'error',
        public readonly recoverable: boolean = false
    ) {
        super(message);
        this.name = 'CapabilityError';
    }
}

// ============================================================================
// Infrastructure Interfaces (Ports)
// ============================================================================

/**
 * IFigmaAdapter - Abstraction over Figma Plugin API
 * Allows testing capabilities without actual Figma environment
 */
export interface IFigmaAdapter {
    /** Check if Figma API is ready */
    isReady(): boolean;

    /** Get current selection */
    getSelection(): Promise<ReadonlyArray<SceneNode>>;

    /** Get all local variables */
    getLocalVariables(): Promise<Variable[]>;

    /** Get all local collections */
    getLocalCollections(): Promise<VariableCollection[]>;

    /** Create a variable */
    createVariable(
        name: string,
        collection: VariableCollection,
        type: VariableResolvedDataType
    ): Promise<Variable>;

    /** Update variable value */
    updateVariable(id: string, value: any): Promise<void>;

    /** Show notification to user */
    notify(message: string, options?: NotificationOptions): void;
}

/**
 * IAIService - Abstraction over AI provider (Gemini, GPT, etc.)
 */
export interface IAIService {
    /** Generate tokens using AI */
    generateTokens(prompt: string, retries?: number): Promise<string>;

    /** General text generation */
    generate(prompt: string, tier?: 'LITE' | 'SMART' | 'VISION', retries?: number): Promise<string>;

    /** Analyze image with vision model */
    analyzeImage?(imageBytes: Uint8Array, prompt: string): Promise<string>;
}

/**
 * IStorageAdapter - Abstraction over persistent storage
 */
export interface IStorageAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
}

/**
 * ILogger - Structured logging interface
 */
export interface ILogger {
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, error?: Error, meta?: Record<string, any>): void;
    debug(message: string, meta?: Record<string, any>): void;
}

/**
 * SessionInfo - Current session metadata
 */
export interface SessionInfo {
    userId: string;
    sessionId: string;
    startTime: number;
}
