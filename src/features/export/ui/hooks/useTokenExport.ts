import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TokenEntity } from '../../../../core/types';
import { TokenExportService } from '../../TokenExportService';
import { DTCGAdapter } from '../../adapters/DTCGAdapter';
import { CSSAdapter } from '../../adapters/CSSAdapter';
import { JSONAdapter } from '../../adapters/JSONAdapter';
import { TypeScriptAdapter } from '../../adapters/TypeScriptAdapter';
import { SCSSAdapter } from '../../adapters/SCSSAdapter';
import { TailwindAdapter } from '../../adapters/TailwindAdapter';
import type { ExportFormData, ExportPreviewData, ExportFormat } from '../types';

/**
 * 🎯 useTokenExport Hook
 * 
 * **Purpose:**
 * Manages state for the Export Activity UI, including:
 * - Export format and options configuration
 * - Live preview generation
 * - Download and clipboard actions
 * 
 * **Design:**
 * - Reactive preview updates on configuration change
 * - Debounced preview generation for performance
 * - Memoized expensive computations
 * 
 * @param tokens - Array of tokens to export
 * @returns Export state and actions
 */
export function useTokenExport(tokens: TokenEntity[]) {
    // Initialize export service and register adapters
    const exportService = useMemo(() => {
        const service = TokenExportService.getInstance();

        // Register all available adapters (only once)
        if (!service.hasAdapter('dtcg')) {
            service.registerAdapter(new DTCGAdapter());
        }
        if (!service.hasAdapter('css')) {
            service.registerAdapter(new CSSAdapter());
        }
        if (!service.hasAdapter('json')) {
            service.registerAdapter(new JSONAdapter());
        }
        if (!service.hasAdapter('typescript')) {
            service.registerAdapter(new TypeScriptAdapter());
        }
        if (!service.hasAdapter('scss')) {
            service.registerAdapter(new SCSSAdapter());
        }
        if (!service.hasAdapter('tailwind')) {
            service.registerAdapter(new TailwindAdapter());
        }

        return service;
    }, []);

    // Form state with sensible defaults
    // Note: Indentation is now hardcoded to '2' spaces per design requirements
    const [formData, setFormData] = useState<ExportFormData>({
        format: 'dtcg',
        namingConvention: 'kebab-case',
        includeMetadata: true,
        includeDependencies: false
    });

    // Preview state
    const [preview, setPreview] = useState<ExportPreviewData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Formats byte size to human-readable string
     */
    const formatSize = useCallback((bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }, []);

    /**
     * Generates export preview based on current form configuration
     */
    const generatePreview = useCallback(async () => {
        if (tokens.length === 0) {
            setPreview(null);
            setError('No tokens available to export');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Export using selected format with options
            const result = await exportService.exportAll(tokens, formData.format, {
                indentation: '2', // Hardcoded per Vibe standards
                namingConvention: formData.namingConvention,
                includeMetadata: formData.includeMetadata
            });

            // Post-process content based on options
            const processedContent = result.content;

            // Calculate size
            const sizeBytes = new Blob([processedContent]).size;

            setPreview({
                content: processedContent,
                filename: result.filename,
                mimeType: result.mimeType,
                sizeBytes,
                sizeDisplay: formatSize(sizeBytes)
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Export generation failed';
            setError(message);
            setPreview(null);
        } finally {
            setIsGenerating(false);
        }
    }, [tokens, formData, exportService, formatSize]); // Added formData dependency for reactivity

    // Regenerate preview when configuration changes
    // Using a debounce effect could be beneficial here if generation became expensive
    useEffect(() => {
        generatePreview();
    }, [generatePreview]);

    /**
     * Updates a specific form field
     */
    const updateFormData = useCallback(<K extends keyof typeof formData>(
        field: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    /**
     * Downloads the current export as a file
     */
    const downloadExport = useCallback(() => {
        if (!preview) return;

        try {
            const blob = new Blob([preview.content], { type: preview.mimeType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = preview.filename;
            link.click();

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    }, [preview]);

    /**
     * Copies export content to clipboard
     * 
     * @returns Promise<boolean> - true if successful
     */
    const copyToClipboard = useCallback(async (): Promise<boolean> => {
        if (!preview) return false;

        try {
            await navigator.clipboard.writeText(preview.content);
            return true;
        } catch (err) {
            // Fallback for older browsers
            try {
                const textarea = document.createElement('textarea');
                textarea.value = preview.content;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            } catch (fallbackErr) {
                console.error('Clipboard copy failed:', fallbackErr);
                return false;
            }
        }
    }, [preview]);

    return {
        // State
        formData,
        preview,
        isGenerating,
        error,

        // Actions
        updateFormData,
        setFormat: (format: ExportFormat) => updateFormData('format', format),
        downloadExport,
        copyToClipboard,
        regenerate: generatePreview
    };
}
