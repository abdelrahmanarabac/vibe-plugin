/**
 * @module FirstTimeWelcome
 * @description Celebration overlay shown to first-time users after successful authentication.
 * @version 1.0.0
 * 
 * Features:
 * - Animated confetti/sparkle effect
 * - Personalized welcome message
 * - Auto-dismiss after 3 seconds
 * - Smooth fade-in/fade-out transitions
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';
import { successOverlay, confettiParticle, bounce } from '../../../../shared/animations/MicroAnimations';
import { useOnboarding } from '../../../auth/OnboardingStore';

interface FirstTimeWelcomeProps {
    username?: string;
    onDismiss?: () => void;
}

/**
 * First-time user celebration overlay
 * Shows a premium welcome animation with confetti effect
 */
export const FirstTimeWelcome: React.FC<FirstTimeWelcomeProps> = ({
    username = 'Designer',
    onDismiss
}) => {
    const { markWelcomeSeen } = useOnboarding();

    // Auto-dismiss after 3 seconds
    useEffect(() => {
        const timer = setTimeout(async () => {
            await markWelcomeSeen();
            onDismiss?.();
        }, 3000);

        return () => clearTimeout(timer);
    }, [markWelcomeSeen, onDismiss]);

    return (
        <motion.div
            variants={successOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
            onClick={async () => {
                await markWelcomeSeen();
                onDismiss?.();
            }}
        >
            {/* Confetti Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                        key={i}
                        variants={confettiParticle(i * 0.05)}
                        initial="hidden"
                        animate="visible"
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: '-20px',
                            width: '8px',
                            height: '8px',
                            borderRadius: i % 3 === 0 ? '50%' : '2px',
                            background: [
                                'linear-gradient(135deg, #6E62E5, #A855F7)',
                                'linear-gradient(135deg, #EC4899, #6E62E5)',
                                'linear-gradient(135deg, #CFFAFE, #0EA5E9)',
                                'linear-gradient(135deg, #10B981, #14AE5C)'
                            ][i % 4]
                        }}
                    />
                ))}
            </div>

            {/* Central Card */}
            <motion.div
                variants={bounce}
                initial="initial"
                animate="bouncing"
                className="relative z-10 max-w-md mx-4 text-center"
            >
                {/* Glow Effect */}
                <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 via-purple-500/30 to-secondary/30 rounded-full blur-3xl opacity-60" />

                {/* Card Content */}
                <div className="relative backdrop-blur-2xl bg-surface-1/90 border border-primary/40 rounded-3xl p-8 shadow-card">
                    {/* Animated Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 12,
                            delay: 0.2
                        }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-500 shadow-glow mb-6"
                    >
                        <Rocket className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </motion.div>

                    {/* Welcome Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-3"
                    >
                        <h2 className="text-3xl font-bold text-white font-display tracking-tight">
                            Welcome, {username}! 🎉
                        </h2>
                        <p className="text-base text-text-dim font-medium leading-relaxed">
                            You're all set! Let's create something amazing together.
                        </p>
                    </motion.div>

                    {/* Sparkle Accent */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-6 flex items-center justify-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Vibe Mode Activated</span>
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                </div>

                {/* Dismiss Hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-xs text-white/60"
                >
                    Click anywhere to continue
                </motion.p>
            </motion.div>
        </motion.div>
    );
};
