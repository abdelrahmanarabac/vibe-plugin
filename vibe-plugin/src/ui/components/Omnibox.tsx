import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X } from 'lucide-react';

interface OmniboxProps {
    onCommand: (query: string) => void;
    isProcessing: boolean;
    placeholder?: string;
}

export const Omnibox: React.FC<OmniboxProps> = ({ onCommand, isProcessing, placeholder = "Describe your vibe..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isProcessing) {
            onCommand(query);
            setQuery('');
            setIsOpen(false);
        }
    };

    return (
        <div className="relative flex flex-col items-end">
            <AnimatePresence>
                {/* Expanded Input State */}
                {isOpen && (
                    <motion.form
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        onSubmit={handleSubmit}
                        className="absolute bottom-16 right-0 w-[400px] z-50"
                    >
                        <div className="relative flex items-center bg-[#1E1E1E] border border-[#A855F7]/50 rounded-xl shadow-2xl shadow-[#A855F7]/20 p-2 gap-2">
                            <div className="pl-2">
                                {isProcessing ? (
                                    <Sparkles className="w-5 h-5 text-[#A855F7] animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5 text-white/50" />
                                )}
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                disabled={isProcessing}
                                className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 outline-none p-1"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* FAB Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-[#A855F7] text-white rotate-90' : 'bg-white text-black hover:bg-[#A855F7] hover:text-white'
                    } ${isProcessing ? 'animate-pulse cursor-wait' : ''}`}
            >
                {isOpen ? <X size={20} /> : <Search size={20} />}
            </motion.button>
        </div>
    );
};
