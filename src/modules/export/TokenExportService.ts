import type { TokenEntity } from '../../core/types';
import type { ITokenAdapter, TokenExportResult } from './interfaces/ITokenExporter';


/**
 * 🧠 TokenExportService
 * 
 * **Purpose:**
 * Central orchestrator for token export operations using the Adapter Pattern.
 * Manages a registry of export adapters and coordinates export requests.
 * 
 * **Architecture Pattern:**
 * - **Singleton:** Single instance manages adapter registry
 * - **Adapter Pattern:** Decouples core logic from format-specific implementations
 * - **Registry Pattern:** Dynamic adapter registration and lookup
 * 
 * **Design Principles:**
 * - **Open/Closed:** Add new export formats without modifying this service
 * - **Dependency Inversion:** Depends on ITokenAdapter abstraction
 * - **Single Responsibility:** Only coordinates adapters, doesn't transform tokens
 * 
 * **Usage Example:**
 * ```typescript
 * const exportService = TokenExportService.getInstance();
 * 
 * // Register adapters
 * exportService.registerAdapter(new DTCGAdapter());
 * exportService.registerAdapter(new CSSAdapter());
 * 
 * // Export to specific format
 * const result = await exportService.exportAll(tokens, 'css');
 * console.log(result.content); // CSS variables
 * ```
 */
export class TokenExportService {
    private static instance: TokenExportService | null = null;

    /**
     * Adapter registry: format identifier → adapter instance
     * Uses Map for O(1) lookup performance
     */
    private adapters: Map<string, ITokenAdapter> = new Map();

    /**
     * Private constructor enforces Singleton pattern
     * Use TokenExportService.getInstance() instead
     */
    private constructor() {
        // Intentionally empty - initialization happens in getInstance()
    }

    /**
     * Gets the singleton instance of TokenExportService
     * 
     * **Lazy Initialization:**
     * Instance is created on first access, not at module load time.
     * 
     * @returns Singleton instance
     */
    public static getInstance(): TokenExportService {
        if (!TokenExportService.instance) {
            TokenExportService.instance = new TokenExportService();
        }

        return TokenExportService.instance;
    }

    /**
     * Registers a new export adapter
     * 
     * **Registration Rules:**
     * - Format IDs must be unique (overwrites existing if duplicate)
     * - Adapter is immediately available for export calls
     * 
     * **Example:**
     * ```typescript
     * service.registerAdapter(new DTCGAdapter());
     * service.registerAdapter(new CSSAdapter());
     * service.registerAdapter(new TypeScriptAdapter());
     * ```
     * 
     * @param adapter - Adapter instance implementing ITokenAdapter
     * @returns this (for method chaining)
     */
    public registerAdapter(adapter: ITokenAdapter): this {
        this.adapters.set(adapter.formatId, adapter);
        return this; // Enable chaining: service.registerAdapter(a).registerAdapter(b)
    }

    /**
     * Unregisters an adapter by format ID
     * 
     * **Use Cases:**
     * - Dynamically disable certain export formats
     * - Replace adapter implementation at runtime
     * 
     * @param formatId - Format identifier to remove
     * @returns true if adapter was found and removed, false otherwise
     */
    public unregisterAdapter(formatId: string): boolean {
        return this.adapters.delete(formatId);
    }

    /**
     * Checks if an adapter is registered for a given format
     * 
     * @param formatId - Format identifier to check
     * @returns true if adapter exists, false otherwise
     */
    public hasAdapter(formatId: string): boolean {
        return this.adapters.has(formatId);
    }

    /**
     * Gets a registered adapter by format ID
     * 
     * @param formatId - Format identifier
     * @returns Adapter instance or undefined if not found
     */
    public getAdapter(formatId: string): ITokenAdapter | undefined {
        return this.adapters.get(formatId);
    }

    /**
     * Lists all registered adapter format IDs
     * 
     * **Use Case:**
     * Display available export formats to users in UI
     * 
     * @returns Array of format identifiers
     */
    public getAvailableFormats(): string[] {
        return Array.from(this.adapters.keys());
    }

    /**
     * Lists all registered adapters with their descriptions
     * 
     * **Use Case:**
     * Populate export format dropdown in UI with human-readable labels
     * 
     * @returns Array of { formatId, description } objects
     */
    public getAdapterInfo(): Array<{ formatId: string; description: string }> {
        return Array.from(this.adapters.values()).map(adapter => ({
            formatId: adapter.formatId,
            description: adapter.description
        }));
    }

    /**
     * Exports tokens to a specific format
     * 
     * **Workflow:**
     * 1. Validates format is registered
     * 2. Delegates transformation to format-specific adapter
     * 3. Returns result with content and metadata
     * 
     * **Error Handling:**
     * - Throws if format is not registered (fail-fast)
     * - Propagates adapter-specific errors to caller
     * 
     * **Example:**
     * ```typescript
     * try {
     *   const css = await service.exportAll(tokens, 'css');
     *   downloadFile(css.filename, css.content, css.mimeType);
     * } catch (error) {
     *   console.error('Export failed:', error);
     * }
     * ```
     * 
     * @param tokens - Array of fully resolved tokens
     * @param formatId - Target export format identifier
     * @returns Promise<TokenExportResult> with exported content
     * 
     * @throws {Error} If format is not registered
     * @throws {Error} Propagates adapter-specific transformation errors
     */
    public async exportAll(
        tokens: TokenEntity[],
        formatId: string
    ): Promise<TokenExportResult> {
        // Validate adapter exists
        const adapter = this.adapters.get(formatId);

        if (!adapter) {
            const availableFormats = this.getAvailableFormats().join(', ');
            throw new Error(
                `❌ Export format "${formatId}" is not registered. ` +
                `Available formats: ${availableFormats || 'none'}`
            );
        }

        // Defensive programming: Validate input
        if (!Array.isArray(tokens)) {
            throw new Error('❌ Invalid input: tokens must be an array');
        }

        // Delegate to format-specific adapter
        try {
            return await adapter.export(tokens);
        } catch (error) {
            // Enrich error with context
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(
                `❌ Export to "${formatId}" failed: ${message}`
            );
        }
    }

    /**
     * Exports tokens to multiple formats concurrently
     * 
     * **Performance Optimization:**
     * Uses Promise.all() for parallel execution of independent exports
     * 
     * **Error Handling:**
     * Returns results with success/error status for each format
     * Does NOT fail-fast (continues if one format fails)
     * 
     * **Example:**
     * ```typescript
     * const results = await service.exportMultiple(tokens, ['css', 'dtcg', 'typescript']);
     * results.forEach(result => {
     *   if (result.success) {
     *     console.log(`✅ ${result.format}: ${result.data.filename}`);
     *   } else {
     *     console.error(`❌ ${result.format}: ${result.error}`);
     *   }
     * });
     * ```
     * 
     * @param tokens - Array of fully resolved tokens
     * @param formatIds - Array of format identifiers
     * @returns Promise<ExportBatchResult[]> with results for each format
     */
    public async exportMultiple(
        tokens: TokenEntity[],
        formatIds: string[]
    ): Promise<ExportBatchResult[]> {
        // Parallel execution
        const promises = formatIds.map(async (formatId) => {
            try {
                const data = await this.exportAll(tokens, formatId);
                return {
                    format: formatId,
                    success: true as const,
                    data
                };
            } catch (error) {
                return {
                    format: formatId,
                    success: false as const,
                    error: error instanceof Error ? error.message : String(error)
                };
            }
        });

        return Promise.all(promises);
    }

    /**
     * Resets the service state
     * Clears all registered adapters
     * 
     * **Use Cases:**
     * - Testing (reset between test cases)
     * - Dynamic adapter management
     */
    public reset(): void {
        this.adapters.clear();
    }

    /**
     * Resets the singleton instance (for testing only)
     * ⚠️ DO NOT USE IN PRODUCTION CODE
     */
    public static resetInstance(): void {
        TokenExportService.instance = null;
    }
}

/**
 * Result type for batch export operations
 */
export type ExportBatchResult =
    | {
        format: string;
        success: true;
        data: TokenExportResult;
    }
    | {
        format: string;
        success: false;
        error: string;
    };
