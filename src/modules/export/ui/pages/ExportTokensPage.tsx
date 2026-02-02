import { motion } from 'framer-motion';
import { ArrowLeft, FileDown } from 'lucide-react';
import type { TokenEntity } from '../../../../core/types';
import { useTokenExport } from '../hooks/useTokenExport';
import { FormatSelector } from '../components/FormatSelector';
import { ExportOptions } from '../components/ExportOptions';
import { ExportPreview } from '../components/ExportPreview';
import { ExportActions } from '../components/ExportActions';

/**
 * 📤 ExportTokensPage Component
 * 
 * **Purpose:**
 * Full-screen export activity for generating and downloading design tokens.
 * 
 * **Features:**
 * - Format selection (DTCG, CSS, TypeScript, JSON)
 * - Live preview with syntax highlighting
 * - Download functionality
 * - Copy to clipboard
 * - Premium animations and glassmorphism design
 * 
 * **UX Pattern:**
 * Mirrors CreateTokenPage structure:
 * - Full-screen overlay
 * - Back button for navigation
 * - Fixed bottom action bar
 * - Scroll area for content
 */

interface ExportTokensPageProps {
    /**
     * Tokens to export
     */
    tokens: TokenEntity[];

    /**
     * Back navigation handler
     */
    onBack: () => void;
}

export function ExportTokensPage({ tokens, onBack }: ExportTokensPageProps) {
    const {
        formData,
        preview,
        isGenerating,
        error,
        updateFormData,
        setFormat,
        downloadExport,
        copyToClipboard
    } = useTokenExport(tokens);

    return (
        <div className="w-full h-full relative flex flex-col bg-void">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl mx-auto px-6 py-6 pb-28 flex flex-col relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={onBack}
                                className="
                                    p-2 rounded-lg
                                    bg-surface-2/50 hover:bg-surface-2
                                    border border-surface-2
                                    text-text-dim hover:text-white
                                    transition-all duration-200
                                "
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <div className="flex items-center gap-2">
                                <FileDown size={20} className="text-primary" />
                                <h1 className="text-lg font-bold text-white">
                                    Export Design Tokens
                                </h1>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-xs text-text-dim mt-2 ml-11"
                        >
                            {tokens.length} token{tokens.length !== 1 ? 's' : ''} ready to export
                        </motion.p>
                    </div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-8 relative"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Format Selection */}
                        <FormatSelector
                            selectedFormat={formData.format}
                            onFormatChange={setFormat}
                        />

                        {/* Export Options */}
                        <ExportOptions
                            indentation={formData.indentation}
                            namingConvention={formData.namingConvention}
                            includeMetadata={formData.includeMetadata}
                            onIndentationChange={(value) => updateFormData('indentation', value)}
                            onNamingConventionChange={(value) => updateFormData('namingConvention', value)}
                            onIncludeMetadataChange={(value) => updateFormData('includeMetadata', value)}
                        />

                        {/* Preview or Error State */}
                        {error ? (
                            <div className="
                                p-6 rounded-xl
                                bg-red-500/10 border border-red-500/30
                                text-red-400 text-sm
                            ">
                                <p className="font-bold mb-1">Export Error</p>
                                <p className="text-xs text-red-300">{error}</p>
                            </div>
                        ) : preview ? (
                            <ExportPreview
                                content={preview.content}
                                sizeDisplay={preview.sizeDisplay}
                                onCopy={copyToClipboard}
                            />
                        ) : (
                            <div className="
                                p-8 rounded-xl
                                bg-surface-2/30 border border-surface-2
                                text-center
                            ">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <p className="text-xs text-text-dim">
                                        Generating preview...
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="
                w-full absolute bottom-0 left-0
                p-6
                bg-gradient-to-t from-void via-void to-transparent
                z-50 pointer-events-none
                flex justify-center
            ">
                <div className="w-full max-w-2xl flex gap-4 pointer-events-auto">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex-1 py-3.5 rounded-xl
                            bg-surface-2/80 hover:bg-surface-2
                            backdrop-blur-md
                            text-sm font-bold
                            text-text-dim hover:text-white
                            transition-colors
                            border border-surface-2
                        "
                    >
                        Cancel
                    </button>

                    {/* Download Action */}
                    <div className="flex-[2]">
                        <ExportActions
                            onDownload={downloadExport}
                            isReady={!isGenerating && preview !== null}
                            filename={preview?.filename}
                        />
                    </div>
                </div>
            </div>

            {/* Ambient Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full mix-blend-screen" />
            </div>
        </div>
    );
}
