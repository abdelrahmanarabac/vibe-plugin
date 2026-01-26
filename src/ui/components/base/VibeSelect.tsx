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

    // Size classes (Matching VibeInput)
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
                    bg-void/50 border border-white/10 rounded-xl 
                    ${sizeClasses[size]} 
                    hover:border-white/20 active:border-white/20 
                    transition-all outline-none 
                    ${isOpen ? "border-primary/50 ring-1 ring-primary/50" : ""}
                `}
            >
                <span className="font-mono text-white text-left truncate flex-1">{selectedOption.label}</span>
                <ChevronDown
                    size={14}
                    className={`text-white/40 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 p-1 py-1 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-xl z-50 flex flex-col gap-0.5 overflow-hidden max-h-[200px] overflow-y-auto custom-scrollbar"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors w-full text-left ${option.value === value
                                    ? "bg-white/10 text-white font-medium"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
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
