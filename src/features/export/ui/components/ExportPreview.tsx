import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

/**
 * 📋 ExportPreview Component
 * 
 * **Purpose:**
 * Live code preview with syntax highlighting and copy functionality.
 * 
 * **Features:**
 * - Basic JSON syntax highlighting (zero dependencies)
 * - Line numbers
 * - Copy button with success state
 * - File size display
 * 
 * **Performance:**
 * - Memoized to prevent unnecessary re-renders
 * - Syntax highlighting via simple regex (no Prism.js bloat)
 */

interface ExportPreviewProps {
    content: string;
    sizeDisplay: string;
    onCopy: () => Promise<boolean>;
}

export const ExportPreview = React.memo(function ExportPreview({
    content,
    sizeDisplay,
    onCopy
}: ExportPreviewProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        const success = await onCopy();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Split content into lines for line numbers
    const lines = content.split('\n');

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1">
                    Preview
                </label>
                <span className="text-[10px] text-text-dim font-mono">
                    {sizeDisplay}
                </span>
            </div>

            <div className="relative group">
                {/* Copy Button */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`
                        absolute top-3 right-3 z-10
                        p-2 rounded-lg
                        backdrop-blur-md border
                        transition-all duration-300
                        ${copied
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-surface-2/80 border-surface-2 text-text-dim hover:text-white hover:bg-surface-2'
                        }
                    `}
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                            >
                                <Check size={14} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Copy size={14} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {/* Code Preview Container */}
                <div className="
                    relative
                    rounded-xl
                    bg-surface-1/50 backdrop-blur-md
                    border border-surface-2
                    overflow-hidden
                ">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="flex">
                            {/* Line Numbers */}
                            <div className="
                                flex flex-col
                                py-4 px-3
                                bg-surface-2/30
                                border-r border-surface-2
                                select-none
                                text-[10px] font-mono text-text-dim
                            ">
                                {lines.map((_, index) => (
                                    <div key={index} className="leading-5 text-right">
                                        {index + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Code Content */}
                            <div className="flex-1 py-4 px-4">
                                <pre className="text-[11px] font-mono leading-5">
                                    <code
                                        className="text-text-dim"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightSyntax(content)
                                        }}
                                    />
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * 🎨 Basic Syntax Highlighter
 * 
 * **Purpose:**
 * Lightweight syntax highlighting without external dependencies.
 * 
 * **Supports:**
 * - JSON (keys, strings, numbers, booleans, null)
 * - CSS (properties, values)
 * 
 * **Limitations:**
 * - Regex-based (not AST parsing)
 * - May have edge cases with escaped quotes
 * - Good enough for preview purposes
 */
function highlightSyntax(code: string): string {
    // Detect format by content patterns
    const isJSON = code.trim().startsWith('{') || code.trim().startsWith('[');
    const isCSS = code.includes(':root') || code.includes('--');

    if (isJSON) {
        return highlightJSON(code);
    } else if (isCSS) {
        return highlightCSS(code);
    }

    // Fallback: no highlighting
    return escapeHtml(code);
}

/**
 * JSON syntax highlighting
 */
function highlightJSON(json: string): string {
    let highlighted = escapeHtml(json);

    // Property keys (e.g., "name":)
    highlighted = highlighted.replace(
        /"([^"]+)"(\s*):/g,
        '<span class="text-primary font-semibold">"$1"</span>$2:'
    );

    // String values (e.g., : "value")
    highlighted = highlighted.replace(
        /:(\s*)"([^"]*)"/g,
        ':$1<span class="text-secondary">"$2"</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
        /:(\s*)(-?\d+\.?\d*)/g,
        ':$1<span class="text-accent">$2</span>'
    );

    // Booleans and null
    highlighted = highlighted.replace(
        /\b(true|false|null)\b/g,
        '<span class="text-orange-400">$1</span>'
    );

    return highlighted;
}

/**
 * CSS syntax highlighting
 */
function highlightCSS(css: string): string {
    let highlighted = escapeHtml(css);

    // Selectors (e.g., :root)
    highlighted = highlighted.replace(
        /([:.][\w-]+)(\s*{)/g,
        '<span class="text-primary font-semibold">$1</span>$2'
    );

    // Property names (e.g., --color-primary:)
    highlighted = highlighted.replace(
        /(--[\w-]+)(\s*):/g,
        '<span class="text-secondary">$1</span>$2:'
    );

    // Values
    highlighted = highlighted.replace(
        /:(\s*)([^;]+);/g,
        ':$1<span class="text-accent">$2</span>;'
    );

    return highlighted;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
