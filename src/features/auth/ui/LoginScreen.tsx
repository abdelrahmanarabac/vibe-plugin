/**
 * @module LoginScreen
 * @description Omni-Box Guided Authentication Experience (Auth v3.0).
 * @version 3.0.0 - Omni-Box Design, Guided Inputs, OTP Flow Preserved.
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2, KeyRound, ShieldCheck, ChevronRight } from 'lucide-react';
import { AuthService } from '../AuthService';
import { Button } from '../../../components/shared/base/Button';
import { GuidedInput } from '../../../components/shared/base/GuidedInput';
import { VibeSupabase } from '../../../infrastructure/supabase/SupabaseClient';
import {
    scaleIn,
    vibeEase
} from '../../../shared/animations/MicroAnimations';
import { useOnboarding } from '../../auth/OnboardingStore';

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

// Config
const OTP_COOLDOWN_SECONDS = 120;

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
    console.log("🚀 Vibe Plugin: Bento-Enhanced Omni-Box Loaded");
    const [mode, setMode] = useState<AuthMode>('LOGIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Omni-Box interaction state for premium animations
    const [isInteracting, setIsInteracting] = useState(false);

    // Onboarding State (Greeting Logic)
    const { isFirstSession } = useOnboarding();

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // OTP Recovery State
    const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('EMAIL');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Rate Limit Timer
    const [resendTimer, setResendTimer] = useState(0);

    // Countdown Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

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
        if (resendTimer > 0) return; // Prevent spamming

        resetState();
        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }
        setLoading(true);

        const { error: otpError } = await AuthService.sendRecoveryOtp(email.trim());

        if (otpError) {
            setError(mapAuthError(otpError));
        } else {
            setSuccessMessage("Code sent! Check your email inbox (and spam).");
            setRecoveryStep('OTP');
            setResendTimer(OTP_COOLDOWN_SECONDS);
        }
        setLoading(false);
    };

    const handleVerifyOtp = async () => {
        resetState();
        if (!otpCode.trim() || otpCode.length < 6) {
            setError("Please enter the complete 6-digit code.");
            return;
        }
        setLoading(true);

        const { session, error: verifyError } = await AuthService.verifyRecoveryOtp(email.trim(), otpCode.trim());

        if (verifyError || !session) {
            setError(verifyError?.message || "Invalid code. Please check and try again.");
        } else {
            setSuccessMessage("Code verified! Set your new password.");
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
            setSuccessMessage("Password updated! You're now logged in.");
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
            if (!supabase) throw new Error("Connection failed. Please restart the plugin.");

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
                        console.warn("[LoginScreen] Auto-login failed:", signInError);
                        setSuccessMessage("Account created! Verify your email to continue.");
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
     * Maps raw Supabase errors to friendly, supportive Vibe messages.
     * Tone: Calm, helpful, never harsh.
     */
    const mapAuthError = (err: unknown): string => {
        const msg = ((err as Error).message || "").toLowerCase();

        if (msg.includes("leaked password") || msg.includes("breach")) {
            return "🔐 Security heads-up: This password appeared in a breach. Choose a stronger one.";
        }
        if (msg.includes("password") && (msg.includes("length") || msg.includes("short"))) {
            return "🔑 A bit longer — aim for 8+ characters for security.";
        }
        if (msg.includes("invalid login credentials")) return "🤔 Hmm, that email or password doesn't match. Double-check?";
        if (msg.includes("user already registered")) return "👋 Account already exists. Try logging in instead.";
        if (msg.includes("rate limit") || msg.includes("too many requests")) {
            return "⏱️ Whoa, slow down! Please wait a moment before trying again.";
        }
        if (msg.includes("invalid email") || msg.includes("email")) {
            return "📧 Let's check that email format — looks off.";
        }

        return (err as Error).message || "⚠️ Something went wrong. Mind trying again?";
    };

    const toggleMode = (newMode: AuthMode) => {
        setMode(newMode);
        resetState();
        resetRecoveryState();
    };

    // ==========================================================================
    // == RENDER HELPERS ==
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
        if (mode === 'LOGIN') {
            return isFirstSession ? "Welcome back. Let's create something amazing." : "";
        }
        if (mode === 'SIGNUP') return "Join the design revolution. ✨";
        if (mode === 'FORGOT_PASSWORD') {
            if (recoveryStep === 'EMAIL') return "We'll email you a recovery code. Check your inbox.";
            if (recoveryStep === 'OTP') return "Enter the code we sent to your email.";
            if (recoveryStep === 'NEW_PASSWORD') return "Create a strong new password.";
        }
        return "";
    };

    const getButtonLabel = (): string => {
        if (mode === 'LOGIN') return 'Enter the Vibe';
        if (mode === 'SIGNUP') return 'Join the Revolution';
        if (mode === 'FORGOT_PASSWORD') {
            if (recoveryStep === 'EMAIL') return 'Send Recovery Code';
            if (recoveryStep === 'OTP') return 'Verify Code';
            if (recoveryStep === 'NEW_PASSWORD') return 'Reset & Secure';
        }
        return 'Continue';
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-void text-text-primary px-6 overflow-hidden relative">
            {/* Background Ambient Glow (Consistent with WelcomeScreen) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1 }}
                className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,var(--color-primary-glow)_0%,transparent_60%)] pointer-events-none"
            />

            {/* Bento-Enhanced Omni-Box Container */}
            <motion.div
                initial="hidden"
                animate={{
                    opacity: 1,
                    scale: isInteracting ? 1.01 : 1,
                    y: isInteracting ? -4 : 0
                }}
                exit="exit"
                variants={scaleIn}
                transition={vibeEase}
                className="w-full max-w-sm relative z-10"
            >
                {/* Header Context */}
                <div className="text-center mb-8">
                    <motion.div
                        layoutId="auth-icon"
                        className="inline-flex items-center justify-center w-14 h-14 rounded-[20px] bg-white/5 border border-white/10 shadow-glow mb-4 backdrop-blur-md"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                {mode === 'LOGIN' && <Sparkles className="w-7 h-7 text-primary" />}
                                {mode === 'SIGNUP' && <User className="w-7 h-7 text-secondary" />}
                                {mode === 'FORGOT_PASSWORD' && <KeyRound className="w-7 h-7 text-warning" />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>

                    <motion.h1
                        layoutId="auth-title"
                        className="text-2xl font-bold tracking-tight text-white font-display mb-2"
                    >
                        {mode === 'LOGIN' && !isFirstSession ? "Welcome back 👋" : getHeaderTitle()}
                    </motion.h1>

                    <motion.p
                        layoutId="auth-subtitle"
                        className="text-text-dim text-sm"
                    >
                        {getHeaderSubtitle()}
                    </motion.p>
                </div>

                {/* Bento-Style Glassmorphic Form Card */}
                <motion.div
                    className="backdrop-blur-[24px] bg-surface-1/60 border border-white/10 rounded-[28px] shadow-card transition-shadow duration-500"
                    animate={{
                        boxShadow: isInteracting
                            ? "0 0 40px 4px rgba(110, 98, 229, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.4)"
                            : "0 4px 6px -1px rgba(0, 0, 0, 0.4)"
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <form onSubmit={handleSubmit} className="p-7 space-y-5">
                        <AnimatePresence mode="popLayout">
                            {/* SIGNUP: Username Section (Bento Tile) */}
                            {mode === 'SIGNUP' && (
                                <motion.div
                                    key="username"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.05] transition-colors">
                                        <GuidedInput
                                            label="Username"
                                            placeholder="your_designer_name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            onFocus={() => setIsInteracting(true)}
                                            onBlur={() => setIsInteracting(false)}
                                            icon={<User className="w-4 h-4 text-text-muted" />}
                                            onboardingHint="Choose a unique handle for the community. ✨"
                                            suppressHints={!isFirstSession}
                                            required={mode === 'SIGNUP'}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Credentials Section (Bento Tile) */}
                            {(mode !== 'FORGOT_PASSWORD' || recoveryStep === 'EMAIL') && (
                                <motion.div
                                    key="credentials"
                                    layout
                                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.05] transition-colors space-y-4"
                                >
                                    <GuidedInput
                                        label="Email"
                                        type="email"
                                        placeholder="you@design.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setIsInteracting(true)}
                                        onBlur={() => setIsInteracting(false)}
                                        icon={<Mail className="w-4 h-4 text-text-muted" />}
                                        onboardingHint={mode === 'LOGIN' ? "Your registered email address. 📧" : "We'll send you a verification link. 💌"}
                                        suppressHints={!isFirstSession}
                                        required
                                    />

                                    {/* PASSWORD: Login/Signup */}
                                    {mode !== 'FORGOT_PASSWORD' && (
                                        <GuidedInput
                                            label="Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setIsInteracting(true)}
                                            onBlur={() => setIsInteracting(false)}
                                            icon={<Lock className="w-4 h-4 text-text-muted" />}
                                            showStrengthMeter={mode === 'SIGNUP'}
                                            onboardingHint={mode === 'LOGIN' ? "Your secure password. 🔐" : "Make it strong! Mix letters, numbers, symbols. 💪"}
                                            suppressHints={!isFirstSession}
                                            required
                                        />
                                    )}
                                </motion.div>
                            )}



                            {/* RECOVERY: OTP Code */}
                            {mode === 'FORGOT_PASSWORD' && recoveryStep === 'OTP' && (
                                <motion.div
                                    key="otp-code"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03]">
                                        <GuidedInput
                                            label="Verification Code"
                                            placeholder="123456"
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                            onFocus={() => setIsInteracting(true)}
                                            onBlur={() => setIsInteracting(false)}
                                            icon={<KeyRound className="w-4 h-4 text-text-muted" />}
                                            className="text-center tracking-[0.3em] font-mono"
                                            onboardingHint="Check your inbox and spam folder. 📬"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* RECOVERY: New Passwords */}
                            {mode === 'FORGOT_PASSWORD' && recoveryStep === 'NEW_PASSWORD' && (
                                <motion.div
                                    key="new-password-fields"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.35 }}
                                >
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] space-y-4">
                                        <GuidedInput
                                            label="New Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            onFocus={() => setIsInteracting(true)}
                                            onBlur={() => setIsInteracting(false)}
                                            icon={<Lock className="w-4 h-4 text-text-muted" />}
                                            showStrengthMeter
                                            onboardingHint="Create a strong password. You've got this! 💪"
                                            required
                                        />
                                        <GuidedInput
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onFocus={() => setIsInteracting(true)}
                                            onBlur={() => setIsInteracting(false)}
                                            icon={<ShieldCheck className="w-4 h-4 text-text-muted" />}
                                            validationState={confirmPassword && newPassword === confirmPassword ? 'valid' : 'idle'}
                                            validationMessage={confirmPassword && newPassword === confirmPassword ? "Perfect match! ✨" : undefined}
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Friendly Messages (Supportive Tone) */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    variants={{
                                        error: {
                                            x: [-4, 4, -3, 3, -2, 2, 0],
                                            transition: { duration: 0.4 }
                                        }
                                    }}
                                    className="p-3.5 bg-error/[0.08] border border-error/[0.15] rounded-xl flex items-start gap-3"
                                >
                                    <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                                    <span className="text-xs text-error font-medium leading-relaxed">{error}</span>
                                </motion.div>
                            )}
                            {successMessage && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    className="p-3.5 bg-success/[0.08] border border-success/[0.15] rounded-xl flex items-start gap-3"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                    <span className="text-xs text-success font-medium leading-relaxed">{successMessage}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions (Polished Interactions) */}
                        <div className="pt-2 space-y-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full shadow-glow active:scale-[0.98] hover:scale-[1.01] transition-transform duration-150"
                                loading={loading}
                                disabled={loading || (mode === 'FORGOT_PASSWORD' && recoveryStep === 'EMAIL' && resendTimer > 0)}
                                icon={(!loading && resendTimer === 0) ? <ArrowRight className="w-4 h-4" /> : undefined}
                            >
                                {mode === 'FORGOT_PASSWORD' && recoveryStep === 'EMAIL' && resendTimer > 0
                                    ? `Resend in ${resendTimer}s`
                                    : getButtonLabel()}
                            </Button>

                            {/* Footer Links */}
                            <div className="flex items-center justify-between px-1">
                                {mode === 'LOGIN' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('FORGOT_PASSWORD')}
                                            className="text-xs text-text-muted hover:text-text-primary transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('SIGNUP')}
                                            className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            Create account <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                                {mode === 'SIGNUP' && (
                                    <div className="w-full text-center">
                                        <span className="text-xs text-text-muted">Already have an account? </span>
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('LOGIN')}
                                            className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                )}
                                {mode === 'FORGOT_PASSWORD' && (
                                    <button
                                        type="button"
                                        onClick={() => toggleMode('LOGIN')}
                                        className="w-full text-center text-xs text-text-muted hover:text-white transition-colors"
                                    >
                                        Back to Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>

                {/* Secure Footer */}
                {mode === 'LOGIN' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-dim"
                    >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Secured by Vibe Auth • Figma Compliant</span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

