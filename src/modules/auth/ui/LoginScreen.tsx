/**
 * @module LoginScreen
 * @description Premium Login Screen for Vibe Plugin with OTP Password Reset.
 * @version 2.1.0 - OTP-based recovery flow (no external redirect).
 */
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { AuthService } from '../AuthService';
import { Button } from '../../../ui/components/base/Button';
import { Input } from '../../../ui/components/base/Input';
import { VibeSupabase } from '../../../infrastructure/supabase/SupabaseClient';

/**
 * OTP Recovery sub-states:
 * - EMAIL: User enters email to receive OTP.
 * - OTP: User enters the 6-digit code.
 * - NEW_PASSWORD: User sets a new password.
 */
type RecoveryStep = 'EMAIL' | 'OTP' | 'NEW_PASSWORD';

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

    // OTP Recovery State
    const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('EMAIL');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const resetState = () => {
        setError(null);
        setSuccessMessage(null);
    };

    const resetRecoveryState = () => {
        setRecoveryStep('EMAIL');
        setOtpCode('');
        setNewPassword('');
        setConfirmPassword('');
    };

    // ==========================================================================
    // == OTP PASSWORD RECOVERY HANDLERS ==
    // ==========================================================================

    const handleSendOtp = async () => {
        resetState();
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        setLoading(true);

        const { error: otpError } = await AuthService.sendRecoveryOtp(email.trim());

        if (otpError) {
            setError(otpError.message);
        } else {
            setSuccessMessage("A 6-digit code has been sent to your email.");
            setRecoveryStep('OTP');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        resetState();
        if (!otpCode.trim() || otpCode.length < 6) {
            setError("Please enter the 6-digit code from your email.");
            return;
        }
        setLoading(true);

        const { session, error: verifyError } = await AuthService.verifyRecoveryOtp(email.trim(), otpCode.trim());

        if (verifyError || !session) {
            setError(verifyError?.message || "Invalid or expired code. Please try again.");
        } else {
            setSuccessMessage("Code verified! Now set your new password.");
            setRecoveryStep('NEW_PASSWORD');
        }
        setLoading(false);
    };

    const handleSetNewPassword = async () => {
        resetState();
        if (!newPassword || newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        const { error: updateError } = await AuthService.updatePassword(newPassword);

        if (updateError) {
            setError(updateError.message);
        } else {
            setSuccessMessage("Password updated successfully! You are now logged in.");
            // Slight delay, then trigger success callback (user is already authenticated via verifyOtp)
            setTimeout(() => {
                onSuccess?.();
            }, 1500);
        }
        setLoading(false);
    };

    const handleRecoverySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (recoveryStep === 'EMAIL') return handleSendOtp();
        if (recoveryStep === 'OTP') return handleVerifyOtp();
        if (recoveryStep === 'NEW_PASSWORD') return handleSetNewPassword();
    };

    // ==========================================================================
    // == MAIN LOGIN / SIGNUP HANDLER ==
    // ==========================================================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'FORGOT_PASSWORD') return handleRecoverySubmit(e);

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
                    const { session: signInSession, error: signInError } = await AuthService.signIn(email, password);
                    if (signInSession) {
                        onSuccess?.();
                    } else {
                        console.warn("[LoginScreen] Auto-login failed after signup:", signInError);
                        setSuccessMessage("Account created! Please verify your email.");
                    }
                }
            } else {
                const { error: signInError } = await AuthService.signIn(email, password);
                if (signInError) throw signInError;
                onSuccess?.();
            }
        } catch (err: unknown) {
            setError(mapAuthError(err));
        } finally {
            setLoading(false);
        }
    };

    /**
     * Maps raw Supabase errors to Vibe-friendly messages.
     */
    const mapAuthError = (err: unknown): string => {
        const msg = ((err as Error).message || "").toLowerCase();

        if (msg.includes("leaked password") || msg.includes("breach")) {
            return "Security Alert: This password has appeared in a data breach. Please choose a different one.";
        }
        if (msg.includes("password") && (msg.includes("length") || msg.includes("short"))) {
            return "Password too weak. Use at least 8 characters.";
        }
        if (msg.includes("invalid login credentials")) return "Invalid email or password.";
        if (msg.includes("user already registered")) return "Account already exists. Try logging in.";
        if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("exceeded")) {
            return "Security: Too many attempts. Please verify your email inbox or wait 60 minutes.";
        }

        return (err as Error).message || "Authentication failed. Please try again.";
    };

    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetState();
        resetRecoveryState();
    };

    // ==========================================================================
    // == RENDER ==
    // ==========================================================================

    const getHeaderTitle = () => {
        if (mode === 'FORGOT_PASSWORD') {
            if (recoveryStep === 'EMAIL') return 'Reset Password';
            if (recoveryStep === 'OTP') return 'Verify Code';
            if (recoveryStep === 'NEW_PASSWORD') return 'New Password';
        }
        return 'Enter the Vibe';
    };

    const getHeaderSubtitle = () => {
        if (mode === 'LOGIN') return "Welcome back, Architect.";
        if (mode === 'SIGNUP') return "Join the design revolution.";
        if (mode === 'FORGOT_PASSWORD') {
            if (recoveryStep === 'EMAIL') return "We'll send you a verification code.";
            if (recoveryStep === 'OTP') return "Enter the 6-digit code from your email.";
            if (recoveryStep === 'NEW_PASSWORD') return "Choose a strong, unique password.";
        }
        return "";
    };

    const getButtonLabel = (): string => {
        if (mode === 'LOGIN') return 'Sign In';
        if (mode === 'SIGNUP') return 'Create Account';
        if (mode === 'FORGOT_PASSWORD') {
            if (recoveryStep === 'EMAIL') return 'Send Code';
            if (recoveryStep === 'OTP') return 'Verify Code';
            if (recoveryStep === 'NEW_PASSWORD') return 'Set New Password';
        }
        return 'Continue';
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
                        {mode === 'FORGOT_PASSWORD' && recoveryStep === 'OTP' && <KeyRound className="w-6 h-6 text-warning" />}
                        {mode === 'FORGOT_PASSWORD' && recoveryStep === 'NEW_PASSWORD' && <ShieldCheck className="w-6 h-6 text-success" />}
                        {(mode !== 'FORGOT_PASSWORD' || recoveryStep === 'EMAIL') && <Sparkles className="w-6 h-6 text-primary" />}
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                        {getHeaderTitle()}
                    </h1>
                    <p className="text-text-muted text-sm">
                        {getHeaderSubtitle()}
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    layout
                    className="backdrop-blur-xl bg-surface-1/50 border border-white/10 p-6 rounded-2xl shadow-card"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {/* SIGNUP: Username Field */}
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

                            {/* EMAIL: Always shown for Login/Signup, and for Recovery Step 1 */}
                            {(mode !== 'FORGOT_PASSWORD' || recoveryStep === 'EMAIL') && (
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
                            )}

                            {/* PASSWORD: For Login/Signup modes only */}
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

                            {/* RECOVERY: OTP Code Input */}
                            {mode === 'FORGOT_PASSWORD' && recoveryStep === 'OTP' && (
                                <motion.div
                                    key="otp-code"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <Input
                                        label="Verification Code"
                                        type="text"
                                        placeholder="123456"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                        icon={<KeyRound className="w-4 h-4" />}
                                        className="bg-void/50 text-center tracking-[0.3em] font-mono"
                                        maxLength={6}
                                    />
                                </motion.div>
                            )}

                            {/* RECOVERY: New Password Inputs */}
                            {mode === 'FORGOT_PASSWORD' && recoveryStep === 'NEW_PASSWORD' && (
                                <motion.div
                                    key="new-password-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden space-y-3"
                                >
                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        icon={<Lock className="w-4 h-4" />}
                                        className="bg-void/50"
                                    />
                                    <Input
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        icon={<ShieldCheck className="w-4 h-4" />}
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
                                {getButtonLabel()}
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
                        Secured by Supabase • Vibe Engine v2.1
                    </motion.p>
                )}
            </div>
        </div>
    );
};
