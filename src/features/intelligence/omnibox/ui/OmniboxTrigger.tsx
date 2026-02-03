import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniboxEyes } from './OmniboxEyes';
import { omnibox, type OmniboxMessage } from '../../../../ui/managers/OmniboxManager';
import { clsx } from 'clsx'; // Assuming clsx is available since it was used in Omnibox.tsx

interface OmniboxTriggerProps {
    onClick: () => void;
    isOpen: boolean;
    isLifted?: boolean;
}

export const OmniboxTrigger: React.FC<OmniboxTriggerProps> = ({ onClick, isOpen, isLifted = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<OmniboxMessage | null>(null);
    const [displayMessage, setDisplayMessage] = useState('');
    const [showBubble, setShowBubble] = useState(false);
    const [expression, setExpression] = useState<'neutral' | 'happy' | 'concerned' | 'surprised'>('neutral');
    const [isCoolingDown, setIsCoolingDown] = useState(false);

    // Typewriter refs
    const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const greetingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 1. Subscribe to Omnibox Manager
    useEffect(() => {
        const unsubscribe = omnibox.subscribe((msg) => {
            setCurrentMessage(msg);
        });
        return () => unsubscribe();
    }, []);

    // 2. Handle Message Changes (The "Voice" Logic)
    useEffect(() => {
        // Clear existing typing
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);

        if (!currentMessage) {
            setShowBubble(false);
            setExpression('neutral');
            return;
        }

        // Setup for new message
        const text = currentMessage.message;
        setDisplayMessage('');
        setShowBubble(true);

        // Expressions based on type
        // OmniboxEyes only supports 'neutral' | 'happy' currently based on previous file content
        // We will map system states to these two for now, but ideally we'd add more expressions.
        switch (currentMessage.type) {
            case 'success': setExpression('happy'); break;
            case 'error': setExpression('neutral'); break; // Fallback for error
            case 'warning': setExpression('neutral'); break;
            case 'loading': setExpression('neutral'); break;
            default: setExpression('neutral');
        }

        let i = 0;
        typeIntervalRef.current = setInterval(() => {
            if (i < text.length) {
                setDisplayMessage(text.substring(0, i + 1));
                i++;
            } else {
                if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
            }
        }, 30); // Faster typing for system messages

        return () => {
            if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        };
    }, [currentMessage]);

    // 3. Initial "Welcome" Greeting
    useEffect(() => {
        greetingTimeoutRef.current = setTimeout(() => {
            // Only greet if no other system message is active
            if (!omnibox.getCurrent()) {
                omnibox.show("Welcome back! How can I help?", { duration: 3000 });
            }
        }, 1000);

        return () => {
            if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current);
        };
    }, []);

    const handleClick = () => {
        if (isCoolingDown) return;
        setIsCoolingDown(true);
        onClick();
        setTimeout(() => setIsCoolingDown(false), 500);
    };

    // Style Helpers
    const getBubbleColor = (type: string | undefined) => {
        switch (type) {
            case 'error': return 'bg-red-50 text-red-900 border-red-200';
            case 'success': return 'bg-emerald-50 text-emerald-900 border-emerald-200';
            case 'warning': return 'bg-amber-50 text-amber-900 border-amber-200';
            default: return 'bg-white text-slate-900 border-white/20'; // Default Neutral
        }
    };

    return (
        <motion.button
            className={clsx(
                "fixed right-6 z-[9999] group outline-none cursor-pointer transition-all duration-500",
                isLifted ? 'bottom-24' : 'bottom-6'
            )}
            onClick={handleClick}
            onHoverStart={() => {
                setIsHovered(true);
                if (!currentMessage) setExpression('happy');
            }}
            onHoverEnd={() => {
                setIsHovered(false);
                if (!currentMessage) setExpression('neutral');
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: (isCoolingDown || isOpen) ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* 🌟 Enhanced Aura Glow (Reactive) */}
            <motion.div
                animate={{
                    scale: currentMessage?.type === 'loading' ? [1, 1.3, 1] : [1, 1.1, 1],
                    opacity: currentMessage?.type === 'error' ? 0.6 : 0.3
                }}
                transition={{
                    duration: currentMessage?.type === 'loading' ? 1 : 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={clsx(
                    "absolute -inset-4 rounded-full blur-2xl transition-colors duration-500",
                    currentMessage?.type === 'error' ? 'bg-red-500/50' :
                        currentMessage?.type === 'success' ? 'bg-emerald-500/50' :
                            "bg-gradient-to-tr from-primary/40 via-purple-500/30 to-secondary/40",
                    isHovered ? 'opacity-80 scale-125' : ''
                )}
            />

            {/* 💬 Speech Bubble (The "Voice") */}
            <AnimatePresence>
                {showBubble && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className={clsx(
                            "absolute right-full top-1/2 -translate-y-1/2 mr-5",
                            "whitespace-nowrap px-5 py-3 rounded-2xl rounded-tr-sm shadow-xl z-50",
                            "flex items-center gap-3 backdrop-blur-3xl border-2",
                            getBubbleColor(currentMessage?.type)
                        )}
                    >
                        {/* Status Icon */}
                        <div className={clsx(
                            "w-2 h-2 rounded-full animate-pulse",
                            currentMessage?.type === 'error' ? 'bg-red-500' :
                                currentMessage?.type === 'success' ? 'bg-emerald-500' :
                                    'bg-primary'
                        )} />

                        <span className="font-medium tracking-tight text-sm font-sans min-w-[60px]">
                            {displayMessage}
                        </span>

                        {/* Cursor blink - only while typing */}
                        {displayMessage.length < (currentMessage?.message.length || 0) && (
                            <span className="w-1.5 h-4 bg-current opacity-50 animate-pulse inline-block align-middle" />
                        )}

                        {/* Action Helper if present */}
                        {currentMessage?.action && displayMessage.length === currentMessage.message.length && (
                            <span className="text-[10px] opacity-60 uppercase tracking-wider ml-2 border border-current/20 px-1.5 py-0.5 rounded">
                                {currentMessage.action.label} ↵
                            </span>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Container */}
            <div className={clsx(
                "relative w-14 h-14 rounded-full flex items-center justify-center",
                "backdrop-blur-xl border-2 transition-all duration-300",
                isOpen
                    ? 'bg-primary border-primary text-white shadow-[0_0_30px_var(--primary-glow)]'
                    : 'bg-[#0A0C14] border-white/10 hover:border-primary/50 hover:bg-[#1A1D26] shadow-2xl'
            )}>
                <div className="transform scale-125">
                    <OmniboxEyes expression={expression === 'happy' ? 'happy' : 'neutral'} />
                </div>
            </div>

        </motion.button>
    );
};
