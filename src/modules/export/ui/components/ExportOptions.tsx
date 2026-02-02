import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Settings2 } from 'lucide-react';
import type { IndentationType, NamingConvention } from '../types';

/**
 * 🎛️ ExportOptions Component
 * 
 * **Purpose:**
 * Collapsible options panel for customizing export output.
 * 
 * **Features:**
 * - Indentation style selector (2 spaces, 4 spaces, tabs)
 * - Naming convention selector (kebab-case, camelCase, snake_case)
 * - Metadata inclusion toggle
 * - Smooth expand/collapse animation
 * - Glassmorphism design
 */

interface ExportOptionsProps {
    /**
     * Current indentation setting
     */
    indentation: IndentationType;

    /**
     * Current naming convention
     */
    namingConvention: NamingConvention;

    /**
     * Whether to include metadata
     */
    includeMetadata: boolean;

    /**
     * Indentation change handler
     */
    onIndentationChange: (value: IndentationType) => void;

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
    indentation,
    namingConvention,
    includeMetadata,
    onIndentationChange,
    onNamingConventionChange,
    onIncludeMetadataChange
}: ExportOptionsProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
                relative
                rounded-xl
                bg-surface-2/50 backdrop-blur-md
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
                    hover:bg-surface-2/80 transition-colors
                    group
                "
            >
                <div className="flex items-center gap-3">
                    <Settings2 size={16} className="text-primary" />
                    <span className="text-sm font-bold text-white">
                        Export Options
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
                <div className="px-5 pb-5 space-y-5 border-t border-surface-2/50">
                    {/* Indentation Selector */}
                    <div className="pt-4">
                        <label className="block text-xs font-bold text-text-dim uppercase tracking-wider mb-2">
                            Indentation
                        </label>
                        <div className="flex gap-2">
                            <IndentButton
                                value="2"
                                label="2 Spaces"
                                isSelected={indentation === '2'}
                                onClick={() => onIndentationChange('2')}
                            />
                            <IndentButton
                                value="4"
                                label="4 Spaces"
                                isSelected={indentation === '4'}
                                onClick={() => onIndentationChange('4')}
                            />
                            <IndentButton
                                value="tab"
                                label="Tabs"
                                isSelected={indentation === 'tab'}
                                onClick={() => onIndentationChange('tab')}
                            />
                        </div>
                    </div>

                    {/* Naming Convention Selector */}
                    <div>
                        <label className="block text-xs font-bold text-text-dim uppercase tracking-wider mb-2">
                            Naming Convention
                        </label>
                        <div className="flex gap-2">
                            <NamingButton
                                value="kebab-case"
                                label="kebab-case"
                                example="color-primary"
                                isSelected={namingConvention === 'kebab-case'}
                                onClick={() => onNamingConventionChange('kebab-case')}
                            />
                            <NamingButton
                                value="camelCase"
                                label="camelCase"
                                example="colorPrimary"
                                isSelected={namingConvention === 'camelCase'}
                                onClick={() => onNamingConventionChange('camelCase')}
                            />
                            <NamingButton
                                value="snake_case"
                                label="snake_case"
                                example="color_primary"
                                isSelected={namingConvention === 'snake_case'}
                                onClick={() => onNamingConventionChange('snake_case')}
                            />
                        </div>
                    </div>

                    {/* Metadata Toggle */}
                    <div>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <div>
                                <span className="block text-xs font-bold text-text-dim uppercase tracking-wider">
                                    Include Metadata
                                </span>
                                <span className="block text-[10px] text-text-dim mt-0.5">
                                    Add version and timestamp to output
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onIncludeMetadataChange(!includeMetadata)}
                                className={`
                                    relative w-11 h-6 rounded-full
                                    transition-colors duration-200
                                    ${includeMetadata ? 'bg-primary' : 'bg-surface-2'}
                                `}
                            >
                                <motion.div
                                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                                    animate={{ left: includeMetadata ? 24 : 4 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </label>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* --- Internal Components --- */

interface IndentButtonProps {
    value: IndentationType;
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

function IndentButton({ label, isSelected, onClick }: IndentButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex-1 px-3 py-2 rounded-lg
                text-xs font-bold
                transition-all duration-200
                ${isSelected
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-surface-2/50 text-text-dim hover:text-white border border-surface-2 hover:border-surface-2/80'
                }
            `}
        >
            {label}
        </button>
    );
}

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
                flex-1 px-3 py-2.5 rounded-lg
                text-xs font-bold
                transition-all duration-200
                ${isSelected
                    ? 'bg-primary/20 text-primary border border-primary/50'
                    : 'bg-surface-2/50 text-text-dim hover:text-white border border-surface-2 hover:border-surface-2/80'
                }
            `}
        >
            <div className="text-xs font-bold">{label}</div>
            <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-primary/70' : 'text-text-dim'}`}>
                {example}
            </div>
        </button>
    );
}
