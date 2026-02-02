import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../AuthService';
import { Button } from '../../../ui/components/base/Button';
import { Input } from '../../../ui/components/base/Input';
import { VibeSupabase } from '../../../infrastructure/supabase/SupabaseClient';

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

interface LoginScreenProps {
    onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const resetState = () => {
        setError(null);
        setSuccessMessage(null);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        resetState();
        setLoading(true);

        const { error: resetError } = await AuthService.sendResetPasswordEmail(email);

        if (resetError) {
            setError(resetError.message);
        } else {
            setSuccessMessage("Reset link sent! Check your email inbox.");
            setTimeout(() => {
                setMode('LOGIN');
                setSuccessMessage(null);
            }, 5000);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'FORGOT_PASSWORD') return handleResetPassword(e);

        resetState();
        setLoading(true);

        try {
            const supabase = VibeSupabase.get();
            if (!supabase) throw new Error("Supabase context missing. Please restart plugin.");

            if (mode === 'SIGNUP') {
                if (!username || username.length < 3) {
                    throw new Error("Username must be at least 3 characters.");
                }
                const { session, error: signUpError } = await AuthService.signUp(email, password, username);
                if (signUpError) throw signUpError;

                if (session) {
                    onSuccess?.();
                } else {
                    // Start auto-login attempt or show check email message
                    const { session: signInSession, error: signInError } = await AuthService.signIn(email, password);
                    if (signInSession) {
                        onSuccess?.();
                    } else {
                        console.warn("Auto-login failed after signup:", signInError);
                        setSuccessMessage("Account created! Please verify your email.");
                    }
                }
            } else {
                const { error: signInError } = await AuthService.signIn(email, password);
                if (signInError) throw signInError;
                onSuccess?.();
            }
        } catch (err: any) {
            setError(mapAuthError(err));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maps raw Supabase errors to Vibe-friendly messages.
     */
    const mapAuthError = (err: any): string => {
        const msg = (err.message || "").toLowerCase();

        // Security / Password Policy
        if (msg.includes("leaked password") || msg.includes("breach")) {
            return "Security Alert: This password has appeared in a data breach. Please choose a different one.";
        }
        if (msg.includes("password") && (msg.includes("length") || msg.includes("short"))) {
            return "Password too weak. Use at least 8 characters.";
        }

        // Auth Flow
        if (msg.includes("invalid login credentials")) return "Invalid email or password.";
        if (msg.includes("user already registered")) return "Account already exists. Try logging in.";
        if (msg.includes("rate limit")) return "Too many attempts. Please wait a moment.";

        // Fallback
        return err.message || "Authentication failed. Please try again.";
    };

    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetState();
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-void text-text-primary overflow-hidden relative">
            {/* Background Ambient Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,var(--color-primary-glow)_0%,transparent_60%)] opacity-20 pointer-events-none animate-pulse-slow" />

            <div className="w-full max-w-xs relative z-10 flex flex-col gap-6">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center space-y-2"
                >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-2 border border-white/5 shadow-glow mb-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                        {mode === 'FORGOT_PASSWORD' ? 'Reset Password' : 'Enter the Vibe'}
                    </h1>
                    <p className="text-text-muted text-sm">
                        {mode === 'LOGIN' && "Welcome back, Architect."}
                        {mode === 'SIGNUP' && "Join the design revolution."}
                        {mode === 'FORGOT_PASSWORD' && "We'll get you back on track."}
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    layout
                    className="backdrop-blur-xl bg-surface-1/50 border border-white/10 p-6 rounded-2xl shadow-card"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {mode === 'SIGNUP' && (
                                <motion.div
                                    key="username"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        label="Username"
                                        placeholder="@username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required={mode === 'SIGNUP'}
                                        icon={<User className="w-4 h-4" />}
                                        className="bg-void/50"
                                    />
                                </motion.div>
                            )}

                            <motion.div key="email" layout>
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="you@design.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    icon={<Mail className="w-4 h-4" />}
                                    className="bg-void/50"
                                />
                            </motion.div>

                            {mode !== 'FORGOT_PASSWORD' && (
                                <motion.div
                                    key="password"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        icon={<Lock className="w-4 h-4" />}
                                        className="bg-void/50"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                                    <span className="text-xs text-error leading-relaxed">{error}</span>
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                                    <span className="text-xs text-success leading-relaxed">{successMessage}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="pt-2 flex flex-col gap-3">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full shadow-glow hover:shadow-primary/50"
                                loading={loading}
                                icon={!loading && <ArrowRight className="w-4 h-4" />}
                            >
                                {mode === 'LOGIN' && 'Sign In'}
                                {mode === 'SIGNUP' && 'Create Account'}
                                {mode === 'FORGOT_PASSWORD' && 'Send Reset Link'}
                            </Button>

                            <div className="flex items-center justify-between text-xs text-text-muted px-1">
                                {mode === 'LOGIN' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('FORGOT_PASSWORD')}
                                            className="hover:text-primary transition-colors"
                                        >
                                            Forgot Password?
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('SIGNUP')}
                                            className="hover:text-white transition-colors"
                                        >
                                            Create Account
                                        </button>
                                    </>
                                )}
                                {mode === 'SIGNUP' && (
                                    <div className="w-full text-center">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('LOGIN')}
                                            className="text-primary hover:text-primary-hover font-medium transition-colors"
                                        >
                                            Log in
                                        </button>
                                    </div>
                                )}
                                {mode === 'FORGOT_PASSWORD' && (
                                    <button
                                        type="button"
                                        onClick={() => toggleMode('LOGIN')}
                                        className="w-full text-center hover:text-white transition-colors"
                                    >
                                        Cancel & Return to Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>

                {mode === 'LOGIN' && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        className="text-[10px] text-center text-text-muted/50"
                    >
                        Secured by Supabase • Vibe Engine v2.0
                    </motion.p>
                )}
            </div>
        </div>
    );
};

