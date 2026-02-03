import React from 'react';
import { motion } from 'framer-motion';
import { FileJson, FileCode, FileType, Hash, Waves } from 'lucide-react';
import type { ExportFormat } from '../types';

/**
 * Format metadata for UI display
 */
interface FormatOption {
    id: ExportFormat;
    name: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
}

/**
 * 📊 Available Export Formats
 */
const FORMATS = [
    {
        id: 'dtcg' as ExportFormat,
        name: 'W3C DTCG',
        Icon: FileJson,
        description: 'Industry standard JSON format'
    },
    {
        id: 'css' as ExportFormat,
        name: 'CSS Variables',
        Icon: FileCode,
        description: 'Custom properties for web'
    },
    {
        id: 'scss' as ExportFormat,
        name: 'SCSS',
        Icon: Hash,
        description: 'Sass variables for stylesheets'
    },
    {
        id: 'typescript' as ExportFormat,
        name: 'TypeScript',
        Icon: FileType,
        description: 'Typed const exports'
    },
    {
        id: 'tailwind' as ExportFormat,
        name: 'Tailwind CSS',
        Icon: Waves,
        description: 'Theme configuration'
    },

] as const;

interface FormatSelectorProps {
    selectedFormat: ExportFormat;
    onFormatChange: (format: ExportFormat) => void;
}

/**
 * 🎨 FormatSelector Component
 * 
 * **Purpose:**
 * Glassmorphic card-based format selector with premium animations.
 * 
 * **Design:**
 * - Grid layout (2 cols mobile, 4 cols desktop)
 * - Stagger animation on mount
 * - Hover scale + selected glow effects
 * - Glassmorphism background
 */
export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-1 h-4">
                Export Format
            </label>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {FORMATS.map((format) => (
                    <FormatCard
                        key={format.id}
                        format={format}
                        isSelected={selectedFormat === format.id}
                        onClick={() => onFormatChange(format.id)}
                    />
                ))}
            </motion.div>
        </div>
    );
}

/**
 * Individual format selection card
 */
interface FormatCardProps {
    format: FormatOption;
    isSelected: boolean;
    onClick: () => void;
}

function FormatCard({ format, isSelected, onClick }: FormatCardProps) {
    const { Icon, name, description } = format;

    return (
        <motion.button
            type="button"
            onClick={onClick}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative group
                flex flex-col items-start gap-2 p-4
                rounded-xl border backdrop-blur-md
                transition-all duration-300
                ${isSelected
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(110,98,229,0.3)]'
                    : 'bg-surface-2/50 border-surface-2 hover:border-surface-2/80'
                }
            `}
        >
            {/* Icon */}
            <div className={`
                p-2 rounded-lg 
                transition-colors duration-300
                ${isSelected
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface-1/50 text-text-dim group-hover:text-white'
                }
            `}>
                <Icon size={18} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start gap-1 text-left">
                <span className={`
                    text-sm font-bold
                    transition-colors duration-300
                    ${isSelected ? 'text-white' : 'text-text group-hover:text-white'}
                `}>
                    {name}
                </span>
                <span className="text-[10px] text-text-dim leading-tight">
                    {description}
                </span>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <motion.div
                    layoutId="formatSelector"
                    className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}

            {/* Ambient Glow */}
            {isSelected && (
                <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-xl" />
            )}
        </motion.button>
    );
}

/**
 * Framer Motion animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};
