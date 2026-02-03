import { useState, useRef, useEffect } from "react";
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

export function VibeSelect<T extends string>({
    value,
    onChange,
    options,
    className = "",
    size = 'md'
}: VibeSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value) || options[0];

    // Size classes (Standard Input Sizes)
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between 
                    bg-surface-1 border border-surface-2 rounded-lg 
                    ${sizeClasses[size]} 
                    hover:border-surface-3 active:border-surface-3 
                    transition-all outline-none 
                    ${isOpen ? "border-primary/50 ring-1 ring-primary/50" : ""}
                `}
            >
                <span className="font-mono text-text-primary text-left truncate flex-1">{selectedOption.label}</span>
                <ChevronDown
                    size={14}
                    className={`text-text-dim ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-4 p-1 py-1 bg-surface-1 border border-surface-2 rounded-lg shadow-xl z-50 flex flex-col gap-0.5 overflow-hidden max-h-[200px] overflow-y-auto scrollbar-hide"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors w-full text-left ${option.value === value
                                    ? "bg-surface-2 text-text-primary font-medium"
                                    : "text-text-dim hover:text-text-primary hover:bg-surface-2"
                                    }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && <Check size={12} className="text-primary flex-shrink-0 ml-2" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
