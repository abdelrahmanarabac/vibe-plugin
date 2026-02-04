import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const updatePosition = () => {
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    setPosition({
                        top: rect.bottom + 4, // 4px offset
                        left: rect.left,
                        width: rect.width
                    });
                }
            };

            updatePosition();
            // Optional: Update on scroll/resize would go here, but for now we settle on initial open pos
            // or we could attach listeners.
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            }
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is inside the button (toggle)
            if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
                return;
            }

            // Note: The portal content logic is handled by the fact that if it's not the button, we close.
            // But we must check if click is inside the Portal content. 
            // Since Portal is not child of containerRef in DOM tree, we need a ref for the dropdown too if we want to support clicking inside it without closing?
            // Actually, clicking an option closes it (desired). Clicking scrollbar should not close it.
            // For simplicity, we rely on the click handler of options to close, and a global listener to close if outside.
            // To prevent immediate close when clicking the dropdown itself (e.g. scrollbar), we'd need a ref on the dropdown.
            // Let's rely on event bubbling check if possible, or just accept click-outside closes it.
            // BETTER: Use a separate overlay or strict check. 
            // Given the complexity of Portals + ClickOutside, a common pattern is checking if target is inside the dropdown dom node.

            // We can add a specialized class or ID to the dropdown to check against.
            const target = event.target as HTMLElement;
            if (target.closest('.vibe-select-dropdown')) {
                return;
            }

            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value);

    const sizeClasses = {
        sm: 'h-8 text-xs px-2',
        md: 'h-11 text-sm px-4', // Increased to 44px (h-11) to match Inputs
        lg: 'h-12 text-base px-4'
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
        >
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-between w-full bg-surface-1 border border-surface-2 rounded-xl transition-all duration-200 outline-none",
                    "text-text-primary font-medium hover:bg-surface-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/50",
                    {
                        'opacity-50 cursor-not-allowed hidden': disabled,
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
                {isOpen && position && createPortal(
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            width: position.width,
                            zIndex: 9999, // Max z-index
                        }}
                        className="vibe-select-dropdown bg-surface-1 border border-surface-2 rounded-xl shadow-xl shadow-black/50 overflow-hidden"
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
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </div>
    );
};
