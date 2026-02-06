/**
 * @module GuidedInput
 * @description Enhanced input component with intelligent guidance system for onboarding.
 * @version 1.0.0
 * 
 * Features:
 * - Contextual floating hints on focus
 * - Real-time validation with gentle feedback
 * - Password strength meter
 * - Accessibility-first design (WCAG 2.2 AA)
 * - Smooth micro-animations
 */

import React, { useState, useEffect, forwardRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../../shared/lib/classnames';
import {
    floatingHint,
    iconShift,
    shake,
    checkmark,
    getStrengthColor
} from '../../../shared/animations/MicroAnimations';

// ============================================================================
// 📝 TYPES
// ============================================================================

export type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid';

export interface GuidedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    hint?: string;
    error?: string;
    icon?: React.ReactNode;

    /**
     * Contextual hint shown on focus (for first-time users)
     */
    onboardingHint?: string;

    /**
     * Current validation state
     */
    validationState?: ValidationState;

    /**
     * Suppress onboarding hints (for returning users)
     */
    suppressHints?: boolean;

    /**
     * Custom validation message (overrides default)
     */
    validationMessage?: string;

    /**
     * Show password strength meter (only for type="password")
     */
    showStrengthMeter?: boolean;

    /**
     * Custom strength calculation function
     */
    calculateStrength?: (value: string) => number;
}

// ============================================================================
// 💪 PASSWORD STRENGTH CALCULATOR
// ============================================================================

/**
 * Calculate password strength (0-100)
 * Based on length, character variety, and common patterns
 */
const defaultStrengthCalculator = (password: string): number => {
    if (!password) return 0;

    let strength = 0;

    // Length bonus (max 40 points)
    strength += Math.min(password.length * 4, 40);

    // Character variety (max 40 points)
    if (/[a-z]/.test(password)) strength += 10; // Lowercase
    if (/[A-Z]/.test(password)) strength += 10; // Uppercase
    if (/[0-9]/.test(password)) strength += 10; // Numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10; // Special chars

    // Pattern penalties
    if (/(.)\1{2,}/.test(password)) strength -= 10; // Repeated chars
    if (/^[0-9]+$/.test(password)) strength -= 15; // Numbers only
    if (/^(password|12345|qwerty)/i.test(password)) strength -= 30; // Common patterns

    return Math.max(0, Math.min(100, strength));
};

/**
 * Get strength label based on score
 */
const getStrengthLabel = (strength: number): string => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
};

// ============================================================================
// 🎨 GUIDED INPUT COMPONENT
// ============================================================================

export const GuidedInput = forwardRef<HTMLInputElement, GuidedInputProps>((
    {
        label,
        hint,
        error,
        icon,
        onboardingHint,
        suppressHints = false,
        validationState = 'idle',
        validationMessage,
        showStrengthMeter = false,
        calculateStrength = defaultStrengthCalculator,
        className,
        id,
        type = 'text',
        onFocus,
        onBlur,
        onChange,
        value,
        ...props
    },
    ref
) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const [isFocused, setIsFocused] = useState(false);
    const [strength, setStrength] = useState(0);
    const [showValidation, setShowValidation] = useState(false);

    // Calculate password strength on value change
    useEffect(() => {
        if (showStrengthMeter && type === 'password' && typeof value === 'string') {
            setStrength(calculateStrength(value));
        }
    }, [value, showStrengthMeter, type, calculateStrength]);

    // Show validation after first blur or when state changes
    useEffect(() => {
        if (validationState !== 'idle') {
            setShowValidation(true);
        }
    }, [validationState]);

    // Handlers
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setShowValidation(true);
        onBlur?.(e);
    };

    // Determine display state
    const hasError = error || validationState === 'invalid';
    const isValid = validationState === 'valid';
    const isValidating = validationState === 'validating';

    // Get validation icon
    const ValidationIcon = () => {
        if (!showValidation || validationState === 'idle') return null;

        if (isValidating) {
            return (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <Loader2 className="w-4 h-4 text-warning" />
                </motion.div>
            );
        }

        if (isValid) {
            return (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={checkmark}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <CheckCircle2 className="w-4 h-4 text-success" />
                </motion.div>
            );
        }

        if (hasError) {
            return (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <AlertCircle className="w-4 h-4 text-error" />
                </motion.div>
            );
        }

        return null;
    };

    return (
        <div className="w-full space-y-2">
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-xs font-semibold uppercase tracking-wider text-text-muted ml-1"
                >
                    {label}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Floating Onboarding Hint (Suppressed for Returning Users) */}
                <AnimatePresence>
                    {isFocused && onboardingHint && !suppressHints && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={floatingHint}
                            className="absolute -top-12 left-0 right-0 z-10"
                        >
                            <div className="bg-surface-3/95 backdrop-blur-md border border-primary/30 rounded-lg px-3 py-2 shadow-lg">
                                <p className="text-xs text-text-dim leading-relaxed flex items-start gap-2">
                                    <span className="text-primary text-sm">💡</span>
                                    <span>{onboardingHint}</span>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Group */}
                <div className="relative group">
                    {/* Icon */}
                    {icon && (
                        <motion.div
                            variants={iconShift}
                            animate={isFocused ? 'active' : 'idle'}
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                        >
                            {icon}
                        </motion.div>
                    )}

                    {/* Input Field */}
                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            "w-full bg-surface-2 border border-white/5 text-text-primary placeholder:text-text-muted/50 rounded-lg py-3 text-sm transition-all duration-200",
                            icon ? "pl-10 pr-12" : "px-4 pr-12",
                            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                            "hover:border-white/10 hover:bg-surface-3",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            hasError && "border-error/50 focus:ring-error/30 focus:border-error",
                            isValid && "border-success/50",
                            isFocused && "shadow-glow border-primary/50",
                            className
                        )}
                        aria-invalid={hasError ? true : false}
                        aria-describedby={error || validationMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />

                    {/* Validation Icon */}
                    <ValidationIcon />
                </div>

                {/* Password Strength Meter */}
                {showStrengthMeter && type === 'password' && typeof value === 'string' && value.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-1.5"
                    >
                        {/* Meter Bar */}
                        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full transition-colors duration-300"
                                initial={{ width: '0%' }}
                                animate={{ width: `${strength}%` }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                style={{ backgroundColor: getStrengthColor(strength) }}
                            />
                        </div>

                        {/* Strength Label */}
                        <div className="flex items-center justify-between text-xs px-1">
                            <span className="text-text-muted">Strength:</span>
                            <span
                                className="font-medium transition-colors duration-300"
                                style={{ color: getStrengthColor(strength) }}
                            >
                                {getStrengthLabel(strength)}
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Error / Validation Message */}
            <AnimatePresence mode="wait">
                {hasError && (error || validationMessage) && (
                    <motion.div
                        key="error"
                        initial="initial"
                        animate="error"
                        exit={{ opacity: 0, height: 0 }}
                        variants={shake}
                        id={`${inputId}-error`}
                        className="text-xs text-error font-medium flex items-center gap-1.5 ml-1"
                        role="alert"
                        aria-live="polite"
                    >
                        <AlertCircle className="w-3.5 h-3.5 flex-none" />
                        <span>{error || validationMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint (Suppressed for Returning Users unless it's critical) */}
            {hint && !hasError && !suppressHints && (
                <p id={`${inputId}-hint`} className="text-xs text-text-muted ml-1">
                    {hint}
                </p>
            )}
        </div>
    );
});

GuidedInput.displayName = 'GuidedInput';

export default GuidedInput;
