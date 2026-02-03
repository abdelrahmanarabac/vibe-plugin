import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface Option<T> {
    label: string;
    value: T;
}

interface VibeSelectProps<T> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function VibeSelect<T extends string | number>({
    value,
    onChange,
    options,
    className = "",
    size = 'md'
}: VibeSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState<{ top: number; left: number; width: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Update position when opening
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const updatePosition = () => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setPosition({
                        top: rect.bottom + 4,
                        left: rect.left,
                        width: rect.width
                    });
                }
            };
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is inside the trigger button
            if (containerRef.current && containerRef.current.contains(event.target as Node)) {
                return;
            }

            // Check if click is inside the portal dropdown (we can use a specific class or check if it's NOT in the list)
            // Ideally, we check if the target is within the dropdown, but since it's a portal, 
            // the simplistic check is: if we clicked outside the containerRef, AND we assume the portal handles its own clicks (stop propagation or separate check)
            // But usually for "click outside" with portals, we need to check if the target is part of the portal.
            const target = event.target as HTMLElement;
            if (target.closest('.vibe-select-dropdown-portal')) {
                return;
            }

            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const selectedOption = options.find((o) => o.value === value) || options[0];

    // Size classes (Standard Input Sizes)
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    return (
        <>
            <div ref={containerRef} className={`relative ${className}`}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        w-full flex items-center justify-between 
                        bg-surface-1 border border-surface-2 rounded-xl 
                        ${sizeClasses[size]} 
                        hover:border-surface-3 active:border-surface-3 
                        transition-all outline-none 
                        ${isOpen ? "border-primary/50 ring-1 ring-primary/50" : ""}
                    `}
                >
                    <span className="font-mono text-text-primary text-left truncate flex-1">{selectedOption?.label}</span>
                    <ChevronDown
                        size={14}
                        className={`text-text-dim ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && position && createPortal(
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            top: position.top,
                            left: position.left,
                            width: position.width,
                            zIndex: 9999,
                        }}
                        className="vibe-select-dropdown-portal flex flex-col gap-0.5 p-1 bg-surface-1 border border-surface-2 rounded-xl shadow-xl overflow-hidden max-h-[200px] overflow-y-auto scrollbar-hide"
                    >
                        {options.map((option) => (
                            <button
                                key={String(option.value)}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors w-full text-left ${option.value === value
                                    ? "bg-surface-2 text-text-primary font-medium"
                                    : "text-text-dim hover:text-text-primary hover:bg-surface-2"
                                    }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && <Check size={12} className="text-primary flex-shrink-0 ml-2" />}
                            </button>
                        ))}
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </>
    );
}
