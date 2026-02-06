/**
 * @module AuthGate
 * @description Enhanced authentication gate with full onboarding flow orchestration.
 * @version 2.0.0 - Production-ready onboarding experience
 * 
 * Flow:
 * 1. First Launch → WelcomeScreen (Terms & Privacy)
 * 2. Terms Accepted → LoginScreen (Guided UX)
 * 3. Authenticated → Dashboard (Children)
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthService } from '../AuthService';
import { LoginScreen } from './LoginScreen';
import { WelcomeScreen } from './WelcomeScreen';
import type { Session } from '@supabase/supabase-js';
import { VibeSupabase } from '../../../infrastructure/supabase/SupabaseClient';
import { onboardingStore, useOnboarding } from '../OnboardingStore';
import { fadeTransition, crossfade } from '../../../shared/animations/MicroAnimations';

// ============================================================================
// 🌀 LOADING COMPONENT
// ============================================================================

const LoadingVoid = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-screen bg-void text-white select-none"
    >
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border border-white/10 rounded-full animate-[spin_3s_linear_infinite] relative">
                <div className="absolute inset-0 border-t border-primary rounded-full animate-[spin_1s_linear_infinite]" />
            </div>
            <span className="text-[10px] font-mono text-primary/80 animate-pulse tracking-widest">
                AUTHENTICATING
            </span>
        </div>
    </motion.div>
);

// ============================================================================
// 📱 AUTH GATE COMPONENT
// ============================================================================

interface AuthGateProps {
    children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [onboardingInitialized, setOnboardingInitialized] = useState(false);

    const { needsTerms } = useOnboarding();

    // ========================================================================
    // 🔄 INITIALIZATION
    // ========================================================================

    useEffect(() => {
        const initialize = async () => {
            try {
                // 1. Initialize OnboardingStore (must happen first)
                console.log('[AuthGate] Initializing onboarding store...');
                await onboardingStore.initialize();
                setOnboardingInitialized(true);

                // 2. Check existing session
                console.log('[AuthGate] Checking session...');
                const currentSession = await AuthService.getSession();
                setSession(currentSession);

                console.log('[AuthGate] Initialization complete', {
                    hasSession: !!currentSession,
                    email: currentSession?.user?.email
                });
            } catch (error) {
                console.error('[AuthGate] Initialization failed:', error);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    // ========================================================================
    // 🔔 AUTH STATE SUBSCRIPTION
    // ========================================================================

    useEffect(() => {
        const supabase = VibeSupabase.get();
        if (!supabase) return;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log(`[AuthGate] Auth State Change: ${event}`, newSession?.user?.email);

            setSession(newSession);

            // Mark first session complete on initial sign-in/sign-up
            if (event === 'SIGNED_IN' && newSession && onboardingInitialized) {
                try {
                    await onboardingStore.completeFirstSession();
                } catch (error) {
                    console.error('[AuthGate] Failed to mark first session:', error);
                }
            }

            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [onboardingInitialized]);

    // ========================================================================
    // 🎨 RENDER
    // ========================================================================

    // Show loading spinner during initialization
    if (loading || !onboardingInitialized) {
        return <LoadingVoid />;
    }

    return (
        <AnimatePresence mode="wait">
            {needsTerms ? (
                // STEP 1: First Launch - Terms & Privacy
                <motion.div
                    key="welcome"
                    variants={crossfade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <WelcomeScreen
                        onAccept={() => {
                            console.log('[AuthGate] Terms accepted, proceeding to login');
                            // State will update via hook, causing re-render
                        }}
                    />
                </motion.div>
            ) : !session ? (
                // STEP 2: No Session - Show Login/Signup
                <motion.div
                    key="login"
                    variants={crossfade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <LoginScreen
                        onSuccess={async () => {
                            console.log('[AuthGate] Login successful');
                            // Session will update via subscription
                        }}
                    />
                </motion.div>
            ) : (
                // STEP 3: Authenticated - Show Dashboard
                <motion.div
                    key="dashboard"
                    variants={fadeTransition}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

