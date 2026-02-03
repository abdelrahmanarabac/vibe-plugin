import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../../../ui/utils/cn';

export interface SelectOption {
    value: string | number;
    label: string | React.ReactNode;
    disabled?: boolean;
}

export interface SelectProps {
    value?: string | number;
    onChange: (value: string | number) => void;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    disabled = false,
    className,
    size = 'md'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const sizeClasses = {
        sm: 'h-8 text-xs px-2',
        md: 'h-[42px] text-sm px-3',
        lg: 'h-12 text-base px-4'
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
        >
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full bg-surface-1 border border-surface-2 rounded-xl transition-all duration-200 outline-none",
                    "text-text-primary font-medium hover:bg-surface-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/50",
                    {
                        'opacity-50 cursor-not-allowed hidden': disabled, // Fix cursor
                        'ring-1 ring-primary/50 border-primary/50': isOpen,
                    },
                    sizeClasses[size]
                )}
            >
                <span className={cn("truncate", !selectedOption && "text-text-muted")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={size === 'sm' ? 14 : 16}
                    className={cn("text-text-dim transition-transform duration-200", isOpen && "rotate-180")}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        className="absolute z-[100] w-full mt-1 bg-surface-1 border border-surface-2 rounded-xl shadow-xl shadow-black/50 overflow-hidden"
                    >
                        <div className="max-h-[240px] overflow-y-auto py-1 custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={String(option.value)}
                                    type="button"
                                    disabled={option.disabled}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 text-left transition-colors",
                                        "hover:bg-primary/10 hover:text-primary",
                                        {
                                            'bg-surface-2 text-primary font-semibold': option.value === value,
                                            'text-text-primary': option.value !== value,
                                            'opacity-50 cursor-not-allowed': option.disabled
                                        },
                                        size === 'sm' ? 'text-xs' : 'text-sm'
                                    )}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {option.value === value && (
                                        <Check size={14} className="text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
