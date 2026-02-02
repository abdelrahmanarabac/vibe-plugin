import type { TokenEntity } from '../../../core/types';

/**
 * 📦 TokenExportResult
 * 
 * Represents the output of a token export operation.
 * Contains all necessary metadata for file generation or API delivery.
 */
export interface TokenExportResult {
    /**
     * Target filename (e.g., "tokens.css", "design-tokens.json")
     */
    filename: string;

    /**
     * Generated content as string
     * (JSON serialized, CSS text, or any string-based format)
     */
    content: string;

    /**
     * MIME type for proper content-type headers
     * Examples: "application/json", "text/css", "text/plain"
     */
    mimeType: string;

    /**
     * Human-readable format identifier
     * Examples: "css-variables", "dtcg", "typescript", "scss"
     */
    format: string;
}

/**
 * 🔌 ITokenAdapter
 * 
 * The Adapter Pattern contract for token export transformations.
 * Each adapter implements a specific output format (DTCG, CSS, TypeScript, etc.)
 * 
 * **Design Principles:**
 * - Single Responsibility: One adapter = One output format
 * - Dependency Inversion: Core logic depends on this abstraction, not implementations
 * - Open/Closed: Add new formats without modifying existing code
 * 
 * **Why Async?**
 * Future-proofs for potential file I/O, network calls, or heavy transformations
 * that may require Worker threads in Figma's sandbox.
 */
export interface ITokenAdapter {
    /**
     * Transforms a collection of TokenEntity objects into a specific output format.
     * 
     * @param tokens - Array of fully resolved tokens (dependencies compiled)
     * @returns Promise resolving to export result with content and metadata
     * 
     * @throws {Error} If token validation fails or transformation encounters critical error
     * 
     * **Implementation Requirements:**
     * - Must handle empty token arrays gracefully
     * - Must validate $type and $value compatibility
     * - Must preserve semantic meaning during transformation
     * - Must NOT mutate input tokens
     */
    export(tokens: TokenEntity[]): Promise<TokenExportResult>;

    /**
     * Unique identifier for this adapter (e.g., "dtcg", "css", "scss")
     * Used for registry lookup in ExportService
     */
    readonly formatId: string;

    /**
     * Human-readable description of the output format
     */
    readonly description: string;
}
