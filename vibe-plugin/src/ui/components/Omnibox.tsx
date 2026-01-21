import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';

interface OmniboxProps {
    onCommand: (query: string) => void;
    isProcessing: boolean;
    placeholder?: string;
}

export const Omnibox: React.FC<OmniboxProps> = ({ onCommand, isProcessing, placeholder = "Describe your vibe (e.g., 'Cyberpunk Neon')..." }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isProcessing) {
            onCommand(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto mt-8 z-50">
            <div className={`
                relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 
                rounded-2xl shadow-2xl transition-all duration-300
                ${isProcessing ? 'border-primary-500/50 shadow-primary-500/20' : 'hover:border-white/30'}
            `}>

                {/* Icon Socket */}
                <div className="pl-4 text-white/50">
                    {isProcessing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-6 h-6 text-primary-400" />
                        </motion.div>
                    ) : (
                        <Search className="w-6 h-6" />
                    )}
                </div>

                {/* Main Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    disabled={isProcessing}
                    className="w-full bg-transparent border-none text-white placeholder-white/40 text-lg px-4 py-4 focus:ring-0 outline-none"
                    autoComplete="off"
                />

                {/* Right Action */}
                <div className="pr-4">
                    <AnimatePresence>
                        {query.length > 0 && !isProcessing && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                type="submit"
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        )}
                        {query.length === 0 && (
                            <div className="flex items-center gap-1 text-xs text-white/30 border border-white/10 px-2 py-1 rounded">
                                <Command className="w-3 h-3" />
                                <span>K</span>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Quick Suggestions (Future Phase) */}
            {/* <div className="absolute top-full left-0 w-full mt-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2" /> */}
        </form>
    );
};
