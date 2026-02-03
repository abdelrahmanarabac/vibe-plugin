/**
 * 📦 Export UI Type Definitions
 * 
 * Type-safe contracts for the Export Activity UI components and state management.
 */

/**
 * Available export formats
 */
export type ExportFormat = 'dtcg' | 'css' | 'json' | 'typescript' | 'scss' | 'tailwind';

/**
 * Naming convention for variable names (primarily affects CSS output)
 */
export type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case';

/**
 * Export form configuration state
 * 
 * Represents user selections and preferences for token export.
 */
export interface ExportFormData {
    /**
     * Selected output format
     */
    format: ExportFormat;

    /**
     * Naming convention for generated identifiers
     */
    namingConvention: NamingConvention;

    /**
     * Include metadata fields (version, exportedAt) in output
     */
    includeMetadata: boolean;

    /**
     * Include dependency/dependent arrays in output
     */
    includeDependencies: boolean;
}

/**
 * Generated export preview data
 * 
 * Contains the generated export content and metadata for display/download.
 */
export interface ExportPreviewData {
    /**
     * Generated export content (JSON, CSS, TypeScript, etc.)
     */
    content: string;

    /**
     * Suggested filename for download
     */
    filename: string;

    /**
     * MIME type for file download
     */
    mimeType: string;

    /**
     * Content size in bytes (for UI display)
     */
    sizeBytes: number;

    /**
     * Human-readable size (e.g., "2.4 KB")
     */
    sizeDisplay: string;
}

/**
 * Format metadata for UI display
 */
export interface FormatOption {
    /**
     * Format identifier
     */
    id: ExportFormat;

    /**
     * Display name
     */
    name: string;

    /**
     * Icon component name from lucide-react
     */
    icon: string;

    /**
     * Short description for card
     */
    description: string;

    /**
     * File extension
     */
    extension: string;
}
