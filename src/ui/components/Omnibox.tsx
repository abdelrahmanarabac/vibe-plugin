import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, Command } from 'lucide-react';

interface OmniboxProps {
    onCommand: (query: string) => void;
    isProcessing: boolean;
    placeholder?: string;
}

/**
 * 🔮 Elite Omnibox: Floating Pill Design
 * Positioned centered-bottom, serving as the main AI entry point.
 */
export const Omnibox: React.FC<OmniboxProps> = ({
    onCommand,
    isProcessing,
    placeholder = "Generate tokens, refactor, or ask Vibe..."
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim() && !isProcessing) {
            onCommand(query.trim());
            setQuery('');
            inputRef.current?.blur();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div
                className={`
                    relative group transition-all duration-500
                    ${isFocused ? 'scale-[1.02]' : 'scale-100'}
                `}
            >
                {/* 🌈 Glow Aura */}
                <div className={`
                    absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-secondary 
                    rounded-[28px] blur-xl transition-opacity duration-500
                    ${isFocused ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}
                `} />

                {/* 💊 Main Pill Container */}
                <div className={`
                    relative flex items-center gap-3 px-4 py-3
                    bg-[#0A0C14]/90 backdrop-blur-2xl
                    border-2 transition-all duration-300 rounded-[24px]
                    ${isFocused ? 'border-primary/60 shadow-[0_0_20px_var(--primary-glow)]' : 'border-white/10 shadow-2xl'}
                `}>

                    {/* Icon / Status */}
                    <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
                        {isProcessing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles size={16} className="text-primary" />
                            </motion.div>
                        ) : (
                            <Command size={14} className={isFocused ? 'text-primary' : 'text-text-muted'} />
                        )}
                    </div>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isProcessing}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-text-bright placeholder:text-text-muted/60"
                    />

                    {/* Submit Button */}
                    <AnimatePresence>
                        {query.length > 0 && !isProcessing && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => handleSubmit()}
                                className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-primary text-void shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <ArrowUp size={16} strokeWidth={3} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Quick Hint (Desktop only) */}
                    {!query && !isFocused && (
                        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                            <span>⌘ K</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub-hint Messaging */}
            <motion.div
                animate={{ opacity: isFocused ? 0.8 : 0.4 }}
                className="mt-3 flex justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted"
            >
                <div className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                    <Sparkles size={10} />
                    <span>Auto-Tokenize</span>
                </div>
                <div className="flex items-center gap-1 hover:text-secondary transition-colors cursor-pointer">
                    <Command size={10} />
                    <span>Scan Page</span>
                </div>
            </motion.div>
        </motion.div>
    );
};
