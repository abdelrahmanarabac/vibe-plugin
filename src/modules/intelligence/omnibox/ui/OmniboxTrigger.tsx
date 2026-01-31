import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniboxEyes } from './OmniboxEyes';

interface OmniboxTriggerProps {
    onClick: () => void;
    isOpen: boolean;
    externalMessage?: string;
    mode?: 'neutral' | 'success' | 'error' | 'warning';
    isLifted?: boolean;
}

export const OmniboxTrigger: React.FC<OmniboxTriggerProps> = ({ onClick, isOpen, isLifted = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');
    const [showBubble, setShowBubble] = useState(false);
    const [expression, setExpression] = useState<'neutral' | 'happy'>('neutral');
    const [isCoolingDown, setIsCoolingDown] = useState(false);

    // Typewriter effect sequence
    useEffect(() => {
        // Initial Greeting
        const timer = setTimeout(() => {
            triggerGreeting();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        if (isCoolingDown) return;

        setIsCoolingDown(true);
        onClick();

        setTimeout(() => {
            setIsCoolingDown(false);
        }, 1000);
    };

    const triggerGreeting = () => {
        const text = "Welcome! :)"; // "Welcome and smiling face"
        setShowBubble(true);
        setExpression('happy');

        let i = 0;
        setMessage('');

        const typeLoop = setInterval(() => {
            if (i < text.length) {
                setMessage(text.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typeLoop);
                // Hold then fade
                setTimeout(() => {
                    setShowBubble(false);
                    setExpression('neutral');
                }, 4000);
            }
        }, 80); // Typing speed
    };

    return (
        <motion.button
            className={`fixed right-6 z-[9999] group outline-none cursor-pointer ${isLifted ? 'bottom-24' : 'bottom-6'} transition-all duration-300`}
            onClick={handleClick}
            onHoverStart={() => {
                setIsHovered(true);
                setExpression('happy');
            }}
            onHoverEnd={() => {
                setIsHovered(false);
                setExpression('neutral');
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: (isCoolingDown || isOpen) ? 1 : 1.15 }}
            whileTap={{ scale: (isCoolingDown || isOpen) ? 1 : 0.9 }}
        >
            {/* 🌟 Enhanced Aura Glow (Pulsing) */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`
                    absolute -inset-4 rounded-full blur-2xl transition-colors duration-500
                    bg-gradient-to-tr from-primary/40 via-purple-500/30 to-secondary/40
                    ${isHovered ? 'opacity-80 scale-125' : 'opacity-30'}
                `}
            />

            {/* 💬 Speech Bubble (Typewriter) */}
            <AnimatePresence>
                {showBubble && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute right-full top-1/2 -translate-y-1/2 mr-4 whitespace-nowrap px-4 py-2 bg-white text-black text-sm font-bold rounded-l-2xl rounded-tr-2xl rounded-br-sm shadow-xl z-50 flex items-center gap-2"
                    >
                        <span className="font-mono tracking-tight">
                            {message}
                        </span>
                        {/* Cursor blink */}
                        <span className="w-1.5 h-3.5 bg-primary animate-pulse inline-block align-middle" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button Container */}
            <div className={`
                relative w-14 h-14 rounded-full flex items-center justify-center
                backdrop-blur-xl border-2 transition-all duration-300
                ${isOpen
                    ? 'bg-primary border-primary text-white shadow-[0_0_30px_var(--primary-glow)]'
                    : 'bg-[#0A0C14] border-white/10 hover:border-primary/50 hover:bg-[#1A1D26] shadow-2xl'
                }
            `}>
                <div className="transform scale-125">
                    <OmniboxEyes expression={expression} />
                </div>
            </div>

        </motion.button>
    );
};
