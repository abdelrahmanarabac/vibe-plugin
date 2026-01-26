import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, Command } from 'lucide-react';

interface OmniboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCommand: (query: string) => void;
    isProcessing: boolean;
    placeholder?: string;
}

/**
 * 🔮 Omnibox Modal
 * The centered command palette triggered by the floating eyes button.
 */
export const OmniboxModal: React.FC<OmniboxModalProps> = ({
    isOpen,
    onClose,
    onCommand,
    isProcessing,
    placeholder = "Generate tokens, refactor, or ask Vibe..."
}) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim() && !isProcessing) {
            onCommand(query.trim());
            setQuery('');
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-full max-w-2xl pointer-events-auto"
                        >
                            <div className="relative group">
                                {/* 🌈 Glow Aura */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-[28px] blur-xl opacity-40 animate-pulse" />

                                {/* 💊 Main Pill Container */}
                                <div className="relative flex items-center gap-4 px-6 py-5 bg-[#0A0C14]/95 backdrop-blur-2xl border border-primary/50 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-[24px]">

                                    {/* Icon / Status */}
                                    <div className="flex-none flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                                        {isProcessing ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Sparkles size={20} className="text-primary" />
                                            </motion.div>
                                        ) : (
                                            <Command size={20} className="text-primary" />
                                        )}
                                    </div>

                                    {/* Input Field */}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={placeholder}
                                        disabled={isProcessing}
                                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-white placeholder:text-gray-500"
                                    />

                                    {/* Submit Button */}
                                    <AnimatePresence>
                                        {query.length > 0 && !isProcessing && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => handleSubmit()}
                                                className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-primary text-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <ArrowUp size={20} strokeWidth={3} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Helper Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mt-4 text-center text-xs font-medium text-gray-500 uppercase tracking-widest"
                            >
                                Press <span className="text-gray-300">Enter</span> to execute • <span className="text-gray-300">Esc</span> to close
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
