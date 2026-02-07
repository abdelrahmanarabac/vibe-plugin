/**
 * @module LoginScreen
 * @description Complete authentication screen with all flows:
 * - Login (Email + Password)
 * - Create Account → OTP Verify → Set Password/Username
 * - Forgot Password → OTP Verify → Reset Password
 * 
 * @version 4.0.0 - OTP-First Passwordless Architecture
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthService, type AuthResult, type OtpResult } from '../AuthService';
import { GuidedInput, type ValidationState } from '../../../components/shared/base/GuidedInput';
import { Button } from '../../../components/shared/base/Button';
import { fadeTransition } from '../../../shared/animations/MicroAnimations';

// ============================================================================
// 📝 TYPES
// ============================================================================

interface LoginScreenProps {
    onSuccess: () => void;
}

/**
 * All possible authentication modes in the flow
 * 
 * SIGNUP FLOW: signup → signup-otp-verify → signup-complete
 * FORGOT FLOW: forgot-password → forgot-otp-verify → reset-password
 */
type AuthMode =
    | 'login'                    // Default: Email + Password login
    | 'signup'                   // Step 1: Enter email only
    | 'signup-otp-verify'        // Step 2: Verify OTP
    | 'signup-complete'          // Step 3: Set username + password
    | 'forgot-password'          // Step 1: Enter email
    | 'forgot-otp-verify'        // Step 2: Verify recovery OTP
    | 'reset-password';          // Step 3: Set new password

interface FormState {
    email: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    username: string;
    otpCode: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    username?: string;
    otpCode?: string;
    general?: string;
}

interface FeedbackState {
    type: 'success' | 'info' | 'error';
    message: string;
}

// ============================================================================
// 🎨 DESIGN SYSTEM TOKEN ILLUSTRATION
// ============================================================================

const DesignTokenIllustration: React.FC = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Subtle Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Main SVG: Design Token System Visualization */}
            <svg
                viewBox="0 0 320 480"
                className="w-full max-w-[260px] h-auto"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* CONNECTION LINES */}
                <motion.path
                    d="M160 95 L160 140"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 0.8 }}
                />
                <motion.path
                    d="M130 185 L90 230"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 1.0 }}
                />
                <motion.path
                    d="M190 185 L230 230"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 1.0 }}
                />
                <motion.path
                    d="M90 280 L130 330"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 1.2 }}
                />
                <motion.path
                    d="M230 280 L190 330"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1, delay: 1.2 }}
                />

                {/* COLOR TOKEN */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <circle cx="160" cy="60" r="32" fill="url(#colorTokenGradient)" />
                    <circle cx="160" cy="60" r="32" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                    <circle cx="150" cy="52" r="8" fill="#6E62E5" />
                    <circle cx="170" cy="52" r="8" fill="#A855F7" />
                    <circle cx="160" cy="68" r="8" fill="#10B981" />
                </motion.g>

                {/* TYPOGRAPHY TOKEN */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                    <rect x="115" y="140" width="90" height="44" rx="10" fill="url(#tokenBgGradient)" />
                    <rect x="115" y="140" width="90" height="44" rx="10" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                    <text x="160" y="168" textAnchor="middle" fill="#F4F4F5" fontSize="18" fontWeight="600" fontFamily="Inter, sans-serif">Aa</text>
                </motion.g>

                {/* SPACING TOKENS */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                    <rect x="55" y="230" width="50" height="50" rx="8" fill="url(#tokenBgGradient)" />
                    <rect x="55" y="230" width="50" height="50" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                    <rect x="65" y="245" width="30" height="4" rx="2" fill="#6E62E5" opacity="0.8" />
                    <rect x="65" y="253" width="20" height="4" rx="2" fill="#6E62E5" opacity="0.5" />
                    <rect x="65" y="261" width="25" height="4" rx="2" fill="#6E62E5" opacity="0.3" />
                </motion.g>
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                >
                    <rect x="215" y="230" width="50" height="50" rx="8" fill="url(#tokenBgGradient)" />
                    <rect x="215" y="230" width="50" height="50" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                    <rect x="225" y="242" width="12" height="12" rx="2" fill="#A855F7" opacity="0.6" />
                    <rect x="241" y="242" width="12" height="12" rx="2" fill="#A855F7" opacity="0.4" />
                    <rect x="225" y="258" width="12" height="12" rx="2" fill="#A855F7" opacity="0.4" />
                    <rect x="241" y="258" width="12" height="12" rx="2" fill="#A855F7" opacity="0.2" />
                </motion.g>

                {/* COMPONENT TOKEN */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
                >
                    <rect x="100" y="330" width="120" height="70" rx="12" fill="url(#componentGradient)" />
                    <rect x="100" y="330" width="120" height="70" rx="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
                    <rect x="112" y="344" width="40" height="6" rx="3" fill="rgba(255,255,255,0.5)" />
                    <rect x="112" y="356" width="96" height="32" rx="6" fill="#6E62E5" />
                    <text x="160" y="377" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">Button</text>
                </motion.g>

                {/* DECORATIVE FLOATING DOTS */}
                <motion.circle
                    cx="40" cy="90" r="4"
                    fill="#6E62E5"
                    opacity="0.3"
                    animate={{ y: [-5, 5, -5], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="280" cy="180" r="3"
                    fill="#A855F7"
                    opacity="0.3"
                    animate={{ y: [5, -5, 5], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.circle
                    cx="60" cy="380" r="5"
                    fill="#10B981"
                    opacity="0.2"
                    animate={{ y: [-8, 8, -8], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.circle
                    cx="270" cy="340" r="4"
                    fill="#6E62E5"
                    opacity="0.25"
                    animate={{ y: [6, -6, 6], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                />

                {/* GRADIENTS */}
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6E62E5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#A855F7" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="colorTokenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(30, 27, 46, 0.9)" />
                        <stop offset="100%" stopColor="rgba(25, 23, 38, 0.95)" />
                    </linearGradient>
                    <linearGradient id="tokenBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(30, 27, 46, 0.8)" />
                        <stop offset="100%" stopColor="rgba(20, 18, 30, 0.9)" />
                    </linearGradient>
                    <linearGradient id="componentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(35, 32, 52, 0.85)" />
                        <stop offset="100%" stopColor="rgba(25, 23, 38, 0.95)" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// ============================================================================
// 🧩 MAIN COMPONENT
// ============================================================================

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
    // Current auth mode
    const [mode, setMode] = useState<AuthMode>('login');

    // Form state
    const [form, setForm] = useState<FormState>({
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        username: '',
        otpCode: '',
    });

    // UI state
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [emailValidation, setEmailValidation] = useState<ValidationState>('idle');
    const [passwordValidation, setPasswordValidation] = useState<ValidationState>('idle');

    // ========================================================================
    // HELPERS
    // ========================================================================

    const updateField = (field: keyof FormState, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const resetForm = () => {
        setForm({
            email: '',
            password: '',
            newPassword: '',
            confirmNewPassword: '',
            username: '',
            otpCode: '',
        });
        setErrors({});
        setFeedback(null);
        setEmailValidation('idle');
        setPasswordValidation('idle');
    };

    const showFeedback = (type: 'success' | 'info' | 'error', message: string) => {
        setFeedback({ type, message });
    };

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Auto-clear feedback after 5 seconds
    useEffect(() => {
        if (feedback && (feedback.type === 'success' || feedback.type === 'info')) {
            const timer = setTimeout(() => setFeedback(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    // ========================================================================
    // VALIDATION
    // ========================================================================

    const validateLoginForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignupEmailForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateOtpForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.otpCode || form.otpCode.length !== 6) {
            newErrors.otpCode = 'Please enter the 6-digit code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSignupCompleteForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.username) {
            newErrors.username = 'Username is required';
        } else if (form.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!form.password) {
            newErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateResetPasswordForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (form.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (form.newPassword !== form.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ========================================================================
    // AUTH ACTIONS
    // ========================================================================

    /**
     * Handle Login (Email + Password)
     */
    const handleLogin = async () => {
        if (!validateLoginForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);
        setEmailValidation('validating');
        setPasswordValidation('validating');

        try {
            const result: AuthResult = await AuthService.signIn(form.email, form.password);

            if (result.error) {
                const errorMsg = result.error.message.toLowerCase();

                if (errorMsg.includes('not confirmed') || errorMsg.includes('verify')) {
                    setErrors({ general: 'Please confirm your email address first' });
                    // Send new OTP and go to verify
                    await AuthService.sendSignupOtp(form.email);
                    setMode('signup-otp-verify');
                    showFeedback('info', 'Verification code sent. Please check your email.');
                } else if (errorMsg.includes('invalid') || errorMsg.includes('credentials')) {
                    setErrors({ general: 'Invalid email or password' });
                    setEmailValidation('invalid');
                    setPasswordValidation('invalid');
                } else {
                    setErrors({ general: result.error.message });
                }
                return;
            }

            setEmailValidation('valid');
            setPasswordValidation('valid');
            showFeedback('success', 'Login successful!');
            onSuccess();

        } catch (error) {
            console.error('[LoginScreen] Login error:', error);
            setErrors({ general: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Signup Step 1: Send OTP to Email
     */
    const handleSignupSendOtp = async () => {
        if (!validateSignupEmailForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result: OtpResult = await AuthService.sendSignupOtp(form.email);

            if (result.error) {
                setErrors({ general: result.error.message });
                return;
            }

            // OTP sent - proceed to verify step
            setMode('signup-otp-verify');
            showFeedback('success', `Verification code sent to ${form.email}`);

        } catch (error) {
            console.error('[LoginScreen] Signup OTP send error:', error);
            setErrors({ general: 'Failed to send verification code. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Signup Step 2: Verify OTP
     */
    const handleVerifySignupOtp = async () => {
        if (!validateOtpForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result = await AuthService.verifySignupOtp(form.email, form.otpCode);

            if (result.error) {
                setErrors({ otpCode: 'Invalid or expired code. Please try again.' });
                return;
            }

            // OTP verified - proceed to set username/password
            setMode('signup-complete');
            showFeedback('success', 'Email verified! Now set your username and password.');

        } catch (error) {
            console.error('[LoginScreen] Signup OTP verify error:', error);
            setErrors({ otpCode: 'Verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Signup Step 3: Complete Signup (set password + username)
     */
    const handleCompleteSignup = async () => {
        if (!validateSignupCompleteForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result = await AuthService.completeSignup(form.password, form.username);

            if (result.error) {
                setErrors({ general: result.error.message });
                return;
            }

            showFeedback('success', 'Account created successfully! Welcome to Vibe Tokens.');
            onSuccess();

        } catch (error) {
            console.error('[LoginScreen] Complete signup error:', error);
            setErrors({ general: 'Failed to complete signup. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Forgot Password Step 1: Send Recovery OTP
     */
    const handleForgotPassword = async () => {
        if (!validateSignupEmailForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result = await AuthService.sendRecoveryOtp(form.email);

            if (result.error) {
                setErrors({ general: result.error.message });
                return;
            }

            setMode('forgot-otp-verify');
            showFeedback('success', `Recovery code sent to ${form.email}`);

        } catch (error) {
            console.error('[LoginScreen] Forgot password error:', error);
            setErrors({ general: 'Failed to send recovery code. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Forgot Password Step 2: Verify Recovery OTP
     */
    const handleVerifyRecoveryOtp = async () => {
        if (!validateOtpForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result = await AuthService.verifyRecoveryOtp(form.email, form.otpCode);

            if (result.error) {
                setErrors({ otpCode: 'Invalid or expired code. Please try again.' });
                return;
            }

            // OTP verified - proceed to reset password
            setMode('reset-password');
            showFeedback('success', 'Code verified! Now set your new password.');

        } catch (error) {
            console.error('[LoginScreen] Recovery OTP verify error:', error);
            setErrors({ otpCode: 'Verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle Forgot Password Step 3: Reset Password
     */
    const handleResetPassword = async () => {
        if (!validateResetPasswordForm()) return;

        setIsLoading(true);
        setErrors({});
        setFeedback(null);

        try {
            const result = await AuthService.updatePassword(form.newPassword);

            if (result.error) {
                setErrors({ general: result.error.message });
                return;
            }

            showFeedback('success', 'Password updated successfully!');

            // Return to login after short delay
            setTimeout(() => {
                resetForm();
                setMode('login');
            }, 1500);

        } catch (error) {
            console.error('[LoginScreen] Password reset error:', error);
            setErrors({ general: 'Failed to update password. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Form Submit Handler - Routes to correct action
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        switch (mode) {
            case 'login':
                await handleLogin();
                break;
            case 'signup':
                await handleSignupSendOtp();
                break;
            case 'signup-otp-verify':
                await handleVerifySignupOtp();
                break;
            case 'signup-complete':
                await handleCompleteSignup();
                break;
            case 'forgot-password':
                await handleForgotPassword();
                break;
            case 'forgot-otp-verify':
                await handleVerifyRecoveryOtp();
                break;
            case 'reset-password':
                await handleResetPassword();
                break;
        }
    };

    /**
     * Get header content based on mode
     */
    const getHeaderContent = () => {
        switch (mode) {
            case 'login':
                return { title: 'Welcome Back', subtitle: 'Sign in to continue to Vibe Tokens' };
            case 'signup':
                return { title: 'Create Account', subtitle: 'Enter your email to get started' };
            case 'signup-otp-verify':
                return { title: 'Verify Email', subtitle: 'Enter the 6-digit code sent to your email' };
            case 'signup-complete':
                return { title: 'Almost Done!', subtitle: 'Set your username and password' };
            case 'forgot-password':
                return { title: 'Forgot Password', subtitle: 'Enter your email to receive a recovery code' };
            case 'forgot-otp-verify':
                return { title: 'Verify Code', subtitle: 'Enter the 6-digit recovery code' };
            case 'reset-password':
                return { title: 'Reset Password', subtitle: 'Choose a new secure password' };
        }
    };

    /**
     * Get submit button text based on mode
     */
    const getSubmitButtonText = () => {
        switch (mode) {
            case 'login': return 'Sign In';
            case 'signup': return 'Send Code';
            case 'signup-otp-verify': return 'Verify Email';
            case 'signup-complete': return 'Create Account';
            case 'forgot-password': return 'Send Code';
            case 'forgot-otp-verify': return 'Verify Code';
            case 'reset-password': return 'Reset Password';
        }
    };

    /**
     * Handle back navigation
     */
    const handleBack = () => {
        if (mode === 'forgot-otp-verify') {
            setMode('forgot-password');
        } else if (mode === 'reset-password') {
            setMode('forgot-otp-verify');
        } else if (mode === 'signup-otp-verify') {
            setMode('signup');
        } else if (mode === 'signup-complete') {
            // Cannot go back after OTP verified - session is active
            setMode('signup-otp-verify');
        } else {
            setMode('login');
        }
        setErrors({});
        setFeedback(null);
    };

    const showBackButton = ['forgot-password', 'forgot-otp-verify', 'reset-password', 'signup-otp-verify'].includes(mode);

    const headerContent = getHeaderContent();

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeTransition}
            className="flex h-screen w-full bg-void overflow-hidden"
        >
            {/* LEFT: VISUAL ZONE (40%) */}
            <div className="hidden md:flex w-[40%] bg-surface-0 border-r border-white/5 relative">
                <DesignTokenIllustration />
            </div>

            {/* RIGHT: FORM ZONE (60%) */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 overflow-y-auto">
                <div className="w-full max-w-sm">

                    {/* Back Button (for sub-flows) */}
                    {showBackButton && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            type="button"
                            onClick={handleBack}
                            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </motion.button>
                    )}

                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        key={mode}
                    >
                        <h1 className="text-2xl font-bold text-white font-display tracking-tight mb-2">
                            {headerContent.title}
                        </h1>
                        <p className="text-sm text-text-dim">
                            {headerContent.subtitle}
                        </p>
                    </motion.div>

                    {/* Feedback Message (Success/Info) */}
                    <AnimatePresence mode="wait">
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className={`p-3 rounded-lg flex items-start gap-2 ${feedback.type === 'success'
                                    ? 'bg-success/10 border border-success/30'
                                    : feedback.type === 'info'
                                        ? 'bg-primary/10 border border-primary/30'
                                        : 'bg-error/10 border border-error/30'
                                    }`}
                            >
                                <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${feedback.type === 'success' ? 'text-success' :
                                    feedback.type === 'info' ? 'text-primary' : 'text-error'
                                    }`} />
                                <span className={`text-sm ${feedback.type === 'success' ? 'text-success' :
                                    feedback.type === 'info' ? 'text-primary' : 'text-error'
                                    }`}>{feedback.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* General Error */}
                    <AnimatePresence mode="wait">
                        {errors.general && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg flex items-start gap-2"
                            >
                                <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-error">{errors.general}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {/* ===== LOGIN MODE ===== */}
                            {mode === 'login' && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <GuidedInput
                                        label="Email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        error={errors.email}
                                        validationState={emailValidation}
                                        icon={<Mail className="w-4 h-4 text-text-muted" />}
                                        autoComplete="email"
                                    />
                                    <GuidedInput
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        error={errors.password}
                                        validationState={passwordValidation}
                                        icon={<Lock className="w-4 h-4 text-text-muted" />}
                                        autoComplete="current-password"
                                    />
                                </motion.div>
                            )}

                            {/* ===== SIGNUP STEP 1: EMAIL ONLY ===== */}
                            {mode === 'signup' && (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GuidedInput
                                        label="Email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        error={errors.email}
                                        icon={<Mail className="w-4 h-4 text-text-muted" />}
                                        autoComplete="email"
                                    />
                                </motion.div>
                            )}

                            {/* ===== OTP VERIFICATION (Signup & Recovery) ===== */}
                            {(mode === 'signup-otp-verify' || mode === 'forgot-otp-verify') && (
                                <motion.div
                                    key="otp-verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GuidedInput
                                        label="Verification Code"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={form.otpCode}
                                        onChange={(e) => updateField('otpCode', e.target.value)}
                                        error={errors.otpCode}
                                        icon={<Lock className="w-4 h-4 text-text-muted" />}
                                        autoComplete="one-time-code"
                                        maxLength={6}
                                    />
                                </motion.div>
                            )}

                            {/* ===== SIGNUP STEP 3: USERNAME + PASSWORD ===== */}
                            {mode === 'signup-complete' && (
                                <motion.div
                                    key="signup-complete"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <GuidedInput
                                        label="Username"
                                        type="text"
                                        placeholder="Choose a unique username"
                                        value={form.username}
                                        onChange={(e) => updateField('username', e.target.value)}
                                        error={errors.username}
                                        icon={<User className="w-4 h-4 text-text-muted" />}
                                        autoComplete="username"
                                    />
                                    <GuidedInput
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        error={errors.password}
                                        icon={<Lock className="w-4 h-4 text-text-muted" />}
                                        showStrengthMeter={true}
                                        autoComplete="new-password"
                                    />
                                </motion.div>
                            )}

                            {/* ===== FORGOT PASSWORD MODE ===== */}
                            {mode === 'forgot-password' && (
                                <motion.div
                                    key="forgot"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GuidedInput
                                        label="Email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={form.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        error={errors.email}
                                        icon={<Mail className="w-4 h-4 text-text-muted" />}
                                        autoComplete="email"
                                    />
                                </motion.div>
                            )}

                            {/* ===== RESET PASSWORD MODE ===== */}
                            {mode === 'reset-password' && (
                                <motion.div
                                    key="reset"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <GuidedInput
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.newPassword}
                                        onChange={(e) => updateField('newPassword', e.target.value)}
                                        error={errors.newPassword}
                                        icon={<Lock className="w-4 h-4 text-text-muted" />}
                                        showStrengthMeter={true}
                                        autoComplete="new-password"
                                    />
                                    <GuidedInput
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={form.confirmNewPassword}
                                        onChange={(e) => updateField('confirmNewPassword', e.target.value)}
                                        error={errors.confirmNewPassword}
                                        icon={<Lock className="w-4 h-4 text-text-muted" />}
                                        autoComplete="new-password"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={isLoading}
                            className="w-full mt-2"
                        >
                            {getSubmitButtonText()}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 text-center space-y-3">
                        {/* Login mode footer */}
                        {mode === 'login' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('forgot-password');
                                        setErrors({});
                                        setFeedback(null);
                                    }}
                                    className="text-sm text-text-muted hover:text-primary transition-colors"
                                >
                                    Forgot your password?
                                </button>
                                <p className="text-sm text-text-dim">
                                    Don't have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('signup');
                                            resetForm();
                                        }}
                                        className="text-primary hover:text-primary-hover font-medium transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            </>
                        )}

                        {/* Signup mode footer */}
                        {mode === 'signup' && (
                            <p className="text-sm text-text-dim">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMode('login');
                                        resetForm();
                                    }}
                                    className="text-primary hover:text-primary-hover font-medium transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
