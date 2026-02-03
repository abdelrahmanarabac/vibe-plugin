import React from 'react';
import { motion } from 'framer-motion';
import { Download, Check } from 'lucide-react';

/**
 * 🎬 ExportActions Component
 * 
 * **Purpose:**
 * Download and Copy action buttons with success animations.
 * 
 * **Features:**
 * - Primary download button
 * - Success state with checkmark
 * - Pulse animation on success
 * - Disabled state when no preview available
 */

interface ExportActionsProps {
    /**
     * Download handler
     */
    onDownload: () => void;

    /**
     * Whether export is ready
     */
    isReady: boolean;

    /**
     * Filename for display (e.g., "tokens.json")
     */
    filename?: string;
}

export function ExportActions({ onDownload, isReady, filename }: ExportActionsProps) {
    const [downloaded, setDownloaded] = React.useState(false);

    const handleDownload = () => {
        if (!isReady) return;

        onDownload();
        setDownloaded(true);

        // Reset success state after 2 seconds
        setTimeout(() => setDownloaded(false), 2000);
    };

    return (
        <motion.button
            type="button"
            onClick={handleDownload}
            disabled={!isReady}
            className={`
                w-full py-3.5 rounded-xl
                text-sm font-bold
                shadow-lg
                transition-all duration-300
                flex items-center justify-center gap-2
                border border-white/10
                group relative overflow-hidden
                ${isReady
                    ? downloaded
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)]'
                        : 'bg-primary hover:bg-primary-hover text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] hover:shadow-[0_4px_25px_rgba(110,98,229,0.5)]'
                    : 'bg-surface-2/50 text-text-dim cursor-not-allowed'
                }
            `}
            whileHover={isReady ? { scale: 1.01 } : {}}
            whileTap={isReady ? { scale: 0.99 } : {}}
        >
            {/* Icon */}
            <motion.div
                animate={downloaded ? { scale: [1, 1.2, 1], rotate: [0, 360, 360] } : {}}
                transition={{ duration: 0.5 }}
            >
                {downloaded ? <Check size={16} /> : <Download size={16} />}
            </motion.div>

            {/* Text */}
            <span>
                {downloaded
                    ? 'Downloaded!'
                    : isReady
                        ? 'Download Export'
                        : 'Generating Preview...'
                }
            </span>

            {/* Filename badge */}
            {isReady && filename && !downloaded && (
                <span className="
                    ml-1 px-2 py-0.5 rounded-md
                    bg-white text-primary
                    text-[10px] font-extrabold
                    shadow-sm
                    group-hover:scale-105 transition-transform
                ">
                    {filename}
                </span>
            )}

            {/* Success ripple effect */}
            {downloaded && (
                <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </motion.button>
    );
}
