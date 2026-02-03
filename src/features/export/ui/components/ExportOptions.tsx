import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Settings2, FileCode } from 'lucide-react';
import type { NamingConvention } from '../types';

/**
 * 🎛️ ExportOptions Component
 * 
 * **Purpose:**
 * Collapsible options panel for customizing export output.
 * 
 * **Features:**
 * - Naming convention selector (kebab-case, camelCase, snake_case)
 * - Metadata inclusion toggle
 * - Smooth expand/collapse animation
 * - Glassmorphism design
 * - Live Variable Preview
 */

interface ExportOptionsProps {
    /**
     * Current naming convention
     */
    namingConvention: NamingConvention;

    /**
     * Whether to include metadata
     */
    includeMetadata: boolean;

    /**
     * Naming convention change handler
     */
    onNamingConventionChange: (value: NamingConvention) => void;

    /**
     * Metadata toggle handler
     */
    onIncludeMetadataChange: (value: boolean) => void;
}

export function ExportOptions({
    namingConvention,
    includeMetadata,
    onNamingConventionChange,
    onIncludeMetadataChange
}: ExportOptionsProps) {
    const [isExpanded, setIsExpanded] = React.useState(true); // Default to expanded for better discovery

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
                relative
                rounded-xl
                bg-surface-2/30 backdrop-blur-md
                border border-surface-2
                overflow-hidden
            "
        >
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                    w-full px-5 py-4
                    flex items-center justify-between
                    hover:bg-surface-2/50 transition-colors
                    group
                "
            >
                <div className="flex items-center gap-3">
                    <Settings2 size={16} className="text-primary" />
                    <span className="text-sm font-bold text-white">
                        Export Configuration
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-text-dim group-hover:text-white transition-colors" />
                </motion.div>
            </button>

            {/* Expandable Content */}
            <motion.div
                initial={false}
                animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
            >
                <div className="px-5 pb-5 space-y-6 border-t border-surface-2/30 pt-5">

                    {/* Metadata Toggle - Promoted to top */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1/50 border border-surface-2/50">
                        <div>
                            <span className="block text-xs font-bold text-white mb-0.5">
                                Export Metadata
                            </span>
                            <span className="block text-[10px] text-text-dim">
                                Add version timestamp header
                            </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={includeMetadata}
                                onChange={(e) => onIncludeMetadataChange(e.target.checked)}
                            />
                            <div className="w-9 h-5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Naming Convention Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-text-dim uppercase tracking-wider">
                                Variable Naming
                            </label>
                            <span className="text-[10px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
                                Live Preview
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <NamingButton
                                value="kebab-case"
                                label="Kebab Case"
                                example="color-primary-500"
                                isSelected={namingConvention === 'kebab-case'}
                                onClick={() => onNamingConventionChange('kebab-case')}
                            />
                            <NamingButton
                                value="camelCase"
                                label="Camel Case"
                                example="colorPrimary500"
                                isSelected={namingConvention === 'camelCase'}
                                onClick={() => onNamingConventionChange('camelCase')}
                            />
                            <NamingButton
                                value="snake_case"
                                label="Snake Case"
                                example="color_primary_500"
                                isSelected={namingConvention === 'snake_case'}
                                onClick={() => onNamingConventionChange('snake_case')}
                            />
                        </div>
                    </div>

                    {/* Live Code Snippet Preview */}
                    <div className="rounded-lg bg-surface-1 border border-surface-2 p-3 font-mono text-[10px] leading-relaxed text-text-dim overflow-hidden relative">
                        <div className="absolute top-2 right-2 opacity-20">
                            <FileCode size={14} />
                        </div>
                        <div><span className="text-purple-400">const</span> <span className="text-yellow-300">tokens</span> = {'{'}</div>
                        <div className="pl-4">
                            <span className="text-blue-300">
                                {namingConvention === 'kebab-case' && '"color-primary"'}
                                {namingConvention === 'camelCase' && 'colorPrimary'}
                                {namingConvention === 'snake_case' && 'color_primary'}
                            </span>
                            : <span className="text-green-300">"#6366f1"</span>,
                        </div>
                        <div>{'}'};</div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
}

/* --- Internal Components --- */

interface NamingButtonProps {
    value: NamingConvention;
    label: string;
    example: string;
    isSelected: boolean;
    onClick: () => void;
}

function NamingButton({ label, example, isSelected, onClick }: NamingButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex flex-col items-start p-3 rounded-lg
                text-left w-full
                transition-all duration-200 border
                ${isSelected
                    ? 'bg-primary/10 border-primary/40 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-surface-2/30 border-transparent hover:bg-surface-2 hover:border-surface-3'
                }
            `}
        >
            <div className={`text-xs font-bold mb-1 ${isSelected ? 'text-primary' : 'text-white'}`}>
                {label}
            </div>
            <div className={`text-[10px] font-mono truncate w-full ${isSelected ? 'text-primary/70' : 'text-text-dim'}`}>
                {example}
            </div>
        </button>
    );
}
