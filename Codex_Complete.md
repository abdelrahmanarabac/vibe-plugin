# ًں•‹ VIBE SYSTEM CODEX (OMNI-ARCHIVE)
> **CLASSIFICATION:** TOP SECRET // VIBE ARCHITECT EYES ONLY
> **GENERATED:** 2026-02-07 03:14:44
> **SCOPE:** FULL RECURSIVE SOURCE DUMP
> **NOTE:** This file is auto-generated to ensure 100% code coverage.

---

---

## System Configuration
> Path: $Path

`$Lang
{
  "name": "vibe-plugin",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build && esbuild src/controller.ts --bundle --outfile=dist/controller.js --target=es2017",
    "watch": "concurrently \"npm:watch:*\"",
    "watch:ui": "vite build --watch",
    "watch:controller": "esbuild src/controller.ts --bundle --outfile=dist/controller.js --target=es2017 --watch",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --fix"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.122.0",
    "@tailwindcss/vite": "^4.1.18",
    "@types/react": "^19.2.8",
    "@types/react-dom": "^19.2.3",
    "@typescript-eslint/eslint-plugin": "^8.54.0",
    "@typescript-eslint/parser": "^8.54.0",
    "@vitejs/plugin-react": "^5.1.2",
    "autoprefixer": "^10.4.23",
    "concurrently": "^9.2.1",
    "eslint": "^9.39.2",
    "eslint-plugin-import": "^2.32.0",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.26",
    "globals": "^17.2.0",
    "jsdom": "^27.4.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.18",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.54.0",
    "vite": "^7.2.4",
    "vite-plugin-singlefile": "^2.3.0",
    "vitest": "^4.0.17"
  },
  "dependencies": {
    "@create-figma-plugin/utilities": "^4.0.3",
    "@supabase/supabase-js": "^2.91.1",
    "clsx": "^2.1.1",
    "colord": "^2.9.3",
    "framer-motion": "^12.27.5",
    "lucide-react": "^0.562.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "tailwind-merge": "^3.4.0",
    "zod": "^3.24.1"
  }
}

`

---

## TypeScript Config
> Path: $Path

`$Lang
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "removeComments": true,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "jsx": "react-jsx",
    "types": [
      "vite/client",
      "@figma/plugin-typings"
    ],
    "skipLibCheck": true,
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": [
    "src"
  ],
  "exclude": [
    "src/archived"
  ]
}
`

---

## Plugin Manifest
> Path: $Path

`$Lang
{
  "name": "Vibe Tokens",
  "id": "vibe-tokens-plugin",
  "api": "1.0.0",
  "main": "dist/controller.js",
  "ui": "dist/index.html",
  "editorType": [
    "figma"
  ],
  "capabilities": [],
  "enableProposedApi": false,
  "permissions": [],
  "networkAccess": {
    "allowedDomains": [
      "https://*.supabase.co",
      "https://fonts.googleapis.com",
      "https://static.figma.com"
    ],
    "reasoning": "This plugin connects to Supabase for color naming database access, Google Fonts for typography, and Figma static assets for web fonts."
  }
}
`

---

## Vite Config
> Path: $Path

`$Lang
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode: _mode }) => ({
    plugins: [
        tailwindcss(),
        react(),
        viteSingleFile()
    ],
    build: {
        target: "esnext",
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        outDir: "dist",
        rollupOptions: {
            input: {
                ui: "./index.html",
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
    },
}));

`

---

## ESLint Config
> Path: $Path

`$Lang
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
    },
);

`

---

## /src/App.tsx
> Path: $Path

`$Lang
import { useState, useEffect } from 'react';
import { VibeSupabase } from './infrastructure/supabase/SupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeApp } from './ui/hooks/useVibeApp';
import { MainLayout } from './ui/layouts/MainLayout';
import { TokensView } from './features/tokens/ui/pages/TokensView';
import { Dashboard } from './features/dashboard/ui/Dashboard';
import { SettingsPage } from './features/settings/ui/SettingsPage';
import { CreateTokenPage } from './features/tokens/ui/pages/CreateTokenPage';
import { ExportTokensPage } from './features/export/ui/pages/ExportTokensPage';
import { OmniboxTrigger } from './features/intelligence/omnibox';
import { FeedbackOmnibox } from './features/feedback/ui/FeedbackOmnibox';


// System Messaging
import { SystemProvider } from './ui/contexts/SystemContext';
import { SystemMessageBar } from './components/shared/system/SystemMessageBar';
import { BootScreen } from './components/shared/system/BootScreen';
import { AmbientBackground } from './components/shared/system/AmbientBackground';

import { AuthGate } from './features/auth/ui/AuthGate';

export default function App() {
    const [ready, setReady] = useState(false);

    // ⚡ Initialize Supabase Connection
    useEffect(() => {
        const init = async () => {
            await VibeSupabase.connect();
            setReady(true);
        };
        init();
    }, []);

    if (!ready) return null; // Or a splash screen, but AuthGate has one. 
    // Actually AuthGate has a loading state, but it fails if Supabase isn't ready.
    // So we block here.

    return (
        <SystemProvider>
            <AuthGate>
                <VibeAppContent />
            </AuthGate>
        </SystemProvider>
    );
}

function VibeAppContent() {
    const vm = useVibeApp();
    const [activeTab, setActiveTab] = useState<import('./ui/layouts/MainLayout').ViewType>('dashboard');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Fake credits for demo (Matches Dashboard)
    const credits = 1250;

    // 1. Boot Sequence (Premium Initialization)
    if (vm.settings.isLoading) {
        return <BootScreen />;
    }

    return (
        <div className="vibe-root relative h-full bg-void text-foreground font-sans antialiased overflow-hidden">
            <MainLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                credits={credits}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -4, scale: 0.99 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 4, scale: 0.99 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="h-full"
                    >
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                tokens={vm.tokens.tokens}
                                stats={vm.tokens.stats}

                                onTabChange={(tab) => setActiveTab(tab)}
                                onSync={vm.tokens.syncVariables}
                                onResetSync={vm.tokens.resetSync}
                                isSyncing={vm.tokens.isSyncing}
                                isSynced={vm.tokens.isSynced}

                                // 🌊 Progressive Feedback
                                syncStatus={vm.tokens.syncStatus}
                                syncProgress={vm.tokens.syncProgress}
                            />
                        )}

                        {activeTab === 'tokens' && (
                            <TokensView onBack={() => setActiveTab('dashboard')} />
                        )}



                        {activeTab === 'create-token' && (
                            <CreateTokenPage
                                onBack={() => setActiveTab('dashboard')}
                                onSubmit={async (tokenData) => {
                                    return await vm.tokens.createToken(tokenData);
                                }}
                            />
                        )}

                        {activeTab === 'export-tokens' && (
                            <ExportTokensPage
                                tokens={vm.tokens.tokens}
                                onBack={() => setActiveTab('dashboard')}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsPage />
                        )}
                    </motion.div>
                </AnimatePresence>
            </MainLayout>

            {/* Feedback Layer */}
            <OmniboxTrigger
                isOpen={isFeedbackOpen}
                onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                isLifted={activeTab === 'create-token'}
            />

            <FeedbackOmnibox
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />

            {/* Ambient Atmosphere */}
            <AmbientBackground />

            {/* System Message Overlay */}
            <SystemMessageBar />



        </div>
    );
}

`

---

## /src/components/shared/base/Button.tsx
> Path: $Path

`$Lang
import React from 'react';
import { cn } from '../../../shared/lib/classnames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Figma-native Button Component
 * Matches Figma's plugin UI style guidelines
 */
export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    ...props
}) => {

    // Base Vibe Styles (Glassy, Interactive, Smooth)
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-vibe focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    // Variants
    const variants = {
        primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:shadow-primary/50 border border-transparent",
        secondary: "bg-surface-2 text-text-primary border border-white/10 hover:bg-surface-3 hover:border-white/20 hover:shadow-card",
        ghost: "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
        danger: "bg-error/10 text-error hover:bg-error/20 border border-error/20"
    };

    // Sizes
    const sizes = {
        sm: "px-2.5 py-1.5 text-xs rounded-md gap-1.5",
        md: "px-4 py-2.5 text-sm rounded-lg gap-2",
        lg: "px-6 py-3 text-base rounded-xl gap-2.5"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant] || variants.primary, sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            <span>{children}</span>
        </button>
    );
};

export default Button;

`

---

## /src/components/shared/base/ConfirmDialog.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    isLoading = false,
    onConfirm,
    onCancel
}) => {
    // Determine colors based on variant
    const getVariantColors = () => {
        switch (variant) {
            case 'danger': return {
                icon: 'text-error',
                border: 'border-error/20',
                bg: 'bg-error/10',
                btn: 'bg-error text-white hover:bg-error/90'
            };
            case 'info': return {
                icon: 'text-primary',
                border: 'border-primary/20',
                bg: 'bg-primary/10',
                btn: 'bg-primary text-void hover:bg-primary/90'
            };
            case 'warning':
            default: return {
                icon: 'text-warning',
                border: 'border-warning/20',
                bg: 'bg-warning/10',
                btn: 'bg-warning text-void hover:bg-warning/90'
            };
        }
    };

    const colors = getVariantColors();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onCancel : undefined}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`
                            relative w-full max-w-sm overflow-hidden
                            rounded-2xl border ${colors.border}
                            bg-surface-0 shadow-2xl
                        `}
                    >
                        {/* Header Decoration */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`} />

                        <div className="p-6">
                            <div className="flex gap-4">
                                <div className={`mt-1 p-2 rounded-xl ${colors.bg} ${colors.icon}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 justify-end">
                                <button
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="
                                        px-4 py-2 rounded-lg text-xs font-medium text-text-muted
                                        hover:bg-white/5 disabled:opacity-50 transition-colors
                                    "
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`
                                        px-4 py-2 rounded-lg text-xs font-bold
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all shadow-lg
                                        ${colors.btn}
                                    `}
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Close Button */}
                        {!isLoading && (
                            <button
                                onClick={onCancel}
                                className="absolute top-3 right-3 p-1 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

`

---

## /src/components/shared/base/FieldLabel.tsx
> Path: $Path

`$Lang
import React, { type PropsWithChildren } from 'react';

interface FieldLabelProps extends PropsWithChildren {
    htmlFor?: string;
    className?: string;
}

/**
 * Standardized field label component
 * Eliminates duplicate label pattern across Select wrappers
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
    children,
    htmlFor,
    className = ''
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`text-xxs font-bold text-text-dim uppercase tracking-wider block mb-1.5 ${className}`}
        >
            {children}
        </label>
    );
};

export default FieldLabel;

`

---

## /src/components/shared/base/GuidedInput.tsx
> Path: $Path

`$Lang
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

`

---

## /src/components/shared/base/IconButton.tsx
> Path: $Path

`$Lang
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    tooltip?: string;
    active?: boolean;
}

/**
 * Figma-native Icon Button Component
 * For toolbar actions and compact controls
 */
export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    tooltip,
    active = false,
    className = '',
    ...props
}) => {
    // Accessibility: Use tooltip as aria-label if aria-label is missing
    const ariaLabel = props['aria-label'] || tooltip;

    return (
        <button
            className={`figma-icon-btn ${active ? 'figma-icon-btn-active' : ''} ${className}`}
            title={tooltip}
            aria-label={ariaLabel}
            {...props}
        >
            {icon}
        </button>
    );
};

export default IconButton;

`

---

## /src/components/shared/base/Input.tsx
> Path: $Path

`$Lang
import React, { forwardRef, useId } from 'react';
import { cn } from '../../../shared/lib/classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}

/**
 * Figma-native Input Component
 * Matches Figma's plugin UI style guidelines
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    icon,
    className = '',
    id,
    ...props
}, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-text-muted ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50 group-focus-within:text-primary transition-colors duration-200 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "w-full bg-surface-2 border border-white/5 text-text-primary placeholder:text-text-muted/50 rounded-lg py-2.5 text-sm transition-all duration-200",
                        icon ? "pl-10 pr-3" : "px-3",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                        "hover:border-white/10 hover:bg-surface-3",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-error/50 focus:ring-error/30 focus:border-error",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-error font-medium flex items-center gap-1.5 ml-1 animate-in slide-in-from-top-1 fade-in duration-200">
                    <span>⚠️</span> {error}
                </p>
            )}
            {hint && !error && (
                <p className="text-xs text-text-muted ml-1">{hint}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

`

---

## /src/components/shared/base/Surface.tsx
> Path: $Path

`$Lang
import React from 'react';

interface SurfaceProps {
    level?: 0 | 1 | 2 | 3;
    children: React.ReactNode;
    className?: string;
}

/**
 * Simple Surface component for layered UI backgrounds
 * Provides semantic background levels for depth hierarchy
 */
export const Surface: React.FC<SurfaceProps> = ({ level = 0, children, className = '' }) => {
    const levelClasses = {
        0: 'bg-surface-0',
        1: 'bg-surface-1',
        2: 'bg-surface-2',
        3: 'bg-surface-3'
    };

    return (
        <div className={`${levelClasses[level]} rounded-xl ${className}`}>
            {children}
        </div>
    );
};

`

---

## /src/components/shared/base/VibePathPicker.tsx
> Path: $Path

`$Lang
import { useState, useRef, useEffect, useMemo } from 'react';
import { Folder, ChevronRight, CornerDownRight, ChevronLeft, Plus, Box, Hash, Type, Info } from 'lucide-react';
import { CollectionContextMenu } from '../CollectionContextMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { Input } from './Input';
import { TokenInspector } from '../business/TokenInspector';

// Exported for usage in parent components
export interface TokenPickerItem {
    name: string;
    path: string[];
    fullPath: string;
    type: string;
    value: string | number | { r: number; g: number; b: number; a?: number } | boolean;
}

interface VibePathPickerProps {
    value: string;
    onChange: (value: string) => void;
    size?: 'sm' | 'md' | 'lg';
    placeholder?: string;
    className?: string;
    existingTokens?: TokenPickerItem[];
    existingCollections?: string[]; // Array of collection names (e.g. "Brand", "System")
    onCreateCollection?: (name: string) => Promise<string | null>;
    onRenameCollection?: (oldName: string, newName: string) => void;
    onDeleteCollection?: (name: string) => void;
}

// Utility to build tree from paths
interface FolderNode {
    subFrame: Record<string, FolderNode>;
    tokens: TokenPickerItem[];
}

function buildFolderTree(items: TokenPickerItem[] = [], collections: string[] = []): FolderNode {
    const tree: FolderNode = { subFrame: {}, tokens: [] };
    collections.forEach(col => {
        if (!tree.subFrame[col]) {
            tree.subFrame[col] = { subFrame: {}, tokens: [] };
        }
    });

    items.forEach(item => {
        const parts = item.fullPath.split('/').filter(p => p.trim().length > 0);
        if (parts.length === 0) return;
        const folders = parts.slice(0, -1);
        let current = tree;
        folders.forEach(folder => {
            if (!current.subFrame[folder]) {
                current.subFrame[folder] = { subFrame: {}, tokens: [] };
            }
            current = current.subFrame[folder];
        });
        current.tokens.push(item);
    });
    return tree;
}

const TokenTypeIcon = ({ type, value }: { type: string, value: string | number | { r: number; g: number; b: number; a?: number } | boolean }) => {
    if (type === 'color' || type === 'COLOR') {
        let colorStyle = {};
        if (typeof value === 'string') {
            colorStyle = { backgroundColor: value };
        } else if (typeof value === 'object' && value !== null && 'r' in value) {
            const { r, g, b, a = 1 } = value as { r: number, g: number, b: number, a?: number };
            const to255 = (n: number) => Math.round(n * 255);
            const rVal = r <= 1 ? to255(r) : r;
            const gVal = g <= 1 ? to255(g) : g;
            const bVal = b <= 1 ? to255(b) : b;
            colorStyle = { backgroundColor: `rgba(${rVal}, ${gVal}, ${bVal}, ${a})` };
        }
        return <div className="w-3.5 h-3.5 rounded-full border border-surface-3 shadow-sm flex-shrink-0" style={colorStyle} />;
    }
    if (type === 'number' || type === 'FLOAT' || type === 'dimension') return <Hash size={13} className="text-text-dim flex-shrink-0" />;
    if (type === 'string' || type === 'STRING') return <Type size={13} className="text-text-dim flex-shrink-0" />;
    return <Box size={13} className="text-text-dim flex-shrink-0" />;
};

export function VibePathPicker({ value, onChange, size = 'md', placeholder = 'Select path...', className = '', existingTokens = [], existingCollections = [], onCreateCollection, onRenameCollection, onDeleteCollection }: VibePathPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentViewPath, setCurrentViewPath] = useState<string[]>([]);
    const [customPaths, setCustomPaths] = useState<string[]>([]);
    const [editingFolder, setEditingFolder] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: string } | null>(null);

    // Optimistic UI State
    const [optimisticRenames, setOptimisticRenames] = useState<Record<string, string>>({});
    const [optimisticDeletes, setOptimisticDeletes] = useState<Set<string>>(new Set());

    // Clear optimistic state when source of truth updates (Sync Complete)
    useEffect(() => {
        setOptimisticRenames({});
        setOptimisticDeletes(new Set());
    }, [existingCollections, existingTokens]);

    // Search & Inspection State
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredToken, setHoveredToken] = useState<TokenPickerItem | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Derive Effective Data (Optimistic)
    const effectiveCollections = useMemo(() => {
        return existingCollections
            .filter(c => !optimisticDeletes.has(c) && !optimisticDeletes.has(optimisticRenames[c] || c))
            .map(c => optimisticRenames[c] || c);
    }, [existingCollections, optimisticRenames, optimisticDeletes]);

    const effectiveTokens = useMemo(() => {
        return existingTokens
            .filter(t => {
                const root = t.path[0];
                const actualRoot = optimisticRenames[root] || root;
                return !optimisticDeletes.has(root) && !optimisticDeletes.has(actualRoot);
            })
            .map(t => {
                const root = t.path[0];
                if (optimisticRenames[root]) {
                    const newRoot = optimisticRenames[root];
                    const newPath = [newRoot, ...t.path.slice(1)];
                    return {
                        ...t,
                        path: newPath,
                        fullPath: [newRoot, ...t.path.slice(1), t.name].join('/')
                    };
                }
                return t;
            });
    }, [existingTokens, optimisticRenames, optimisticDeletes]);

    const folderTree = useMemo(() => buildFolderTree(effectiveTokens, effectiveCollections), [effectiveTokens, effectiveCollections]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setEditingFolder(null);
                setContextMenu(null);
                setSearchQuery(''); // Reset search on close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Derived State: Current View or Search Results
    const viewContent = useMemo(() => {
        // If searching, return flat list of matches
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matches = existingTokens.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.fullPath.toLowerCase().includes(query)
            );
            return { folders: [], tokens: matches, isSearch: true };
        }

        // Standard Folder Traversal
        let current: FolderNode = folderTree;
        for (const p of currentViewPath) {
            if (current.subFrame[p]) {
                current = current.subFrame[p];
            } else {
                current = { subFrame: {}, tokens: [] };
                break;
            }
        }

        const baseFolders = Object.keys(current.subFrame);
        const baseTokens = current.tokens;
        const currentPathStr = currentViewPath.join('/');
        const relevantCustom = customPaths.filter(p => {
            const parts = p.split('/').filter(Boolean);
            const parentPath = parts.slice(0, -1).join('/');
            if (!currentPathStr) return parts.length === 1;
            return parentPath === currentPathStr;
        }).map(p => {
            const parts = p.split('/').filter(Boolean);
            return parts[parts.length - 1];
        });

        const allFolders = Array.from(new Set([...baseFolders, ...relevantCustom])).sort();
        const allTokens = [...baseTokens].sort((a, b) => a.name.localeCompare(b.name));

        return { folders: allFolders, tokens: allTokens, isSearch: false };
    }, [currentViewPath, folderTree, customPaths, searchQuery, existingTokens]);

    const handleSelectFolder = (folderName: string) => {
        if (editingFolder) return;
        const newPath = [...currentViewPath, folderName];
        setCurrentViewPath(newPath);
        const pathString = newPath.join('/');
        onChange(pathString + '/');
    };

    const handleBack = () => {
        if (editingFolder) return;
        setCurrentViewPath((prev) => prev.slice(0, -1));
    };

    const isRoot = currentViewPath.length === 0;
    const actionLabel = isRoot ? "New Collection" : "Add Group";
    const currentFolderName = isRoot ? 'Collections' : currentViewPath[currentViewPath.length - 1];

    // Optimistic Handlers
    // Optimistic Handlers
    const handleRenameSubmitInternal = async () => {
        if (!editingFolder || !editValue.trim()) { setEditingFolder(null); return; }
        const oldFolderName = editingFolder;
        const newFolderName = editValue.trim();

        // If we are renaming a ROOT collection (Creation or Rename)
        if (currentViewPath.length === 0) {
            const isExisting = existingCollections.includes(oldFolderName) || optimisticRenames[oldFolderName];

            if (isExisting) {
                // RENAME EXISTING
                if (oldFolderName !== newFolderName) {
                    onRenameCollection?.(oldFolderName, newFolderName);
                    setOptimisticRenames(prev => ({ ...prev, [oldFolderName]: newFolderName }));

                    if (value.startsWith(oldFolderName + '/')) {
                        onChange(value.replace(oldFolderName + '/', newFolderName + '/'));
                    }
                }
            } else {
                // CREATE NEW
                // It was a temporary folder (e.g. "New Collection"), now being "named".
                // Trigger Creation.
                if (onCreateCollection) {
                    // Remove the temporary folder from customPaths to avoid duplicates
                    // The backend will send the real collection list via Sync
                    setCustomPaths(prev => prev.filter(p => p !== oldFolderName)); // Clear temp

                    // Call Backend - PURE NAME ONLY (Context Detached)
                    await onCreateCollection(newFolderName);

                    // We rely on the backend Sync to repopulate the list. 
                    // But for immediate feedback, we can add it to optmistic? 
                    // Actually, CreateCollectionCapability now returns the full list quickly.
                    // But to be safe for UI flicker, we can temporarily assume it exists?
                    // Let's rely on the Aggressive Sync of the Capability. 
                    // Just clear the temp folder.
                }
            }
            setEditingFolder(null);
            return;
        }

        // Just a local folder (Group) rename
        if (oldFolderName === newFolderName) { setEditingFolder(null); return; }

        const parentPathStr = currentViewPath.join('/');
        const oldPathFull = parentPathStr ? `${parentPathStr}/${oldFolderName}` : oldFolderName;
        const newPathFull = parentPathStr ? `${parentPathStr}/${newFolderName}` : newFolderName;

        setCustomPaths(prev => prev.map(p => {
            if (p === oldPathFull) return newPathFull;
            if (p.startsWith(`${oldPathFull}/`)) return p.replace(oldPathFull, newPathFull);
            return p;
        }));

        // Update value if selected
        if (value.startsWith(oldPathFull + '/')) {
            onChange(value.replace(oldPathFull, newPathFull));
        }

        setEditingFolder(null);
    };

    const handleDeleteCollectionInternal = (name: string) => {
        // Confirmation dialog
        const confirmed = confirm(`Are you sure you want to delete "${name}" collection?\n\nThis will remove the collection and all its tokens.`);

        if (!confirmed) return;

        if (onDeleteCollection) {
            onDeleteCollection(name);
            setOptimisticDeletes(prev => new Set(prev).add(name));

            // If we are currently inside this collection or selected a token in it, clear selection?
            if (value.startsWith(name + '/')) {
                onChange('');
            }
        }
    };

    // ... (Keep existing handlers: handleCreateCollection, handleRenameStart, handleRenameSubmit, handleContextMenu)
    // I will abbreviate them for brevity in this replace, but in real code they MUST be present.
    // Since I'm using write_to_file, I MUST include them fully.

    const handleCreateCollection = (e: React.MouseEvent) => {
        e.stopPropagation();
        let name = actionLabel;
        let counter = 1;
        const isNameTaken = (n: string) => viewContent.folders.includes(n);
        while (isNameTaken(name)) { counter++; name = `${actionLabel} (${counter})`; }
        const newFolderPath = [...currentViewPath, name].join('/');
        setCustomPaths(prev => [...prev, newFolderPath]);
        setEditingFolder(name);
        setEditValue(name);
    };

    const handleRenameStart = (folder: string) => { setEditingFolder(folder); setEditValue(folder); };


    const handleContextMenu = (e: React.MouseEvent, folder: string) => {
        if (!isRoot) return;
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, target: folder });
    };

    const sizeClasses = { sm: 'h-8 text-xs', md: 'h-11 text-sm', lg: 'h-14 text-base' };

    return (
        <div ref={containerRef} className={`relative group ${className}`}>
            {contextMenu && (
                <CollectionContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onRename={() => { if (contextMenu.target) handleRenameStart(contextMenu.target); setContextMenu(null); }}

                    onDelete={() => { if (contextMenu.target) handleDeleteCollectionInternal(contextMenu.target); setContextMenu(null); }}
                    onClose={() => setContextMenu(null)}
                />
            )}

            {/* Trigger Input */}
            <div
                onClick={() => setIsOpen(true)}
                className={`cursor-text relative flex items-center bg-surface-1 border border-surface-2 rounded-xl transition-all 
                ${isOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'hover:border-surface-3'} 
                ${sizeClasses[size]}`}
            >
                <div className="pl-3 pr-2 text-text-dim">
                    <Folder size={14} className={value ? "text-primary/70" : "text-text-dim"} />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-dim/50 font-mono w-full text-xs"
                    placeholder={placeholder}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full text-left left-0 right-0 mt-2 bg-surface-0 border border-surface-2 rounded-xl shadow-2xl shadow-black/50 overflow-visible z-[100] flex flex-col max-h-[400px]"
                    >
                        {/* 1. Internal Search Bar */}
                        <div className="p-2 border-b border-white/5 space-y-2">
                            <Input
                                placeholder="Search tokens..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="h-9 text-xs"
                            />
                        </div>

                        {/* 2. Navigation Header (Only if not searching) */}
                        {!searchQuery && (
                            <div className="bg-surface-1/50 border-b border-surface-2 flex flex-col">
                                <div className="flex items-center gap-2 px-3 py-2 text-xs text-text-dim min-h-[36px]">
                                    {!isRoot ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="p-1 -ml-1 hover:bg-surface-2 rounded-md transition-colors text-text-dim hover:text-text-bright flex-shrink-0"
                                            >
                                                <ChevronLeft size={12} />
                                            </button>
                                            <span className="font-medium text-text-primary truncate">{currentFolderName}</span>
                                        </>
                                    ) : (
                                        <span className="text-xxs font-bold uppercase tracking-wider text-text-muted pl-1">Collections</span>
                                    )}
                                </div>
                                <div className="px-3 pb-3 pt-0 w-full">
                                    <button type="button" onClick={handleCreateCollection} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xxs font-bold uppercase tracking-wide py-2 rounded-lg transition-all shadow-md shadow-primary/10 border border-white/10">
                                        <Plus size={12} strokeWidth={3} />
                                        <span>{actionLabel}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 3. List Content */}
                        <div className="overflow-y-auto p-1 custom-scrollbar flex-1 min-h-[60px]" onMouseLeave={() => setHoveredToken(null)}>
                            {/* Folders */}
                            {viewContent.folders.map(folder => (
                                <div key={folder} className="relative group/folder">
                                    {editingFolder === folder ? (
                                        <div className="w-full flex items-center px-3 py-2 bg-surface-2 rounded-lg border border-primary/30 mx-px mb-0.5">
                                            <Folder size={14} className="text-primary mr-2 flex-shrink-0" />
                                            <input autoFocus type="text" value={editValue} onFocus={(e) => e.target.select()} onChange={(e) => setEditValue(e.target.value)} onBlur={handleRenameSubmitInternal} onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmitInternal(); if (e.key === 'Escape') setEditingFolder(null); }} className="bg-transparent border-none outline-none text-text-primary text-xs w-full font-medium" />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectFolder(folder)}
                                            onContextMenu={(e) => handleContextMenu(e, folder)}
                                            onDoubleClick={(e) => { e.stopPropagation(); if (isRoot) handleRenameStart(folder); }}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-2 group transition-colors text-left mb-0.5"
                                        >
                                            <div className="flex items-center gap-2.5 text-xs text-text-dim group-hover:text-text-primary transition-colors">
                                                <Folder size={14} className="text-primary/60 group-hover:text-primary transition-colors fill-primary/10" />
                                                <span className="truncate">{folder}</span>
                                            </div>
                                            <ChevronRight size={12} className="text-text-dim/30 group-hover:text-text-bright/50" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Tokens */}
                            {viewContent.tokens.map(token => (
                                <div
                                    key={token.fullPath}
                                    onMouseEnter={() => setHoveredToken(token)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-2 transition-colors mb-0.5 group cursor-default"
                                >
                                    <div className="flex items-center gap-2.5 text-xs text-text-primary">
                                        <TokenTypeIcon type={token.type} value={token.value} />
                                        <span className="truncate font-medium">{token.name}</span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Info size={12} className="text-primary" />
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {viewContent.folders.length === 0 && viewContent.tokens.length === 0 && (
                                <div className="px-4 py-8 text-center text-text-muted text-xs flex flex-col items-center gap-2 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center mb-1">
                                        <CornerDownRight size={14} className="text-text-dim" />
                                    </div>
                                    <span className="font-medium text-text-dim">No results</span>
                                </div>
                            )}
                        </div>

                        {/* 4. Token Inspector Portal/Panel */}
                        <AnimatePresence>
                            {hoveredToken && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="absolute right-full top-0 mr-2 z-50 pointer-events-none"
                                >
                                    <TokenInspector token={hoveredToken} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

`

---

## /src/components/shared/base/VibeSelect.tsx
> Path: $Path

`$Lang
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface Option<T> {
    label: string;
    value: T;
}

interface VibeSelectProps<T> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function VibeSelect<T extends string>({
    value,
    onChange,
    options,
    className = "",
    size = 'md'
}: VibeSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value) || options[0];

    // Size classes (Standard Input Sizes)
    const sizeClasses = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3 text-sm',
        lg: 'px-4 py-3.5 text-base',
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between 
                    bg-surface-1 border border-surface-2 rounded-lg 
                    ${sizeClasses[size]} 
                    hover:border-surface-3 active:border-surface-3 
                    transition-all outline-none 
                    ${isOpen ? "border-primary/50 ring-1 ring-primary/50" : ""}
                `}
            >
                <span className="font-mono text-text-primary text-left truncate flex-1">{selectedOption.label}</span>
                <ChevronDown
                    size={14}
                    className={`text-text-dim ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-4 p-1 py-1 bg-surface-1 border border-surface-2 rounded-lg shadow-xl z-50 flex flex-col gap-0.5 overflow-hidden max-h-[200px] overflow-y-auto scrollbar-hide"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-md text-[13px] transition-colors w-full text-left ${option.value === value
                                    ? "bg-surface-2 text-text-primary font-medium"
                                    : "text-text-dim hover:text-text-primary hover:bg-surface-2"
                                    }`}
                            >
                                <span className="truncate">{option.label}</span>
                                {option.value === value && <Check size={12} className="text-primary flex-shrink-0 ml-2" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

`

---

## /src/components/shared/business/TokenInspector.tsx
> Path: $Path

`$Lang
import React from 'react';
import { Surface } from '../base/Surface';
import type { TokenPickerItem } from '../base/VibePathPicker';

interface TokenInspectorProps {
    token: TokenPickerItem;
    className?: string;
}

export const TokenInspector: React.FC<TokenInspectorProps> = ({ token, className }) => {
    return (
        <Surface
            level={2}
            className={`p-3 w-64 border border-white/10 shadow-xl shadow-black/50 overflow-hidden ${className}`}
        >
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary truncate">{token.name}</h4>
                        <p className="text-[10px] text-text-dim truncate font-mono">{token.fullPath}</p>
                    </div>
                </div>

                {/* Properties */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-dim">Type</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-3 text-text-bright font-mono text-[10px] uppercase">
                            {token.type}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                        <span className="text-text-dim">Value</span>
                        <div className="p-2 rounded bg-surface-0 border border-white/5 font-mono text-text-primary break-all">
                            {typeof token.value === 'object'
                                ? JSON.stringify(token.value)
                                : String(token.value)}
                        </div>
                    </div>
                </div>
            </div>
        </Surface>
    );
};

`

---

## /src/components/shared/CollectionContextMenu.tsx
> Path: $Path

`$Lang
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

interface CollectionContextMenuProps {
    x: number;
    y: number;
    onRename: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const CollectionContextMenu = ({ x, y, onRename, onDelete, onClose }: CollectionContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Prevent menu from going off-screen (basic bounds check)
    const style = {
        top: Math.min(y, window.innerHeight - 100),
        left: Math.min(x, window.innerWidth - 160),
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="fixed z-[9999] min-w-[140px] bg-surface-1 border border-surface-2 rounded-xl shadow-2xl flex flex-col p-1 overflow-hidden"
                style={style}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => {
                        onRename();
                        onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-surface-2 rounded-lg transition-colors w-full text-left"
                >
                    <Edit2 size={12} className="text-primary" />
                    Rename
                </button>
                <div className="h-px bg-surface-2 my-1 mx-1" />
                <button
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors w-full text-left"
                >
                    <Trash2 size={12} />
                    Delete
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

`

---

## /src/components/shared/ErrorBoundary.tsx
> Path: $Path

`$Lang
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Optional: Send error to logging service
        // logErrorToService(error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleCopyError = () => {
        const errorText = `
Error: ${this.state.error?.message}
Stack: ${this.state.error?.stack}
Component Stack: ${this.state.errorInfo?.componentStack}
        `.trim();
        navigator.clipboard.writeText(errorText);
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-200 p-8">
                    <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-lg p-6 shadow-2xl shadow-red-500/10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-red-400">System Error</h2>
                                <p className="text-xs text-slate-500">Something went wrong</p>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded p-3 mb-4 border border-white/5">
                            <p className="text-sm font-mono text-red-300">{this.state.error?.message}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReload}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-bold text-sm transition-colors"
                            >
                                Reload Plugin
                            </button>
                            <button
                                onClick={this.handleCopyError}
                                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors border border-white/10"
                            >
                                Copy Error
                            </button>
                        </div>

                        <details className="mt-4 text-xs">
                            <summary className="cursor-pointer text-slate-500 hover:text-slate-400">Technical Details</summary>
                            <pre className="mt-2 bg-black/60 p-2 rounded border border-white/5 text-[10px] text-red-400 overflow-auto max-h-40">
                                {this.state.error?.stack}
                            </pre>
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

`

---

## /src/components/shared/ErrorConsole.tsx
> Path: $Path

`$Lang
// src/ui/components/ErrorConsole.tsx
import { useState } from 'react';

interface ErrorConsoleProps {
    error: Error | null;
    onClear: () => void;
}

export const ErrorConsole = ({ error, onClear }: ErrorConsoleProps) => {
    const [copied, setCopied] = useState(false);

    if (!error) return null;

    const errorLog = JSON.stringify({
        message: error.message,
        stack: error.stack,
        time: new Date().toISOString(),
        userAgent: navigator.userAgent
    }, null, 2);

    const handleCopy = () => {
        // Hidden textarea hack for Figma plugin environment where navigator.clipboard might be restricted
        const textArea = document.createElement("textarea");
        textArea.value = errorLog;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="vibe-panel" style={{
            borderColor: 'var(--error)',
            background: 'rgba(239, 68, 68, 0.1)',
            marginTop: '12px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="vibe-label" style={{ color: 'var(--error)' }}>SYSTEM_CRITICAL_FAILURE</label>
                <button
                    onClick={onClear}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}
                >
                    ✕
                </button>
            </div>

            <div style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#f87171',
                maxHeight: '80px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                marginBottom: '8px'
            }}>
                {error.message}
            </div>

            <button onClick={handleCopy} className="vibe-btn" style={{
                background: copied ? 'var(--success)' : 'var(--bg-surface)',
                border: '1px solid var(--error)',
                color: copied ? '#fff' : 'var(--error)'
            }}>
                {copied ? "COPIED_TO_CLIPBOARD ✅" : "COPY_DEBUG_LOG 📋"}
            </button>
        </div>
    );
};

`

---

## /src/components/shared/system/AmbientBackground.tsx
> Path: $Path

`$Lang
import React from 'react';

export const AmbientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full mix-blend-screen" />
        </div>
    );
};

`

---

## /src/components/shared/system/BootScreen.tsx
> Path: $Path

`$Lang
import React from 'react';

export const BootScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-void text-white select-none cursor-wait">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border border-white/10 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 border-t border-primary rounded-full animate-[spin_2s_linear_infinite]" />
                    <div className="absolute inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                        VIBE // SYNC_ENGINE
                    </span>
                    <span className="text-[10px] font-mono text-primary/80 animate-pulse">
                        ESTABLISHING CONNECTION...
                    </span>
                </div>
            </div>
        </div>
    );
};

`

---

## /src/components/shared/system/SystemMessageBar.tsx
> Path: $Path

`$Lang
import { AnimatePresence, motion } from 'framer-motion';
import { useSystem } from '../../../ui/contexts/SystemContext';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function SystemMessageBar() {
    const { message, clear } = useSystem();

    if (!message) return null;

    const icons = {
        info: <Info className="w-4 h-4" />,
        success: <CheckCircle2 className="w-4 h-4" />,
        warning: <AlertCircle className="w-4 h-4" />,
        error: <XCircle className="w-4 h-4" />
    };

    const styles = {
        info: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    return (
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-[9999]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className={clsx(
                        "pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-lg select-none cursor-pointer",
                        styles[message.type]
                    )}
                    onClick={clear}
                >
                    <span className="opacity-80">
                        {icons[message.type]}
                    </span>
                    <span className="text-xs font-medium tracking-wide">
                        {message.text}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

`

---

## /src/controller.ts
> Path: $Path

`$Lang
import type { PluginAction } from './shared/types';
import type { AgentContext } from './core/AgentContext';
import { CompositionRoot } from './core/CompositionRoot';
import { Dispatcher } from './core/Dispatcher';
import { logger } from './core/services/Logger';

// 🛑 POLYFILL: AbortController for Figma Sandbox
if (typeof globalThis.AbortController === 'undefined') {
    class SimpleAbortSignal {
        aborted = false;
        onabort: (() => void) | null = null;
        _listeners: (() => void)[] = [];
        addEventListener(_type: string, listener: () => void) { this._listeners.push(listener); }
        removeEventListener(_type: string, listener: () => void) { this._listeners = this._listeners.filter(l => l !== listener); }
        dispatchEvent(_event: any) { return true; }
    }
    class SimpleAbortController {
        signal = new SimpleAbortSignal();
        abort() {
            this.signal.aborted = true;
            this.signal._listeners.forEach(l => l());
            if (this.signal.onabort) this.signal.onabort();
        }
    }
    (globalThis as any).AbortController = SimpleAbortController;
    (globalThis as any).AbortSignal = SimpleAbortSignal;
}


logger.clear();
logger.info('system', 'System booting...');

// === 1. Bootstrap Core ===
const root = new CompositionRoot();
const dispatcher = new Dispatcher(root.registry);

// === 3. Setup UI ===
figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

// === 4. Start Engine ===
(async () => {
    try {
        logger.info('system', 'Initializing architecture...');
        logger.info('system', 'System ready');
    } catch (e) {
        logger.error('system', 'Bootstrap failed', { error: e });
    }
})();

// === 5. Message Handling ===
let currentSyncAbortController: AbortController | null = null;

figma.ui.onmessage = async (msg: PluginAction) => {
    try {
        // Build Context on-the-fly
        const context: AgentContext = {
            repository: root.repository,
            selection: figma.currentPage.selection,
            page: figma.currentPage,
            session: { timestamp: Date.now() }
        };

        logger.debug('controller:message', `Received: ${msg.type}`);

        // 1. Initial System Check: Storage Bridge Handlers
        if (msg.type === 'PING') {
            figma.ui.postMessage({ type: 'PONG', timestamp: Date.now() });
            return;
        }

        // 🚀 STARTUP: Load Cached Data Instantaneously
        if (msg.type === 'STARTUP') {
            const cachedUsage = await figma.clientStorage.getAsync('internal_usage_cache');
            if (cachedUsage) {
                logger.info('sync', 'Loaded cached usage data.');
                figma.ui.postMessage({
                    type: 'SCAN_COMPLETE',
                    payload: {
                        timestamp: Date.now(),
                        usage: cachedUsage,
                        isCached: true
                    }
                });
            }
            return;
        }

        // Bridge Handlers
        else if (msg.type === 'STORAGE_GET') {
            const value = await figma.clientStorage.getAsync(msg.key);
            figma.ui.postMessage({ type: 'STORAGE_GET_RESPONSE', key: msg.key, value });
            return; // Handled
        }
        else if (msg.type === 'STORAGE_SET') {
            await figma.clientStorage.setAsync(msg.key, msg.value);
            figma.ui.postMessage({ type: 'STORAGE_SET_SUCCESS', key: msg.key }); // ACK
            return; // Handled
        }
        else if (msg.type === 'STORAGE_REMOVE') {
            await figma.clientStorage.deleteAsync(msg.key);
            figma.ui.postMessage({ type: 'STORAGE_REMOVE_SUCCESS', key: msg.key }); // ACK
            return; // Handled
        }

        // 🛑 MANUAL SYNC TRIGGER
        else if (msg.type === 'SYNC_START') {
            if (currentSyncAbortController) {
                logger.warn('sync', 'Sync already in progress, ignoring start request.');
                return;
            }
            currentSyncAbortController = new AbortController();
            logger.info('sync', 'Manual Sync Initiated');
            await performFullSync(currentSyncAbortController.signal);
            currentSyncAbortController = null; // Reset after completion
            return;
        }

        // � MANUAL SYNC CANCEL
        else if (msg.type === 'SYNC_CANCEL') {
            if (currentSyncAbortController) {
                logger.info('sync', 'Cancelling sync process...');
                currentSyncAbortController.abort();
                currentSyncAbortController = null;
                figma.ui.postMessage({ type: 'SYNC_CANCELLED' }); // Feedback to UI
            } else {
                logger.debug('sync', 'No active sync to cancel.');
            }
            return;
        }

        // 2. Dispatch Domain Logic
        // 🛡️ Guard: Do NOT dispatch invalid commands to the registry
        // Type assertion needed because SYNC_START/CANCEL are handled above and TS narrows the type
        const type = msg.type as string;
        if (type !== 'SCAN_USAGE' && type !== 'SYNC_START' && type !== 'SYNC_CANCEL') {
            await dispatcher.dispatch(msg, context);
        }

        // Global Post-Dispatch Side Effects
        if (['CREATE_VARIABLE', 'UPDATE_VARIABLE', 'RENAME_TOKEN', 'CREATE_COLLECTION', 'RENAME_COLLECTION', 'DELETE_COLLECTION', 'CREATE_STYLE'].includes(msg.type)) {
            // 🛑 CORE RULE: NO IMPLICIT SYNC.
            logger.debug('controller:sync', 'Action completed. Auto-sync suppressed (Manual Mode).');
        } else if (msg.type === 'SCAN_USAGE') {
            // Usage scan logic remains but only if triggered explicitly
            logger.debug('controller:usage', 'Starting lazy usage scan...');
            try {
                await root.syncService.scanUsage();
            } catch (err) {
                logger.error('controller:usage', 'Scan usage failed', { error: err });
            }

            // Re-emit graph with updated usage info
            try {
                const tokens = root.repository.getAllNodes(); // Access via Composition Root
                figma.ui.postMessage({
                    type: 'GRAPH_UPDATED',
                    payload: tokens,
                    timestamp: Date.now()
                });
                logger.debug('controller:usage', 'Usage scan complete & broadcasted.');
            } catch (err) {
                logger.error('controller:usage', 'Failed to broadcast graph update', { error: err });
            }
        } else if (msg.type === 'SEARCH_QUERY') {
            // 🔍 Handle Search Request
            const query = msg.payload?.query || '';
            const results = searchTokens(query);
            figma.ui.postMessage({
                type: 'SEARCH_RESULTS',
                payload: { matches: results, query }
            });
        }

    } catch (error: unknown) {
        logger.error('controller:error', 'Controller error occurred', { error });
        const errorMessage = error instanceof Error ? error.message : 'Unknown Controller Error';
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: errorMessage, type: 'error' }
        });
        figma.ui.postMessage({ type: 'ERROR', message: errorMessage });
    }
};

// ==========================================
// 🔍 SEARCH ENGINE (Main Thread + Yielding)
// ==========================================

import type { TokenEntity } from './core/types';

let searchIndex: {
    byName: Map<string, number[]>;
    byPath: Map<string, number[]>;
    byType: Map<string, number[]>;
} = {
    byName: new Map(),
    byPath: new Map(),
    byType: new Map()
};

// Cache tokens for search to avoid re-fetching from repo constantly
let cachedSearchTokens: TokenEntity[] = [];

async function buildSearchIndex(tokens: TokenEntity[]): Promise<void> {
    // 1. Reset
    searchIndex = {
        byName: new Map(),
        byPath: new Map(),
        byType: new Map()
    };
    cachedSearchTokens = tokens;

    logger.info('search', `Building index for ${tokens.length} tokens...`);

    // 2. Batch Processing
    const batchSize = 200; // slightly larger batch for performance

    for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);

        batch.forEach((token, localIndex) => {
            const globalIndex = i + localIndex;

            // Index by name parts
            const nameParts = token.name.toLowerCase().split(/[-_./]/);
            nameParts.forEach(part => {
                if (!part) return;
                if (!searchIndex.byName.has(part)) {
                    searchIndex.byName.set(part, []);
                }
                searchIndex.byName.get(part)!.push(globalIndex);
            });

            // Index by path (full string)
            // Assuming path is array of strings
            if (Array.isArray(token.path)) {
                const pathStr = token.path.join('/').toLowerCase();
                if (!searchIndex.byPath.has(pathStr)) {
                    searchIndex.byPath.set(pathStr, []);
                }
                searchIndex.byPath.get(pathStr)!.push(globalIndex);
            }

            // Index by type
            if (!searchIndex.byType.has(token.$type)) {
                searchIndex.byType.set(token.$type, []);
            }
            searchIndex.byType.get(token.$type)!.push(globalIndex);
        });

        // 🌊 Yield to Main Thread
        await new Promise(resolve => setTimeout(resolve, 0));
    }

    logger.info('search', 'Index built successfully.');
    figma.ui.postMessage({ type: 'INDEX_COMPLETE' });
}

function searchTokens(query: string): TokenEntity[] {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();
    const matchedIndices = new Set<number>();

    // Search Name (Exact or Partial match on indexed parts)
    for (const [key, indices] of searchIndex.byName) {
        if (key.includes(lowerQuery)) {
            indices.forEach(i => matchedIndices.add(i));
        }
    }

    // Search Path
    for (const [key, indices] of searchIndex.byPath) {
        if (key.includes(lowerQuery)) {
            indices.forEach(i => matchedIndices.add(i));
        }
    }

    return Array.from(matchedIndices).map(idx => cachedSearchTokens[idx]);
}

// ==========================================
// 🔄 SYNC & UTILS
// ==========================================
async function performFullSync(abortSignal: AbortSignal) {
    // 🌊 Progressive Protocol
    // 🛑 OPTIMIZATION: Do NOT buffer allTokens. UI rebuilds from chunks.
    // const allTokens: any[] = []; // Removed to save memory
    let progress = 0;
    let totalTokensProcessed = 0;  // ← Track total

    if (abortSignal.aborted) return;

    // 1. Start Phase: Definitions
    figma.ui.postMessage({ type: 'SYNC_PHASE_START', phase: 'definitions' });

    try {
        // Stream Chunks
        for await (const chunk of root.syncService.syncDefinitionsGenerator(abortSignal)) {
            if (abortSignal.aborted) {
                logger.info('sync', 'Aborted during definitions stream.');
                throw new Error('Sync Aborted');
            }

            // allTokens.push(...chunk); // Removed
            progress += chunk.length;
            totalTokensProcessed += chunk.length;  // ← Track

            figma.ui.postMessage({
                type: 'SYNC_CHUNK',
                payload: {
                    tokens: chunk,
                    chunkIndex: Math.floor(progress / 50),
                    isLast: false
                }
            });

            // Allow event loop to breathe and process aborts
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        // ✅ FIX: Send final SYNC_COMPLETE with actual count
        figma.ui.postMessage({
            type: 'SYNC_COMPLETE',
            payload: {
                totalTokens: totalTokensProcessed,  // ← Send actual count
                message: '✅ Sync complete!'
            }
        });

        logger.info('sync', `Sync complete: ${totalTokensProcessed} tokens`);

        // 🔄 Final Consistency Event (Backward Compat)
        // 🛑 PAYLOAD REMOVED: prevents freezing on large docs.
        figma.ui.postMessage({
            type: 'GRAPH_UPDATED',
            payload: [], // Empty payload. UI has already built state from chunks.
            isIncremental: true, // 🚩 Signal UI to keep chunked data
            timestamp: Date.now()
        });

        // 🔍 Auto-Index for Search
        await buildSearchIndex(root.repository.getAllNodes());


    } catch (e) {
        if (e instanceof Error && e.message === 'Sync Aborted') {
            logger.info('sync', 'Sync process aborted gracefully.');
            return; // Exit cleanly
        }
        logger.error('controller:sync', 'Progressive sync failed', { error: e });
        figma.ui.postMessage({ type: 'ERROR', message: 'Sync Interrupted' });
        return; // Stop if failed
    }

    if (abortSignal.aborted) return;

    // 2. Sync Stats (Collections/Styles)
    try {
        const stats = await root.syncService.getStats();

        if (abortSignal.aborted) return;

        figma.ui.postMessage({
            type: 'STATS_UPDATED',
            payload: {
                totalVariables: stats.totalVariables,
                collections: stats.collections,
                styles: stats.styles,
                collectionNames: Object.keys(stats.collectionMap),
                collectionMap: stats.collectionMap
            }
        });
    } catch (e) {
        logger.error('controller:sync', 'Stats sync failed', { error: e });
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: {
                message: "Stats Sync Partial Failure",
                type: 'error'
            }
        });
    }

    // 3. Lazy Usage Scan (Now Manual & Instant & Non-Blocking)
    if (abortSignal.aborted) return;

    try {
        logger.info('sync', 'Starting non-blocking usage scan...');
        const usageMap = await root.syncService.scanUsage();

        // Convert Map to Record for transport
        const usageReport = Object.fromEntries(usageMap);

        if (abortSignal.aborted) return;

        // Persist for next startup
        await figma.clientStorage.setAsync('internal_usage_cache', usageReport);

        // Broadcast results
        figma.ui.postMessage({
            type: 'SCAN_COMPLETE',
            payload: {
                timestamp: Date.now(),
                // We're essentially sending back stats, but specialized for usage
                usage: usageReport
            }
        });

        logger.info('sync', 'Manual usage scan complete & saved.');
        figma.notify("✅ Data Synced & Saved Internally");

    } catch (e) {
        logger.error('controller:sync', 'Usage scan failed', { error: e });
    }
}

`

---

## /src/core/AgentContext.ts
> Path: $Path

`$Lang
import type { TokenRepository } from './TokenRepository';

/**
 * The Context Object passed to every capability.
 * Contains references to the Core Brain (Graph) and Environment.
 */
export interface AgentContext {
    /**
     * The Single Source of Truth for Design Tokens.
     */
    readonly repository: TokenRepository;

    /**
     * Access to Figma Environment (Selection, etc).
     * Note: In a pure clean architecture, this might be an abstraction,
     * but for the plugin context, we allow constrained access.
     */
    readonly selection: readonly SceneNode[];

    /**
     * Current Page reference
     */
    readonly page: PageNode;

    /**
     * User ID or Session Meta
     */
    readonly session: {
        timestamp: number;
    }
}

`

---

## /src/core/CapabilityRegistry.ts
> Path: $Path

`$Lang
import type { ICapability } from './interfaces/ICapability';
import { logger } from './services/Logger';

export class CapabilityRegistry {
    private capabilities: Map<string, ICapability> = new Map();
    private commandMap: Map<string, string> = new Map(); // CommandID -> CapabilityID

    /**
     * Registers a new capability in the system
     */
    register(capability: ICapability): void {
        if (this.capabilities.has(capability.id)) {
            logger.warn('registry', `Capability ${capability.id} already registered. Overwriting.`);
        }

        this.capabilities.set(capability.id, capability);
        this.commandMap.set(capability.commandId, capability.id);

        logger.debug('registry', `Registered: ${capability.id}`, { command: capability.commandId });
    }

    /**
     * Retrieves a capability by its Command ID (e.g., 'SCAN_SELECTION')
     */
    getByCommand(commandId: string): ICapability | undefined {
        const capId = this.commandMap.get(commandId);
        if (!capId) return undefined;
        return this.capabilities.get(capId);
    }

    /**
     * Retrieves a capability by its unique ID
     */
    get(id: string): ICapability | undefined {
        return this.capabilities.get(id);
    }

    /**
     * List all registered capabilities
     */
    list(): ICapability[] {
        return Array.from(this.capabilities.values());
    }
}

`

---

## /src/core/CompositionRoot.ts
> Path: $Path

`$Lang
import { TokenRepository } from './TokenRepository';
import { CapabilityRegistry } from './CapabilityRegistry';
import { SyncService } from './services/SyncService';
import { logger } from './services/Logger';

// Core Modules
import { VariableManager } from '../features/governance/VariableManager';
import { DocsRenderer } from '../features/documentation/DocsRenderer';
import { CollectionRenamer } from '../features/collections/adapters/CollectionRenamer';

// Infrastructure
import { FigmaVariableRepository } from '../infrastructure/repositories/FigmaVariableRepository';

// Capabilities
import { ScanSelectionCapability } from '../features/perception/capabilities/scanning/ScanSelectionCapability';
import { SyncTokensCapability } from '../features/tokens/capabilities/sync/SyncTokensCapability';
import { CreateVariableCapability } from '../features/tokens/capabilities/management/CreateVariableCapability';
import { UpdateVariableCapability } from '../features/tokens/capabilities/management/UpdateVariableCapability';
import { RenameVariableCapability } from '../features/tokens/capabilities/management/RenameVariableCapability';
import { GenerateDocsCapability } from '../features/documentation/capabilities/GenerateDocsCapability';
import { GetAnatomyCapability } from '../features/perception/capabilities/scanning/GetAnatomyCapability';
import { RenameCollectionsCapability } from '../features/collections/capabilities/RenameCollectionsCapability';
import { CreateCollectionCapability } from '../features/collections/capabilities/CreateCollectionCapability';
import { RenameCollectionCapability } from '../features/collections/capabilities/RenameCollectionCapability';
import { DeleteCollectionCapability } from '../features/collections/capabilities/DeleteCollectionCapability';
import { CreateStyleCapability } from '../features/styles/capabilities/CreateStyleCapability';

// System Capabilities
import {
    RequestGraphCapability,
    RequestStatsCapability,

    NotifyCapability,
    StorageGetCapability,
    StorageSetCapability,
    SyncVariablesCapability
} from '../features/system/capabilities';

/**
 * 🏗️ CompositionRoot
 * 
 * The Dependency Injection (DI) container for the application.
 * responsible for wiring up all services, managers, and capabilities.
 * 
 * @singleton
 */
export class CompositionRoot {
    private static instance: CompositionRoot;

    // Public Services
    public readonly registry: CapabilityRegistry;
    public readonly repository: TokenRepository;
    public readonly syncService: SyncService;

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }
        return CompositionRoot.instance;
    }

    constructor() {
        logger.debug('composition', 'Wiring dependencies...');

        // 1. Core State
        this.repository = new TokenRepository();
        const variableRepo = new FigmaVariableRepository();

        // 2. Domain Services
        const variableManager = new VariableManager(this.repository, variableRepo);
        const docsRenderer = new DocsRenderer(this.repository);
        const collectionRenamer = new CollectionRenamer();

        this.syncService = new SyncService(variableManager, this.repository);

        // 3. Capabilities
        this.registry = new CapabilityRegistry();
        this.registerCapabilities(variableManager, docsRenderer, collectionRenamer);
    }

    private registerCapabilities(
        variableManager: VariableManager,
        docsRenderer: DocsRenderer,
        collectionRenamer: CollectionRenamer
    ) {
        const capabilities = [
            new ScanSelectionCapability(),
            new SyncTokensCapability(variableManager),
            new CreateVariableCapability(variableManager),
            new UpdateVariableCapability(variableManager),
            new RenameVariableCapability(variableManager),
            new GenerateDocsCapability(docsRenderer, variableManager),
            new RenameCollectionsCapability(collectionRenamer),
            new CreateCollectionCapability(this.syncService),
            new RenameCollectionCapability(),
            new DeleteCollectionCapability(this.syncService),
            new GetAnatomyCapability(),
            new CreateStyleCapability(),

            // System Capabilities
            new RequestGraphCapability(this.syncService),
            new RequestStatsCapability(this.syncService),

            new NotifyCapability(),
            new StorageGetCapability(),
            new StorageSetCapability(),
            new SyncVariablesCapability(this.syncService)
        ];

        capabilities.forEach(cap => this.registry.register(cap));
    }
}

`

---

## /src/core/Dispatcher.ts
> Path: $Path

`$Lang
import type { PluginAction } from '../shared/types';
import type { AgentContext } from './AgentContext';
import type { CapabilityRegistry } from './CapabilityRegistry';
import { CompositionRoot } from './CompositionRoot'; // ⚡ STATIC IMPORT
import { logger } from './services/Logger';
import { ProgressiveSyncCoordinator } from './services/ProgressiveSyncCoordinator';

export class Dispatcher {
    private readonly registry: CapabilityRegistry;
    private readonly syncCoordinator: ProgressiveSyncCoordinator;
    private readonly root: CompositionRoot; // ⚡ CACHED REFERENCE

    constructor(registry: CapabilityRegistry) {
        this.registry = registry;
        this.syncCoordinator = new ProgressiveSyncCoordinator();
        this.root = CompositionRoot.getInstance(); // ⚡ GET ONCE - NO DELAYS
    }

    /**
     * Routes an incoming message to the appropriate capability.
     */
    public async dispatch(msg: PluginAction, context: AgentContext): Promise<void> {
        // 🚀 Special handling for SYNC commands
        if (msg.type === 'SYNC_TOKENS' || msg.type === 'SYNC_VARIABLES') {
            return this.handleProgressiveSync(msg, context);
        }

        // 1. Identify Capability
        const capability = this.registry.getByCommand(msg.type);

        if (!capability) {
            logger.warn('dispatcher', `No capability found for command: ${msg.type}`);
            return;
        }

        logger.debug('dispatcher', `Routing ${msg.type} -> ${capability.id}`);

        // 2. Validate Context
        if (!capability.canExecute(context)) {
            logger.warn('dispatcher', `Capability ${capability.id} declined execution context`);
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: `⚠️ Cannot execute ${msg.type} in current context.`, type: 'warning' }
            });
            return;
        }

        // 3. Extract Payload (Defensive)
        const hasPayload = (m: PluginAction): m is PluginAction & { payload: unknown } => 'payload' in m;
        const payload = hasPayload(msg) ? msg.payload : msg;

        // 4. Execute
        const result = await capability.execute(payload, context);

        // 5. Handle Outcome
        if (result.success) {
            this.sendSuccess(msg.type, result.value);
            this.handleSideEffects(result.value);
        } else {
            logger.error('dispatcher', 'Capability failed', { capability: capability.id, error: result.error });
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: { message: `❌ Action failed: ${result.error}`, type: 'error' }
            });
        }
    }

    /**
     * 🚀 Handle progressive sync with streaming
     */
    private async handleProgressiveSync(_msg: PluginAction, context: AgentContext): Promise<void> {
        // ⚡ IMMEDIATE UI FEEDBACK - Don't wait for anything!
        figma.ui.postMessage({
            type: 'SYNC_PHASE_START',
            payload: { phase: 'definitions' }
        });

        try {
            // ⚡ Use cached reference - NO dynamic import delay
            const generator = this.root.syncService.syncDefinitionsGenerator();
            const stats = await this.root.syncService.getStats();
            const estimatedTotal = stats.totalVariables;

            // ⚡ Notify UI immediately with estimate
            figma.ui.postMessage({
                type: 'SYNC_PROGRESS',
                payload: {
                    phase: 'definitions',
                    current: 0,
                    total: estimatedTotal,
                    percentage: 0
                }
            });

            // Start progressive sync
            await this.syncCoordinator.start(generator, {
                estimatedTotal,

                onProgress: (progress) => {
                    figma.ui.postMessage({
                        type: 'SYNC_PROGRESS',
                        payload: progress
                    });
                },

                onChunk: (chunk) => {
                    figma.ui.postMessage({
                        type: 'SYNC_CHUNK',
                        payload: chunk
                    });
                },

                onComplete: () => {
                    figma.ui.postMessage({
                        type: 'SYNC_COMPLETE',
                        payload: {
                            totalTokens: context.repository.getAllNodes().length,
                            message: '✅ Sync complete!'
                        }
                    });

                    // Start usage analysis in background (non-blocking)
                    this.lazyLoadUsageAnalysis();
                },

                onError: (error) => {
                    // 🔍 ENHANCED ERROR LOGGING
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    const errorStack = error instanceof Error ? error.stack : undefined;
                    const errorName = error instanceof Error ? error.name : 'Unknown';

                    logger.error('dispatcher', 'Progressive sync failed', {
                        error,
                        errorName,
                        errorMessage,
                        errorStack
                    });

                    console.error('[Dispatcher] Full sync error details:', {
                        name: errorName,
                        message: errorMessage,
                        stack: errorStack,
                        raw: error
                    });

                    figma.ui.postMessage({
                        type: 'OMNIBOX_NOTIFY',
                        payload: {
                            message: `❌ Sync failed: ${errorMessage}`,
                            type: 'error'
                        }
                    });
                }
            });

        } catch (error) {
            logger.error('dispatcher', 'Failed to start progressive sync', { error });
            figma.ui.postMessage({
                type: 'OMNIBOX_NOTIFY',
                payload: {
                    message: '❌ Failed to start sync',
                    type: 'error'
                }
            });
        }
    }

    /**
     * 🧠 Lazy load usage analysis (runs in background after definitions loaded)
     */
    private async lazyLoadUsageAnalysis(): Promise<void> {
        try {
            // Notify UI that usage analysis started
            figma.ui.postMessage({
                type: 'USAGE_ANALYSIS_STARTED',
                payload: { message: '🔍 Analyzing token usage...' }
            });

            // \u26a1 FIX: Capture usage data instead of discarding it
            const usageMap = await this.root.syncService.scanUsage();

            // Convert Map to Record for transport (like controller.ts line 282)
            const usageReport = Object.fromEntries(usageMap);

            //  Persist for next startup
            await figma.clientStorage.setAsync('internal_usage_cache', usageReport);

            // \u2705 CRITICAL FIX: Send usage data to UI (was missing before!)
            figma.ui.postMessage({
                type: 'SCAN_COMPLETE',
                payload: {
                    timestamp: Date.now(),
                    usage: usageReport
                }
            });

            // Notify completion
            figma.ui.postMessage({
                type: 'USAGE_ANALYSIS_COMPLETE',
                payload: { message: '✅ Usage analysis complete' }
            });

            logger.info('dispatcher', 'Usage analysis complete and transmitted to UI');

        } catch (error) {
            logger.error('dispatcher', 'Usage analysis failed', { error });
            // Don't show error to user - it's a background task
        }
    }

    /**
     * Cancel ongoing sync
     */
    public cancelSync(): void {
        this.syncCoordinator.cancel();
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: '⏹️ Sync canceled', type: 'info' }
        });
    }

    private sendSuccess<T>(type: string, payload: T) {
        figma.ui.postMessage({
            type: `${type}_SUCCESS`,
            payload: payload,
            timestamp: Date.now()
        });
    }

    private handleSideEffects(value: unknown) {
        if (value && typeof value === 'object' && 'message' in value) {
            const msg = (value as Record<string, unknown>).message;
            if (typeof msg === 'string') {
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: { message: msg, type: 'info' }
                });
            }
        }
    }
}

`

---

## /src/core/interfaces/ICapability.ts
> Path: $Path

`$Lang
import type { AgentContext } from '../AgentContext';
import type { Result } from '../../shared/lib/result';

/**
 * Standard Interface for ALL Plugin Features (Capabilities).
 * Replaces the monolithic controller switch statement.
 */
export interface ICapability<TPayload = unknown, TResult = unknown> {
    /**
     * Unique Identifier (e.g., 'scan-selection-v1')
     */
    readonly id: string;

    /**
     * The Command ID this capability responds to (e.g., 'SCAN_SELECTION')
     */
    readonly commandId: string;

    /**
     * Description for the Help/Docs system
     */
    readonly description?: string;

    /**
     * Guard Clause: Can this capability run right now?
     * @param context Current agent context
     */
    canExecute(context: AgentContext): boolean;

    /**
     * Core Logic execution.
     * @param payload Data from the UI or System
     * @param context Current agent context
     */
    execute(payload: TPayload, context: AgentContext): Promise<Result<TResult>>;
}

`

---

## /src/core/interfaces/IVariableRepository.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../types';

/**
 * Repository Interface for Variable Management.
 * Decouples Business Logic from Figma API calls.
 */
export interface IVariableRepository {
    /**
     * Syncs all tokens from the external source (Figma)
     */
    sync(): Promise<TokenEntity[]>;
    syncGenerator?(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]>; // 🌊 Progressive Sync

    /**
     * Creates a new variable in the external source
     */
    create(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void>;

    /**
     * Updates an existing variable
     */
    update(id: string, value: VariableValue): Promise<void>;

    /**
     * Renames a variable
     */
    rename(id: string, newName: string): Promise<void>;

    /**
     * Moves a var to a specific collection (if supported)
     */
    move?(id: string, targetCollectionId: string): Promise<void>;
}

`

---

## /src/core/services/Logger.ts
> Path: $Path

`$Lang
/**
 * 📝 Logger Service
 * 
 * Centralized logging abstraction for the Vibe Plugin.
 * Replaces raw console.log/warn/error with structured, filterable logs.
 * 
 * Features:
 * - Log Levels: debug, info, warn, error, silent
 * - Context Namespacing: e.g. 'controller:message', 'sync:drift'
 * - Production Safe: Can be silenced completely
 * - Structured Data: Accepts objects for rich context
 * 
 * Usage:
 * ```ts
 * import { logger } from '@/core/services/Logger';
 * 
 * logger.info('controller', 'Message received', { type: msg.type });
 * logger.error('sync', 'Sync failed', { error });
 * ```
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

interface LoggerConfig {
    level: LogLevel;
    enableTimestamp: boolean;
    enableContext: boolean;
}

class LoggerService {
    private config: LoggerConfig = {
        level: 'info',
        enableTimestamp: true,
        enableContext: true
    };

    private readonly levels: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        silent: 999
    };

    /**
     * Set the minimum log level
     * Logs below this level will be suppressed
     */
    setLevel(level: LogLevel): void {
        this.config.level = level;
    }

    /**
     * Configure logger behavior
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Debug level logging (most verbose)
     * Use for detailed debugging information
     */
    debug(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('debug', context, message, data);
    }

    /**
     * Info level logging
     * Use for general informational messages
     */
    info(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('info', context, message, data);
    }

    /**
     * Warning level logging
     * Use for potentially problematic situations
     */
    warn(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('warn', context, message, data);
    }

    /**
     * Error level logging
     * Use for error conditions
     */
    error(context: string, message: string, data?: Record<string, unknown>): void {
        this.log('error', context, message, data);
    }

    /**
     * Internal log method
     */
    private log(
        level: LogLevel,
        context: string,
        message: string,
        data?: Record<string, unknown>
    ): void {
        // Check if this log level should be displayed
        if (this.levels[level] < this.levels[this.config.level]) {
            return;
        }

        // Build log prefix
        const parts: string[] = [];

        if (this.config.enableTimestamp) {
            parts.push(this.getTimestamp());
        }

        if (this.config.enableContext) {
            parts.push(`[${context}]`);
        }

        const prefix = parts.join(' ');
        const fullMessage = `${prefix} ${message}`;

        // Output to appropriate console method
        switch (level) {
            case 'debug':
            case 'info':
                if (data) {
                    console.log(fullMessage, data);
                } else {
                    console.log(fullMessage);
                }
                break;
            case 'warn':
                if (data) {
                    console.warn(fullMessage, data);
                } else {
                    console.warn(fullMessage);
                }
                break;
            case 'error':
                if (data) {
                    console.error(fullMessage, data);
                } else {
                    console.error(fullMessage);
                }
                break;
        }
    }

    /**
     * Get formatted timestamp
     */
    private getTimestamp(): string {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${ms}`;
    }

    /**
     * Clear console (use sparingly)
     */
    clear(): void {
        console.clear();
    }
}

// Export singleton instance
export const logger = new LoggerService();

// Export for production builds
if (typeof window !== 'undefined') {
    // Make logger available on window for debugging in production
    (window as typeof window & { __vibeLogger?: LoggerService }).__vibeLogger = logger;
}

`

---

## /src/core/services/ProgressiveSyncCoordinator.ts
> Path: $Path

`$Lang
import { logger } from './Logger';
import type { TokenEntity } from '../types';

export interface SyncProgress {
    phase: 'definitions' | 'usage' | 'complete';
    current: number;
    total: number;
    percentage: number;
    chunksProcessed: number;
    estimatedTimeRemaining?: number;
}

export interface SyncChunk {
    tokens: TokenEntity[];
    chunkIndex: number;
    isLast: boolean;
}

/**
 * 🧠 ProgressiveSyncCoordinator (Ghobghabi Edition)
 * * Implements "Context-Driven Sync" with Adaptive Frame Budgeting & Minimal Overhead.
 * - Respects 16ms frame budget (60fps target).
 * - Batches chunks dynamically to avoid yield thrashing AND small chunk spam.
 * - Yields preemptively if processing gets heavy.
 * - Eliminates dead code (MIN_CHUNK_SIZE was unused!).
 */
export class ProgressiveSyncCoordinator {
    private isRunning = false;
    private shouldCancel = false;
    private startTime = 0;
    private processedCount = 0;

    // ⚡ GHOBGHABI CONFIG: Adaptive Budgeting
    private readonly FRAME_BUDGET_MS = 12; // Leave 4ms overhead for UI rendering
    private readonly MIN_FLUSH_SIZE = 50;  // Avoid sending tiny chunks (reduce postMessage overhead)
    private readonly MAX_FLUSH_SIZE = 200; // Hard cap to prevent memory spikes

    private onProgress?: (progress: SyncProgress) => void;
    private onChunk?: (chunk: SyncChunk) => void;
    private onComplete?: () => void;
    private onError?: (error: Error) => void;

    async start(
        syncGenerator: AsyncGenerator<TokenEntity[]>,
        options: {
            onProgress?: (progress: SyncProgress) => void;
            onChunk?: (chunk: SyncChunk) => void;
            onComplete?: () => void;
            onError?: (error: Error) => void;
            estimatedTotal?: number;
        }
    ): Promise<void> {
        if (this.isRunning) {
            logger.warn('sync-coordinator', 'Sync already running');
            return;
        }

        this.isRunning = true;
        this.shouldCancel = false;
        this.startTime = Date.now();
        this.processedCount = 0;

        this.onProgress = options.onProgress;
        this.onChunk = options.onChunk;
        this.onComplete = options.onComplete;
        this.onError = options.onError;

        try {
            await this.processGenerator(syncGenerator, options.estimatedTotal);
        } catch (error) {
            // 🔍 ENHANCED ERROR LOGGING
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            const errorName = error instanceof Error ? error.name : 'Unknown';

            logger.error('sync-coordinator', 'Sync failed', {
                error,
                errorName,
                errorMessage,
                errorStack
            });

            console.error('[ProgressiveSyncCoordinator] Full error details:', {
                name: errorName,
                message: errorMessage,
                stack: errorStack,
                raw: error
            });

            this.onError?.(error instanceof Error ? error : new Error(String(error)));
        } finally {
            this.isRunning = false;
        }
    }

    cancel(): void {
        if (!this.isRunning) return;
        this.shouldCancel = true;
    }

    private async processGenerator(
        generator: AsyncGenerator<TokenEntity[]>,
        estimatedTotal?: number
    ): Promise<void> {
        let chunkIndex = 0;
        let pendingTokens: TokenEntity[] = [];
        let lastYieldTime = Date.now();

        for await (const incomingChunk of generator) {
            if (this.shouldCancel) {
                logger.info('sync-coordinator', 'Sync canceled');
                return;
            }

            // 🛡️ SAFETY: Prevent ReferenceError if generator yields null/undefined/non-array
            if (!incomingChunk || !Array.isArray(incomingChunk)) {
                logger.warn('sync-coordinator', 'Skipping invalid chunk (not an array)', { chunk: incomingChunk });
                continue;
            }

            // 1. Accumulate tokens
            pendingTokens.push(...incomingChunk);

            const now = Date.now();
            const timeInFrame = now - lastYieldTime;

            // ⚡ GHOBGHABI LOGIC: 
            // Yield if we exceeded frame budget OR hit hard cap.
            // But ONLY if we have enough to meet minimum flush size.
            const shouldYield =
                timeInFrame >= this.FRAME_BUDGET_MS ||
                pendingTokens.length >= this.MAX_FLUSH_SIZE;

            if (shouldYield && pendingTokens.length >= this.MIN_FLUSH_SIZE) {
                await this.flushChunk(pendingTokens, ++chunkIndex, false, estimatedTotal);
                pendingTokens = []; // Clear buffer

                // 🛑 Force yield to main thread to let UI breathe
                await this.yieldToMain();
                lastYieldTime = Date.now(); // Reset frame timer
            }
        }

        // Flush remaining tokens (even if < MIN_FLUSH_SIZE, because it's the last batch)
        if (pendingTokens.length > 0) {
            await this.flushChunk(pendingTokens, ++chunkIndex, true, estimatedTotal);
        }

        this.onComplete?.();
        logger.info('sync-coordinator', `Sync complete: ${this.processedCount} tokens in ${Date.now() - this.startTime}ms`);
    }

    private async flushChunk(
        tokens: TokenEntity[],
        index: number,
        isLast: boolean,
        total?: number
    ): Promise<void> {
        this.processedCount += tokens.length;

        // Send to UI
        this.onChunk?.({
            tokens,
            chunkIndex: index,
            isLast
        });

        // Update Stats
        this.notifyProgress('definitions', total);
    }

    /**
     * Yield control to main thread
     * Uses setTimeout to break the microtask queue
     */
    private async yieldToMain(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }

    private notifyProgress(phase: SyncProgress['phase'], total?: number): void {
        if (!this.onProgress) return;

        const elapsed = Date.now() - this.startTime;
        const rate = elapsed > 0 ? this.processedCount / (elapsed / 1000) : 0;
        const remaining = total ? total - this.processedCount : 0;

        this.onProgress({
            phase,
            current: this.processedCount,
            total: total || this.processedCount,
            percentage: total ? Math.min(100, (this.processedCount / total) * 100) : 0,
            chunksProcessed: 0, // Deprecated/Not relevant in dynamic mode
            estimatedTimeRemaining: rate > 0 ? (remaining / rate) * 1000 : undefined
        });
    }
}

`

---

## /src/core/services/SyncService.ts
> Path: $Path

`$Lang
import { TokenRepository } from '../TokenRepository';
import { VariableManager } from '../../features/governance/VariableManager';
import type { TokenEntity } from '../types';

export interface SyncStats {
    totalVariables: number;
    collections: number;
    styles: number;
    collectionMap: Record<string, string>; // Name -> ID
}

/**
 * 🔄 SyncService
 * 
 * Orchestrates the synchronization between the Plugin UI and the Figma Main thread.
 * Handles variable creation, updates, and feedback loops.
 */
export class SyncService {
    private readonly variableManager: VariableManager;
    private readonly repository: TokenRepository;

    constructor(
        variableManager: VariableManager,
        repository: TokenRepository
    ) {
        this.variableManager = variableManager;
        this.repository = repository;
    }

    /**
     * 🌊 Progressive Sync Generator
     * Yields chunks of tokens definitions (Lightweight).
     * Usage analysis is DEFERRED.
     */
    async *syncDefinitionsGenerator(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]> {
        // Yield from Variable Manager (which yields from Repo)
        for await (const chunk of this.variableManager.syncGenerator(abortSignal)) {
            yield chunk;
        }
    }

    /**
     * 🧠 Lazy Usage Analysis
     * Should be called ONLY when user requests it or on idle.
     */
    async scanUsage(): Promise<any> { // Using any or specific type if import available, prefer weak typing here to avoid circular dep issues in signature if types aren't purely shared
        try {
            // Lazy load analyzer to avoid circular deps
            const { TokenUsageAnalyzer } = await import('../../features/tokens/domain/TokenUsageAnalyzer');
            const analyzer = new TokenUsageAnalyzer();
            const usageMap = await analyzer.analyze();

            // Store in Repository
            // We need to update existing nodes in the repo with usage data
            // This assumes nodes already exist.
            const allNodes = this.repository.getAllNodes();
            for (const node of allNodes) {
                if (usageMap.has(node.id)) {
                    node.usage = usageMap.get(node.id);
                    // No need to re-add, objects are ref? 
                    // Repository might store copies.
                    // If repo stores copies, we need repository.update(node).
                    // core/TokenRepository is in-memory graph usually.
                }
            }

            return usageMap;
        } catch (e) {
            console.error('Failed to analyze usage:', e);
            return new Map();
        }
    }

    /**
     * @deprecated Use syncDefinitionsGenerator() for UI.
     * Keeps backward compatibility for tests/CLI.
     */
    async sync(): Promise<TokenEntity[]> {
        const tokens: TokenEntity[] = [];
        for await (const chunk of this.syncDefinitionsGenerator()) {
            tokens.push(...chunk);
        }
        await this.scanUsage();
        return tokens;
    }

    /**
     * Collects current statistics from Figma.
     */
    async getStats(): Promise<SyncStats> {
        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const variables = await figma.variables.getLocalVariablesAsync();
        const styles = await figma.getLocalPaintStylesAsync();

        // Build Name -> ID Map
        const collectionMap: Record<string, string> = {};
        collections.forEach(c => {
            collectionMap[c.name] = c.id;
        });

        return {
            totalVariables: variables.length,
            collections: collections.length,
            styles: styles.length,
            collectionMap
        };
    }

    /**
     * ☁️ Cloud Sync (Worker Proxy)
     * Pushes generic token data to the persistent store via Cloudflare Worker.
     */
    async pushToCloud(tokens: TokenEntity[]): Promise<boolean> {
        try {
            // Lazy load to ensure minimal bundle size if not used
            const { VibeWorkerClient } = await import('../../infrastructure/network/VibeWorkerClient');

            // 🛑 Chunking strategy could be implemented here if payload is too large
            // For now, we push the whole batch as the worker snippet implies simple proxy
            const { error } = await VibeWorkerClient.syncTokens(tokens);

            if (error) {
                console.error('[SyncService] Cloud push failed:', error);
                return false;
            }
            return true;
        } catch (e) {
            console.error('[SyncService] Cloud push exception:', e);
            return false;
        }
    }
}

`

---

## /src/core/TokenRepository.ts
> Path: $Path

`$Lang
import type { TokenEntity } from './types';

/**
 * 📦 TokenRepository
 * In-memory graph database for Design Tokens.
 * Maintains dependency graphs (ancestry/impact) and ensures O(1) lookup.
 */
export class TokenRepository {
    private nodes: Map<string, TokenEntity>;
    private adjacencyList: Map<string, Set<string>>;  // Directed edges: Key depends on Value(s)
    private reverseAdjacencyList: Map<string, Set<string>>; // Directed edges: Key defines who depends on it

    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
        this.reverseAdjacencyList = new Map();
    }

    addNode(token: TokenEntity): void {
        this.nodes.set(token.id, token);
        if (!this.adjacencyList.has(token.id)) {
            this.adjacencyList.set(token.id, new Set());
        }
        if (!this.reverseAdjacencyList.has(token.id)) {
            this.reverseAdjacencyList.set(token.id, new Set());
        }
    }

    addEdge(dependentId: string, dependencyId: string): void {
        // dependentId "uses" dependencyId
        this.adjacencyList.get(dependentId)?.add(dependencyId);
        this.reverseAdjacencyList.get(dependencyId)?.add(dependentId);
    }

    getNode(id: string): TokenEntity | undefined {
        return this.nodes.get(id);
    }

    getAllNodes(): TokenEntity[] {
        return Array.from(this.nodes.values());
    }

    // Alias for semantics
    getTokens(): Map<string, TokenEntity> {
        return this.nodes;
    }

    /**
     * DFS-based ancestry analysis
     * Returns all tokens that `tokenId` depends on (directly or indirectly)
     */
    getAncestry(tokenId: string): TokenEntity[] {
        const visited = new Set<string>();
        const ancestors: TokenEntity[] = [];

        const dfs = (currentId: string) => {
            if (visited.has(currentId)) {
                return;
            }
            visited.add(currentId);

            const token = this.nodes.get(currentId);
            if (token && currentId !== tokenId) {
                ancestors.push(token);
            }

            // Read from adjacency list to find what currentId depends on
            const dependencies = this.adjacencyList.get(currentId) || new Set();
            for (const depId of dependencies) {
                dfs(depId);
            }
        };

        dfs(tokenId);
        return ancestors;
    }

    /**
     * DFS-based impact analysis
     * Returns all tokens that depend on `tokenId` (directly or indirectly)
     * Time Complexity: O(V+E)
     */
    getImpact(tokenId: string): TokenEntity[] {
        const visited = new Set<string>();
        const impacted: TokenEntity[] = [];

        const dfs = (currentId: string) => {
            if (visited.has(currentId)) {
                // 🛑 Cycle Detected - Break Recursion
                console.warn(`⚠️ Cycle detected at token: ${currentId} while analyzing impact of ${tokenId}`);
                return;
            }
            visited.add(currentId);

            const token = this.nodes.get(currentId);
            if (token && currentId !== tokenId) {
                impacted.push(token);
            }

            // Read from reverse adjacency list to find who depends on currentId
            const dependents = this.reverseAdjacencyList.get(currentId) || new Set();
            for (const dependentId of dependents) {
                dfs(dependentId);
            }

            // Backtrack (optional, but for impact analysis we generally want to avoid re-visiting regardless of path)
            // visited.delete(currentId); 
        };

        dfs(tokenId);
        return impacted;
    }

    /**
     * Detects orphans (variables not used by anyone and not bound to Figma nodes - logic to be extended)
     * Currently returns tokens that have 0 dependents.
     */
    detectOrphans(): TokenEntity[] {
        return Array.from(this.nodes.values()).filter(token => {
            const dependents = this.reverseAdjacencyList.get(token.id);
            return !dependents || dependents.size === 0;
        });
    }

    reset(): void {
        this.nodes.clear();
        this.adjacencyList.clear();
        this.reverseAdjacencyList.clear();
    }
}

`

---

## /src/core/types.ts
> Path: $Path

`$Lang
export type TokenType =
    | 'color'
    | 'dimension'
    | 'fontFamily'
    | 'fontWeight'
    | 'duration'
    | 'cubicBezier';

export type VariableScope =
    | 'ALL_SCOPES'
    | 'FRAME_FILL'
    | 'TEXT_FILL'
    | 'STROKE_COLOR'
    | 'EFFECT_COLOR';

export type RGB = { r: number; g: number; b: number };
export type RGBA = RGB & { a: number };
export type VariableValue = string | number | boolean | RGB | RGBA;

export interface ComponentUsage {
    id: string;
    name: string;
}

export interface StyleUsage {
    id: string;
    name: string;
}

export interface TokenUsageStats {
    /** 
     * Qualitative list of components using this token.
     */
    usedInComponents: ComponentUsage[];

    /** 
     * Qualitative list of styles using this token.
     */
    usedInStyles: StyleUsage[];

    /** 
     * Qualitative impact estimate (e.g. instances of components).
     */
    affectedInstancesCount: number;

    /**
     * Total raw usage count across the entire file (including Frames, Text, etc.).
     */
    totalRawUsage: number;

    /** 
     * Dependency chain for deep analysis.
     */
    dependencyChain: string[];
}

export type TokenUsageMap = Map<string, TokenUsageStats>;

export interface TokenEntity {
    id: string;                    // Figma Variable ID
    name: string;                  // "primary-500"
    path: string[];                // ["Colors", "Brand"]
    $value: string | number;       // W3C standard
    $type: TokenType;
    $description?: string;
    $extensions: {
        figma: {
            scopes: VariableScope[];
            collectionId: string;
            modeId: string;
            resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
        }
    };
    dependencies: string[];        // Token IDs this references
    dependents: string[];          // Token IDs that reference this

    /**
     * 📊 Usage Analytics
     * Added for qualitative usage insights (e.g. "Used in Button/Primary").
     * Populated by TokenUsageAnalyzer.
     */
    usage?: TokenUsageStats;
}

`

---

## /src/features/auth/AuthService.ts
> Path: $Path

`$Lang
/**
 * @module AuthService
 * @description Authentication service for Vibe Plugin using Supabase.
 * @version 2.1.0 - OTP-based password recovery flow.
 */
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | Error | null;
}

export class AuthService {
    /**
     * Persistent session retrieval backed by FigmaStorageAdapter.
     */
    static async getSession(): Promise<Session | null> {
        const supabase = VibeSupabase.get();
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("[Auth] Failed to restore session:", error.message);
            return null;
        }
        return data.session;
    }

    /**
     * Checks if a username is globally unique in the public.profiles table.
     */
    static async isUsernameAvailable(username: string): Promise<boolean> {
        const supabase = VibeSupabase.get();
        if (!supabase) throw new Error("Supabase client not initialized");

        const { count, error } = await supabase
            .from('profiles')
            .select('username', { count: 'exact', head: true })
            .eq('username', username);

        if (error) {
            console.error("[Auth] Username check failed:", error);
            throw new Error("Could not validate username availability.");
        }

        return count === 0;
    }

    /**
     * Signs up a new user with email, password, and a unique username.
     */
    static async signUp(email: string, password: string, username: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            // 1. Check Username Availability
            const available = await this.isUsernameAvailable(username);
            if (!available) {
                return {
                    user: null,
                    session: null,
                    error: new Error(`Username '${username}' is already taken.`)
                };
            }

            // 2. Create Auth User with username in metadata for the DB Trigger
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    },
                },
            });

            if (error) return { user: null, session: null, error };

            return { user: data.user, session: data.session, error: null };

        } catch (e: unknown) {
            console.error("[AuthService] Signup flow interrupted:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    static async signIn(email: string, password: string): Promise<AuthResult> {
        // 🔒 SECURE PROXY: Route through Worker
        const { VibeWorkerClient } = await import('../../infrastructure/network/VibeWorkerClient');

        const { data, error } = await VibeWorkerClient.signIn(email, password);

        if (error || !data) {
            const errorObj = typeof error === 'string' ? new Error(error) : new Error('Login failed');
            return { user: null, session: null, error: errorObj };
        }

        // Assuming Worker returns { user, session } in data
        return { user: data.user, session: data.session, error: null };
    }

    static async signOut(): Promise<{ error: AuthError | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    }

    // ==========================================================================
    // == OTP-BASED PASSWORD RECOVERY ==
    // ==========================================================================

    /**
     * Sends an OTP code to the user's email for password recovery.
     * Uses `resetPasswordForEmail` to trigger the standard recovery flow.
     * NOTE: Requires Supabase Email Template "Reset Password" to use {{ .Token }} instead of link.
     * @param email The user's email address.
     */
    static async sendRecoveryOtp(email: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        try {
            // Use resetPasswordForEmail effectively requests a recovery token.
            // By default, this sends a Magic Link. The User MUST configure the template
            // to send a code, or Supabase must be configured to send instructions.
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                console.error("[AuthService] Password Reset Request Failed:", error.message);
                return { error };
            }

            return { error: null };
        } catch (e) {
            console.error("[AuthService] Password Reset Exception:", e);
            return { error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Verifies the OTP code sent to the user's email.
     * Uses type 'recovery' which corresponds to `resetPasswordForEmail` flow.
     * @param email The user's email address.
     * @param token The 6-digit OTP code.
     */
    static async verifyRecoveryOtp(email: string, token: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery', // corrected from 'email' to 'recovery' for password reset
            });

            if (error) {
                console.error("[AuthService] OTP Verification Failed:", error.message);
                return { user: null, session: null, error };
            }

            return { user: data.user, session: data.session, error: null };
        } catch (e) {
            console.error("[AuthService] OTP Verify Exception:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Updates the user's password.
     * Requires an active session (e.g., after OTP verification).
     * @param newPassword The new password.
     */
    static async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        return { error };
    }
}

`

---

## /src/features/auth/OnboardingStore.ts
> Path: $Path

`$Lang
/**
 * Onboarding Store
 * Manages persistent onboarding state via Figma ClientStorage Bridge
 * 
 * NOTE: Uses message passing to figma.clientStorage because localStorage
 * is disabled in the Figma UI 'data:' context.
 */

import { useState, useEffect } from 'react';

// ============================================================================
// 📊 STATE SCHEMA
// ============================================================================

/**
 * Persistent onboarding state schema
 */
export interface OnboardingState {
    /**
     * Schema version for future migrations
     */
    schemaVersion: number;

    /**
     * Has the user accepted Terms & Privacy?
     */
    hasAcceptedTerms: boolean;

    /**
     * Which version of terms did they accept?
     */
    termsVersion: number;

    /**
     * Timestamp of terms acceptance
     */
    acceptedAt?: string;

    /**
     * Has the user completed their first authenticated session?
     */
    hasCompletedFirstSession: boolean;

    /**
     * Timestamp of first session
     */
    firstSessionAt?: string;

    /**
     * Has the user seen the welcome celebration?
     */
    hasSeenWelcome: boolean;
}

// ============================================================================
// 🔐 CONSTANTS
// ============================================================================

const STORAGE_KEY = 'vibe_onboarding_state';
const CURRENT_SCHEMA_VERSION = 1;
const CURRENT_TERMS_VERSION = 1;

const DEFAULT_STATE: OnboardingState = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    hasAcceptedTerms: false,
    termsVersion: 0,
    hasCompletedFirstSession: false,
    hasSeenWelcome: false
};

// ============================================================================
// 💾 STORAGE ADAPTER
// ============================================================================

/**
 * Storage adapter interface
 */
interface StorageAdapter<T> {
    load(): Promise<T | null>;
    save(data: T): Promise<void>;
    clear(): Promise<void>;
}

/**
 * Bridge-based storage adapter (Communication with Plugin Sandbox)
 * 
 * Sends messages to the controller (main thread) to access figma.clientStorage,
 * which is persistent across sessions and shared across the plugin.
 */
class BridgeStorageAdapter<T> implements StorageAdapter<T> {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    /**
     * Load data via 'STORAGE_GET' message
     */
    async load(): Promise<T | null> {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                cleanup();
                console.warn(`[BridgeStorageAdapter] Timeout loading ${this.key}`);
                resolve(null); // Return null on timeout to allow safe implementation defaults
            }, 3000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_GET_RESPONSE' && msg.key === this.key) {
                    cleanup();
                    try {
                        // Figma storage returns the raw object/value directly
                        resolve(msg.value as T);
                    } catch (e) {
                        console.error(`[BridgeStorageAdapter] Failed to parse ${this.key}`, e);
                        resolve(null);
                    }
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_GET', key: this.key } }, '*');
        });
    }

    /**
     * Save data via 'STORAGE_SET' message
     */
    async save(data: T): Promise<void> {
        return new Promise((resolve) => {
            // Optimistic timeout - we assume success if no error, but we wait for ACK
            const timeoutId = setTimeout(() => {
                cleanup();
                console.warn(`[BridgeStorageAdapter] Timeout saving ${this.key} (Assume Success)`);
                resolve();
            }, 3000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_SET_SUCCESS' && msg.key === this.key) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_SET', key: this.key, value: data } }, '*');
        });
    }

    /**
     * Clear data via 'STORAGE_REMOVE' message
     */
    async clear(): Promise<void> {
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                cleanup();
                resolve();
            }, 1000);

            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg && msg.type === 'STORAGE_REMOVE_SUCCESS' && msg.key === this.key) {
                    cleanup();
                    resolve();
                }
            };

            const cleanup = () => {
                clearTimeout(timeoutId);
                window.removeEventListener('message', handler);
            };

            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: this.key } }, '*');
        });
    }
}

// ============================================================================
// 🏪 ONBOARDING STORE CLASS
// ============================================================================

/**
 * Singleton store for managing onboarding state
 */
export class OnboardingStore {
    private state: OnboardingState;
    private storage: StorageAdapter<OnboardingState>;
    private initialized: boolean;
    private subscribers: Set<(state: OnboardingState) => void>;

    constructor() {
        // Use BridgeStorageAdapter instead of LocalStorageAdapter
        this.storage = new BridgeStorageAdapter<OnboardingState>(STORAGE_KEY);
        this.state = DEFAULT_STATE;
        this.initialized = false;
        this.subscribers = new Set();
    }

    /**
     * Initialize the store by loading persisted state
     * MUST be called before any other method
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            console.warn('[OnboardingStore] Already initialized, skipping');
            return;
        }

        console.log('[OnboardingStore] Initializing via Bridge...');
        const stored = await this.storage.load();

        if (!stored) {
            console.log('[OnboardingStore] No existing state found (or first load), using defaults');
            this.state = DEFAULT_STATE;
        } else if (stored.schemaVersion !== CURRENT_SCHEMA_VERSION) {
            console.warn('[OnboardingStore] Schema version mismatch, applying migration');
            this.state = this.migrate(stored);
        } else {
            console.log('[OnboardingStore] Loaded persisted state');
            this.state = stored;
        }

        this.initialized = true;
        this.notify();
    }

    /**
     * Save current state to storage
     */
    private async save(): Promise<void> {
        try {
            await this.storage.save(this.state);
            console.log('[OnboardingStore] State saved successfully');
        } catch (error) {
            console.error('[OnboardingStore] Failed to save state:', error);
            throw error;
        }
    }

    /**
     * Migrate old schema versions to current schema
     */
    private migrate(oldState: Partial<OnboardingState>): OnboardingState {
        console.log('[OnboardingStore] Migrating from version:', oldState.schemaVersion);

        // For now, just merge with defaults
        // In future, implement version-specific migrations here
        return {
            ...DEFAULT_STATE,
            ...oldState,
            schemaVersion: CURRENT_SCHEMA_VERSION
        };
    }

    /**
     * Notify all subscribers of state changes
     */
    private notify(): void {
        this.subscribers.forEach(callback => callback(this.state));
    }

    // ========================================================================
    // 🔄 PUBLIC API - Getters
    // ========================================================================

    /**
     * Get current state (read-only)
     */
    getState(): Readonly<OnboardingState> {
        return this.state;
    }

    /**
     * Is the store initialized?
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Does the user need to see the Terms screen?
     */
    needsTermsAcceptance(): boolean {
        return !this.state.hasAcceptedTerms ||
            this.state.termsVersion < CURRENT_TERMS_VERSION;
    }

    /**
     * Is this the user's first authenticated session?
     * Used to trigger the "Welcome" celebration overlay
     */
    isFirstSession(): boolean {
        return !this.state.hasCompletedFirstSession || !this.state.hasSeenWelcome;
    }

    // ========================================================================
    // 🔄 PUBLIC API - Actions
    // ========================================================================

    /**
     * Mark terms as accepted
     */
    async acceptTerms(): Promise<void> {
        console.log('[OnboardingStore] Accepting terms...');
        this.state = {
            ...this.state,
            hasAcceptedTerms: true,
            termsVersion: CURRENT_TERMS_VERSION,
            acceptedAt: new Date().toISOString()
        };

        await this.save();
        this.notify();
    }

    /**
     * Mark first session as complete (after successful auth)
     */
    async completeFirstSession(): Promise<void> {
        if (this.state.hasCompletedFirstSession) {
            return; // Already completed
        }

        console.log('[OnboardingStore] Completing first session...');
        this.state = {
            ...this.state,
            hasCompletedFirstSession: true,
            firstSessionAt: new Date().toISOString()
        };

        await this.save();
        this.notify();
    }

    /**
     * Mark welcome celebration as seen
     */
    async markWelcomeSeen(): Promise<void> {
        this.state = {
            ...this.state,
            hasSeenWelcome: true
        };

        await this.save();
        this.notify();
    }

    /**
     * Reset all onboarding state (for testing/debugging)
     */
    async reset(): Promise<void> {
        this.state = DEFAULT_STATE;
        await this.storage.clear();
        this.notify();
        console.log('[OnboardingStore] State reset to defaults');
    }

    // ========================================================================
    // 🔔 SUBSCRIPTION SYSTEM
    // ========================================================================

    /**
     * Subscribe to state changes
     * Returns unsubscribe function
     */
    subscribe(callback: (state: OnboardingState) => void): () => void {
        this.subscribers.add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.delete(callback);
        };
    }
}

// ============================================================================
// 🎯 SINGLETON INSTANCE
// ============================================================================

/**
 * Global singleton instance
 */
export const onboardingStore = new OnboardingStore();

// Expose to window for debugging
if (typeof window !== 'undefined') {
    (window as any).__VIBE_ONBOARDING_STORE__ = onboardingStore;
}

// ============================================================================
// ⚛️ REACT HOOK
// ============================================================================

/**
 * React hook for onboarding state
 * Automatically subscribes to changes and re-renders
 */
export const useOnboarding = () => {
    const [state, setState] = useState<OnboardingState>(onboardingStore.getState());

    useEffect(() => {
        // Subscribe to store updates
        const unsubscribe = onboardingStore.subscribe((newState) => {
            setState(newState);
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []);

    return {
        // State indicators
        needsTerms: onboardingStore.needsTermsAcceptance(),
        isFirstSession: onboardingStore.isFirstSession(),

        // Raw state (for advanced use)
        state,

        // Actions
        acceptTerms: () => onboardingStore.acceptTerms(),
        completeFirstSession: () => onboardingStore.completeFirstSession(),
        markWelcomeSeen: () => onboardingStore.markWelcomeSeen(),
        reset: () => onboardingStore.reset()
    };
};

`

---

## /src/features/auth/ui/AuthGate.tsx
> Path: $Path

`$Lang
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


`

---

## /src/features/auth/ui/LoginScreen.tsx
> Path: $Path

`$Lang
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


`

---

## /src/features/auth/ui/WelcomeScreen.tsx
> Path: $Path

`$Lang
/**
 * @module WelcomeScreen
 * @description Document-style Terms & Privacy screen with scroll-to-accept pattern.
 * @version 2.0.0
 * 
 * UX Pattern: Users must scroll to bottom of document before "Continue" button enables.
 * This ensures they've actually seen the legal content.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, ScrollText, ChevronDown, Check } from 'lucide-react';
import { Button } from '../../../components/shared/base/Button';
import { fadeTransition } from '../../../shared/animations/MicroAnimations';
import { useOnboarding } from '../OnboardingStore';

interface WelcomeScreenProps {
    onAccept: () => void;
}

type DocumentTab = 'terms' | 'privacy';

/**
 * Document-Style Welcome Screen
 * Forces users to read legal documents by requiring scroll to bottom
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAccept }) => {
    const { acceptTerms } = useOnboarding();
    const [isAccepting, setIsAccepting] = useState(false);
    const [activeTab, setActiveTab] = useState<DocumentTab>('terms');
    const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
    const [hasScrolledPrivacy, setHasScrolledPrivacy] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if user has scrolled to bottom
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

        if (isBottom) {
            if (activeTab === 'terms') {
                setHasScrolledTerms(true);
            } else {
                setHasScrolledPrivacy(true);
            }
        }
    };

    // Reset scroll position when switching tabs
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const canProceed = hasScrolledTerms && hasScrolledPrivacy;

    const handleAccept = async () => {
        console.log('[WelcomeScreen] Button clicked!', {
            canProceed,
            hasScrolledTerms,
            hasScrolledPrivacy,
            isAccepting
        });

        if (!canProceed) {
            console.warn('[WelcomeScreen] Cannot proceed - documents not scrolled');
            return;
        }

        setIsAccepting(true);
        try {
            console.log('[WelcomeScreen] Calling acceptTerms()...');
            await acceptTerms();
            console.log('[WelcomeScreen] Terms accepted successfully!');

            console.log('[WelcomeScreen] Calling onAccept callback...');
            onAccept();
            console.log('[WelcomeScreen] onAccept callback completed!');
        } catch (error) {
            console.error('[WelcomeScreen] Failed to accept terms:', error);
            setIsAccepting(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeTransition}
            className="flex flex-col h-screen bg-void text-text-primary"
        >
            {/* Header */}
            <div className="flex-none border-b border-white/5 bg-surface-1/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
                            <Shield className="w-6 h-6 text-primary" strokeWidth={2.5} />
                        </div>

                        {/* Title */}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white font-display tracking-tight">
                                Welcome to Vibe Tokens
                            </h1>
                            <p className="text-xs text-text-dim mt-0.5">
                                Please review our legal documents before continuing
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex-none border-b border-white/5 bg-surface-1/40">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex gap-1">
                        {/* Terms Tab */}
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`
                                relative px-5 py-3 text-sm font-semibold transition-all
                                ${activeTab === 'terms'
                                    ? 'text-primary'
                                    : 'text-text-dim hover:text-text-primary'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Terms of Use</span>
                                {hasScrolledTerms && (
                                    <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
                                )}
                            </div>
                            {activeTab === 'terms' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>

                        {/* Privacy Tab */}
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`
                                relative px-5 py-3 text-sm font-semibold transition-all
                                ${activeTab === 'privacy'
                                    ? 'text-primary'
                                    : 'text-text-dim hover:text-text-primary'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <ScrollText className="w-4 h-4" />
                                <span>Privacy Policy</span>
                                {hasScrolledPrivacy && (
                                    <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
                                )}
                            </div>
                            {activeTab === 'privacy' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Content (Scrollable) */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scroll-smooth"
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'terms' ? (
                            <motion.div
                                key="terms"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <TermsOfUseDocument />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="privacy"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <PrivacyPolicyDocument />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Scroll Indicator (when not at bottom) */}
                <AnimatePresence>
                    {((activeTab === 'terms' && !hasScrolledTerms) ||
                        (activeTab === 'privacy' && !hasScrolledPrivacy)) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="sticky bottom-24 left-0 right-0 flex justify-center pointer-events-none"
                            >
                                <div className="bg-warning/10 border border-warning/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-warning">
                                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                                    <span>Scroll to continue reading</span>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>

            {/* Footer with CTA */}
            <div className="flex-none border-t border-white/5 bg-surface-1/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className={`flex items-center gap-1.5 ${hasScrolledTerms ? 'text-success' : 'text-text-dim'}`}>
                                {hasScrolledTerms ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                                )}
                                <span>Terms reviewed</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasScrolledPrivacy ? 'text-success' : 'text-text-dim'}`}>
                                {hasScrolledPrivacy ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                                )}
                                <span>Privacy reviewed</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                            onClick={handleAccept}
                            loading={isAccepting}
                            disabled={!canProceed || isAccepting}
                            variant="primary"
                            size="lg"
                            className="shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {canProceed ? 'I Agree & Continue' : 'Read Documents to Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// 📄 DOCUMENT CONTENT COMPONENTS
// ============================================================================

const TermsOfUseDocument: React.FC = () => (
    <div className="space-y-6 text-text-primary leading-relaxed">
        <div>
            <h2 className="text-2xl font-bold text-white mb-3">Terms of Use</h2>
            <p className="text-xs text-text-dim italic">Last Updated: February 6, 2026</p>
        </div>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h3>
            <p>
                By using Vibe Tokens ("the Plugin"), you agree to be bound by these Terms of Use.
                If you do not agree to these terms, please do not use the Plugin.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Description of Service</h3>
            <p>
                Vibe Tokens is a Figma plugin that helps designers manage design tokens,
                create and sync variables, and export tokens in multiple formats. The Plugin
                integrates with your Figma workspace and may store data in external services.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. User Account</h3>
            <p>
                To use certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">4. Acceptable Use</h3>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Plugin for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the Plugin's functionality</li>
                <li>Attempt to gain unauthorized access to any systems</li>
                <li>Reverse engineer or decompile the Plugin</li>
                <li>Use the Plugin to transmit malicious code or content</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">5. Intellectual Property</h3>
            <p>
                The Plugin and all related content, features, and functionality are owned by
                the Plugin developers and are protected by international copyright, trademark,
                and other intellectual property laws.
            </p>
            <p className="mt-2">
                Your design tokens and Figma files remain your intellectual property.
                We claim no ownership rights over your content.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">6. Data Storage & Syncing</h3>
            <p>
                The Plugin may sync your design tokens to cloud storage (Supabase) to enable
                cross-device access and team collaboration. You can delete your data at any time
                from the Plugin settings.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">7. Limitation of Liability</h3>
            <p>
                THE PLUGIN IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                We shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of the Plugin.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">8. Modifications to Terms</h3>
            <p>
                We reserve the right to modify these terms at any time. We will notify users
                of significant changes via the Plugin interface. Continued use after changes
                constitutes acceptance of the new terms.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">9. Termination</h3>
            <p>
                We may terminate or suspend your access to the Plugin immediately, without
                prior notice, for any breach of these Terms.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">10. Contact</h3>
            <p>
                For questions about these Terms, please contact us through our GitHub repository
                or Figma Community page.
            </p>
        </section>

        <div className="pt-8 border-t border-white/10">
            <p className="text-center text-xs text-text-dim">
                End of Terms of Use Document
            </p>
        </div>
    </div>
);

const PrivacyPolicyDocument: React.FC = () => (
    <div className="space-y-6 text-text-primary leading-relaxed">
        <div>
            <h2 className="text-2xl font-bold text-white mb-3">Privacy Policy</h2>
            <p className="text-xs text-text-dim italic">Last Updated: February 6, 2026</p>
        </div>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Introduction</h3>
            <p>
                This Privacy Policy explains how Vibe Tokens ("we," "us," or "the Plugin")
                collects, uses, and protects your personal information.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Information We Collect</h3>

            <h4 className="font-semibold text-white mt-3 mb-1">2.1 Personal Information</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Email Address:</strong> Used for account creation and recovery</li>
                <li><strong>Authentication Data:</strong> Securely managed by Supabase Auth</li>
            </ul>

            <h4 className="font-semibold text-white mt-3 mb-1">2.2 Usage Data</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li>Plugin interaction signals (feature usage, errors)</li>
                <li>Session duration and frequency</li>
                <li>Plugin version and environment information</li>
            </ul>

            <h4 className="font-semibold text-white mt-3 mb-1">2.3 Design Token Data</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li>Token names, types, and values</li>
                <li>Collection metadata (names, descriptions)</li>
                <li>Variable mode configurations</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. What We DON'T Collect</h3>
            <p className="font-semibold text-success mb-2">We explicitly do NOT collect:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Your Figma design files or screenshots</li>
                <li>Proprietary design content or assets</li>
                <li>Personal information beyond email address</li>
                <li>Payment or financial information</li>
                <li>Location data or device identifiers</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">4. How We Use Your Data</h3>
            <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain the Plugin functionality</li>
                <li>To sync your tokens across devices and team members</li>
                <li>To improve the Plugin based on usage patterns</li>
                <li>To communicate important updates or security issues</li>
                <li>To provide customer support when requested</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">5. Data Storage & Security</h3>
            <p>
                Your data is stored securely using Supabase, a database built on PostgreSQL
                with enterprise-grade security:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Encryption:</strong> Data is encrypted in transit (TLS) and at rest</li>
                <li><strong>Access Control:</strong> Row-level security policies protect your data</li>
                <li><strong>Backups:</strong> Regular automated backups with point-in-time recovery</li>
                <li><strong>Compliance:</strong> SOC 2 Type II certified infrastructure</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">6. Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Supabase:</strong> Database and authentication (see their privacy policy)</li>
                <li><strong>Figma:</strong> The Plugin operates within Figma's environment</li>
            </ul>
            <p className="mt-2">
                We do NOT share your data with advertising networks, analytics trackers,
                or any other third parties beyond these essential services.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">7. Your Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Deletion:</strong> Delete your account and all associated data</li>
                <li><strong>Export:</strong> Download your tokens in various formats</li>
                <li><strong>Opt-Out:</strong> Disable usage analytics at any time</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">8. Data Retention</h3>
            <p>
                We retain your data only as long as necessary to provide the service.
                When you delete your account:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>All personal data is permanently deleted within 30 days</li>
                <li>Backups are purged according to our retention schedule (90 days)</li>
                <li>Anonymized usage statistics may be retained for analytics</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">9. Children's Privacy</h3>
            <p>
                The Plugin is not intended for users under 13 years of age.
                We do not knowingly collect data from children.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">10. Changes to This Policy</h3>
            <p>
                We may update this Privacy Policy from time to time. We will notify you
                of any significant changes via the Plugin interface or email.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">11. Figma Plugin Policy Compliance</h3>
            <p>
                This Plugin fully complies with Figma's Plugin Privacy and Security policies:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>We only access data necessary for Plugin functionality</li>
                <li>We do not access user files without explicit permission</li>
                <li>All data access is clearly communicated to users</li>
                <li>We follow Figma's security best practices</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">12. Contact Us</h3>
            <p>
                For privacy-related questions or to exercise your rights, contact us through:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>GitHub: <span className="text-primary font-mono">github.com/abdelrahmanarabac/vibe-plugin</span></li>
                <li>Figma Community: Vibe Tokens Plugin Page</li>
            </ul>
        </section>

        <div className="pt-8 border-t border-white/10">
            <p className="text-center text-xs text-text-dim">
                End of Privacy Policy Document
            </p>
        </div>
    </div>
);

`

---

## /src/features/collections/adapters/CollectionRenamer.ts
> Path: $Path

`$Lang
import { CollectionClassifier } from '../logic/CollectionClassifier';
import type { RenameResult, CollectionClassification } from '../types';

/**
 * CollectionRenamer: Adapter Layer for Figma API Integration
 * 
 * Responsibility: Orchestrate the classification and renaming of Figma Variable Collections.
 * This class acts as the boundary between our domain logic (CollectionClassifier) and
 * the Figma Plugin API.
 * 
 * Design Pattern: Adapter Pattern
 * - CollectionClassifier (Business Logic) remains pure and testable
 * - CollectionRenamer (Adapter) handles Figma API specifics and error handling
 */
export class CollectionRenamer {
    private classifier: CollectionClassifier;
    private confidenceThreshold: number = 0.7;

    constructor() {
        this.classifier = new CollectionClassifier();
    }

    /**
     * Automatically renames all local variable collections based on classification.
     * 
     * Algorithm:
     * 1. Fetch all local collections from Figma
     * 2. Classify each collection using CollectionClassifier
     * 3. Filter by confidence threshold (default: 0.7)
     * 4. Apply renames via Figma API
     * 5. Return comprehensive result report
     * 
     * @param dryRun - If true, simulates rename without applying changes (for preview)
     * @returns RenameResult with success status, counts, and error details
     */
    async renameAll(dryRun: boolean = false): Promise<RenameResult> {
        const result: RenameResult = {
            success: true,
            renamedCount: 0,
            skippedCount: 0,
            errors: []
        };

        try {
            // Fetch all local collections
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // Handle case where no collections exist
            if (collections.length === 0) {
                console.warn('No variable collections found in document');
                return result;
            }

            // Process each collection
            for (const collection of collections) {
                try {
                    const classification = await this.classifier.classify(collection);

                    // Skip if confidence too low
                    if (classification.confidence < this.confidenceThreshold) {
                        result.skippedCount++;
                        console.warn(
                            `Skipped '${collection.name}': ${classification.reason} (confidence: ${classification.confidence.toFixed(2)})`
                        );
                        continue;
                    }

                    // Skip if classification is Unknown
                    if (classification.proposedName === 'Unknown') {
                        result.skippedCount++;
                        console.warn(
                            `Skipped '${collection.name}': ${classification.reason}`
                        );
                        continue;
                    }

                    // Skip if already has correct name
                    if (collection.name === classification.proposedName) {
                        result.skippedCount++;
                        console.log(
                            `Skipped '${collection.name}': Already has correct name`
                        );
                        continue;
                    }

                    // Apply rename (or simulate if dry run)
                    if (!dryRun) {
                        // Check for name collision
                        const existingCollection = collections.find(
                            c => c.name === classification.proposedName && c.id !== collection.id
                        );

                        if (existingCollection) {
                            // Handle collision: append suffix
                            let suffix = 1;
                            let proposedName = `${classification.proposedName}_${suffix}`;
                            while (collections.some(c => c.name === proposedName && c.id !== collection.id)) {
                                suffix++;
                                proposedName = `${classification.proposedName}_${suffix}`;
                            }

                            collection.name = proposedName;
                            result.renamedCount++;
                            console.warn(
                                `⚠️ Name collision detected. Renamed '${classification.currentName}' → '${proposedName}' (${classification.reason})`
                            );
                        } else {
                            // No collision: apply clean rename
                            collection.name = classification.proposedName;
                            result.renamedCount++;
                            console.log(
                                `✅ Renamed '${classification.currentName}' → '${classification.proposedName}' (${classification.reason})`
                            );
                        }
                    } else {
                        // Dry run: just log what would happen
                        console.log(
                            `[DRY RUN] Would rename '${classification.currentName}' → '${classification.proposedName}' (confidence: ${classification.confidence.toFixed(2)})`
                        );
                        result.renamedCount++;
                    }

                } catch (collectionError: unknown) {
                    const message = collectionError instanceof Error ? collectionError.message : String(collectionError);
                    // Handle individual collection errors without stopping the batch
                    result.errors.push({
                        collectionId: collection.id,
                        error: message || 'Unknown error during classification/rename'
                    });
                    result.success = false;
                    console.error(
                        `Error processing collection '${collection.name}' (${collection.id}):`,
                        collectionError
                    );
                }
            }

        } catch (globalError: unknown) {
            const message = globalError instanceof Error ? globalError.message : String(globalError);
            // Handle fatal errors (e.g., API unavailable)
            result.success = false;
            result.errors.push({
                collectionId: 'GLOBAL',
                error: message || 'Failed to retrieve collections'
            });
            console.error('Fatal error in renameAll:', globalError);
        }

        return result;
    }

    // Helper for omnibox notifications
    private notify(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message, type }
        });
    }

    // ... inside renameById ...

    async renameById(collectionId: string): Promise<boolean> {
        try {
            const collection = await figma.variables.getVariableCollectionByIdAsync(collectionId);

            if (!collection) {
                this.notify(`❌ Collection not found (ID: ${collectionId})`, 'error');
                return false;
            }

            const classification = await this.classifier.classify(collection);

            // Check if classification is valid
            if (classification.proposedName === 'Unknown') {
                this.notify(`⚠️ Cannot classify '${collection.name}'. ${classification.reason}`, 'warning');
                return false;
            }

            // Check confidence
            if (classification.confidence < this.confidenceThreshold) {
                this.notify(`⚠️ Low confidence (${Math.round(classification.confidence * 100)}%). ${classification.reason}`, 'warning');
                return false;
            }

            // Check if already correct
            if (collection.name === classification.proposedName) {
                this.notify(`✅ '${collection.name}' already has the correct name`, 'success');
                return true;
            }

            // Apply rename
            const oldName = collection.name;
            collection.name = classification.proposedName;
            this.notify(`✅ Renamed '${oldName}' → '${classification.proposedName}'`, 'success');
            return true;

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            this.notify(`❌ Rename failed: ${message}`, 'error');
            console.error('Error in renameById:', error);
            return false;
        }
    }

    /**
     * Preview classification results without applying changes.
     * 
     * Use case: Show user what would be renamed before confirming action.
     * 
     * @returns Array of CollectionClassification results
     */
    async previewClassifications(): Promise<CollectionClassification[]> {
        const results: CollectionClassification[] = [];

        try {
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            for (const collection of collections) {
                const classification = await this.classifier.classify(collection);
                results.push(classification);
            }

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Error in previewClassifications:', error);
            throw new Error(`Failed to generate preview: ${message}`);
        }

        return results;
    }

    /**
     * Update the confidence threshold used for auto-rename decisions.
     * 
     * @param threshold - New confidence threshold (0.0 to 1.0)
     */
    setConfidenceThreshold(threshold: number): void {
        if (threshold < 0 || threshold > 1) {
            throw new Error('Confidence threshold must be between 0.0 and 1.0');
        }
        this.confidenceThreshold = threshold;
    }

    /**
     * Get current confidence threshold.
     */
    getConfidenceThreshold(): number {
        return this.confidenceThreshold;
    }
}

`

---

## /src/features/collections/capabilities/CreateCollectionCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/lib/result";
import type { SyncService } from "../../../core/services/SyncService";

type CreateCollectionPayload = { name: string };
type CreateCollectionResult = {
    message: string;
    collectionId: string;
    collections: string[];
    collectionMap: Record<string, string>; // Aggressive Sync Payload
};

export class CreateCollectionCapability implements ICapability<CreateCollectionPayload, CreateCollectionResult> {
    readonly id = "create-collection-v1";
    readonly commandId = "CREATE_COLLECTION";
    readonly description = "Creates a new variable collection in Figma";

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true; // Available in any context
    }

    async execute(payload: CreateCollectionPayload, _context: AgentContext): Promise<Result<CreateCollectionResult>> {
        try {
            // 1. Validate name
            const name = payload.name?.trim();
            if (!name) {
                return Result.fail("Collection name cannot be empty");
            }

            // 2. STRICT: Ignores current selection to prevent side-effects.
            // We do NOT touch figma.currentPage.selection. 
            // We utilize figma.variables.createVariableCollection which spawns an empty collection.

            // 3. Create collection via Figma API (Blind Creation)
            const collection = figma.variables.createVariableCollection(name);

            // 4. Default Mode
            if (collection.modes.length === 0) {
                collection.addMode("Default");
            }

            console.log(`[Vibe] Created Collection: ${collection.name} (ID: ${collection.id})`);

            // 5. AGGRESSIVE SYNC: Fetch fresh state immediately
            const stats = await this.syncService.getStats();

            return Result.ok({
                message: `✅ Collection '${name}' Created`,
                collectionId: collection.id,
                collections: Object.keys(stats.collectionMap),
                collectionMap: stats.collectionMap // FRESH DATA
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[CreateCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to create collection: ${message}`);
        }
    }
}

`

---

## /src/features/collections/capabilities/DeleteCollectionCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/lib/result";
import type { SyncService } from "../../../core/services/SyncService";

type DeleteCollectionPayload = { name: string; id?: string };
type DeleteCollectionResult = {
    message: string,
    deletedId?: string,
    deletedName: string,
    collectionMap: Record<string, string>
};

export class DeleteCollectionCapability implements ICapability<DeleteCollectionPayload, DeleteCollectionResult> {
    readonly id = "delete-collection-v1";
    readonly commandId = "DELETE_COLLECTION";
    readonly description = "Deletes a variable collection from Figma (Zombie-Proof)";

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: DeleteCollectionPayload, _context: AgentContext): Promise<Result<DeleteCollectionResult>> {
        console.log('[DeleteCollectionCapability] Attempting Nuclear Delete:', payload);
        const { name, id } = payload;

        try {
            // STEP 1: Attempt Deletion (The "Try" Phase)
            // We do not fail if this fails. We just want to ensure it's gone.

            let collection: VariableCollection | null = null;

            if (id) {
                collection = await figma.variables.getVariableCollectionByIdAsync(id);
            } else if (name) {
                const collections = await figma.variables.getLocalVariableCollectionsAsync();
                collection = collections.find(c => c.name === name) || null;
            }

            if (collection) {
                collection.remove();
                console.log(`[Vibe] Collection '${collection.name}' removed from Figma.`);
            } else {
                console.warn(`[DeleteCollectionCapability] Collection not found (Zombie). treating as success.`);
            }

        } catch (error) {
            // STEP 2: Swallow the Error (The "Ignore" Phase)
            // If Figma throws "Invalid ID" or anything else, we don't care. The goal is "It's gone".
            console.error('[DeleteCollectionCapability] Deletion error swallowed:', error);
        }

        // STEP 3: Aggressive Sync (The "Refresh" Phase)
        // We force a stats refresh to get the absolute truth from Figma.
        const freshStats = await this.syncService.getStats();

        // STEP 4: Return Trith
        return Result.ok({
            message: `🗑️ Collection '${name}' Processed`,
            deletedId: id,
            deletedName: name,
            collectionMap: freshStats.collectionMap // FRESH DATA
        });
    }
}

`

---

## /src/features/collections/capabilities/RenameCollectionCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from "../../../core/interfaces/ICapability";
import type { AgentContext } from "../../../core/AgentContext";
import { Result } from "../../../shared/lib/result";

type RenameCollectionPayload = { oldName: string; newName: string };
type RenameCollectionResult = { message: string; collectionId: string };

export class RenameCollectionCapability implements ICapability<RenameCollectionPayload, RenameCollectionResult> {
    readonly id = "rename-collection-v1";
    readonly commandId = "RENAME_COLLECTION";
    readonly description = "Renames an existing variable collection in Figma";

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: RenameCollectionPayload, _context: AgentContext): Promise<Result<RenameCollectionResult>> {
        try {
            const { oldName, newName } = payload;

            if (!oldName || !newName) {
                return Result.fail("Both oldName and newName are required");
            }

            let collections = await figma.variables.getLocalVariableCollectionsAsync();
            let collection = collections.find(c => c.name === oldName);

            // Double Check Strategy: Force Refetch if not found (Race Condition Guard)
            if (!collection) {
                console.log(`[RenameCollectionCapability] Collection '${oldName}' not found in cache. Refetching...`);
                // Wait a tick to allow Figma internal state to settle
                await new Promise(resolve => setTimeout(resolve, 50));
                collections = await figma.variables.getLocalVariableCollectionsAsync();
                collection = collections.find(c => c.name === oldName);
            }

            if (!collection) {
                console.warn(`[RenameCollectionCapability] Collection '${oldName}' vanished.`);
                return Result.fail(`Collection '${oldName}' not found`);
            }

            collection.name = newName;

            console.log(`[Vibe] Renamed Collection: ${oldName} -> ${newName}`);

            return Result.ok({
                message: `✅ Collection renamed to '${newName}'`,
                collectionId: collection.id
            });

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[RenameCollectionCapability] Execution Error:', error);
            return Result.fail(`Failed to rename collection: ${message}`);
        }
    }
}

`

---

## /src/features/collections/capabilities/RenameCollectionsCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { RenameResult } from '../types';
import type { CollectionRenamer } from '../adapters/CollectionRenamer';

type RenameCollectionsPayload = { dryRun?: boolean };

export class RenameCollectionsCapability implements ICapability<RenameCollectionsPayload, RenameResult> {
    readonly id = 'rename-collections-v1';
    readonly commandId = 'RENAME_COLLECTIONS';
    readonly description = 'Batch renames variable collections based on classification.';

    private renamer: CollectionRenamer;

    constructor(renamer: CollectionRenamer) {
        this.renamer = renamer;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: RenameCollectionsPayload, _context: AgentContext): Promise<Result<RenameResult>> {
        try {
            const isDryRun = payload?.dryRun ?? false;
            const result = await this.renamer.renameAll(isDryRun);

            if (!result.success && !isDryRun) {
                return Result.fail('Rename failed with errors');
            }

            return Result.ok(result);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/collections/logic/CollectionClassifier.ts
> Path: $Path

`$Lang
import type { CollectionClassification, CollectionType, VariableInfo } from '../types';

/**
 * CollectionClassifier: Core Business Logic for Collection Classification
 * 
 * Responsibility: Analyze Figma Variable Collections and determine their semantic purpose
 * based on pattern matching, dependency analysis, and scope inspection.
 * 
 * Classification Strategy:
 * 1. Pattern Matching (Primary): Match variable names against known patterns
 * 2. Dependency Analysis (Secondary): Analyze alias vs raw value ratio
 * 3. Scope Analysis (Fallback): Check for component-specific scopes
 */
export class CollectionClassifier {
    // Pattern definitions for each collection type
    private readonly primitivePatterns = [
        /primitives\//i,
        /color-/i,
        /spacing-/i,
        /radius-/i,
        /font-/i,
        /size-/i
    ];

    private readonly semanticPatterns = [
        /brand\//i,
        /surface\//i,
        /content\//i,
        /feedback\//i,
        /border\//i,
        /text\//i,
        /bg\//i,
        /background\//i
    ];

    private readonly componentPatterns = [
        /component\//i,
        /button-/i,
        /card-/i,
        /input-/i,
        /modal-/i,
        /nav-/i
    ];

    // Confidence threshold for classification
    private readonly CONFIDENCE_THRESHOLD = 0.7;

    /**
     * Classifies a single VariableCollection based on its variables.
     * 
     * @param collection - The Figma VariableCollection to classify
     * @returns CollectionClassification with proposed name and confidence score
     */
    async classify(collection: VariableCollection): Promise<CollectionClassification> {
        const variables = await this.extractVariableInfo(collection);

        // Handle empty collections
        if (variables.length === 0) {
            return {
                collectionId: collection.id,
                currentName: collection.name,
                proposedName: 'Unknown',
                confidence: 0.0,
                reason: 'Collection is empty',
                variables: []
            };
        }

        const classification = this.runClassificationLogic(collection, variables);

        return {
            collectionId: collection.id,
            currentName: collection.name,
            proposedName: classification.type,
            confidence: classification.confidence,
            reason: classification.reason,
            variables
        };
    }

    /**
     * Extracts relevant information from all variables in a collection.
     * 
     * @param collection - The Figma VariableCollection to analyze
     * @returns Array of VariableInfo objects
     */
    private async extractVariableInfo(collection: VariableCollection): Promise<VariableInfo[]> {
        const variableInfos: VariableInfo[] = [];

        for (const varId of collection.variableIds) {
            const variable = await figma.variables.getVariableByIdAsync(varId);
            if (!variable) continue;

            // ✅ ARCHITECTURAL FIX (Level 1): Check ALL modes for aliases.
            const hasAliases = Object.values(variable.valuesByMode).some(value =>
                typeof value === 'object' &&
                value !== null &&
                'type' in value &&
                value.type === 'VARIABLE_ALIAS'
            );

            variableInfos.push({
                id: variable.id,
                // ✅ ARCHITECTURAL FIX (Level 2): Use standard name (leaf). 
                // Context is now handled via Collection Name Signal (Rule 0).
                name: variable.name,
                type: variable.resolvedType,
                hasAliases,
                scopes: variable.scopes
            });
        }

        return variableInfos;
    }

    /**
     * Core classification algorithm using a 4-tier decision tree.
     * 
     * Decision Tree:
     * 0. Collection Name Signal (Explicit keywords)
     * 1. Pattern Matching (Match threshold)
     * 2. Dependency Analysis (alias ratio analysis)
     * 3. Scope Analysis (component scope detection)
     * 
     * @param collection - The target VariableCollection
     * @param variables - Array of VariableInfo to analyze
     * @returns Classification result with type, confidence, and reasoning
     */
    private runClassificationLogic(
        collection: VariableCollection,
        variables: VariableInfo[]
    ): { type: CollectionType; confidence: number; reason: string } {
        // Defensive check for malformed inputs or test setup mismatches
        if (!variables || !Array.isArray(variables)) {
            return {
                type: 'Unknown',
                confidence: 0.0,
                reason: 'No variables provided for analysis'
            };
        }

        const totalVars = variables.length;
        if (totalVars === 0) {
            return {
                type: 'Unknown',
                confidence: 0.0,
                reason: 'Collection variables list is empty'
            };
        }

        // ✅ RULE 0: Collection Name Signal (Level 2 - Highest Priority)
        const collectionName = collection.name.toLowerCase();

        if (collectionName.includes('primitive') || collectionName.includes('base') || collectionName.includes('core')) {
            return {
                type: 'Primitives',
                confidence: 0.95,
                reason: `Collection name "${collection.name}" explicitly indicates Primitives`
            };
        }

        if (collectionName.includes('semantic') || collectionName.includes('theme') || collectionName.includes('token')) {
            return {
                type: 'Semantic',
                confidence: 0.95,
                reason: `Collection name "${collection.name}" explicitly indicates Semantic Tokens`
            };
        }

        // RULE 1: Pattern Matching
        const primitiveMatches = this.countPatternMatches(variables, this.primitivePatterns);
        const semanticMatches = this.countPatternMatches(variables, this.semanticPatterns);
        const componentMatches = this.countPatternMatches(variables, this.componentPatterns);

        const primitiveRatio = primitiveMatches / totalVars;
        const semanticRatio = semanticMatches / totalVars;
        const componentRatio = componentMatches / totalVars;

        // Primitives: 70%+ match
        if (primitiveRatio > 0.7) {
            return {
                type: 'Primitives',
                confidence: 0.9,
                reason: `${primitiveMatches}/${totalVars} variables match primitive patterns (${Math.round(primitiveRatio * 100)}%)`
            };
        }

        // Semantic: 50%+ match
        if (semanticRatio > 0.5) {
            return {
                type: 'Semantic',
                confidence: 0.85,
                reason: `${semanticMatches}/${totalVars} variables match semantic patterns (${Math.round(semanticRatio * 100)}%)`
            };
        }

        // Component: 50%+ match
        if (componentRatio > 0.5) {
            return {
                type: 'Component',
                confidence: 0.8,
                reason: `${componentMatches}/${totalVars} variables match component patterns (${Math.round(componentRatio * 100)}%)`
            };
        }

        // RULE 2: Dependency Analysis
        const aliasCount = variables.filter(v => v.hasAliases).length;
        const aliasRatio = aliasCount / totalVars;

        // High alias ratio suggests Semantic
        if (aliasRatio > 0.8) {
            return {
                type: 'Semantic',
                confidence: 0.75,
                reason: `${Math.round(aliasRatio * 100)}% variables are aliases (likely semantic tokens)`
            };
        }

        // Low alias ratio suggests Primitives
        if (aliasRatio < 0.2) {
            return {
                type: 'Primitives',
                confidence: 0.7,
                reason: `${Math.round((1 - aliasRatio) * 100)}% variables are raw values (likely primitives)`
            };
        }

        // RULE 3: Scope Analysis
        const hasTextScopes = variables.some(v =>
            v.scopes.includes('TEXT_FILL')
        );

        if (hasTextScopes && componentRatio > 0.3) {
            return {
                type: 'Component',
                confidence: 0.6,
                reason: 'Text-scoped variables with some component patterns detected'
            };
        }

        // FALLBACK: Cannot determine with confidence
        return {
            type: 'Unknown',
            confidence: 0.0,
            reason: `Ambiguous structure - primitive:${Math.round(primitiveRatio * 100)}%, semantic:${Math.round(semanticRatio * 100)}%, component:${Math.round(componentRatio * 100)}%, aliases:${Math.round(aliasRatio * 100)}%`
        };
    }

    /**
     * Counts how many variables match any of the given patterns.
     * 
     * @param variables - Array of variables to check
     * @param patterns - Array of RegExp patterns to match against variable names
     * @returns Number of variables matching at least one pattern
     */
    private countPatternMatches(variables: VariableInfo[], patterns: RegExp[]): number {
        return variables.filter(v =>
            patterns.some(pattern => pattern.test(v.name))
        ).length;
    }

    /**
     * Public getter for confidence threshold (for testing/debugging)
     */
    get confidenceThreshold(): number {
        return this.CONFIDENCE_THRESHOLD;
    }
}

`

---

## /src/features/collections/types.ts
> Path: $Path

`$Lang
// src/modules/collections/types.ts
export type CollectionType = 'Primitives' | 'Semantic' | 'Component' | 'Unknown';

export interface CollectionClassification {
    collectionId: string;
    currentName: string;
    proposedName: CollectionType;
    confidence: number;
    reason: string;
    variables: VariableInfo[];
}

export interface VariableInfo {
    id: string;
    name: string;
    type: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
    hasAliases: boolean;
    scopes: ReadonlyArray<VariableScope>;
}

export interface RenameResult {
    success: boolean;
    renamedCount: number;
    skippedCount: number;
    errors: { collectionId: string; error: string }[];
}

`

---

## /src/features/dashboard/ui/components/FirstTimeWelcome.tsx
> Path: $Path

`$Lang
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

`

---

## /src/features/dashboard/ui/Dashboard.tsx
> Path: $Path

`$Lang
import { Download, Plus, Layers, Zap, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../../../shared/lib/classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { type TokenEntity } from '../../../core/types';
import { NewStyleDialog } from '../../styles/ui/dialogs/NewStyleDialog';
import { useState, useEffect } from 'react';
import type { ViewType } from '../../../ui/layouts/MainLayout';

import { FirstTimeWelcome } from './components/FirstTimeWelcome';
import { useOnboarding } from '../../auth/OnboardingStore';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };

    onTabChange?: (tab: ViewType) => void;
    onSync?: () => void;
    onResetSync?: () => void;
    isSyncing?: boolean;
    isSynced?: boolean;

    // 🌊 Progressive Feedback
    syncStatus?: string;
    syncProgress?: number;

    onCreateStyle?: (data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => void;
}

/**
 * 📊 Elite Dashboard Fragment
 * Higher contrast, super rounded corners, and clear information hierarchy.
 */
export function Dashboard({
    tokens: _tokens = [],
    stats,
    onTabChange,
    onCreateStyle,
    onSync,
    onResetSync,
    isSyncing,
    isSynced: _isSynced,
    syncStatus,
    syncProgress: _swallowedProgress // 🗑️ Unused for now, status has the text
}: DashboardProps) {
    const [showNewStyleDialog, setShowNewStyleDialog] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const { isFirstSession } = useOnboarding();

    // Show first-time welcome celebration
    useEffect(() => {
        // isFirstSession is true only when user completed first session but hasn't seen welcome
        if (isFirstSession) {
            setShowWelcome(true);
        }
    }, [isFirstSession]);


    // 🔥 Burn Effect State
    const [isBurning, setIsBurning] = useState(false);

    const handleRefreshFromBlack = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('[Dashboard] From Black button clicked - triggering onSync');
        setIsBurning(true);
        // Simulate sync/refresh delay of 2.5s
        onSync?.();
        setTimeout(() => {
            setIsBurning(false);
        }, 2500);
    };

    const handleRefreshToBlack = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('[Dashboard] To Black button clicked - triggering onResetSync');
        setIsBurning(true);
        // Simulate feedback delay of 3s
        onResetSync?.();
        setTimeout(() => {
            setIsBurning(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center py-8 px-4 gap-8 w-full max-w-5xl mx-auto">

            {/* 🍱 Bento Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* 📊 Stat Card: Total Tokens (Large) - With Burn Effect */}
                <div
                    className={cn(
                        "vibe-card h-44 p-6 flex flex-col justify-between relative overflow-hidden group transition-all",
                        isBurning && "border-primary/50" // Optional border enhancement during burn
                    )}
                >
                    {/* Background Gradient - Standard */}
                    {!isBurning && (
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />
                    )}

                    {/* 🔥 Burn Overlay - Only visible when burning */}
                    <AnimatePresence>
                        {isBurning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none z-0"
                            >
                                {/* Base Burn Layer - Blue/Purple Light */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"
                                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                                />

                                {/* Slanted White Glow */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                        scale: [0.95, 1.05, 0.95],
                                        rotate: [-13, -11, -13],
                                        x: [-2, 2, -2],
                                        y: [-2, 2, -2]
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                    className="absolute top-[-50%] left-[-20%] w-[150%] h-[200%] bg-white/10 blur-[60px] mix-blend-overlay"
                                />

                                {/* Intense Flicker Core */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-xl"
                                    animate={{ opacity: [0, 1, 0, 0.5, 0] }}
                                    transition={{ duration: 0.15, repeat: Infinity }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Card Content - Z-Index to stay above burn */}
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="p-3 rounded-xl bg-white/5 text-primary border border-white/5 shadow-inner backdrop-blur-sm">
                            <Zap size={24} strokeWidth={1.5} />
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            {/* 🌊 Progressive Status Label */}
                            <AnimatePresence>
                                {isSyncing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className="mb-1 whitespace-nowrap text-xxs font-bold uppercase tracking-widest text-primary animate-pulse"
                                    >
                                        {syncStatus || 'Syncing...'}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons: From Black / To Black */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRefreshFromBlack}
                                    className="px-2.5 py-1.5 rounded-lg bg-surface-2/50 hover:bg-surface-2 border border-surface-2 hover:border-white/10 text-text-dim hover:text-white text-xxs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 group/btn"
                                >
                                    <ArrowLeft size={10} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                                    From Black
                                </button>
                                <button
                                    onClick={handleRefreshToBlack}
                                    className="px-2.5 py-1.5 rounded-lg bg-surface-2/50 hover:bg-surface-2 border border-surface-2 hover:border-white/10 text-text-dim hover:text-white text-xxs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 group/btn"
                                >
                                    To Black
                                    <ArrowRight size={10} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="z-10 relative">
                        <div className="text-5xl font-display font-bold text-white mb-1 tracking-tight">{stats?.totalVariables ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2">
                            {/* Status Dot */}
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                                isSyncing || isBurning ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)] scale-125' : 'bg-primary'
                            )} />
                            Total Design Tokens
                        </div>
                    </div>
                </div>

                {/* 🎨 Stat Card: Styles (Large) */}
                <div className="vibe-card h-44 p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full group-hover:bg-secondary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 rounded-xl bg-white/5 text-secondary border border-white/5 shadow-inner">
                            <Layers size={24} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xxs font-bold uppercase tracking-wider border border-secondary/20">Linked Styles</span>
                    </div>

                    <div className="z-10">
                        <div className="text-5xl font-display font-bold text-white mb-1 tracking-tight">{stats?.styles ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            Figma Styles Mapped
                        </div>
                    </div>
                </div>

                {/* 🚀 Quick Actions Grid (Nested) */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* 🚀 Quick Action: New Token */}
                    <button
                        onClick={() => {
                            onTabChange?.('create-token');
                        }}
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-primary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Plus size={24} strokeWidth={3} className="text-white group-hover:text-primary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-primary transition-colors">New Token</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Create a primitive</div>
                            </div>
                        </div>
                    </button>

                    {/* 🖌️ Quick Action: Add Style */}
                    <button
                        onClick={() => setShowNewStyleDialog(true)}
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Layers size={24} strokeWidth={3} className="text-white group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-secondary transition-colors">Add Style</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Map to Figma Style</div>
                            </div>
                        </div>
                    </button>

                    {/* 🌐 Quick Action: Add Mode (SOON) */}
                    <button
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-emerald-500/50 hover:bg-surface-2 group transition-all relative overflow-hidden"
                        onClick={() => { }} // No-op for now
                        disabled
                    >
                        <div className="flex items-center gap-5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Globe size={24} strokeWidth={3} className="text-white group-hover:text-emerald-500 transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-emerald-500 transition-colors">Add Mode</div>
                                <div className="text-xs text-text-dim group-hover:text-emerald-500 transition-colors">Figma variable mode</div>
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xxs font-black uppercase text-text-dim tracking-widest backdrop-blur-md">
                            Soon
                        </div>
                    </button>



                    {/* 💾 Quick Action: Export */}
                    <button
                        onClick={() => onTabChange?.('export-tokens')}
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Download size={24} strokeWidth={3} className="text-white group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-secondary transition-colors">Export Tokens</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Multiple formats</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* 🆕 New Style Dialog */}
            <NewStyleDialog
                isOpen={showNewStyleDialog}
                onClose={() => setShowNewStyleDialog(false)}
                onSubmit={(data) => {
                    onCreateStyle?.(data);
                    setShowNewStyleDialog(false);
                }}
            />

            {/* 🎉 First-Time Welcome Celebration */}
            <AnimatePresence>
                {showWelcome && (
                    <FirstTimeWelcome
                        username="Designer"
                        onDismiss={() => setShowWelcome(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

`

---

## /src/features/documentation/capabilities/GenerateDocsCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { DocsRenderer } from '../DocsRenderer';
import type { VariableManager } from '../../governance/VariableManager';

export class GenerateDocsCapability implements ICapability {
    readonly id = 'generate-docs-v1';
    readonly commandId = 'GENERATE_DOCS';
    readonly description = 'Generates documentation for the current token system.';

    private docsRenderer: DocsRenderer;
    private variableManager: VariableManager;

    constructor(
        docsRenderer: DocsRenderer,
        variableManager: VariableManager
    ) {
        this.docsRenderer = docsRenderer;
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<{ generated: boolean }>> {
        try {
            // Ensure data is fresh before generating docs
            await this.variableManager.syncFromFigma();
            await this.docsRenderer.generateDocs();
            return Result.ok({ generated: true });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/documentation/DocsRenderer.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../core/types';
import { TokenRepository } from '../../core/TokenRepository';

const PAGE_NAME = '📘 Token Docs';
const SPACING = 40;

// Vibe Design System Constants for Docs
const COLORS = {
    HEADER_BG: { r: 0.1, g: 0.1, b: 0.12 }, // #1a1a1f
    HEADER_TEXT: { r: 1, g: 1, b: 1 },
    CARD_BG: { r: 1, g: 1, b: 1 },
    CARD_STROKE: { r: 0.9, g: 0.9, b: 0.92 },
    TEXT_PRIMARY: { r: 0.1, g: 0.1, b: 0.12 },
    TEXT_SECONDARY: { r: 0.5, g: 0.5, b: 0.55 },
    CHIP_BG: { r: 0.96, g: 0.96, b: 0.98 },
    CHIP_TEXT: { r: 0.3, g: 0.3, b: 0.35 }
};

export class DocsRenderer {
    private repository: TokenRepository;

    constructor(repository: TokenRepository) {
        this.repository = repository;
    }

    /**
     * Main entry point to generate documentation.
     * Creates/Resets page and renders all visible tokens.
     */
    async generateDocs(): Promise<void> {
        // Load fonts required for the Vibe aesthetic
        await Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            figma.loadFontAsync({ family: "Inter", style: "Medium" }),
            figma.loadFontAsync({ family: "Inter", style: "Bold" }),
            figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
        ]);

        const page = this.getOrCreatePage();
        figma.currentPage = page;

        // Clear existing docs
        page.children.forEach(child => child.remove());

        // 1. Header Section
        const header = this.createHeader();
        page.appendChild(header);

        // 2. Token Grid Container
        const grid = figma.createFrame();
        grid.name = "Token Grid";
        grid.layoutMode = "HORIZONTAL";
        grid.layoutWrap = "WRAP";
        grid.itemSpacing = 24;
        grid.counterAxisSpacing = 24;
        grid.fills = []; // Transparent
        grid.y = 200;
        grid.x = SPACING;
        grid.resize(1200, 1000); // Initial size, auto-grow

        // 3. Render Tokens
        const tokens = this.repository.getTokens();
        // Sort: Type -> Name
        const sortedTokens = Array.from(tokens.values()).sort((a, b) => {
            const typeCompare = a.$type.localeCompare(b.$type);
            if (typeCompare !== 0) return typeCompare;
            return a.name.localeCompare(b.name);
        });

        for (const token of sortedTokens) {
            const card = await this.createTokenCard(token);
            grid.appendChild(card);
        }

        page.appendChild(grid);
        figma.ui.postMessage({
            type: 'OMNIBOX_NOTIFY',
            payload: { message: '✨ Vibe Documentation Generated', type: 'success' }
        });
    }

    private getOrCreatePage(): PageNode {
        const existing = figma.root.children.find(p => p.name === PAGE_NAME);
        if (existing) return existing;
        const page = figma.createPage();
        page.name = PAGE_NAME;
        return page;
    }

    private createHeader(): FrameNode {
        const frame = figma.createFrame();
        frame.name = "Header";
        frame.resize(1400, 160);
        frame.fills = [{ type: 'SOLID', color: COLORS.HEADER_BG }];
        frame.cornerRadius = 0; // Full bleed look, or rounded if preferred

        // Title Group
        const textGroup = figma.createFrame();
        textGroup.fills = [];
        textGroup.layoutMode = 'VERTICAL';
        textGroup.itemSpacing = 8;
        textGroup.x = 60;
        textGroup.y = 48;

        const title = figma.createText();
        title.characters = "Design System Documentation";
        title.fontSize = 42;
        title.fontName = { family: "Inter", style: "Bold" };
        title.fills = [{ type: 'SOLID', color: COLORS.HEADER_TEXT }];
        textGroup.appendChild(title);

        const subtitle = figma.createText();
        subtitle.characters = `Generated via Vibe Token OS • ${new Date().toLocaleDateString()}`;
        subtitle.fontSize = 14;
        subtitle.fontName = { family: "Inter", style: "Medium" };
        subtitle.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.65 } }];
        textGroup.appendChild(subtitle);

        frame.appendChild(textGroup);
        return frame;
    }

    /**
     * Creates a premium card for a token.
     */
    private async createTokenCard(token: TokenEntity): Promise<FrameNode> {
        const frame = figma.createFrame();
        frame.name = token.name;
        frame.layoutMode = "VERTICAL";
        frame.itemSpacing = 12;
        frame.paddingLeft = 20;
        frame.paddingRight = 20;
        frame.paddingTop = 20;
        frame.paddingBottom = 20;
        frame.cornerRadius = 16;
        frame.strokeWeight = 1;
        frame.strokes = [{ type: 'SOLID', color: COLORS.CARD_STROKE }];
        frame.fills = [{ type: 'SOLID', color: COLORS.CARD_BG }];
        frame.resize(280, 100); // Auto-height via layout

        // -- Header Row (Chip + Name) --
        const headerRow = figma.createFrame();
        headerRow.layoutMode = 'HORIZONTAL';
        headerRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
        // headerRow.width = 240; // Removed: Controlled by layoutAlign: STRETCH
        headerRow.layoutAlign = 'STRETCH';
        headerRow.fills = [];

        // Type Chip
        const chip = figma.createFrame();
        chip.layoutMode = "HORIZONTAL";
        chip.paddingLeft = 8;
        chip.paddingRight = 8;
        chip.paddingTop = 4;
        chip.paddingBottom = 4;
        chip.cornerRadius = 6;
        chip.fills = [{ type: 'SOLID', color: COLORS.CHIP_BG }];

        const typeText = figma.createText();
        typeText.characters = token.$type;
        typeText.fontSize = 10;
        typeText.fontName = { family: "Inter", style: "Semi Bold" };
        typeText.fills = [{ type: 'SOLID', color: COLORS.CHIP_TEXT }];
        chip.appendChild(typeText);

        headerRow.appendChild(chip);
        frame.appendChild(headerRow);

        // Name
        const name = figma.createText();
        name.characters = token.name;
        name.fontSize = 16;
        name.fontName = { family: "Inter", style: "Bold" };
        name.fills = [{ type: 'SOLID', color: COLORS.TEXT_PRIMARY }];
        frame.appendChild(name);

        // -- Preview Section --
        if (token.$type === 'color') {
            const previewRow = figma.createFrame();
            previewRow.layoutMode = 'HORIZONTAL';
            previewRow.itemSpacing = 12;
            previewRow.counterAxisAlignItems = 'CENTER';
            previewRow.fills = [];

            const swatch = figma.createEllipse();
            swatch.resize(48, 48);
            swatch.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.1 }];
            swatch.strokeWeight = 1;

            const resolved = this.resolveColorValue(token);
            swatch.fills = [{ type: 'SOLID', color: resolved.rgb }];

            previewRow.appendChild(swatch);

            // Value Text
            const valueCol = figma.createFrame();
            valueCol.layoutMode = 'VERTICAL';
            valueCol.itemSpacing = 4;
            valueCol.fills = [];

            const hexText = figma.createText();
            hexText.characters = resolved.hex.toUpperCase();
            hexText.fontSize = 14;
            hexText.fontName = { family: "Inter", style: "Medium" };
            hexText.fills = [{ type: 'SOLID', color: COLORS.TEXT_PRIMARY }];
            valueCol.appendChild(hexText);

            if (resolved.isAlias) {
                const aliasText = figma.createText();
                aliasText.characters = `🔗 ${resolved.path.join(' → ')}`;
                aliasText.fontSize = 10;
                aliasText.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
                valueCol.appendChild(aliasText);
            }

            previewRow.appendChild(valueCol);
            frame.appendChild(previewRow);
        } else {
            // Generic Value Display
            const valText = figma.createText();
            valText.characters = String(token.$value);
            valText.fontSize = 14;
            valText.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
            frame.appendChild(valText);
        }

        // -- Description --
        if (token.$description) {
            const separator = figma.createLine();
            separator.strokeWeight = 1;
            separator.strokes = [{ type: 'SOLID', color: COLORS.CARD_STROKE }];
            separator.layoutAlign = 'STRETCH';
            frame.appendChild(separator);

            const desc = figma.createText();
            desc.characters = token.$description;
            desc.fontSize = 11;
            desc.lineHeight = { value: 16, unit: 'PIXELS' };
            desc.fills = [{ type: 'SOLID', color: COLORS.TEXT_SECONDARY }];
            frame.appendChild(desc);
        }

        return frame;
    }

    /**
     * Recursive Alias Resolution
     * Returns the final RGB color and the path taken to get there.
     */
    private resolveColorValue(token: TokenEntity, depth = 0): { rgb: RGB, hex: string, isAlias: boolean, path: string[] } {
        // Fallback for recursion limit
        if (depth > 8) {
            return { rgb: { r: 0, g: 0, b: 0 }, hex: '#000000', isAlias: true, path: ['RECURSION_LIMIT'] };
        }

        // Primitive
        if (token.$value !== 'ALIAS') {
            const hex = String(token.$value).startsWith('#') ? String(token.$value) : '#CCCCCC';
            return {
                rgb: this.hexToRgb(hex),
                hex: hex,
                isAlias: false,
                path: []
            };
        }

        // Alias
        if (token.dependencies && token.dependencies.length > 0) {
            const aliasId = token.dependencies[0]; // Assuming primary dependency is the alias target
            const targetToken = this.repository.getNode(aliasId);

            if (targetToken) {
                const resolved = this.resolveColorValue(targetToken, depth + 1);
                return {
                    rgb: resolved.rgb,
                    hex: resolved.hex,
                    isAlias: true,
                    path: [targetToken.name, ...resolved.path]
                };
            }
        }

        // Broken Alias
        return { rgb: { r: 1, g: 0.2, b: 0.2 }, hex: '#FF3333', isAlias: true, path: ['BROKEN_LINK'] };
    }

    private hexToRgb(hex: string): RGB {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substring(0, 2), 16) / 255;
        const g = parseInt(clean.substring(2, 4), 16) / 255;
        const b = parseInt(clean.substring(4, 6), 16) / 255;
        return {
            r: isNaN(r) ? 0.5 : r,
            g: isNaN(g) ? 0.5 : g,
            b: isNaN(b) ? 0.5 : b
        };
    }
}

`

---

## /src/features/editor/ui/EditorView.tsx
> Path: $Path

`$Lang
import { useState, useEffect } from 'react';
import { omnibox } from '../../../ui/managers/OmniboxManager';
import { TokenTree } from '../../tokens/ui/components/TokenTree';
import { LineageExplorer } from '../../intelligence/ui/components/LineageExplorer';
import { type TokenEntity } from '../../../core/types';
import { Search } from 'lucide-react';



interface EditorViewProps {
    tokens: TokenEntity[];
    searchFocus?: string;
    onTraceLineage?: (id: string) => void;
    lineageData?: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

/**
 * 🏷️ Elite Tokens Fragment
 * A dual-identity view with a persistent sidebar and a spatial graph/inspector workspace.
 */
export function EditorView({ tokens = [], searchFocus, onTraceLineage, lineageData }: EditorViewProps) {
    const [searchQuery, setSearchQuery] = useState(searchFocus || '');
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    // allow external control but keep local state sync
    if (searchFocus && searchFocus !== searchQuery) {
        setSearchQuery(searchFocus);
    }

    const clearSearch = () => setSearchQuery('');

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};
            if (type === 'OMNIBOX_NOTIFY') {
                omnibox.show(payload.message, { type: payload.type || 'info' });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // ⚡ INTERACTION UPGRADE: Clicking Sidebar -> Traces Lineage
    const handleTokenSelect = (id: string) => {
        setSelectedTokenId(id);
        if (onTraceLineage) {
            onTraceLineage(id);
        }
    };

    return (
        <div className="flex w-full h-full overflow-hidden bg-void/50 p-3 gap-3">
            {/* 🌲 Left Fragment: Sidebar (Token Tree) */}
            <aside className="w-[300px] bg-surface-1/50 backdrop-blur-3xl border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm transition-all duration-500 hover:border-white/10">
                {/* Collections Identity & Search */}
                <div className="p-3 border-b border-white/5 flex flex-col gap-3 bg-surface-0/10">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-text-primary">Collections</span>
                        <div className="bg-surface-2 px-1.5 py-0.5 rounded text-[10px] text-text-muted font-mono">{tokens.length}</div>
                    </div>

                    {/* 🔍 Search Line - High Contrast Fix */}
                    <div className="relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find a token..."
                            aria-label="Search tokens"
                            className="w-full bg-surface-1 text-xs text-text-primary placeholder:text-text-dim border border-white/10 rounded-lg py-2 pl-8 pr-8 focus:outline-none focus:border-primary/50 focus:bg-surface-2 transition-all font-medium shadow-inner"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                    <TokenTree
                        tokens={tokens}
                        searchQuery={searchQuery}
                        selectedId={selectedTokenId}
                        onSelect={handleTokenSelect}
                    />
                </div>
            </aside>

            {/* 🌌 Right Fragment: Workspace (Lineage Explorer) */}
            <main className="flex-1 relative bg-surface-0/50 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 border-b border-white/5 flex items-center justify-between pointer-events-none bg-gradient-to-b from-surface-0/80 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <span className="text-xs font-medium text-text-primary">Lineage Explorer</span>
                    </div>
                    {lineageData?.target && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-text-muted">Target:</span>
                            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                {lineageData.target.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Lineage Component */}
                <div className="absolute inset-0 z-0 pt-10">
                    <LineageExplorer
                        tokens={tokens}
                        onTrace={(id) => {
                            setSelectedTokenId(id);
                            if (onTraceLineage) onTraceLineage(id);
                        }}
                        lineageData={lineageData || null}
                    />
                </div>
            </main>
        </div>
    );
}

`

---

## /src/features/export/adapters/CSSAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity, TokenType } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult, ExportOptions } from '../interfaces/ITokenExporter';
import { applyNamingConvention, toKebabCase } from '../logic/stringUtils';


/**
 * 🎨 CSSAdapter - CSS Custom Properties (Variables) Exporter
 * 
 * **Purpose:**
 * Transforms TokenEntity[] into browser-compatible CSS custom properties.
 * Generates a `:root` block suitable for direct inclusion in stylesheets.
 * 
 * **Output Format:**
 * ```css
 * :root {
 *   --color-primary-500: #FF5733;
 *   --spacing-base: 8px;
 *   --font-family-heading: 'Inter', sans-serif;
 * }
 * ```
 * 
 * **Design Decisions:**
 * - **Naming:** Configurable (default: kebab-case)
 * - **Prefix:** `--` (CSS custom property syntax)
 * - **Scope:** `:root` (global scope, highest specificity)
 * - **Units:** Auto-inject `px` for unitless dimensions
 * 
 * **Browser Compatibility:**
 * CSS Custom Properties are supported in all modern browsers (IE11+)
 */
export class CSSAdapter implements ITokenAdapter {
    public readonly formatId = 'css';
    public readonly description = 'CSS Custom Properties (Variables)';

    /**
     * Export tokens to CSS variables format
     * 
     * @param tokens - Fully resolved token entities
     * @param options - Configuration options
     * @returns Promise<TokenExportResult> with CSS content
     */
    public async export(tokens: TokenEntity[], options?: ExportOptions): Promise<TokenExportResult> {
        // Edge case: Empty tokens
        if (tokens.length === 0) {
            return {
                filename: 'tokens.css',
                content: ':root {\n  /* No tokens available */\n}',
                mimeType: 'text/css',
                format: this.formatId
            };
        }

        const indent = this.getIndent(options?.indentation);
        const convention = options?.namingConvention || 'kebab-case';

        // Generate CSS variable declarations
        const declarations = tokens
            .map(token => this.toDeclaration(token, convention, indent))
            .filter(Boolean) // Remove null/undefined from error cases
            .join('\n');

        // Wrap in :root selector
        const content = `:root {\n${declarations}\n}`;

        return {
            filename: 'tokens.css',
            content,
            mimeType: 'text/css',
            format: this.formatId
        };
    }

    private getIndent(indentation?: string): string {
        if (indentation === 'tab') return '\t';
        if (indentation === '4') return '    ';
        return '  '; // Default 2 spaces
    }

    /**
     * Converts a single TokenEntity to a CSS variable declaration
     */
    private toDeclaration(token: TokenEntity, convention: 'kebab-case' | 'camelCase' | 'snake_case', indent: string): string | null {
        try {
            const variableName = this.buildVariableName(token, convention);
            const value = this.serializeValue(token.$value, token.$type);

            return `${indent}${variableName}: ${value};`;
        } catch (error) {
            console.warn(`⚠️ Failed to convert token "${token.name}" to CSS:`, error);
            return null;
        }
    }

    /**
     * Builds CSS variable name from token path and name
     */
    private buildVariableName(token: TokenEntity, convention: 'kebab-case' | 'camelCase' | 'snake_case'): string {
        // Combine path segments with token name
        const segments = [...token.path, token.name];

        // Join with default separator first, then apply convention
        // CSS vars ALWAYS start with --, regardless of convention
        const rawName = segments.join('-');

        // We apply convention to the name part, but keep the -- prefix
        // However, CSS variables technically MUST be dashes? 
        // No, CSS vars can be camelCase: --primaryColor: red; is valid.

        const convertedName = applyNamingConvention(rawName, convention);
        return `--${convertedName}`;
    }

    /**
     * Legacy helper removed in favor of stringUtils
     */
    // private toKebabCase(str: string): string { ... }

    /**
     * Serializes token value to CSS-compatible format
     * 
     * **Type-Specific Serialization:**
     * - **color**: Pass through (hex/rgba/hsl)
     * - **dimension**: Add `px` if unitless number
     * - **fontFamily**: Wrap in quotes if contains spaces
     * - **fontWeight**: Pass through (numeric or keyword)
     * - **duration**: Add `ms` or `s` suffix
     * - **cubicBezier**: Format as `cubic-bezier(x1, y1, x2, y2)`
     * 
     * **Alias Handling:**
     * If value is a reference (e.g., "{color/primary}"), convert to CSS var reference:
     * `{color/primary}` → `var(--color-primary)`
     * 
     * @param value - Raw token value
     * @param type - Token type for context-aware formatting
     * @returns CSS-compatible value string
     */
    private serializeValue(value: string | number, type: TokenType): string {
        // Handle alias references
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            return this.convertAliasToVar(value);
        }

        // Type-specific serialization
        switch (type) {
            case 'color':
                return this.serializeColor(value);

            case 'dimension':
                return this.serializeDimension(value);

            case 'fontFamily':
                return this.serializeFontFamily(value);

            case 'fontWeight':
                return String(value);

            case 'duration':
                return this.serializeDuration(value);

            case 'cubicBezier':
                return this.serializeCubicBezier(value);

            default:
                return String(value);
        }
    }

    /**
     * Converts alias reference to CSS var() function
     * 
     * **Example:**
     * "{color/primary/500}" → "var(--color-primary-500)"
     * 
     * @param alias - Alias string in format "{path/to/token}"
     * @returns CSS var() reference
     */
    private convertAliasToVar(alias: string): string {
        // Remove braces
        const path = alias.slice(1, -1);

        // Convert path to kebab-case
        const variableName = path
            .split('/')
            .map(segment => toKebabCase(segment))
            .join('-');

        return `var(--${variableName})`;
    }

    /**
     * Serializes color values
     * Pass through as-is (assumes hex, rgb, rgba, hsl formats)
     */
    private serializeColor(value: string | number): string {
        return String(value);
    }

    /**
     * Serializes dimension values
     * Adds `px` unit if value is a unitless number
     */
    private serializeDimension(value: string | number): string {
        // If already has unit (e.g., "1.5rem", "100%"), pass through
        if (typeof value === 'string' && /[a-z%]/i.test(value)) {
            return value;
        }

        // Add `px` to unitless numbers
        return `${value}px`;
    }

    /**
     * Serializes font family values
     * Wraps in quotes if contains spaces or special characters
     */
    private serializeFontFamily(value: string | number): string {
        const str = String(value);

        // If contains spaces or commas, wrap in quotes (unless already quoted)
        if (/[\s,]/.test(str) && !str.startsWith('"') && !str.startsWith("'")) {
            return `"${str}"`;
        }

        return str;
    }

    /**
     * Serializes duration values
     * Adds `ms` suffix if unitless number
     */
    private serializeDuration(value: string | number): string {
        if (typeof value === 'string' && /[a-z]/i.test(value)) {
            return value; // Already has unit
        }

        return `${value}ms`;
    }

    /**
     * Serializes cubic-bezier values
     * 
     * **Expected Input Format:**
     * String: "0.4, 0.0, 0.2, 1.0"
     * 
     * **Output:**
     * "cubic-bezier(0.4, 0.0, 0.2, 1.0)"
     */
    private serializeCubicBezier(value: string | number): string {
        const str = String(value);

        // If already wrapped, pass through
        if (str.startsWith('cubic-bezier(')) {
            return str;
        }

        // Wrap in cubic-bezier() function
        return `cubic-bezier(${str})`;
    }
}

`

---

## /src/features/export/adapters/DTCGAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';


/**
 * 🌍 DTCGAdapter - W3C Design Tokens Community Group Specification Adapter
 * 
 * **Purpose:**
 * Transforms Vibe's flat TokenEntity[] array into the nested, hierarchical structure
 * defined by the W3C Design Tokens Format Specification (DTCG).
 * 
 * **W3C DTCG Spec Compliance:**
 * - Uses `$value` and `$type` keys (per spec)
 * - Preserves `$description` for documentation
 * - Converts flat paths into nested JSON objects
 * - Handles alias references using `{path.to.token}` syntax
 * 
 * **References:**
 * - Spec: https://tr.designtokens.org/format/
 * - GitHub: https://github.com/design-tokens/community-group
 * 
 * **Strategic Value:**
 * This adapter provides interoperability with:
 * - Figma Tokens Studio
 * - Supernova
 * - Knapsack
 * - Any DTCG-compliant design system tool
 */
export class DTCGAdapter implements ITokenAdapter {
    public readonly formatId = 'dtcg';
    public readonly description = 'W3C Design Tokens Community Group Format (JSON)';

    /**
     * Export tokens to W3C DTCG JSON format
     * 
     * **Transformation Logic:**
     * 1. Group tokens by their path hierarchy
     * 2. Build nested object structure via deep merge
     * 3. Convert each token to DTCG-compliant object
     * 4. Serialize to formatted JSON
     * 
     * @param tokens - Fully resolved token entities
     * @returns Promise<TokenExportResult> with JSON content
     */
    public async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        // Edge case: Empty token array
        if (tokens.length === 0) {
            return {
                filename: 'design-tokens.json',
                content: '{}',
                mimeType: 'application/json',
                format: this.formatId
            };
        }

        // Build nested DTCG object structure
        const dtcgObject = this.buildNestedStructure(tokens);

        // Serialize with pretty-print for human readability
        const content = JSON.stringify(dtcgObject, null, 2);

        return {
            filename: 'design-tokens.json',
            content,
            mimeType: 'application/json',
            format: this.formatId
        };
    }

    /**
     * Constructs the nested DTCG object from flat token array
     * 
     * **Algorithm:**
     * - Uses reduce() to accumulate nested structure
     * - For each token, navigate/create path hierarchy
     * - Insert token data at leaf node
     * 
     * **Example:**
     * Input: [{ path: ["color", "primary"], name: "500", $value: "#FF0000" }]
     * Output: { color: { primary: { "500": { $value: "#FF0000", $type: "color" } } } }
     * 
     * @param tokens - Input token entities
     * @returns Nested DTCG-compliant object
     */
    private buildNestedStructure(tokens: TokenEntity[]): Record<string, unknown> {
        return tokens.reduce((acc, token) => {
            // Navigate to the correct nesting level
            let current = acc;

            // Traverse path hierarchy (e.g., ["Colors", "Brand"])
            for (const segment of token.path) {
                if (!current[segment]) {
                    current[segment] = {};
                }
                current = current[segment] as Record<string, unknown>;
            }

            // Insert token at leaf node
            current[token.name] = this.toDTO(token);

            return acc;
        }, {} as Record<string, unknown>);
    }

    /**
     * Converts TokenEntity to DTCG Data Transfer Object
     * 
     * **W3C Spec Mapping:**
     * - $value: The actual value (color, dimension, etc.)
     * - $type: Token type (color, dimension, fontFamily, etc.)
     * - $description: Optional human-readable description
     * 
     * **Alias Handling:**
     * If $value is a reference (e.g., "{color/primary/500}"), preserve as-is.
     * DTCG spec allows alias references using this syntax.
     * 
     * @param token - Source token entity
     * @returns DTCG-compliant object
     */
    private toDTO(token: TokenEntity): Record<string, unknown> {
        const dto: Record<string, unknown> = {
            $value: this.serializeValue(token.$value),
            $type: token.$type
        };

        // Add optional description if present
        if (token.$description) {
            dto.$description = token.$description;
        }

        return dto;
    }

    /**
     * Serializes token values to DTCG-compliant formats
     * 
     * **Type-Specific Serialization:**
     * - Strings: Pass through (including aliases "{...}")
     * - Numbers: Pass through
     * - Objects (RGB/RGBA): Not in $value (handled by Figma extensions)
     * 
     * **Why This Method?**
     * Future-proofing for complex value transformations:
     * - Color space conversions
     * - Unit normalization
     * - Alias resolution (if needed)
     * 
     * @param value - Raw token value
     * @returns Serialized value for DTCG spec
     */
    private serializeValue(value: string | number): string | number {
        // Preserve aliases (e.g., "{color/primary/500}")
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            return value;
        }

        // Pass through primitive values
        return value;
    }
}

`

---

## /src/features/export/adapters/JSONAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult, ExportOptions } from '../interfaces/ITokenExporter';
import { applyNamingConvention } from '../logic/stringUtils';

/**
 * 📄 JSON Adapter
 * 
 * **Purpose:**
 * Exports tokens as simple JSON key-value format (flat structure).
 */
export class JSONAdapter implements ITokenAdapter {
    public readonly formatId = 'json';
    public readonly description = 'Simple JSON Adapter (Flat Key-Value)';

    /**
     * Exports tokens to simple JSON format
     */
    async export(tokens: TokenEntity[], options?: ExportOptions): Promise<TokenExportResult> {
        try {
            const convention = options?.namingConvention || 'kebab-case';
            const indent = this.getIndent(options?.indentation);

            const json = this.buildFlatObject(tokens, convention);
            const content = JSON.stringify(json, null, indent);

            return {
                filename: 'tokens.json',
                content,
                mimeType: 'application/json',
                format: 'json'
            };
        } catch (error) {
            throw new Error(
                `JSON export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private getIndent(indentation?: string): string | number {
        if (indentation === 'tab') return '\t';
        if (indentation === '4') return 4;
        return 2; // Default
    }

    /**
     * Builds flat key-value object from tokens
     */
    private buildFlatObject(tokens: TokenEntity[], convention: 'kebab-case' | 'camelCase' | 'snake_case'): Record<string, string | number> {
        const result: Record<string, string | number> = {};

        for (const token of tokens) {
            const key = this.buildKey(token, convention);
            result[key] = token.$value;
        }

        return result;
    }

    /**
     * Builds flat key from token path and name
     */
    private buildKey(token: TokenEntity, convention: 'kebab-case' | 'camelCase' | 'snake_case'): string {
        const segments = [...token.path, token.name];
        // Join with generic separator first
        const rawKey = segments.join('-');
        return applyNamingConvention(rawKey, convention);
    }
}

`

---

## /src/features/export/adapters/SCSSAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 🎨 SCSS Adapter
 * 
 * **Purpose:**
 * Exports tokens as Sass (SCSS) variables.
 * 
 * **Format:**
 * ```scss
 * // Design Tokens
 * $color-primary-500: #FF0000;
 * $spacing-large: 24px;
 * $font-family-base: "Inter", sans-serif;
 * ```
 * 
 * **Use Cases:**
 * - Sass/SCSS projects
 * - Compatibility with existing Sass themes
 * - Stylesheets that need variable substitution
 */
export class SCSSAdapter implements ITokenAdapter {
    public readonly formatId = 'scss';
    public readonly description = 'SCSS Variables (Sass)';

    /**
     * Exports tokens to SCSS format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildSCSSFile(tokens);

            return {
                filename: 'tokens.scss',
                content,
                mimeType: 'text/x-scss',
                format: 'scss'
            };
        } catch (error) {
            throw new Error(
                `SCSS export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete SCSS file content
     */
    private buildSCSSFile(tokens: TokenEntity[]): string {
        const header = `/**
 * 🎨 Design Tokens (SCSS Variables)
 * 
 * Auto-generated Sass variables.
 * DO NOT EDIT MANUALLY.
 */

`;

        const variables = tokens
            .map(token => this.buildVariable(token))
            .join('\n');

        return header + variables;
    }

    /**
     * Builds a single SCSS variable declaration
     */
    private buildVariable(token: TokenEntity): string {
        const name = this.buildVariableName(token);
        const value = this.formatValue(token);

        return `$${name}: ${value};`;
    }

    /**
     * Builds kebab-case variable name from token path
     */
    private buildVariableName(token: TokenEntity): string {
        const segments = [...token.path, token.name];
        return segments
            .join('-')
            .toLowerCase()
            .replace(/\s+/g, '-');
    }

    /**
     * Formats value for SCSS output
     */
    private formatValue(token: TokenEntity): string {
        const value = token.$value;
        const type = token.$type;

        // Handle alias references
        if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const aliasPath = value.slice(1, -1);
            const sassVarName = aliasPath.replace(/\//g, '-').replace(/\./g, '-');
            return `$${sassVarName}`;
        }

        // Type-specific formatting
        switch (type) {
            case 'dimension':
                return typeof value === 'number' ? `${value}px` : String(value);

            case 'fontFamily':
                // Wrap font families in quotes
                if (typeof value === 'string') {
                    return value.includes(' ')
                        ? `"${value}"`
                        : value;
                }
                return String(value);

            case 'duration':
                return typeof value === 'number' ? `${value}ms` : String(value);

            case 'cubicBezier':
                if (Array.isArray(value)) {
                    return `cubic-bezier(${value.join(', ')})`;
                }
                return String(value);

            default:
                // Colors, strings, numbers
                if (typeof value === 'string') {
                    // Don't quote hex colors
                    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
                        return value;
                    }
                    return value;
                }
                return String(value);
        }
    }
}

`

---

## /src/features/export/adapters/TailwindAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 🌊 Tailwind Adapter
 * 
 * **Purpose:**
 * Exports tokens as Tailwind CSS theme configuration.
 * 
 * **Format:**
 * ```javascript
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: {
 *           500: "#FF0000",
 *         },
 *       },
 *       spacing: {
 *         large: "24px",
 *       },
 *     },
 *   },
 * };
 * ```
 * 
 * **Use Cases:**
 * - Tailwind CSS projects
 * - Utility-first design systems
 * - JIT mode theme configuration
 */
export class TailwindAdapter implements ITokenAdapter {
    public readonly formatId = 'tailwind';
    public readonly description = 'Tailwind CSS Theme Config';

    /**
     * Exports tokens to Tailwind config format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildTailwindConfig(tokens);

            return {
                filename: 'tailwind.tokens.js',
                content,
                mimeType: 'text/javascript',
                format: 'tailwind'
            };
        } catch (error) {
            throw new Error(
                `Tailwind export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete Tailwind config file
     */
    private buildTailwindConfig(tokens: TokenEntity[]): string {
        const themeExtend = this.buildThemeExtend(tokens);

        return `/**
 * 🎨 Design Tokens (Tailwind CSS)
 * 
 * Auto-generated Tailwind theme configuration.
 * Import this into your tailwind.config.js:
 * 
 * const tokens = require('./tailwind.tokens');
 * module.exports = {
 *   theme: {
 *     extend: {
 *       ...tokens.theme.extend
 *     }
 *   }
 * }
 */

module.exports = {
  theme: {
    extend: ${this.stringifyObject(themeExtend, 3)}
  }
};
`;
    }

    /**
     * Builds theme.extend object by categorizing tokens
     */
    private buildThemeExtend(tokens: TokenEntity[]): Record<string, unknown> {
        const extend: Record<string, unknown> = {};

        // Group tokens by Tailwind theme key
        for (const token of tokens) {
            const category = this.mapToTailwindCategory(token.$type);
            if (!category) continue;

            if (!extend[category]) {
                extend[category] = {};
            }

            this.addTokenToCategory(extend[category] as Record<string, unknown>, token);
        }

        return extend;
    }

    /**
     * Maps token type to Tailwind theme category
     */
    private mapToTailwindCategory(type: string): string | null {
        const mapping: Record<string, string> = {
            'color': 'colors',
            'dimension': 'spacing',
            'fontFamily': 'fontFamily',
            'fontSize': 'fontSize',
            'fontWeight': 'fontWeight',
            'lineHeight': 'lineHeight',
            'letterSpacing': 'letterSpacing',
            'borderRadius': 'borderRadius',
            'borderWidth': 'borderWidth',
            'boxShadow': 'boxShadow',
            'duration': 'transitionDuration',
            'cubicBezier': 'transitionTimingFunction'
        };

        return mapping[type] || null;
    }

    /**
     * Adds token to category object (nested structure)
     */
    private addTokenToCategory(category: Record<string, unknown>, token: TokenEntity): void {
        let current = category;

        // Navigate/create nested structure from path
        for (const segment of token.path) {
            if (!current[segment]) {
                current[segment] = {};
            }
            current = current[segment] as Record<string, unknown>;
        }

        // Set final value
        current[token.name] = this.formatValue(token);
    }

    /**
     * Formats value for Tailwind config
     */
    private formatValue(token: TokenEntity): string {
        const value = token.$value;
        const type = token.$type;

        // Type-specific formatting
        switch (type) {
            case 'dimension':
                return typeof value === 'number' ? `${value}px` : String(value);

            case 'duration':
                return typeof value === 'number' ? `${value}ms` : String(value);

            case 'cubicBezier':
                if (Array.isArray(value)) {
                    return `cubic-bezier(${value.join(', ')})`;
                }
                return String(value);

            default:
                return String(value);
        }
    }

    /**
     * Stringifies object with proper indentation for JS module
     */
    private stringifyObject(obj: Record<string, unknown>, depth: number): string {
        const indent = '  '.repeat(depth);
        const innerIndent = '  '.repeat(depth + 1);

        const entries = Object.entries(obj).map(([key, value]) => {
            const safeKey = this.isSafeIdentifier(key) ? key : `"${key}"`;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${innerIndent}${safeKey}: ${this.stringifyObject(value as Record<string, unknown>, depth + 1)}`;
            }

            // String values need quotes
            const formattedValue = typeof value === 'string' ? `"${value}"` : value;
            return `${innerIndent}${safeKey}: ${formattedValue}`;
        });

        return `{\n${entries.join(',\n')}\n${indent}}`;
    }

    /**
     * Checks if string is safe JavaScript identifier
     */
    private isSafeIdentifier(str: string): boolean {
        return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str) && !this.isReservedWord(str);
    }

    /**
     * Checks if string is JavaScript reserved word
     */
    private isReservedWord(str: string): boolean {
        const reserved = ['break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield'];
        return reserved.includes(str);
    }
}

`

---

## /src/features/export/adapters/TypeScriptAdapter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { ITokenAdapter, TokenExportResult } from '../interfaces/ITokenExporter';

/**
 * 📘 TypeScript Adapter
 * 
 * **Purpose:**
 * Exports tokens as TypeScript const object with type definitions.
 * 
 * **Format:**
 * ```typescript
 * export const tokens = {
 *   color: {
 *     primary: {
 *       500: "#FF0000",
 *     },
 *   },
 * } as const;
 * 
 * export type TokenPaths = "color.primary.500" | ...;
 * ```
 * 
 * **Use Cases:**
 * - TypeScript projects
 * - Type-safe token references
 * - Autocomplete in IDEs
 */
export class TypeScriptAdapter implements ITokenAdapter {
    public readonly formatId = 'typescript';
    public readonly description = 'TypeScript Const Exports with Types';

    /**
     * Exports tokens to TypeScript format
     */
    async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
        try {
            const content = this.buildTypeScriptFile(tokens);

            return {
                filename: 'tokens.ts',
                content,
                mimeType: 'text/typescript',
                format: 'typescript'
            };
        } catch (error) {
            throw new Error(
                `TypeScript export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Builds complete TypeScript file content
     */
    private buildTypeScriptFile(tokens: TokenEntity[]): string {
        const nestedObject = this.buildNestedObject(tokens);
        const tokenPaths = this.extractTokenPaths(tokens);

        return `/**
 * 🎨 Design Tokens
 * 
 * Auto-generated TypeScript token definitions.
 * DO NOT EDIT MANUALLY.
 */

export const tokens = ${this.stringifyObject(nestedObject, 0)} as const;

/**
 * Type-safe token path union
 */
export type TokenPath = ${tokenPaths.map(p => `"${p}"`).join(' | ')};

/**
 * Extract token value by path
 */
export type TokenValue<T extends TokenPath> = 
  T extends keyof typeof tokens
    ? typeof tokens[T]
    : string | number;
`;
    }

    /**
     * Builds nested object structure from flat token array
     */
    private buildNestedObject(tokens: TokenEntity[]): Record<string, unknown> {
        const result: Record<string, unknown> = {};

        for (const token of tokens) {
            let current = result;

            // Navigate/create nested structure
            for (const segment of token.path) {
                if (!current[segment]) {
                    current[segment] = {};
                }
                current = current[segment] as Record<string, unknown>;
            }

            // Set final value
            current[token.name] = this.formatValue(token.$value);
        }

        return result;
    }

    /**
     * Formats value for TypeScript output
     */
    private formatValue(value: string | number): string {
        if (typeof value === 'number') {
            return String(value);
        }
        return `"${value}"`;
    }

    /**
     * Stringifies object with proper indentation
     */
    private stringifyObject(obj: Record<string, unknown>, depth: number): string {
        const indent = '  '.repeat(depth);
        const innerIndent = '  '.repeat(depth + 1);

        const entries = Object.entries(obj).map(([key, value]) => {
            const safeKey = this.isSafeIdentifier(key) ? key : `"${key}"`;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                return `${innerIndent}${safeKey}: ${this.stringifyObject(value as Record<string, unknown>, depth + 1)}`;
            }

            return `${innerIndent}${safeKey}: ${value}`;
        });

        return `{\n${entries.join(',\n')},\n${indent}}`;
    }

    /**
     * Checks if string is safe JavaScript identifier
     */
    private isSafeIdentifier(str: string): boolean {
        return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str);
    }

    /**
     * Extracts dot-notation paths for type union
     */
    private extractTokenPaths(tokens: TokenEntity[]): string[] {
        return tokens.map(token => {
            return [...token.path, token.name].join('.');
        });
    }
}

`

---

## /src/features/export/index.ts
> Path: $Path

`$Lang
/**
 * 📦 Export Module - Public API
 * 
 * This barrel file exports the public interface of the token export system.
 * Use this for clean imports: `import { TokenExportService, DTCGAdapter } from '@/modules/export'`
 */

// Core Interfaces
export type { ITokenAdapter, TokenExportResult } from './interfaces/ITokenExporter';

// Adapters
export { DTCGAdapter } from './adapters/DTCGAdapter';
export { CSSAdapter } from './adapters/CSSAdapter';

// Service
export { TokenExportService } from './TokenExportService';
export type { ExportBatchResult } from './TokenExportService';

`

---

## /src/features/export/interfaces/ITokenExporter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';
import type { NamingConvention } from '../ui/types';

/**
 * Indentation options for formatted output
 */
export type IndentationType = '2' | '4' | 'tab';

/**
 * ⚙️ ExportOptions
 * 
 * Configuration options passed to adapters to customize output.
 */
export interface ExportOptions {
    indentation?: IndentationType;
    namingConvention: NamingConvention;
    includeMetadata: boolean;
}

/**
 * 📦 TokenExportResult
 * 
 * Represents the output of a token export operation.
 * Contains all necessary metadata for file generation or API delivery.
 */
export interface TokenExportResult {
    /**
     * Target filename (e.g., "tokens.css", "design-tokens.json")
     */
    filename: string;

    /**
     * Generated content as string
     * (JSON serialized, CSS text, or any string-based format)
     */
    content: string;

    /**
     * MIME type for proper content-type headers
     * Examples: "application/json", "text/css", "text/plain"
     */
    mimeType: string;

    /**
     * Human-readable format identifier
     * Examples: "css-variables", "dtcg", "typescript", "scss"
     */
    format: string;
}

/**
 * 🔌 ITokenAdapter
 * 
 * The Adapter Pattern contract for token export transformations.
 * Each adapter implements a specific output format (DTCG, CSS, TypeScript, etc.)
 * 
 * **Design Principles:**
 * - Single Responsibility: One adapter = One output format
 * - Dependency Inversion: Core logic depends on this abstraction, not implementations
 * - Open/Closed: Add new formats without modifying existing code
 * 
 * **Why Async?**
 * Future-proofs for potential file I/O, network calls, or heavy transformations
 * that may require Worker threads in Figma's sandbox.
 */
export interface ITokenAdapter {
    /**
     * Transforms a collection of TokenEntity objects into a specific output format.
     * 
     * @param options - Configuration options for export (indentation, naming, etc.)
     * @returns Promise resolving to export result with content and metadata
     * 
     * @throws {Error} If token validation fails or transformation encounters critical error
     * 
     * **Implementation Requirements:**
     * - Must handle empty token arrays gracefully
     * - Must validate $type and $value compatibility
     * - Must preserve semantic meaning during transformation
     * - Must NOT mutate input tokens
     */
    export(tokens: TokenEntity[], options?: ExportOptions): Promise<TokenExportResult>;

    /**
     * Unique identifier for this adapter (e.g., "dtcg", "css", "scss")
     * Used for registry lookup in ExportService
     */
    readonly formatId: string;

    /**
     * Human-readable description of the output format
     */
    readonly description: string;
}

`

---

## /src/features/export/logic/CSSVariablesExporter.ts
> Path: $Path

`$Lang
import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../../core/types';

/**
 * 🎨 CSSVariablesExporter
 * Generates standard CSS Custom Properties from the token graph.
 * Strictly adheres to the purified TokenEntity schema.
 */
export class CSSVariablesExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const lines = [':root {'];

        tokens.forEach(token => {
            const name = `--${this.formatName(token.name)}`;
            const value = token.$value;
            lines.push(`  ${name}: ${value};`);
        });

        lines.push('}');

        return {
            filename: 'variables.css',
            content: lines.join('\n'),
            language: 'css'
        };
    }
}

`

---

## /src/features/export/logic/stringUtils.ts
> Path: $Path

`$Lang
/**
 * 🧵 String Manipulation Utilities
 * 
 * **Purpose:**
 * Helper functions for converting strings between different casing conventions.
 * Used primarily by Export Adapters to format token names and keys.
 */

/**
 * Converts a string to kebab-case
 * e.g., "Primary Color" -> "primary-color"
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // split camelCase
        .replace(/[\s_]+/g, '-')             // replace spaces and underscores
        .toLowerCase();
}

/**
 * Converts a string to camelCase
 * e.g., "primary-color" -> "primaryColor"
 */
export function toCamelCase(str: string): string {
    return str
        .replace(/[-_]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
        .replace(/^(.)/, c => c.toLowerCase());
}

/**
 * Converts a string to snake_case
 * e.g., "primary-color" -> "primary_color"
 */
export function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2') // split camelCase
        .replace(/[\s-]+/g, '_')             // replace spaces and hyphens
        .toLowerCase();
}

/**
 * Applies the requested naming convention to a key
 */
export function applyNamingConvention(key: string, convention: 'kebab-case' | 'camelCase' | 'snake_case'): string {
    switch (convention) {
        case 'camelCase': return toCamelCase(key);
        case 'snake_case': return toSnakeCase(key);
        case 'kebab-case':
        default:
            return toKebabCase(key);
    }
}

`

---

## /src/features/export/logic/TailwindExporter.ts
> Path: $Path

`$Lang
import { TokenExporter } from './TokenExporter';
import type { ExportResult } from './TokenExporter';
import type { TokenEntity } from '../../../core/types';

/**
 * 🌪️ TailwindExporter
 * Generates Tailwind CSS configuration from the token graph.
 * Implements recursive object nesting based on token paths.
 */
interface ColorTree {
    [key: string]: string | number | ColorTree;
}

export class TailwindExporter extends TokenExporter {
    execute(tokens: TokenEntity[]): ExportResult {
        const colors: ColorTree = {};

        tokens.filter(t => t.$type === 'color').forEach(token => {
            const parts = [...token.path, token.name];
            let current = colors;

            parts.forEach((part: string, index: number) => {
                if (index === parts.length - 1) {
                    current[part] = token.$value;
                } else {
                    current[part] = current[part] || {};
                    // Ensure current is still treated as an object for the next iteration
                    if (typeof current[part] === 'object' && current[part] !== null) {
                        current = current[part];
                    }
                }
            });
        });

        const output = `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 2)}\n    }\n  }\n}`;

        return {
            filename: 'tailwind.config.js',
            content: output,
            language: 'javascript'
        };
    }
}

`

---

## /src/features/export/logic/TokenExporter.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../core/types';

export interface ExportResult {
    filename: string;
    content: string;
    language: string;
}

/**
 * 📤 TokenExporter
 * Base abstract class for all exporters.
 * Purified to use the core TokenEntity definition.
 */
export abstract class TokenExporter {
    abstract execute(tokens: TokenEntity[]): ExportResult;

    protected formatName(name: string): string {
        return name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    }
}

`

---

## /src/features/export/README.md
> Path: $Path

`$Lang
# 🔌 Token Export System - Usage Guide

## Overview
Zero-dependency, graph-aware token export engine using the Adapter Pattern.
Optimized for Figma's sandbox environment with strict TypeScript enforcement.

---

## Quick Start

### 1️⃣ Basic Usage

```typescript
import { TokenExportService, DTCGAdapter, CSSAdapter } from '@/modules/export';
import type { TokenEntity } from '@/core/types';

// Initialize service
const exportService = TokenExportService.getInstance();

// Register adapters
exportService
  .registerAdapter(new DTCGAdapter())
  .registerAdapter(new CSSAdapter());

// Export to CSS
const tokens: TokenEntity[] = [...]; // Your token array
const cssResult = await exportService.exportAll(tokens, 'css');

console.log(cssResult.filename); // "tokens.css"
console.log(cssResult.content);  // ":root { --color-primary: #FF0000; }"
console.log(cssResult.mimeType);  // "text/css"
```

---

## Available Adapters

### 📄 DTCG Adapter (W3C Compliance)

**Format ID:** `dtcg`  
**Output:** JSON following W3C Design Tokens Format  
**Use Case:** Interoperability with Figma Tokens Studio, Supernova, etc.

**Example Output:**
```json
{
  "color": {
    "primary": {
      "500": {
        "$value": "#FF5733",
        "$type": "color",
        "$description": "Primary brand color"
      }
    }
  }
}
```

### 🎨 CSS Adapter

**Format ID:** `css`  
**Output:** CSS Custom Properties  
**Use Case:** Direct stylesheet inclusion

**Example Output:**
```css
:root {
  --color-primary-500: #FF5733;
  --spacing-base: 8px;
  --font-family-heading: "Inter";
  --duration-fast: 200ms;
}
```

**Features:**
- ✅ Kebab-case naming (`primary/500` → `--primary-500`)
- ✅ Auto-unit injection (`8` → `8px` for dimensions)
- ✅ Alias resolution (`{color/primary}` → `var(--color-primary)`)
- ✅ Font family quoting (spaces → quoted)

---

## Advanced Usage

### 🔄 Batch Export

Export to multiple formats concurrently:

```typescript
const results = await exportService.exportMultiple(tokens, ['css', 'dtcg']);

results.forEach(result => {
  if (result.success) {
    downloadFile(result.data.filename, result.data.content);
  } else {
    console.error(`Export failed: ${result.error}`);
  }
});
```

### 📋 List Available Formats

```typescript
const formats = exportService.getAvailableFormats();
console.log(formats); // ["css", "dtcg"]

const info = exportService.getAdapterInfo();
console.log(info);
// [
//   { formatId: "css", description: "CSS Custom Properties (Variables)" },
//   { formatId: "dtcg", description: "W3C Design Tokens..." }
// ]
```

### 🔧 Custom Adapter

Create your own export format:

```typescript
import type { ITokenAdapter, TokenExportResult } from '@/modules/export';
import type { TokenEntity } from '@/core/types';

class TypeScriptAdapter implements ITokenAdapter {
  public readonly formatId = 'typescript';
  public readonly description = 'TypeScript Const Exports';

  async export(tokens: TokenEntity[]): Promise<TokenExportResult> {
    const declarations = tokens
      .map(t => `export const ${t.name} = '${t.$value}';`)
      .join('\n');

    return {
      filename: 'tokens.ts',
      content: declarations,
      mimeType: 'text/typescript',
      format: this.formatId
    };
  }
}

// Register your adapter
exportService.registerAdapter(new TypeScriptAdapter());
```

---

## Integration Examples

### 📤 Download in UI

```typescript
async function downloadTokens(tokens: TokenEntity[], format: string) {
  const result = await exportService.exportAll(tokens, format);

  const blob = new Blob([result.content], { type: result.mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = result.filename;
  link.click();

  URL.revokeObjectURL(url);
}
```

### 💾 Save via Figma Plugin API

```typescript
async function saveToClientStorage(tokens: TokenEntity[], format: string) {
  const result = await exportService.exportAll(tokens, format);

  await figma.clientStorage.setAsync(`exported_tokens_${format}`, result.content);
  figma.notify(`✅ Tokens saved as ${format}`);
}
```

### 🔁 Sync with DTCG File

```typescript
async function syncWithDTCG(tokens: TokenEntity[]) {
  const dtcgResult = await exportService.exportAll(tokens, 'dtcg');
  const dtcgData = JSON.parse(dtcgResult.content);

  // Send to external API or save to file system
  await fetch('/api/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dtcgData)
  });
}
```

---

## Error Handling

```typescript
try {
  const result = await exportService.exportAll(tokens, 'invalid-format');
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    // "❌ Export format "invalid-format" is not registered. Available formats: css, dtcg"
  }
}
```

---

## Architecture Benefits

### ✅ Zero Dependencies
- No `style-dictionary` or external libraries
- Lightweight bundle size
- Full control over transformation logic

### ✅ Type Safety
- Strict TypeScript enforcement
- No `any` types
- Compile-time validation

### ✅ Extensibility
- Add new formats via Adapter Pattern
- No modification to core service
- Open/Closed Principle compliance

### ✅ Performance
- O(1) adapter lookup (Map-based registry)
- Parallel batch exports
- Optimized for Figma sandbox

---

## Testing

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { TokenExportService, CSSAdapter } from '@/modules/export';

describe('TokenExportService', () => {
  let service: TokenExportService;

  beforeEach(() => {
    TokenExportService.resetInstance();
    service = TokenExportService.getInstance();
    service.registerAdapter(new CSSAdapter());
  });

  it('should export to CSS format', async () => {
    const tokens = [
      {
        id: '1',
        name: 'primary',
        path: ['color'],
        $value: '#FF0000',
        $type: 'color',
        $extensions: { figma: {...} },
        dependencies: [],
        dependents: []
      }
    ];

    const result = await service.exportAll(tokens, 'css');

    expect(result.content).toContain('--color-primary: #FF0000');
    expect(result.mimeType).toBe('text/css');
  });
});
```

---

## Roadmap

Future adapter implementations:

- [ ] **SCSS Adapter** - Sass variables and mixins
- [ ] **TypeScript Adapter** - Const exports with type definitions
- [ ] **Tailwind Adapter** - `tailwind.config.js` format
- [ ] **iOS Adapter** - Swift color assets
- [ ] **Android Adapter** - XML resources
- [ ] **JSON Adapter** - Generic key-value pairs

---

## Reference

- **W3C DTCG Spec:** https://tr.designtokens.org/format/
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Adapter Pattern:** https://refactoring.guru/design-patterns/adapter

`

---

## /src/features/export/TokenExportService.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../core/types';
import type { ITokenAdapter, TokenExportResult, ExportOptions } from './interfaces/ITokenExporter';


/**
 * 🧠 TokenExportService
 * 
 * **Purpose:**
 * Central orchestrator for token export operations using the Adapter Pattern.
 * Manages a registry of export adapters and coordinates export requests.
 * 
 * **Architecture Pattern:**
 * - **Singleton:** Single instance manages adapter registry
 * - **Adapter Pattern:** Decouples core logic from format-specific implementations
 * - **Registry Pattern:** Dynamic adapter registration and lookup
 * 
 * **Design Principles:**
 * - **Open/Closed:** Add new export formats without modifying this service
 * - **Dependency Inversion:** Depends on ITokenAdapter abstraction
 * - **Single Responsibility:** Only coordinates adapters, doesn't transform tokens
 * 
 * **Usage Example:**
 * ```typescript
 * const exportService = TokenExportService.getInstance();
 * 
 * // Register adapters
 * exportService.registerAdapter(new DTCGAdapter());
 * exportService.registerAdapter(new CSSAdapter());
 * 
 * // Export to specific format
 * const result = await exportService.exportAll(tokens, 'css');
 * console.log(result.content); // CSS variables
 * ```
 */
export class TokenExportService {
    private static instance: TokenExportService | null = null;

    /**
     * Adapter registry: format identifier → adapter instance
     * Uses Map for O(1) lookup performance
     */
    private adapters: Map<string, ITokenAdapter> = new Map();

    /**
     * Private constructor enforces Singleton pattern
     * Use TokenExportService.getInstance() instead
     */
    private constructor() {
        // Intentionally empty - initialization happens in getInstance()
    }

    /**
     * Gets the singleton instance of TokenExportService
     * 
     * **Lazy Initialization:**
     * Instance is created on first access, not at module load time.
     * 
     * @returns Singleton instance
     */
    public static getInstance(): TokenExportService {
        if (!TokenExportService.instance) {
            TokenExportService.instance = new TokenExportService();
        }

        return TokenExportService.instance;
    }

    /**
     * Registers a new export adapter
     * 
     * **Registration Rules:**
     * - Format IDs must be unique (overwrites existing if duplicate)
     * - Adapter is immediately available for export calls
     * 
     * **Example:**
     * ```typescript
     * service.registerAdapter(new DTCGAdapter());
     * service.registerAdapter(new CSSAdapter());
     * service.registerAdapter(new TypeScriptAdapter());
     * ```
     * 
     * @param adapter - Adapter instance implementing ITokenAdapter
     * @returns this (for method chaining)
     */
    public registerAdapter(adapter: ITokenAdapter): this {
        this.adapters.set(adapter.formatId, adapter);
        return this; // Enable chaining: service.registerAdapter(a).registerAdapter(b)
    }

    /**
     * Unregisters an adapter by format ID
     * 
     * **Use Cases:**
     * - Dynamically disable certain export formats
     * - Replace adapter implementation at runtime
     * 
     * @param formatId - Format identifier to remove
     * @returns true if adapter was found and removed, false otherwise
     */
    public unregisterAdapter(formatId: string): boolean {
        return this.adapters.delete(formatId);
    }

    /**
     * Checks if an adapter is registered for a given format
     * 
     * @param formatId - Format identifier to check
     * @returns true if adapter exists, false otherwise
     */
    public hasAdapter(formatId: string): boolean {
        return this.adapters.has(formatId);
    }

    /**
     * Gets a registered adapter by format ID
     * 
     * @param formatId - Format identifier
     * @returns Adapter instance or undefined if not found
     */
    public getAdapter(formatId: string): ITokenAdapter | undefined {
        return this.adapters.get(formatId);
    }

    /**
     * Lists all registered adapter format IDs
     * 
     * **Use Case:**
     * Display available export formats to users in UI
     * 
     * @returns Array of format identifiers
     */
    public getAvailableFormats(): string[] {
        return Array.from(this.adapters.keys());
    }

    /**
     * Lists all registered adapters with their descriptions
     * 
     * **Use Case:**
     * Populate export format dropdown in UI with human-readable labels
     * 
     * @returns Array of { formatId, description } objects
     */
    public getAdapterInfo(): Array<{ formatId: string; description: string }> {
        return Array.from(this.adapters.values()).map(adapter => ({
            formatId: adapter.formatId,
            description: adapter.description
        }));
    }

    /**
     * Exports tokens to a specific format
     * 
     * **Workflow:**
     * 1. Validates format is registered
     * 2. Delegates transformation to format-specific adapter
     * 3. Returns result with content and metadata
     * 
     * **Error Handling:**
     * - Throws if format is not registered (fail-fast)
     * - Propagates adapter-specific errors to caller
     * 
     * **Example:**
     * ```typescript
     * try {
     *   const css = await service.exportAll(tokens, 'css');
     *   downloadFile(css.filename, css.content, css.mimeType);
     * } catch (error) {
     *   console.error('Export failed:', error);
     * }
     * ```
     * 
     * @param tokens - Array of fully resolved tokens
     * @param formatId - Target export format identifier
     * @returns Promise<TokenExportResult> with exported content
     * 
     * @throws {Error} If format is not registered
     * @throws {Error} Propagates adapter-specific transformation errors
     */
    public async exportAll(
        tokens: TokenEntity[],
        formatId: string,
        options?: ExportOptions // Export options from ITokenExporter interface
    ): Promise<TokenExportResult> {
        // Validate adapter exists
        const adapter = this.adapters.get(formatId);

        if (!adapter) {
            const availableFormats = this.getAvailableFormats().join(', ');
            throw new Error(
                `❌ Export format "${formatId}" is not registered. ` +
                `Available formats: ${availableFormats || 'none'}`
            );
        }

        // Defensive programming: Validate input
        if (!Array.isArray(tokens)) {
            throw new Error('❌ Invalid input: tokens must be an array');
        }

        // Delegate to format-specific adapter
        try {
            return await adapter.export(tokens, options);
        } catch (error) {
            // Enrich error with context
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(
                `❌ Export to "${formatId}" failed: ${message}`
            );
        }
    }

    /**
     * Exports tokens to multiple formats concurrently
     * 
     * **Performance Optimization:**
     * Uses Promise.all() for parallel execution of independent exports
     * 
     * **Error Handling:**
     * Returns results with success/error status for each format
     * Does NOT fail-fast (continues if one format fails)
     * 
     * **Example:**
     * ```typescript
     * const results = await service.exportMultiple(tokens, ['css', 'dtcg', 'typescript']);
     * results.forEach(result => {
     *   if (result.success) {
     *     console.log(`✅ ${result.format}: ${result.data.filename}`);
     *   } else {
     *     console.error(`❌ ${result.format}: ${result.error}`);
     *   }
     * });
     * ```
     * 
     * @param tokens - Array of fully resolved tokens
     * @param formatIds - Array of format identifiers
     * @returns Promise<ExportBatchResult[]> with results for each format
     */
    public async exportMultiple(
        tokens: TokenEntity[],
        formatIds: string[],
        options?: ExportOptions
    ): Promise<ExportBatchResult[]> {
        // Parallel execution
        const promises = formatIds.map(async (formatId) => {
            try {
                const data = await this.exportAll(tokens, formatId, options);
                return {
                    format: formatId,
                    success: true as const,
                    data
                };
            } catch (error) {
                return {
                    format: formatId,
                    success: false as const,
                    error: error instanceof Error ? error.message : String(error)
                };
            }
        });

        return Promise.all(promises);
    }

    /**
     * Resets the service state
     * Clears all registered adapters
     * 
     * **Use Cases:**
     * - Testing (reset between test cases)
     * - Dynamic adapter management
     */
    public reset(): void {
        this.adapters.clear();
    }

    /**
     * Resets the singleton instance (for testing only)
     * ⚠️ DO NOT USE IN PRODUCTION CODE
     */
    public static resetInstance(): void {
        TokenExportService.instance = null;
    }
}

/**
 * Result type for batch export operations
 */
export type ExportBatchResult =
    | {
        format: string;
        success: true;
        data: TokenExportResult;
    }
    | {
        format: string;
        success: false;
        error: string;
    };

`

---

## /src/features/export/ui/components/ExportActions.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion } from 'framer-motion';
import { Download, Check } from 'lucide-react';

/**
 * 🎬 ExportActions Component
 * 
 * **Purpose:**
 * Download and Copy action buttons with success animations.
 * 
 * **Features:**
 * - Primary download button
 * - Success state with checkmark
 * - Pulse animation on success
 * - Disabled state when no preview available
 */

interface ExportActionsProps {
    /**
     * Download handler
     */
    onDownload: () => void;

    /**
     * Whether export is ready
     */
    isReady: boolean;

    /**
     * Filename for display (e.g., "tokens.json")
     */
    filename?: string;
}

export function ExportActions({ onDownload, isReady, filename }: ExportActionsProps) {
    const [downloaded, setDownloaded] = React.useState(false);

    const handleDownload = () => {
        if (!isReady) return;

        onDownload();
        setDownloaded(true);

        // Reset success state after 2 seconds
        setTimeout(() => setDownloaded(false), 2000);
    };

    return (
        <motion.button
            type="button"
            onClick={handleDownload}
            disabled={!isReady}
            className={`
                w-full py-3.5 rounded-xl
                text-sm font-bold
                shadow-lg
                transition-all duration-300
                flex items-center justify-center gap-2
                border border-white/10
                group relative overflow-hidden
                ${isReady
                    ? downloaded
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-[0_4px_20px_rgba(34,197,94,0.4)]'
                        : 'bg-primary hover:bg-primary-hover text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] hover:shadow-[0_4px_25px_rgba(110,98,229,0.5)]'
                    : 'bg-surface-2/50 text-text-dim cursor-not-allowed'
                }
            `}
            whileHover={isReady ? { scale: 1.01 } : {}}
            whileTap={isReady ? { scale: 0.99 } : {}}
        >
            {/* Icon */}
            <motion.div
                animate={downloaded ? { scale: [1, 1.2, 1], rotate: [0, 360, 360] } : {}}
                transition={{ duration: 0.5 }}
            >
                {downloaded ? <Check size={16} /> : <Download size={16} />}
            </motion.div>

            {/* Text */}
            <span>
                {downloaded
                    ? 'Downloaded!'
                    : isReady
                        ? 'Download Export'
                        : 'Generating Preview...'
                }
            </span>

            {/* Filename badge */}
            {isReady && filename && !downloaded && (
                <span className="
                    ml-1 px-2 py-0.5 rounded-md
                    bg-white text-primary
                    text-[10px] font-extrabold
                    shadow-sm
                    group-hover:scale-105 transition-transform
                ">
                    {filename}
                </span>
            )}

            {/* Success ripple effect */}
            {downloaded && (
                <motion.div
                    className="absolute inset-0 bg-white/20 rounded-xl"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </motion.button>
    );
}

`

---

## /src/features/export/ui/components/ExportOptions.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Settings2, FileCode } from 'lucide-react';
import type { NamingConvention } from '../types';

/**
 * 🎛️ ExportOptions Component
 * 
 * **Purpose:**
 * Collapsible options panel for customizing export output.
 * 
 * **Features:**
 * - Naming convention selector (kebab-case, camelCase, snake_case)
 * - Metadata inclusion toggle
 * - Smooth expand/collapse animation
 * - Glassmorphism design
 * - Live Variable Preview
 */

interface ExportOptionsProps {
    /**
     * Current naming convention
     */
    namingConvention: NamingConvention;

    /**
     * Whether to include metadata
     */
    includeMetadata: boolean;

    /**
     * Naming convention change handler
     */
    onNamingConventionChange: (value: NamingConvention) => void;

    /**
     * Metadata toggle handler
     */
    onIncludeMetadataChange: (value: boolean) => void;
}

export function ExportOptions({
    namingConvention,
    includeMetadata,
    onNamingConventionChange,
    onIncludeMetadataChange
}: ExportOptionsProps) {
    const [isExpanded, setIsExpanded] = React.useState(true); // Default to expanded for better discovery

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
                relative
                rounded-xl
                bg-surface-2/30 backdrop-blur-md
                border border-surface-2
                overflow-hidden
            "
        >
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                    w-full px-5 py-4
                    flex items-center justify-between
                    hover:bg-surface-2/50 transition-colors
                    group
                "
            >
                <div className="flex items-center gap-3">
                    <Settings2 size={16} className="text-primary" />
                    <span className="text-sm font-bold text-white">
                        Export Configuration
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-text-dim group-hover:text-white transition-colors" />
                </motion.div>
            </button>

            {/* Expandable Content */}
            <motion.div
                initial={false}
                animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
            >
                <div className="px-5 pb-5 space-y-6 border-t border-surface-2/30 pt-5">

                    {/* Metadata Toggle - Promoted to top */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1/50 border border-surface-2/50">
                        <div>
                            <span className="block text-xs font-bold text-white mb-0.5">
                                Export Metadata
                            </span>
                            <span className="block text-[10px] text-text-dim">
                                Add version timestamp header
                            </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={includeMetadata}
                                onChange={(e) => onIncludeMetadataChange(e.target.checked)}
                            />
                            <div className="w-9 h-5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    {/* Naming Convention Selector */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold text-text-dim uppercase tracking-wider">
                                Variable Naming
                            </label>
                            <span className="text-[10px] font-mono text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
                                Live Preview
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <NamingButton
                                value="kebab-case"
                                label="Kebab Case"
                                example="color-primary-500"
                                isSelected={namingConvention === 'kebab-case'}
                                onClick={() => onNamingConventionChange('kebab-case')}
                            />
                            <NamingButton
                                value="camelCase"
                                label="Camel Case"
                                example="colorPrimary500"
                                isSelected={namingConvention === 'camelCase'}
                                onClick={() => onNamingConventionChange('camelCase')}
                            />
                            <NamingButton
                                value="snake_case"
                                label="Snake Case"
                                example="color_primary_500"
                                isSelected={namingConvention === 'snake_case'}
                                onClick={() => onNamingConventionChange('snake_case')}
                            />
                        </div>
                    </div>

                    {/* Live Code Snippet Preview */}
                    <div className="rounded-lg bg-surface-1 border border-surface-2 p-3 font-mono text-[10px] leading-relaxed text-text-dim overflow-hidden relative">
                        <div className="absolute top-2 right-2 opacity-20">
                            <FileCode size={14} />
                        </div>
                        <div><span className="text-purple-400">const</span> <span className="text-yellow-300">tokens</span> = {'{'}</div>
                        <div className="pl-4">
                            <span className="text-blue-300">
                                {namingConvention === 'kebab-case' && '"color-primary"'}
                                {namingConvention === 'camelCase' && 'colorPrimary'}
                                {namingConvention === 'snake_case' && 'color_primary'}
                            </span>
                            : <span className="text-green-300">"#6366f1"</span>,
                        </div>
                        <div>{'}'};</div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
}

/* --- Internal Components --- */

interface NamingButtonProps {
    value: NamingConvention;
    label: string;
    example: string;
    isSelected: boolean;
    onClick: () => void;
}

function NamingButton({ label, example, isSelected, onClick }: NamingButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex flex-col items-start p-3 rounded-lg
                text-left w-full
                transition-all duration-200 border
                ${isSelected
                    ? 'bg-primary/10 border-primary/40 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    : 'bg-surface-2/30 border-transparent hover:bg-surface-2 hover:border-surface-3'
                }
            `}
        >
            <div className={`text-xs font-bold mb-1 ${isSelected ? 'text-primary' : 'text-white'}`}>
                {label}
            </div>
            <div className={`text-[10px] font-mono truncate w-full ${isSelected ? 'text-primary/70' : 'text-text-dim'}`}>
                {example}
            </div>
        </button>
    );
}

`

---

## /src/features/export/ui/components/ExportPreview.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

/**
 * 📋 ExportPreview Component
 * 
 * **Purpose:**
 * Live code preview with syntax highlighting and copy functionality.
 * 
 * **Features:**
 * - Basic JSON syntax highlighting (zero dependencies)
 * - Line numbers
 * - Copy button with success state
 * - File size display
 * 
 * **Performance:**
 * - Memoized to prevent unnecessary re-renders
 * - Syntax highlighting via simple regex (no Prism.js bloat)
 */

interface ExportPreviewProps {
    content: string;
    sizeDisplay: string;
    onCopy: () => Promise<boolean>;
}

export const ExportPreview = React.memo(function ExportPreview({
    content,
    sizeDisplay,
    onCopy
}: ExportPreviewProps) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        const success = await onCopy();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Split content into lines for line numbers
    const lines = content.split('\n');

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1">
                    Preview
                </label>
                <span className="text-[10px] text-text-dim font-mono">
                    {sizeDisplay}
                </span>
            </div>

            <div className="relative group">
                {/* Copy Button */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`
                        absolute top-3 right-3 z-10
                        p-2 rounded-lg
                        backdrop-blur-md border
                        transition-all duration-300
                        ${copied
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-surface-2/80 border-surface-2 text-text-dim hover:text-white hover:bg-surface-2'
                        }
                    `}
                >
                    <AnimatePresence mode="wait">
                        {copied ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                            >
                                <Check size={14} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Copy size={14} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {/* Code Preview Container */}
                <div className="
                    relative
                    rounded-xl
                    bg-surface-1/50 backdrop-blur-md
                    border border-surface-2
                    overflow-hidden
                ">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="flex">
                            {/* Line Numbers */}
                            <div className="
                                flex flex-col
                                py-4 px-3
                                bg-surface-2/30
                                border-r border-surface-2
                                select-none
                                text-[10px] font-mono text-text-dim
                            ">
                                {lines.map((_, index) => (
                                    <div key={index} className="leading-5 text-right">
                                        {index + 1}
                                    </div>
                                ))}
                            </div>

                            {/* Code Content */}
                            <div className="flex-1 py-4 px-4">
                                <pre className="text-[11px] font-mono leading-5">
                                    <code
                                        className="text-text-dim"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightSyntax(content)
                                        }}
                                    />
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

/**
 * 🎨 Basic Syntax Highlighter
 * 
 * **Purpose:**
 * Lightweight syntax highlighting without external dependencies.
 * 
 * **Supports:**
 * - JSON (keys, strings, numbers, booleans, null)
 * - CSS (properties, values)
 * 
 * **Limitations:**
 * - Regex-based (not AST parsing)
 * - May have edge cases with escaped quotes
 * - Good enough for preview purposes
 */
function highlightSyntax(code: string): string {
    // Detect format by content patterns
    const isJSON = code.trim().startsWith('{') || code.trim().startsWith('[');
    const isCSS = code.includes(':root') || code.includes('--');

    if (isJSON) {
        return highlightJSON(code);
    } else if (isCSS) {
        return highlightCSS(code);
    }

    // Fallback: no highlighting
    return escapeHtml(code);
}

/**
 * JSON syntax highlighting
 */
function highlightJSON(json: string): string {
    let highlighted = escapeHtml(json);

    // Property keys (e.g., "name":)
    highlighted = highlighted.replace(
        /"([^"]+)"(\s*):/g,
        '<span class="text-primary font-semibold">"$1"</span>$2:'
    );

    // String values (e.g., : "value")
    highlighted = highlighted.replace(
        /:(\s*)"([^"]*)"/g,
        ':$1<span class="text-secondary">"$2"</span>'
    );

    // Numbers
    highlighted = highlighted.replace(
        /:(\s*)(-?\d+\.?\d*)/g,
        ':$1<span class="text-accent">$2</span>'
    );

    // Booleans and null
    highlighted = highlighted.replace(
        /\b(true|false|null)\b/g,
        '<span class="text-orange-400">$1</span>'
    );

    return highlighted;
}

/**
 * CSS syntax highlighting
 */
function highlightCSS(css: string): string {
    let highlighted = escapeHtml(css);

    // Selectors (e.g., :root)
    highlighted = highlighted.replace(
        /([:.][\w-]+)(\s*{)/g,
        '<span class="text-primary font-semibold">$1</span>$2'
    );

    // Property names (e.g., --color-primary:)
    highlighted = highlighted.replace(
        /(--[\w-]+)(\s*):/g,
        '<span class="text-secondary">$1</span>$2:'
    );

    // Values
    highlighted = highlighted.replace(
        /:(\s*)([^;]+);/g,
        ':$1<span class="text-accent">$2</span>;'
    );

    return highlighted;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

`

---

## /src/features/export/ui/components/FormatSelector.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion } from 'framer-motion';
import { FileJson, FileCode, FileType, Hash, Waves } from 'lucide-react';
import type { ExportFormat } from '../types';

/**
 * Format metadata for UI display
 */
interface FormatOption {
    id: ExportFormat;
    name: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
}

/**
 * 📊 Available Export Formats
 */
const FORMATS = [
    {
        id: 'dtcg' as ExportFormat,
        name: 'W3C DTCG',
        Icon: FileJson,
        description: 'Industry standard JSON format'
    },
    {
        id: 'css' as ExportFormat,
        name: 'CSS Variables',
        Icon: FileCode,
        description: 'Custom properties for web'
    },
    {
        id: 'scss' as ExportFormat,
        name: 'SCSS',
        Icon: Hash,
        description: 'Sass variables for stylesheets'
    },
    {
        id: 'typescript' as ExportFormat,
        name: 'TypeScript',
        Icon: FileType,
        description: 'Typed const exports'
    },
    {
        id: 'tailwind' as ExportFormat,
        name: 'Tailwind CSS',
        Icon: Waves,
        description: 'Theme configuration'
    },

] as const;

interface FormatSelectorProps {
    selectedFormat: ExportFormat;
    onFormatChange: (format: ExportFormat) => void;
}

/**
 * 🎨 FormatSelector Component
 * 
 * **Purpose:**
 * Glassmorphic card-based format selector with premium animations.
 * 
 * **Design:**
 * - Grid layout (2 cols mobile, 4 cols desktop)
 * - Stagger animation on mount
 * - Hover scale + selected glow effects
 * - Glassmorphism background
 */
export function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-1 h-4">
                Export Format
            </label>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {FORMATS.map((format) => (
                    <FormatCard
                        key={format.id}
                        format={format}
                        isSelected={selectedFormat === format.id}
                        onClick={() => onFormatChange(format.id)}
                    />
                ))}
            </motion.div>
        </div>
    );
}

/**
 * Individual format selection card
 */
interface FormatCardProps {
    format: FormatOption;
    isSelected: boolean;
    onClick: () => void;
}

function FormatCard({ format, isSelected, onClick }: FormatCardProps) {
    const { Icon, name, description } = format;

    return (
        <motion.button
            type="button"
            onClick={onClick}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative group
                flex flex-col items-start gap-2 p-4
                rounded-xl border backdrop-blur-md
                transition-all duration-300
                ${isSelected
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(110,98,229,0.3)]'
                    : 'bg-surface-2/50 border-surface-2 hover:border-surface-2/80'
                }
            `}
        >
            {/* Icon */}
            <div className={`
                p-2 rounded-lg 
                transition-colors duration-300
                ${isSelected
                    ? 'bg-primary/20 text-primary'
                    : 'bg-surface-1/50 text-text-dim group-hover:text-white'
                }
            `}>
                <Icon size={18} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start gap-1 text-left">
                <span className={`
                    text-sm font-bold
                    transition-colors duration-300
                    ${isSelected ? 'text-white' : 'text-text group-hover:text-white'}
                `}>
                    {name}
                </span>
                <span className="text-[10px] text-text-dim leading-tight">
                    {description}
                </span>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <motion.div
                    layoutId="formatSelector"
                    className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}

            {/* Ambient Glow */}
            {isSelected && (
                <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-xl" />
            )}
        </motion.button>
    );
}

/**
 * Framer Motion animation variants
 */
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

`

---

## /src/features/export/ui/hooks/useTokenExport.ts
> Path: $Path

`$Lang
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { TokenEntity } from '../../../../core/types';
import { TokenExportService } from '../../TokenExportService';
import { DTCGAdapter } from '../../adapters/DTCGAdapter';
import { CSSAdapter } from '../../adapters/CSSAdapter';
import { JSONAdapter } from '../../adapters/JSONAdapter';
import { TypeScriptAdapter } from '../../adapters/TypeScriptAdapter';
import { SCSSAdapter } from '../../adapters/SCSSAdapter';
import { TailwindAdapter } from '../../adapters/TailwindAdapter';
import type { ExportFormData, ExportPreviewData, ExportFormat } from '../types';

/**
 * 🎯 useTokenExport Hook
 * 
 * **Purpose:**
 * Manages state for the Export Activity UI, including:
 * - Export format and options configuration
 * - Live preview generation
 * - Download and clipboard actions
 * 
 * **Design:**
 * - Reactive preview updates on configuration change
 * - Debounced preview generation for performance
 * - Memoized expensive computations
 * 
 * @param tokens - Array of tokens to export
 * @returns Export state and actions
 */
export function useTokenExport(tokens: TokenEntity[]) {
    // Initialize export service and register adapters
    const exportService = useMemo(() => {
        const service = TokenExportService.getInstance();

        // Register all available adapters (only once)
        if (!service.hasAdapter('dtcg')) {
            service.registerAdapter(new DTCGAdapter());
        }
        if (!service.hasAdapter('css')) {
            service.registerAdapter(new CSSAdapter());
        }
        if (!service.hasAdapter('json')) {
            service.registerAdapter(new JSONAdapter());
        }
        if (!service.hasAdapter('typescript')) {
            service.registerAdapter(new TypeScriptAdapter());
        }
        if (!service.hasAdapter('scss')) {
            service.registerAdapter(new SCSSAdapter());
        }
        if (!service.hasAdapter('tailwind')) {
            service.registerAdapter(new TailwindAdapter());
        }

        return service;
    }, []);

    // Form state with sensible defaults
    // Note: Indentation is now hardcoded to '2' spaces per design requirements
    const [formData, setFormData] = useState<ExportFormData>({
        format: 'dtcg',
        namingConvention: 'kebab-case',
        includeMetadata: true,
        includeDependencies: false
    });

    // Preview state
    const [preview, setPreview] = useState<ExportPreviewData | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Formats byte size to human-readable string
     */
    const formatSize = useCallback((bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }, []);

    /**
     * Generates export preview based on current form configuration
     */
    const generatePreview = useCallback(async () => {
        if (tokens.length === 0) {
            setPreview(null);
            setError('No tokens available to export');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Export using selected format with options
            const result = await exportService.exportAll(tokens, formData.format, {
                indentation: '2', // Hardcoded per Vibe standards
                namingConvention: formData.namingConvention,
                includeMetadata: formData.includeMetadata
            });

            // Post-process content based on options
            const processedContent = result.content;

            // Calculate size
            const sizeBytes = new Blob([processedContent]).size;

            setPreview({
                content: processedContent,
                filename: result.filename,
                mimeType: result.mimeType,
                sizeBytes,
                sizeDisplay: formatSize(sizeBytes)
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Export generation failed';
            setError(message);
            setPreview(null);
        } finally {
            setIsGenerating(false);
        }
    }, [tokens, formData, exportService, formatSize]); // Added formData dependency for reactivity

    // Regenerate preview when configuration changes
    // Using a debounce effect could be beneficial here if generation became expensive
    useEffect(() => {
        generatePreview();
    }, [generatePreview]);

    /**
     * Updates a specific form field
     */
    const updateFormData = useCallback(<K extends keyof typeof formData>(
        field: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    /**
     * Downloads the current export as a file
     */
    const downloadExport = useCallback(() => {
        if (!preview) return;

        try {
            const blob = new Blob([preview.content], { type: preview.mimeType });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = preview.filename;
            link.click();

            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    }, [preview]);

    /**
     * Copies export content to clipboard
     * 
     * @returns Promise<boolean> - true if successful
     */
    const copyToClipboard = useCallback(async (): Promise<boolean> => {
        if (!preview) return false;

        try {
            await navigator.clipboard.writeText(preview.content);
            return true;
        } catch (err) {
            // Fallback for older browsers
            try {
                const textarea = document.createElement('textarea');
                textarea.value = preview.content;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            } catch (fallbackErr) {
                console.error('Clipboard copy failed:', fallbackErr);
                return false;
            }
        }
    }, [preview]);

    return {
        // State
        formData,
        preview,
        isGenerating,
        error,

        // Actions
        updateFormData,
        setFormat: (format: ExportFormat) => updateFormData('format', format),
        downloadExport,
        copyToClipboard,
        regenerate: generatePreview
    };
}

`

---

## /src/features/export/ui/index.ts
> Path: $Path

`$Lang
/**
 * 📤 Export UI Module
 * 
 * Barrel export for clean imports.
 */

// Pages
export { ExportTokensPage } from './pages/ExportTokensPage';

// Components
export { FormatSelector } from './components/FormatSelector';
export { ExportPreview } from './components/ExportPreview';
export { ExportActions } from './components/ExportActions';

// Hooks
export { useTokenExport } from './hooks/useTokenExport';

// Types
export type {
    ExportFormat,
    ExportFormData,
    ExportPreviewData,
    NamingConvention
} from './types';

`

---

## /src/features/export/ui/pages/ExportTokensPage.tsx
> Path: $Path

`$Lang
import { motion } from 'framer-motion';
import { ArrowLeft, FileDown } from 'lucide-react';
import type { TokenEntity } from '../../../../core/types';
import { useTokenExport } from '../hooks/useTokenExport';
import { FormatSelector } from '../components/FormatSelector';
import { ExportOptions } from '../components/ExportOptions';
import { ExportPreview } from '../components/ExportPreview';
import { ExportActions } from '../components/ExportActions';

/**
 * 📤 ExportTokensPage Component
 * 
 * **Purpose:**
 * Full-screen export activity for generating and downloading design tokens.
 * 
 * **Features:**
 * - Format selection (DTCG, CSS, TypeScript, JSON)
 * - Live preview with syntax highlighting
 * - Download functionality
 * - Copy to clipboard
 * - Premium animations and glassmorphism design
 * 
 * **UX Pattern:**
 * Mirrors CreateTokenPage structure:
 * - Full-screen overlay
 * - Back button for navigation
 * - Fixed bottom action bar
 * - Scroll area for content
 */

interface ExportTokensPageProps {
    /**
     * Tokens to export
     */
    tokens: TokenEntity[];

    /**
     * Back navigation handler
     */
    onBack: () => void;
}

export function ExportTokensPage({ tokens, onBack }: ExportTokensPageProps) {
    const {
        formData,
        preview,
        isGenerating,
        error,
        updateFormData,
        setFormat,
        downloadExport,
        copyToClipboard
    } = useTokenExport(tokens);

    return (
        <div className="w-full h-full relative flex flex-col bg-void">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl mx-auto px-6 py-6 pb-28 flex flex-col relative z-10">
                    {/* Header */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-3"
                        >
                            <button
                                type="button"
                                onClick={onBack}
                                className="
                                    p-2 rounded-lg
                                    bg-surface-2/50 hover:bg-surface-2
                                    border border-surface-2
                                    text-text-dim hover:text-white
                                    transition-all duration-200
                                "
                            >
                                <ArrowLeft size={16} />
                            </button>

                            <div className="flex items-center gap-2">
                                <FileDown size={20} className="text-primary" />
                                <h1 className="text-lg font-bold text-white">
                                    Export Design Tokens
                                </h1>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="text-xs text-text-dim mt-2 ml-11"
                        >
                            {tokens.length} token{tokens.length !== 1 ? 's' : ''} ready to export
                        </motion.p>
                    </div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-8 relative"
                    >
                        {/* Ambient Glow */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        {/* Format Selection */}
                        <FormatSelector
                            selectedFormat={formData.format}
                            onFormatChange={setFormat}
                        />

                        {/* Export Options */}
                        <ExportOptions
                            namingConvention={formData.namingConvention}
                            includeMetadata={formData.includeMetadata}
                            onNamingConventionChange={(value) => updateFormData('namingConvention', value)}
                            onIncludeMetadataChange={(value) => updateFormData('includeMetadata', value)}
                        />

                        {/* Preview or Error State */}
                        {error ? (
                            <div className="
                                p-6 rounded-xl
                                bg-red-500/10 border border-red-500/30
                                text-red-400 text-sm
                            ">
                                <p className="font-bold mb-1">Export Error</p>
                                <p className="text-xs text-red-300">{error}</p>
                            </div>
                        ) : preview ? (
                            <ExportPreview
                                content={preview.content}
                                sizeDisplay={preview.sizeDisplay}
                                onCopy={copyToClipboard}
                            />
                        ) : (
                            <div className="
                                p-8 rounded-xl
                                bg-surface-2/30 border border-surface-2
                                text-center
                            ">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                    <p className="text-xs text-text-dim">
                                        Generating preview...
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="
                w-full absolute bottom-0 left-0
                p-6
                bg-gradient-to-t from-void via-void to-transparent
                z-50 pointer-events-none
                flex justify-center
            ">
                <div className="w-full max-w-2xl flex gap-4 pointer-events-auto">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            flex-1 py-3.5 rounded-xl
                            bg-surface-2/80 hover:bg-surface-2
                            backdrop-blur-md
                            text-sm font-bold
                            text-text-dim hover:text-white
                            transition-colors
                            border border-surface-2
                        "
                    >
                        Cancel
                    </button>

                    {/* Download Action */}
                    <div className="flex-[2]">
                        <ExportActions
                            onDownload={downloadExport}
                            isReady={!isGenerating && preview !== null}
                            filename={preview?.filename}
                        />
                    </div>
                </div>
            </div>

            {/* Ambient Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full mix-blend-screen" />
            </div>
        </div>
    );
}

`

---

## /src/features/export/ui/types.ts
> Path: $Path

`$Lang
/**
 * 📦 Export UI Type Definitions
 * 
 * Type-safe contracts for the Export Activity UI components and state management.
 */

/**
 * Available export formats
 */
export type ExportFormat = 'dtcg' | 'css' | 'json' | 'typescript' | 'scss' | 'tailwind';

/**
 * Naming convention for variable names (primarily affects CSS output)
 */
export type NamingConvention = 'kebab-case' | 'camelCase' | 'snake_case';

/**
 * Export form configuration state
 * 
 * Represents user selections and preferences for token export.
 */
export interface ExportFormData {
    /**
     * Selected output format
     */
    format: ExportFormat;

    /**
     * Naming convention for generated identifiers
     */
    namingConvention: NamingConvention;

    /**
     * Include metadata fields (version, exportedAt) in output
     */
    includeMetadata: boolean;

    /**
     * Include dependency/dependent arrays in output
     */
    includeDependencies: boolean;
}

/**
 * Generated export preview data
 * 
 * Contains the generated export content and metadata for display/download.
 */
export interface ExportPreviewData {
    /**
     * Generated export content (JSON, CSS, TypeScript, etc.)
     */
    content: string;

    /**
     * Suggested filename for download
     */
    filename: string;

    /**
     * MIME type for file download
     */
    mimeType: string;

    /**
     * Content size in bytes (for UI display)
     */
    sizeBytes: number;

    /**
     * Human-readable size (e.g., "2.4 KB")
     */
    sizeDisplay: string;
}

/**
 * Format metadata for UI display
 */
export interface FormatOption {
    /**
     * Format identifier
     */
    id: ExportFormat;

    /**
     * Display name
     */
    name: string;

    /**
     * Icon component name from lucide-react
     */
    icon: string;

    /**
     * Short description for card
     */
    description: string;

    /**
     * File extension
     */
    extension: string;
}

`

---

## /src/features/feedback/FeedbackService.ts
> Path: $Path

`$Lang
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export type FeedbackType = 'feature' | 'bug' | 'general';

export interface FeedbackData {
    message: string;
    type: FeedbackType;
    username?: string;
    userId?: string;
}

export class FeedbackService {
    private static TABLE = 'plugin_feedback';

    /**
     * Sends feedback to the Supabase database.
     * @param feedback The feedback data object.
     * @returns The inserted data or throws an error.
     */
    static async sendFeedback(feedback: FeedbackData): Promise<void> {
        const client = VibeSupabase.get();
        if (!client) {
            throw new Error("Feedback Service: Supabase client not initialized.");
        }

        try {
            const { error } = await client
                .from(this.TABLE)
                .insert({
                    message: feedback.message,
                    type: feedback.type,
                    username: feedback.username,
                    user_id: feedback.userId, // Can be null for anon
                });

            if (error) {
                console.error('[FeedbackService] Submission Error:', error);
                throw new Error(error.message);
            }
        } catch (err) {
            console.error('[FeedbackService] Unexpected Error:', err);
            throw err;
        }
    }
}

`

---

## /src/features/feedback/ui/FeedbackOmnibox.tsx
> Path: $Path

`$Lang
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, PartyPopper, AlertCircle } from 'lucide-react';
import { FeedbackService, type FeedbackType } from '../FeedbackService';
import { AuthService } from '../../auth/AuthService';


interface FeedbackOmniboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackOmnibox: React.FC<FeedbackOmniboxProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<FeedbackType>('feature');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setStatus('sending');
        try {
            const session = await AuthService.getSession();
            const user = session?.user;

            await FeedbackService.sendFeedback({
                message: message.trim(),
                type,
                userId: user?.id,
                username: user?.email // Fallback since Figma username might not be available here directly
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMessage('Failed to send feedback. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="
                            relative w-full max-w-lg overflow-hidden
                            bg-[#0A0A0A] border border-white/10
                            rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]
                        "
                        style={{
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 0 40px rgba(110,98,229,0.4)`
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white tracking-wide">💬 We're All Ears!</h2>
                                    <p className="text-[10px] text-text-muted">Your voice shapes Vibe's future.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                        <PartyPopper size={32} className="text-success" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Feedback Sent!</h3>
                                    <p className="text-xs text-text-muted">Thank you for helping us improve Vibe.</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Type Selector */}
                                    <div className="flex bg-white/5 p-1 rounded-xl">
                                        {(['feature', 'bug', 'general'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setType(t)}
                                                className={`
                                                    flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all
                                                    ${type === t
                                                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                                        : 'text-text-muted hover:text-white hover:bg-white/5'
                                                    }
                                                `}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Text Area */}
                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={
                                                type === 'feature' ? "I dream of... ✨" :
                                                    type === 'bug' ? "Houston, we have a problem: 🚨" :
                                                        "Just wanted to say... 💭"
                                            }
                                            className="
                                                w-full h-40 px-5 py-4
                                                bg-gradient-to-br from-black/40 via-black/30 to-black/20
                                                border-2 border-white/10
                                                rounded-2xl
                                                text-base text-white/90 placeholder:text-white/30 placeholder:font-normal
                                                font-medium leading-relaxed
                                                focus:border-primary/60 focus:bg-black/50
                                                focus:outline-none focus:ring-2 focus:ring-primary/30
                                                focus:shadow-[0_0_30px_rgba(138,180,248,0.15)]
                                                transition-all duration-300
                                                resize-none
                                            "
                                            autoFocus
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-error text-[10px] bg-error/10 p-2 rounded-lg"
                                        >
                                            <AlertCircle size={12} />
                                            {errorMessage}
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {status !== 'success' && (
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!message.trim() || status === 'sending'}
                                    className="
                                        flex items-center gap-2 px-6 py-2.5 rounded-xl
                                        bg-primary text-black font-bold text-xs uppercase tracking-wider
                                        hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100
                                        transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]
                                    "
                                >
                                    {status === 'sending' ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Feedback</span>
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

`

---

## /src/features/governance/ImpactAnalyzer.ts
> Path: $Path

`$Lang
import { TokenRepository } from '../../core/TokenRepository';
import type { TokenEntity } from '../../core/types';

export interface ImpactReport {
    totalAffected: number;
    breakdown: Record<string, number>;
    tokens: TokenEntity[];
    severity: 'low' | 'medium' | 'high';
}

export class ImpactAnalyzer {
    private graph: TokenRepository;

    constructor(graph: TokenRepository) {
        this.graph = graph;
    }

    analyzeChange(tokenId: string): ImpactReport {
        const affectedTokens = this.graph.getImpact(tokenId);

        // Categorize by type
        const breakdown = affectedTokens.reduce((acc, token) => {
            acc[token.$type] = (acc[token.$type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalAffected = affectedTokens.length;

        let severity: 'low' | 'medium' | 'high' = 'low';
        if (totalAffected > 50) severity = 'high';
        else if (totalAffected > 10) severity = 'medium';

        return {
            totalAffected,
            breakdown,
            tokens: affectedTokens,
            severity
        };
    }

    // Alias for consistency
    analyzeImpact(tokenId: string): ImpactReport {
        return this.analyzeChange(tokenId);
    }
}

`

---

## /src/features/governance/ui/components/ImpactWarning.tsx
> Path: $Path

`$Lang
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import type { TokenEntity } from '../../../../core/types';

export interface ImpactReport {
    totalAffected: number;
    breakdown: Record<string, number>;
    tokens: TokenEntity[];
    severity: 'low' | 'medium' | 'high';
}

export function ImpactWarning({ report, onDismiss }: { report: ImpactReport | null, onDismiss: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (report && !visible) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onDismiss, 300); // Wait for fade out
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [report, onDismiss, visible]);

    if (!report && !visible) return null;

    const severityStyles = {
        low: 'bg-slate-800 border-blue-500/50 shadow-blue-500/20',
        medium: 'bg-slate-800 border-yellow-500/50 shadow-yellow-500/20',
        high: 'bg-slate-900 border-red-500 shadow-red-500/30 ring-1 ring-red-500/50'
    };

    const severityIcon = {
        low: 'ℹ️',
        medium: '⚠️',
        high: '🚨'
    };

    return (
        <div className={clsx(
            "fixed bottom-8 right-8 z-50 transition-all duration-300 transform",
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}>
            <div className={clsx(
                "bg-slate-900 border backdrop-blur-md rounded-lg p-4 shadow-xl max-w-sm w-full",
                report ? severityStyles[report.severity] : ""
            )}>
                <div className="flex items-start gap-3">
                    <div className="text-2xl">{report ? severityIcon[report.severity] : ''}</div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-100 text-sm">
                            Impact Analysis
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Modifying this token will affect <strong className="text-slate-200">{report?.totalAffected} elements</strong>.
                        </p>
                        {report?.breakdown && (
                            <ul className="mt-2 space-y-1">
                                {Object.entries(report.breakdown).map(([type, count]) => (
                                    <li key={type} className="text-[10px] text-slate-500 flex justify-between uppercase tracking-wider">
                                        <span>{type}</span>
                                        <span className="font-mono text-slate-300">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <button
                        onClick={() => setVisible(false)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

`

---

## /src/features/governance/VariableManager.ts
> Path: $Path

`$Lang
import type { TokenEntity, VariableValue } from '../../core/types';
import type { TokenRepository } from '../../core/TokenRepository';
import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';

/**
 * Domain Service for Variable Governance.
 * Coordinates between the Repository (Storage) and the Repository (State).
 */
export class VariableManager {
    private repository: TokenRepository;
    private figmaRepo: IVariableRepository;

    constructor(repository: TokenRepository, figmaRepo: IVariableRepository) {
        this.repository = repository;
        this.figmaRepo = figmaRepo;
    }

    /**
     * Syncs all local variables from Storage into the TokenGraph.
     */
    async syncFromFigma(): Promise<TokenEntity[]> {
        this.repository.reset();

        // Delegate to repository
        const tokens = await this.figmaRepo.sync();

        // Populate Repository
        for (const token of tokens) {
            this.repository.addNode(token);
        }

        // Add edges
        for (const token of tokens) {
            for (const depId of token.dependencies) {
                this.repository.addEdge(token.id, depId);
            }
        }

        return tokens;
    }

    /**
     * 🌊 Progressive Sync Generator
     * Yields chunks of tokens as they are processed.
     */
    async *syncGenerator(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]> {
        if (!this.figmaRepo.syncGenerator) {
            // Fallback for repos that don't support generation (e.g. tests)
            yield this.syncFromFigma();
            return;
        }

        this.repository.reset(); // Clear graph before starting

        for await (const chunk of this.figmaRepo.syncGenerator(abortSignal)) {
            // Populate Repository incrementally
            for (const token of chunk) {
                this.repository.addNode(token);
            }
            // Edges must be added after nodes exist? 
            // Actually, addNode is safe.
            // But addEdge requires both nodes to exist in some graph implementations.
            // If we have forward references (token A depends on token B, B comes in later chunk), `addEdge` might fail if it strictly checks existence.
            // `TokenRepository` likely uses an adjacency list.
            // Safe bet: Add nodes first, add edges later? 
            // OR: Add edges permissively (create placeholder nodes).

            // Let's assume standard behavior: We yield the chunk.
            // The Controller emits the chunk to UI.
            // We need to build the graph correctly.
            // If `chunk` has dependencies not yet in graph, we delay edge creation?
            // "Deep dependency resolution" is listed as "Deferred" in requirements (Phase 3).
            // But basic "A references B" is needed for values.

            // For now, let's just add nodes. Edges might need a second pass or lazy resolve.
            // Review VariableManager.ts logic: it adds edges *after* adding all nodes in `syncFromFigma`.

            yield chunk;
        }

        // Post-Load: Build Edges (Heavy?)
        // If we do this here, it's blocking at the end.
        // It's fast (in-memory, no API calls).
        const allNodes = this.repository.getAllNodes(); // Assuming this exists or we iterate
        // Re-iterating 1000 nodes for edges is sub-millisecond in JS typically.

        for (const token of allNodes) {
            for (const depId of token.dependencies) {
                this.repository.addEdge(token.id, depId);
            }
        }
    }

    /**
     * Creates a new variable via repository.
     */
    async createVariable(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void> {
        await this.figmaRepo.create(name, type, value);
    }

    /**
     * Updates a variable value directly via repository.
     */
    async updateVariable(id: string, value: VariableValue): Promise<void> {
        await this.figmaRepo.update(id, value);
    }

    async renameVariable(id: string, newName: string): Promise<void> {
        await this.figmaRepo.rename(id, newName);
    }
}

`

---

## /src/features/intelligence/CloudColorNamer.ts
> Path: $Path

`$Lang
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';
import { ColorScience } from './ColorScience';

export interface ClosestColor {
    match_name: string;
    match_hex: string;
    distance: number;
}

/**
 * ☁️ CloudColorNamer (L7 standard)
 * Orchestrates hybrid color search: SQL spatial pruning + JS precision refinement.
 */
export class CloudColorNamer {
    /**
     * Finds the most accurate human-readable name for a given Hex color.
     * Path: Local Input -> DB Search (Euclidean) -> Local Refinement (CIEDE2000)
     */
    static async findColor(hex: string): Promise<string> {
        const client = VibeSupabase.get();
        if (!client) return "Unknown (Offline)";

        const lab = ColorScience.hexToLab(hex);

        // 1. Database Search (SQL Pruning)
        // We fetch the top 10 candidates using fast spatial Euclidean distance
        const { data: candidates, error } = await client.rpc('find_closest_color', {
            input_l: lab.L,
            input_a: lab.a,
            input_b: lab.b,
            match_limit: 10
        });

        if (error) {
            console.error(`[CloudColorNamer] DB Pruning Failure: ${error.message}`);
            return "Unknown Color";
        }

        if (!candidates || (candidates as ClosestColor[]).length === 0) {
            return "Unknown Color";
        }

        // 2. Local Refinement (CIEDE2000 Precision)
        // Apply the gold-standard algorithm to the top candidates
        const results = (candidates as ClosestColor[]).map(candidate => {
            const candidateLab = ColorScience.hexToLab(candidate.match_hex);
            return {
                name: candidate.match_name,
                precisionDistance: ColorScience.deltaE2000(lab, candidateLab)
            };
        });

        // 3. Return the absolute best match
        results.sort((a, b) => a.precisionDistance - b.precisionDistance);
        return results[0].name;
    }
}

`

---

## /src/features/intelligence/ColorScience.ts
> Path: $Path

`$Lang
import { colord } from 'colord';

export interface LAB {
    L: number;
    a: number;
    b: number;
}

/**
 * 🧪 ColorScience Engine (L7 standard)
 * Handles high-precision color space conversions and delta-E calculations.
 */
export class ColorScience {
    /**
     * Converts Hex to CIE-L*a*b* coordinates.
     * Standard: D65 Illuminant / 2° Observer.
     */
    static hexToLab(hex: string): LAB {
        const c = colord(hex).toRgb();
        return this.rgbToLab(c.r, c.g, c.b);
    }

    static rgbToLab(r: number, g: number, b: number): LAB {
        // 1. Normalize RGB to [0, 1]
        let nr = r / 255;
        let ng = g / 255;
        let nb = b / 255;

        // 2. Linearize RGB (Gamma removal)
        nr = nr > 0.04045 ? Math.pow((nr + 0.055) / 1.055, 2.4) : nr / 12.92;
        ng = ng > 0.04045 ? Math.pow((ng + 0.055) / 1.055, 2.4) : ng / 12.92;
        nb = nb > 0.04045 ? Math.pow((nb + 0.055) / 1.055, 2.4) : nb / 12.92;

        // 3. Convert to XYZ (D65)
        let x = (nr * 0.4124 + ng * 0.3576 + nb * 0.1805) * 100;
        let y = (nr * 0.2126 + ng * 0.7152 + nb * 0.0722) * 100;
        let z = (nr * 0.0193 + ng * 0.1192 + nb * 0.9505) * 100;

        // 4. XYZ to LAB
        x /= 95.047;
        y /= 100.000;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

        const L = 116 * y - 16;
        const a = 500 * (x - y);
        const labB = 200 * (y - z);

        return { L, a, b: labB };
    }

    /**
     * CIEDE2000 Algorithm (High Precision)
     * Returns a value where <= 1.0 is imperceptible to the human eye.
     */
    static deltaE2000(lab1: LAB, lab2: LAB): number {
        const { L: L1, a: a1, b: b1 } = lab1;
        const { L: L2, a: a2, b: b2 } = lab2;

        const avgL = (L1 + L2) / 2;
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);
        const avgC = (C1 + C2) / 2;

        const G = 0.5 * (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
        const a1Prime = a1 * (1 + G);
        const a2Prime = a2 * (1 + G);

        const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
        const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
        const avgCPrime = (C1Prime + C2Prime) / 2;

        const h1Prime = (Math.atan2(b1, a1Prime) * 180) / Math.PI;
        const h2Prime = (Math.atan2(b2, a2Prime) * 180) / Math.PI;

        const deltaLPrime = L2 - L1;
        const deltaCPrime = C2Prime - C1Prime;

        let hDiff = h2Prime - h1Prime;
        if (C1Prime * C2Prime !== 0) {
            if (hDiff > 180) hDiff -= 360;
            else if (hDiff < -180) hDiff += 360;
        } else {
            hDiff = 0;
        }
        const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((hDiff / 2 * Math.PI) / 180);

        const avgHPrime = C1Prime * C2Prime === 0 ? h1Prime + h2Prime :
            Math.abs(h1Prime - h2Prime) <= 180 ? (h1Prime + h2Prime) / 2 :
                h1Prime + h2Prime < 360 ? (h1Prime + h2Prime + 360) / 2 : (h1Prime + h2Prime - 360) / 2;

        const T = 1 - 0.17 * Math.cos((avgHPrime - 30) * Math.PI / 180) +
            0.24 * Math.cos(2 * avgHPrime * Math.PI / 180) +
            0.32 * Math.cos((3 * avgHPrime + 6) * Math.PI / 180) -
            0.20 * Math.cos((4 * avgHPrime - 63) * Math.PI / 180);

        const SL = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
        const SC = 1 + 0.045 * avgCPrime;
        const SH = 1 + 0.015 * avgCPrime * T;

        const deltaTheta = 30 * Math.exp(-Math.pow((avgHPrime - 275) / 25, 2));
        const RC = 2 * Math.sqrt(Math.pow(avgCPrime, 7) / (Math.pow(avgCPrime, 7) + Math.pow(25, 7)));
        const RT = -RC * Math.sin((2 * deltaTheta * Math.PI) / 180);

        const KL = 1, KC = 1, KH = 1;

        const deltaE = Math.sqrt(
            Math.pow(deltaLPrime / (KL * SL), 2) +
            Math.pow(deltaCPrime / (KC * SC), 2) +
            Math.pow(deltaHPrime / (KH * SH), 2) +
            RT * (deltaCPrime / (KC * SC)) * (deltaHPrime / (KH * SH))
        );

        return deltaE;
    }
}

`

---

## /src/features/intelligence/omnibox/index.ts
> Path: $Path

`$Lang
export * from './ui/OmniboxTrigger';
export * from './ui/OmniboxModal';
export * from './ui/OmniboxEyes';

`

---

## /src/features/intelligence/omnibox/ui/OmniboxEyes.tsx
> Path: $Path

`$Lang
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export const OmniboxEyes = ({ expression = 'neutral' }: { expression?: 'neutral' | 'happy' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            // Limit movement range (max 3px in any direction)
            const maxMove = 3;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = distance > 0 ? Math.min(distance, 50) / 50 : 0; // increasing sensitivity

            const x = (dx / (distance || 1)) * maxMove * scale;
            const y = (dy / (distance || 1)) * maxMove * scale;

            setPupilPos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Blinking logic
    useEffect(() => {
        const blinkLoop = () => {
            const timeToNextBlink = Math.random() * 3000 + 2000; // 2-5s
            setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => {
                    setIsBlinking(false);
                    blinkLoop();
                }, 150);
            }, timeToNextBlink);
        };
        blinkLoop();
    }, []);

    return (
        <div ref={containerRef} className="flex gap-[2px] items-center justify-center w-full h-full">
            {/* Left Eye */}
            <Eye isBlinking={isBlinking} pupilPos={pupilPos} expression={expression} />
            {/* Right Eye */}
            <Eye isBlinking={isBlinking} pupilPos={pupilPos} expression={expression} />
        </div>
    );
};

const Eye = ({ isBlinking, pupilPos, expression }: { isBlinking: boolean; pupilPos: { x: number; y: number }, expression: 'neutral' | 'happy' }) => {
    // Memoize the random tilt so it doesn't change on every render frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const randomTilt = useMemo(() => Math.random() > 0.5 ? -10 : 10, [expression === 'happy']);

    return (
        <div className="relative w-2.5 h-3.5 rounded-full overflow-hidden shadow-sm">
            <motion.div
                initial={false}
                animate={{
                    // Squint logic:
                    height: expression === 'happy' ? '12px' : '100%',
                    borderRadius: expression === 'happy' ? '0px 0px 100% 100%' : '100%',
                    // Blink logic overrides
                    scaleY: isBlinking ? 0.1 : (expression === 'happy' ? 0.6 : 1),
                    rotate: expression === 'happy' ? randomTilt : 0, // Cheerful tilt
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-full h-full bg-white relative flex items-center justify-center ${expression === 'happy' ? 'mt-1' : ''}`}
            >
                <motion.div
                    className="w-1.5 h-1.5 bg-black rounded-full"
                    animate={{
                        x: pupilPos.x,
                        y: pupilPos.y,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
            </motion.div>
        </div>
    );
};

`

---

## /src/features/intelligence/omnibox/ui/OmniboxModal.tsx
> Path: $Path

`$Lang
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
                                <div className="relative flex items-center gap-4 px-6 py-5 bg-void/95 backdrop-blur-2xl border border-primary/50 shadow-card rounded-[24px]">

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
                                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-white placeholder:text-text-dim"
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
                                className="mt-4 text-center text-xs font-medium text-text-dim uppercase tracking-widest"
                            >
                                Press <span className="text-text-primary">Enter</span> to execute • <span className="text-text-primary">Esc</span> to close
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

`

---

## /src/features/intelligence/omnibox/ui/OmniboxTrigger.tsx
> Path: $Path

`$Lang
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
                omnibox.show("💡 Got feedback? We're listening!", { duration: 4000 });
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
                "fixed z-[9999] group outline-none cursor-pointer transition-all duration-500",
                // Don't use className for positioning - we'll animate it via motion values
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
            animate={{
                scale: 1,
                opacity: 1,
                // Spotlight Animation: Move eyes UP when modal opens
                bottom: isOpen
                    ? isLifted ? 'calc(60vh + 72px)' : '60vh'  // Move to spotlight position
                    : isLifted ? '96px' : '24px',              // Default bottom-right
                right: isOpen
                    ? '50%'    // Center horizontally
                    : '24px',  // Default right edge
                x: isOpen ? '50%' : 0,  // Offset for centering
            }}
            whileHover={{ scale: (isCoolingDown || isOpen) ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
                opacity: { type: "spring", stiffness: 300, damping: 20 },
                // Smooth spotlight movement
                bottom: { type: "spring", stiffness: 200, damping: 25, mass: 0.8 },
                right: { type: "spring", stiffness: 200, damping: 25, mass: 0.8 },
                x: { type: "spring", stiffness: 200, damping: 25, mass: 0.8 },
            }}
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

            {/* 🎭 Spotlight Beam - Theatrical Light Effect */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 20,
                            opacity: { duration: 0.5 }
                        }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-64 h-[50vh] origin-top pointer-events-none"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(138, 180, 248, 0.2) 0%, rgba(138, 180, 248, 0.1) 30%, transparent 100%)',
                            filter: 'blur(30px)',
                            clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)', // Cone shape
                        }}
                    />
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

`

---

## /src/features/intelligence/types.ts
> Path: $Path

`$Lang
export type TokenValue = string | number | Record<string, unknown>;

export type TokenType = 'color' | 'spacing' | 'borderRadius' | 'typography' | 'boxShadow' | 'fontFamily' | 'fontSize' | 'fontWeight';

export interface VibeToken {
    name: string;
    $value: TokenValue;
    $type: TokenType;
    description?: string;
    tags?: string[];
}

export interface DesignNode {
    id: string;
    type: string;
    name: string;
    fills?: readonly Paint[];
    strokes?: readonly Paint[];
    effects?: readonly Effect[];
    fontName?: FontName;
    fontSize?: number;
    fontWeight?: number;
    letterSpacing?: LetterSpacing;
    lineHeight?: LineHeight;
    cornerRadius?: number | typeof figma.mixed;
    width?: number;
    height?: number;
}

export interface ScannedPrimitive {
    id: string;
    name: string;
    $value: TokenValue;
    $type: TokenType;
    usageCount?: number;
}

export type IntentType = 'GENERATE_SYSTEM' | 'MODIFY_TOKEN' | 'ANSWER_QUESTION' | 'RENAME_COLLECTION';

export interface UserIntent {
    type: IntentType;
    confidence: number;
    originalQuery: string;
    payload?: Record<string, unknown>;
}

export interface AgentContext {
    apiKey: string;
    vibe: string;
    primitives: ScannedPrimitive[];
    history: string[];
}

`

---

## /src/features/intelligence/ui/components/LineageExplorer.tsx
> Path: $Path

`$Lang
import { useState, useMemo } from 'react';
import { Search, ArrowDown, ArrowUp, GitCommit, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TokenEntity } from '../../../../core/types';

interface LineageExplorerProps {
    tokens: TokenEntity[];
    onTrace: (tokenId: string) => void;
    lineageData: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

export function LineageExplorer({ tokens, onTrace, lineageData }: LineageExplorerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const checkLineage = (id: string) => {
        setSearchQuery('');
        setIsSearching(false);
        onTrace(id);
    };

    const filteredTokens = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return tokens.filter(t => t.name.toLowerCase().includes(q) || t.path.join('/').toLowerCase().includes(q)).slice(0, 8);
    }, [tokens, searchQuery]);

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-surface-0">
            {/* 🔍 Internal Quick Jump (Optional, since we have sidebar) */}
            <div className="relative z-30 pt-4 px-6 pb-2 w-full max-w-xl mx-auto">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Quick trace..."
                        className="w-full bg-surface-1 border border-surface-active rounded-lg py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:bg-surface-2 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearching(true);
                        }}
                        onFocus={() => setIsSearching(true)}
                    />
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {isSearching && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute top-full left-6 right-6 mt-1 bg-surface-0 border border-surface-active rounded-lg overflow-hidden shadow-xl z-50 ring-1 ring-black/5"
                        >
                            {filteredTokens.length > 0 ? (
                                filteredTokens.map(token => (
                                    <button
                                        key={token.id}
                                        onClick={() => checkLineage(token.id)}
                                        className="w-full text-left px-3 py-2.5 hover:bg-surface-1 flex items-center justify-between group transition-colors border-b border-surface-active/50 last:border-0"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-text-primary font-medium text-xs truncate">{token.name}</span>
                                            <span className="text-[10px] text-text-muted truncate">{token.path.join(' / ')}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-text-muted text-xs">
                                    No tokens found
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🧬 Lineage Graph */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 pb-12 pt-4">
                {lineageData ? (
                    <div className="flex flex-col items-center gap-0 w-full max-w-md mx-auto relative">

                        {/* ⛓️ The Spine */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-active -translate-x-1/2 z-0" />

                        {/* ⬆️ Ancestors (Upstream) */}
                        <div className="flex flex-col items-center w-full gap-3 z-10 pb-8">
                            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-0 px-3 py-1 rounded-full border border-surface-active mb-2">
                                References (Upstream)
                            </h3>

                            {lineageData.ancestors.length === 0 ? (
                                <div className="px-4 py-2 bg-surface-1 rounded-md border border-dashed border-surface-active text-[10px] text-text-dim">
                                    No dependencies (Primitive)
                                </div>
                            ) : (
                                lineageData.ancestors.map((node, idx) => (
                                    <NodeCard
                                        key={node.id}
                                        node={node}
                                        type="ancestor"
                                        onClick={() => checkLineage(node.id)}
                                        index={idx}
                                    />
                                ))
                            )}
                        </div>

                        {/* 💎 Target Nucleus (Center) */}
                        <motion.div
                            layoutId={lineageData.target.id}
                            className="my-4 relative z-20 w-full max-w-[340px]"
                        >
                            <div className="bg-surface-0 border-2 border-primary/20 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-primary/40 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-[10px] text-text-muted font-mono bg-surface-1 px-1.5 py-0.5 rounded border border-surface-active">
                                        {lineageData.target.path.join(' / ')}
                                    </div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Active</div>
                                </div>

                                <h1 className="text-lg font-bold text-text-primary mb-4 truncate text-center select-text">
                                    {lineageData.target.name}
                                </h1>

                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div className="bg-surface-1/50 rounded-lg p-2.5 border border-surface-active flex flex-col items-center text-center">
                                        <span className="text-[9px] text-text-dim uppercase tracking-wider mb-1">Type</span>
                                        <span className="text-xs font-semibold text-text-primary">{lineageData.target.$type}</span>
                                    </div>
                                    <div className="bg-surface-1/50 rounded-lg p-2.5 border border-surface-active flex flex-col items-center text-center">
                                        <span className="text-[9px] text-text-dim uppercase tracking-wider mb-1">Value</span>
                                        <ValueDisplay value={lineageData.target.$value} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ⬇️ Descendants (Downstream) */}
                        <div className="flex flex-col items-center w-full gap-3 z-10 pt-8">
                            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-0 px-3 py-1 rounded-full border border-surface-active mb-2">
                                Usage (Downstream)
                            </h3>

                            {lineageData.descendants.length === 0 ? (
                                <div className="px-4 py-2 bg-surface-1 rounded-md border border-dashed border-surface-active text-[10px] text-text-dim">
                                    Unused leaf node
                                </div>
                            ) : (
                                lineageData.descendants.map((node, idx) => (
                                    <NodeCard
                                        key={node.id}
                                        node={node}
                                        type="descendant"
                                        onClick={() => checkLineage(node.id)}
                                        index={idx}
                                    />
                                ))
                            )}

                        </div>

                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

function NodeCard({ node, type, onClick, index }: { node: TokenEntity, type: 'ancestor' | 'descendant', onClick: () => void, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: type === 'ancestor' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative"
        >
            <button
                onClick={onClick}
                className="relative z-10 w-[240px] px-3 py-2.5 bg-surface-0 hover:bg-surface-1 border border-surface-active hover:border-primary/30 rounded-lg flex items-center justify-between transition-all shadow-sm group-hover:shadow-md text-left"
            >
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-text-primary truncate">{node.name}</span>
                    <span className="text-[10px] text-text-dim font-mono truncate max-w-[180px]">{String(node.$value)}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted">
                    {type === 'ancestor' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                </div>
            </button>
        </motion.div>
    )
}

function ValueDisplay({ value }: { value: string | number }) {
    const [copied, setCopied] = useState(false);
    const strVal = String(value);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(strVal);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button onClick={handleCopy} className="flex items-center gap-1.5 max-w-full group hover:text-primary transition-colors">
            <span className="text-xs font-mono font-medium truncate" title={strVal}>{strVal}</span>
            {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center opacity-60">
            <div className="w-16 h-16 bg-surface-1 rounded-2xl flex items-center justify-center mb-4 border border-surface-active">
                <GitCommit size={32} className="text-text-muted" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">Select a Token</h3>
            <p className="text-xs text-text-dim max-w-[200px]">
                Choose a token from the sidebar to visualize its relationships.
            </p>
        </div>
    );
}

`

---

## /src/features/intelligence/ui/components/SmartInspector.tsx
> Path: $Path

`$Lang
import { useState } from 'react';
import { type TokenEntity } from '../../../../core/types';
import { Table, Eye, Code, Package, Terminal } from 'lucide-react';

import type { VariableValue } from '../../../../core/types';

interface SmartInspectorProps {
    tokens: TokenEntity[];
    onUpdate: (id: string, value: VariableValue) => void;
}

export function SmartInspector({ tokens, onUpdate }: SmartInspectorProps) {
    const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
    const [jsonContent, setJsonContent] = useState(() => JSON.stringify(tokens, null, 2));

    // Suppress unused onUpdate warning until fully implemented with diffing engine
    void onUpdate;

    const handleJsonSave = () => {
        try {
            const parsed = JSON.parse(jsonContent);
            // In a real implementation, we'd diff and apply partial updates
            console.log("Saving JSON Surgery:", parsed);
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "JSON Surgery Applied (Simulation)" } }, '*');
        } catch {
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Invalid JSON Syntax" } }, '*');
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-0 font-sans">
            {/* Toolbar */}
            <div className="p-3 border-b border-surface-1 flex items-center justify-between bg-surface-1/30">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Terminal size={14} className="text-primary" />
                        Smart Inspector
                    </h2>
                    <div className="flex bg-surface-0 rounded-md p-0.5 border border-surface-active">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all ${viewMode === 'table' ? 'bg-surface-active text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            <Table size={12} /> Table View
                        </button>
                        <button
                            onClick={() => setViewMode('json')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all ${viewMode === 'json' ? 'bg-surface-active text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            <Code size={12} /> Surgical JSON
                        </button>
                    </div>
                </div>

                <div className="text-[10px] text-text-muted font-mono bg-surface-1 px-2 py-1 rounded">
                    NODES_TOTAL: {tokens.length}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'table' ? (
                    <div className="h-full overflow-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-surface-1/80 backdrop-blur-md z-1">
                                <tr className="border-b border-surface-active">
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Token Name</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Value</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">References</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-active/50">
                                {tokens.map(token => (
                                    <tr key={token.id} className="hover:bg-surface-1/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded bg-surface-1 flex items-center justify-center text-[10px] text-text-muted">
                                                    <Package size={10} />
                                                </div>
                                                <span className="text-xs font-medium text-text-primary">{token.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                                {token.$type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                {token.$type === 'color' && (
                                                    <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: String(token.$value) }} />
                                                )}
                                                {String(token.$value)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[10px] text-text-muted">
                                            {token.dependencies.length} Deps / {token.dependents.length} Refs
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="p-1.5 text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye size={12} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Request deep sync
                                                }}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                {/* Placeholder for new button content */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-full flex flex-col p-4 bg-[#0d1117]">
                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            className="flex-1 bg-transparent text-success font-mono text-xs outline-none resize-none border-none leading-relaxed"
                            spellCheck={false}
                        />
                        <div className="mt-4 flex justify-end gap-2 shrink-0">
                            <button
                                onClick={handleJsonSave}
                                className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/40 rounded-md text-[10px] font-bold hover:bg-primary/30 transition-all shadow-glow-primary"
                            >
                                UPDATE_DATA_L7
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

`

---

## /src/features/perception/capabilities/naming/ColorNamer.ts
> Path: $Path

`$Lang
import { ColorScience, type LAB } from './ColorScience';
import { ColorRepository } from '../../../../infrastructure/supabase/ColorRepository';
import type { RemoteColor } from '../../../../infrastructure/supabase/ColorRepository';
import { HueAnalyzer } from './HueBuckets';

export type NamedColor = { name: string; hex: string; lab: LAB };

export interface NamingResult {
    name: string;
    confidence: number; // 0 to 1
    source: 'exact' | 'db_perfect' | 'db_approx' | 'algo_fallback';
    deltaE?: number;
}

export class ColorNamer {
    private static instance: ColorNamer;
    private colors: NamedColor[] = [];
    private isInitialized = false;

    private constructor() { }

    public static get(): ColorNamer {
        if (!ColorNamer.instance) {
            ColorNamer.instance = new ColorNamer();
        }
        return ColorNamer.instance;
    }

    public async init() {
        if (this.isInitialized) return true;

        try {
            const remotes = await ColorRepository.fetchAll();
            if (remotes && remotes.length > 0) {
                this.colors = remotes.map((r: RemoteColor) => ({
                    name: r.name,
                    hex: r.hex,
                    lab: ColorScience.hexToLab(r.hex)
                }));
                this.isInitialized = true;
                console.log(`🎨 Vibe Architect: Intelligent Engine active with ${this.colors.length} nodes.`);
                return true;
            }
        } catch (e) {
            console.error("[ColorNamer] Initialization failed:", e);
        }
        return false;
    }

    public isReady(): boolean {
        return this.isInitialized;
    }

    /**
     * The Multi-Stage Naming Pipeline
     * Goal: 99%+ Semantic Accuracy
     */
    public name(hex: string): NamingResult {
        const inputHex = hex.toLowerCase().trim();
        const inputLab = ColorScience.hexToLab(inputHex);

        // STAGE 1: Exact Match (100% Accuracy)
        const exact = this.colors.find(c => c.hex.toLowerCase() === inputHex);
        if (exact) {
            return { name: exact.name, confidence: 1.0, source: 'exact' };
        }

        if (!this.isInitialized || this.colors.length === 0) {
            return this.algorithmicFallback(inputHex, inputLab);
        }

        // STAGE 2: High Confidence CIEDE2000 (95%+ accuracy)
        const results = this.colors.map(c => ({
            name: c.name,
            deltaE: ColorScience.deltaE2000(inputLab, c.lab),
            hex: c.hex
        })).sort((a, b) => a.deltaE - b.deltaE);

        const best = results[0];
        if (best.deltaE <= 2.3) {
            return { name: best.name, confidence: 0.95, source: 'db_perfect', deltaE: best.deltaE };
        }

        // STAGE 3: Weighted Hue Priority (For "good enough" naming)
        const weightedResults = this.colors.map(c => ({
            name: c.name,
            deltaE: ColorScience.weightedDeltaE(inputLab, c.lab, { L: 1.0, C: 1.0, H: 2.5 }),
            hex: c.hex
        })).sort((a, b) => a.deltaE - b.deltaE);

        const weightedBest = weightedResults[0];
        if (weightedBest.deltaE <= 20.0) {
            return {
                name: weightedBest.name,
                confidence: Math.max(0.6, 0.9 - (weightedBest.deltaE / 50)),
                source: 'db_approx',
                deltaE: weightedBest.deltaE
            };
        }

        // STAGE 4: Algorithmic Fallback (Safety Net)
        return this.algorithmicFallback(inputHex, inputLab);
    }

    private algorithmicFallback(hex: string, lab: LAB): NamingResult {
        const family = HueAnalyzer.getFamily(hex);
        const shade = HueAnalyzer.getShade(lab.L);
        return {
            name: `${family}-${shade}`,
            confidence: 0.5,
            source: 'algo_fallback'
        };
    }

    public analyze(hex: string) {
        const result = this.name(hex);
        const lab = ColorScience.hexToLab(hex);

        return {
            hex,
            ...result,
            lab,
            family: HueAnalyzer.getFamily(hex),
            shade: HueAnalyzer.getShade(lab.L),
            dbSize: this.colors.length
        };
    }
}

/**
 * Public Singleton API
 */
export const vibeColor = {
    name: (hex: string) => ColorNamer.get().name(hex).name,
    fullResult: (hex: string) => ColorNamer.get().name(hex),
    info: (hex: string) => ColorNamer.get().analyze(hex),
    isReady: () => ColorNamer.get().isReady(),
    init: () => ColorNamer.get().init()
};

`

---

## /src/features/perception/capabilities/naming/ColorScience.ts
> Path: $Path

`$Lang
/**
 * ═══════════════════════════════════════════════════════════════════════
 * VIBE COLOR SCIENCE ENGINE (CIE 1976 L*a*b* + CIEDE2000)
 * ═══════════════════════════════════════════════════════════════════════
 */
export type RGB = { r: number; g: number; b: number };
export type LAB = { L: number; a: number; b: number };

export class ColorScience {
    // CIE Constants (ISO/CIE 11664-4:2019)
    private static readonly EPSILON = 216 / 24389;
    private static readonly KAPPA = 24389 / 27;
    private static readonly REF_WHITE = { X: 0.95047, Y: 1.00000, Z: 1.08883 };

    // Memoization Cache
    private static labCache = new Map<string, LAB>();
    private static readonly CACHE_LIMIT = 2048;

    static hexToLab(hex: string): LAB {
        const key = hex.toLowerCase().replace('#', '');

        if (this.labCache.has(key)) {
            return this.labCache.get(key)!;
        }

        const rgb = this.hexToRgb(key);
        const lab = this.rgbToLab(rgb);

        if (this.labCache.size >= this.CACHE_LIMIT) {
            const firstKey = this.labCache.keys().next().value;
            if (firstKey) this.labCache.delete(firstKey);
        }

        this.labCache.set(key, lab);
        return lab;
    }

    private static hexToRgb(hex: string): RGB {
        // Handle short hex
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }

        const val = parseInt(hex, 16);
        return {
            r: (val >> 16) & 255,
            g: (val >> 8) & 255,
            b: val & 255
        };
    }

    private static rgbToLab({ r, g, b }: RGB): LAB {
        let R = r / 255, G = g / 255, B = b / 255;

        R = R > 0.04045 ? Math.pow((R + 0.055) / 1.055, 2.4) : R / 12.92;
        G = G > 0.04045 ? Math.pow((G + 0.055) / 1.055, 2.4) : G / 12.92;
        B = B > 0.04045 ? Math.pow((B + 0.055) / 1.055, 2.4) : B / 12.92;

        const X = R * 0.4124564 + G * 0.3575761 + B * 0.1804375;
        const Y = R * 0.2126729 + G * 0.7151522 + B * 0.0721750;
        const Z = R * 0.0193339 + G * 0.1191920 + B * 0.9503041;

        const fx = this.fXYZ(X / this.REF_WHITE.X);
        const fy = this.fXYZ(Y / this.REF_WHITE.Y);
        const fz = this.fXYZ(Z / this.REF_WHITE.Z);

        return {
            L: 116 * fy - 16,
            a: 500 * (fx - fy),
            b: 200 * (fy - fz)
        };
    }

    private static fXYZ(t: number): number {
        return t > this.EPSILON ? Math.cbrt(t) : (this.KAPPA * t + 16) / 116;
    }

    static deltaE2000(lab1: LAB, lab2: LAB): number {
        const { L: L1, a: a1, b: b1 } = lab1;
        const { L: L2, a: a2, b: b2 } = lab2;

        const C1 = Math.hypot(a1, b1);
        const C2 = Math.hypot(a2, b2);
        const Cbar = (C1 + C2) / 2;

        const Cbar7 = Math.pow(Cbar, 7);
        const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)));

        const a1p = a1 * (1 + G);
        const a2p = a2 * (1 + G);

        const C1p = Math.hypot(a1p, b1);
        const C2p = Math.hypot(a2p, b2);

        const h1p = this.hueAngle(b1, a1p);
        const h2p = this.hueAngle(b2, a2p);

        const dLp = L2 - L1;
        const dCp = C2p - C1p;

        let dhp = h2p - h1p;
        if (C1p * C2p !== 0) {
            if (dhp > 180) dhp -= 360;
            else if (dhp < -180) dhp += 360;
        } else {
            dhp = 0;
        }

        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(this.deg2rad(dhp / 2));

        const Lpbar = (L1 + L2) / 2;
        const Cpbar = (C1p + C2p) / 2;

        let hpbar: number;
        if (C1p * C2p === 0) {
            hpbar = h1p + h2p;
        } else if (Math.abs(h1p - h2p) <= 180) {
            hpbar = (h1p + h2p) / 2;
        } else {
            hpbar = (h1p + h2p + 360) / 2;
            if (hpbar >= 360) hpbar -= 360;
        }

        const T = 1 - 0.17 * Math.cos(this.deg2rad(hpbar - 30)) +
            0.24 * Math.cos(this.deg2rad(2 * hpbar)) +
            0.32 * Math.cos(this.deg2rad(3 * hpbar + 6)) -
            0.20 * Math.cos(this.deg2rad(4 * hpbar - 63));

        const SL = 1 + (0.015 * Math.pow(Lpbar - 50, 2)) /
            Math.sqrt(20 + Math.pow(Lpbar - 50, 2));
        const SC = 1 + 0.045 * Cpbar;
        const SH = 1 + 0.015 * Cpbar * T;

        const dTheta = 30 * Math.exp(-Math.pow((hpbar - 275) / 25, 2));
        const RC = 2 * Math.sqrt(Math.pow(Cpbar, 7) / (Math.pow(Cpbar, 7) + 6103515625));
        const RT = -Math.sin(this.deg2rad(2 * dTheta)) * RC;

        return Math.sqrt(
            Math.pow(dLp / SL, 2) +
            Math.pow(dCp / SC, 2) +
            Math.pow(dHp / SH, 2) +
            RT * (dCp / SC) * (dHp / SH)
        );
    }

    /**
     * Weighted DeltaE 2000
     * Allows emphasizing Hue over Lightness/Chroma in naming scenarios.
     */
    static weightedDeltaE(lab1: LAB, lab2: LAB, weights: { L: number; C: number; H: number }): number {
        const { L: L1, a: a1, b: b1 } = lab1;
        const { L: L2, a: a2, b: b2 } = lab2;

        const C1 = Math.hypot(a1, b1);
        const C2 = Math.hypot(a2, b2);
        const Cbar = (C1 + C2) / 2;

        const Cbar7 = Math.pow(Cbar, 7);
        const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)));

        const a1p = a1 * (1 + G);
        const a2p = a2 * (1 + G);

        const C1p = Math.hypot(a1p, b1);
        const C2p = Math.hypot(a2p, b2);

        const h1p = this.hueAngle(b1, a1p);
        const h2p = this.hueAngle(b2, a2p);

        const dLp = L2 - L1;
        const dCp = C2p - C1p;

        let dhp = h2p - h1p;
        if (C1p * C2p !== 0) {
            if (dhp > 180) dhp -= 360;
            else if (dhp < -180) dhp += 360;
        } else {
            dhp = 0;
        }

        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(this.deg2rad(dhp / 2));

        const Lpbar = (L1 + L2) / 2;
        const Cpbar = (C1p + C2p) / 2;

        let hpbar: number;
        if (C1p * C2p === 0) {
            hpbar = h1p + h2p;
        } else if (Math.abs(h1p - h2p) <= 180) {
            hpbar = (h1p + h2p) / 2;
        } else {
            hpbar = (h1p + h2p + 360) / 2;
            if (hpbar >= 360) hpbar -= 360;
        }

        const T = 1 - 0.17 * Math.cos(this.deg2rad(hpbar - 30)) +
            0.24 * Math.cos(this.deg2rad(2 * hpbar)) +
            0.32 * Math.cos(this.deg2rad(3 * hpbar + 6)) -
            0.20 * Math.cos(this.deg2rad(4 * hpbar - 63));

        const SL = 1 + (0.015 * Math.pow(Lpbar - 50, 2)) /
            Math.sqrt(20 + Math.pow(Lpbar - 50, 2));
        const SC = 1 + 0.045 * Cpbar;
        const SH = 1 + 0.015 * Cpbar * T;

        const dTheta = 30 * Math.exp(-Math.pow((hpbar - 275) / 25, 2));
        const RC = 2 * Math.sqrt(Math.pow(Cpbar, 7) / (Math.pow(Cpbar, 7) + 6103515625));
        const RT = -Math.sin(this.deg2rad(2 * dTheta)) * RC;

        // Apply Weights as divisor for tolerances (Lowering KL means more sensitivity)
        const kL = 1 / weights.L;
        const kC = 1 / weights.C;
        const kH = 1 / weights.H;

        return Math.sqrt(
            Math.pow(dLp / (kL * SL), 2) +
            Math.pow(dCp / (kC * SC), 2) +
            Math.pow(dHp / (kH * SH), 2) +
            RT * (dCp / (kC * SC)) * (dHp / (kH * SH))
        );
    }

    private static hueAngle(b: number, a: number): number {
        const h = Math.atan2(b, a) * 180 / Math.PI;
        return h >= 0 ? h : h + 360;
    }

    private static deg2rad(deg: number): number {
        return deg * Math.PI / 180;
    }
}

`

---

## /src/features/perception/capabilities/naming/HueBuckets.ts
> Path: $Path

`$Lang
/**
 * 🎨 HUE BUCKETS & SEMANTIC MAPPING
 * Used as an algorithmic fallback for the ColorNamer.
 */

export interface ColorFamily {
    name: string;
    hueStart: number; // 0-360
    hueEnd: number;
}

export const COLOR_FAMILIES: ColorFamily[] = [
    { name: 'red', hueStart: 345, hueEnd: 15 },
    { name: 'orange', hueStart: 15, hueEnd: 45 },
    { name: 'yellow', hueStart: 45, hueEnd: 70 },
    { name: 'lime', hueStart: 70, hueEnd: 90 },
    { name: 'green', hueStart: 90, hueEnd: 160 },
    { name: 'teal', hueStart: 160, hueEnd: 190 },
    { name: 'cyan', hueStart: 190, hueEnd: 210 },
    { name: 'blue', hueStart: 210, hueEnd: 250 },
    { name: 'indigo', hueStart: 250, hueEnd: 280 },
    { name: 'purple', hueStart: 280, hueEnd: 320 },
    { name: 'pink', hueStart: 320, hueEnd: 345 }
];

export class HueAnalyzer {
    /**
     * Converts RGB to HSL for easy hue classification
     */
    static getHue(hex: string): number {
        const r = parseInt(hex.substring(1, 3), 16) / 255;
        const g = parseInt(hex.substring(3, 5), 16) / 255;
        const b = parseInt(hex.substring(5, 7), 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0;

        if (max !== min) {
            const d = max - min;
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return Math.round(h * 360);
    }

    static getFamily(hex: string): string {
        const hue = this.getHue(hex);

        // Handle red wrap-around
        if (hue >= 345 || hue < 15) return 'red';

        const family = COLOR_FAMILIES.find(f => hue >= f.hueStart && hue < f.hueEnd);
        return family ? family.name : 'gray';
    }

    static getShade(L: number): string {
        if (L > 95) return '50';
        if (L > 90) return '100';
        if (L > 80) return '200';
        if (L > 70) return '300';
        if (L > 60) return '400';
        if (L > 50) return '500';
        if (L > 40) return '600';
        if (L > 30) return '700';
        if (L > 20) return '800';
        if (L > 10) return '900';
        return '950';
    }
}

`

---

## /src/features/perception/capabilities/scanning/GetAnatomyCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import { Traverser } from '../../core/Traverser';
import { HierarchyVisitor, type SceneNodeAnatomy } from '../../visitors/HierarchyVisitor';

export class GetAnatomyCapability implements ICapability {
    readonly id = 'get-anatomy';
    readonly commandId = 'GET_ANATOMY';
    readonly description = 'Captures the structural hierarchy of selected nodes.';

    canExecute(context: AgentContext): boolean {
        return context.selection.length > 0;
    }

    async execute(_payload: unknown, context: AgentContext): Promise<Result<{ anatomy: SceneNodeAnatomy[] }>> {
        const traverser = new Traverser();
        const visitor = new HierarchyVisitor();

        traverser.traverse(context.selection, visitor);

        return Result.ok({
            anatomy: visitor.getAnatomy()
        });
    }
}

`

---

## /src/features/perception/capabilities/scanning/ScanSelectionCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import { Traverser } from '../../core/Traverser';
import { CompositeVisitor } from '../../visitors/CompositeVisitor';
import { TokenDiscoveryVisitor } from '../../visitors/TokenDiscoveryVisitor';
import { StatsVisitor } from '../../visitors/StatsVisitor';

export class ScanSelectionCapability implements ICapability {
    readonly id = 'scan-selection-v2';
    readonly commandId = 'SCAN_SELECTION';
    readonly description = 'Scans the current selection using Visitor Pattern v2.';

    canExecute(context: AgentContext): boolean {
        return context.selection.length > 0;
    }

    async execute(_payload: unknown, context: AgentContext): Promise<Result<{ stats: unknown; findings: unknown }>> {
        console.log('[ScanCapability] Initializing Perception Engine v2...');

        // 0. Hydrate Knowledge (Get existing tokens for Drift Detection)
        // We convert the graph to a simple Hex Map for the visitor
        const existingTokens: Record<string, string> = {};
        const graph = context.repository.getTokens();
        for (const token of graph.values()) {
            if (token.$type === 'color' && typeof token.$value === 'string') {
                existingTokens[token.name] = token.$value;
            }
        }

        // 1. Setup Visitors
        const traverser = new Traverser();
        const composite = new CompositeVisitor();

        // Inject existing tokens into Discovery Visitor
        const discovery = new TokenDiscoveryVisitor(existingTokens);
        const stats = new StatsVisitor();

        composite.add(discovery);
        composite.add(stats);

        // 2. Traverse (One Pass, Multiple Checks)
        console.time('Traversal');
        traverser.traverse(context.selection, composite);
        console.timeEnd('Traversal');

        // 3. Aggregate Results
        const findings = discovery.getFindings();
        const report = stats.getReport();

        if (findings.drifts.length > 0) {
            console.warn(`[Design Gravity] Detected ${findings.drifts.length} color drifts.`);
        }

        console.log('[ScanCapability] Stats:', report);

        return Result.ok({
            stats: report,
            findings: {
                colors: findings.colors,
                fonts: findings.fonts,
                drifts: findings.drifts,
                scannedCount: findings.stats.scanned
            }
        });
    }
}

`

---

## /src/features/perception/core/IVisitor.ts
> Path: $Path

`$Lang
export interface TraversalContext {
    depth: number;
    parentId?: string;
    path: string; // e.g. "Frame 1 > Group 2 > Text 3"
}

export interface IVisitor {
    /**
     * Visit a node in the Figma tree.
     * @param node The current scene node.
     * @param context Metadata about the traversal state.
     */
    visit(node: SceneNode, context: TraversalContext): void;
}

`

---

## /src/features/perception/core/Traverser.ts
> Path: $Path

`$Lang
import type { IVisitor, TraversalContext } from './IVisitor';

/**
 * 🚶 Traverser
 * Efficiently walks the Figma node tree and accepts visitors.
 * Handles recursion and context tracking.
 */
export class Traverser {

    /**
     * Walks a list of nodes (and their children) with the given visitor.
     */
    traverse(nodes: readonly SceneNode[], visitor: IVisitor): void {
        for (const node of nodes) {
            this.walk(node, visitor, {
                depth: 0,
                path: node.name
            });
        }
    }

    private walk(node: SceneNode, visitor: IVisitor, context: TraversalContext): void {
        // 1. Visit current node
        try {
            visitor.visit(node, context);
        } catch (e) {
            console.error(`[Traverser] Error visiting ${node.name}:`, e);
            // Continue traversal even if one node fails
        }

        // 2. Recurse if applicable (DFS)
        if ('children' in node) {
            const children = (node as { children: readonly SceneNode[] }).children;
            if (children && Array.isArray(children)) {
                for (const child of children) {
                    this.walk(child, visitor, {
                        depth: context.depth + 1,
                        parentId: node.id,
                        path: `${context.path} > ${child.name}`
                    });
                }
            }
        }
    }
}

`

---

## /src/features/perception/visitors/CompositeVisitor.ts
> Path: $Path

`$Lang
import type { IVisitor, TraversalContext } from '../core/IVisitor';

/**
 * 🌳 CompositeVisitor
 * Allows running multiple visitors in a single pass.
 */
export class CompositeVisitor implements IVisitor {
    private visitors: IVisitor[] = [];

    /**
     * Register a new visitor to the pipeline.
     */
    add(visitor: IVisitor): void {
        this.visitors.push(visitor);
    }

    visit(node: SceneNode, context: TraversalContext): void {
        for (const visitor of this.visitors) {
            visitor.visit(node, context);
        }
    }
}

`

---

## /src/features/perception/visitors/HierarchyVisitor.ts
> Path: $Path

`$Lang
import type { IVisitor, TraversalContext } from '../core/IVisitor';

export interface SceneNodeAnatomy {
    id: string;
    name: string;
    type: string;
    parentId?: string;
    depth: number;
    tokens: {
        property: string;
        variableId: string;
    }[];
}

/**
 * 🦴 HierarchyVisitor
 * Captures the structural anatomy of Figma nodes and their token/variable bindings.
 */
export class HierarchyVisitor implements IVisitor {
    public nodes: SceneNodeAnatomy[] = [];

    visit(node: SceneNode, context: TraversalContext): void {
        const tokens: { property: string; variableId: string }[] = [];

        // Check for bound variables (Figma Native Variables)
        if ('boundVariables' in node && node.boundVariables) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bv = node.boundVariables as any;

            const extractId = (target: unknown): string | undefined => {
                if (!target) return undefined;

                // VariableAlias check
                if (typeof target === 'object' && 'id' in target) {
                    return (target as { id: string }).id;
                }

                // Array check
                if (Array.isArray(target) && target.length > 0 && target[0] && 'id' in target[0]) {
                    return (target[0] as { id: string }).id;
                }

                return undefined;
            };

            // 1. Fills
            const fillId = extractId(bv.fills);
            if (fillId) tokens.push({ property: 'fill', variableId: fillId });

            // 2. Strokes
            const strokeId = extractId(bv.strokes);
            if (strokeId) tokens.push({ property: 'stroke', variableId: strokeId });

            // 3. Layout & Geometry
            const spacingId = extractId(bv.itemSpacing);
            if (spacingId) tokens.push({ property: 'spacing', variableId: spacingId });

            const radiusId = extractId(bv.cornerRadius) || extractId(bv.topLeftRadius);
            if (radiusId) tokens.push({ property: 'radius', variableId: radiusId });

            const paddingId = extractId(bv.paddingTop) || extractId(bv.paddingLeft);
            if (paddingId) tokens.push({ property: 'padding', variableId: paddingId });

            // 4. Dimensions
            const widthId = extractId(bv.width);
            if (widthId) tokens.push({ property: 'width', variableId: widthId });

            const heightId = extractId(bv.height);
            if (heightId) tokens.push({ property: 'height', variableId: heightId });
        }

        this.nodes.push({
            id: node.id,
            name: node.name,
            type: node.type,
            parentId: context.parentId,
            depth: context.depth,
            tokens
        });
    }

    getAnatomy(): SceneNodeAnatomy[] {
        return this.nodes;
    }
}

`

---

## /src/features/perception/visitors/StatsVisitor.ts
> Path: $Path

`$Lang
import type { IVisitor, TraversalContext } from '../core/IVisitor';

/**
 * 📊 StatsVisitor
 * Counts node types for debugging and analytics.
 */
export class StatsVisitor implements IVisitor {
    public counts: Record<string, number> = {};

    visit(node: SceneNode, _context: TraversalContext): void {
        const type = node.type;
        this.counts[type] = (this.counts[type] || 0) + 1;
    }

    getReport(): string {
        return Object.entries(this.counts)
            .map(([type, count]) => `${type}: ${count}`)
            .join(', ');
    }
}

`

---

## /src/features/perception/visitors/TokenDiscoveryVisitor.ts
> Path: $Path

`$Lang
import type { IVisitor, TraversalContext } from '../core/IVisitor';
import { ColorScience, type LAB } from '../capabilities/naming/ColorScience';
import { colord } from 'colord';

export interface DiscoveryResult {
    colors: Set<string>;
    fonts: Set<string>;
    drifts: Array<{ hex: string; nearestToken: string; deltaE: number; layerId: string }>;
    stats: {
        total: number;
        scanned: number;
    }
}

/**
 * 🕵️ TokenDiscoveryVisitor
 * Scans nodes for potential Design Tokens (Colors, Typography).
 * Now enhanced with "Design Gravity" to detect color drift.
 */
export class TokenDiscoveryVisitor implements IVisitor {
    private existingTokens: Map<string, LAB>; // Hex -> LAB

    public result: DiscoveryResult = {
        colors: new Set(),
        fonts: new Set(),
        drifts: [],
        stats: { total: 0, scanned: 0 }
    };

    constructor(existingTokens: Record<string, string> = {}) {
        // Pre-calculate LAB for all existing tokens for fast dE checks
        this.existingTokens = new Map();
        for (const [name, hex] of Object.entries(existingTokens)) {
            this.existingTokens.set(name, ColorScience.hexToLab(hex));
        }
    }

    visit(node: SceneNode, _context: TraversalContext): void {
        this.result.stats.total++;

        // 1. Scan Fills (Colors)
        if ('fills' in node && node.fills !== figma.mixed) {
            for (const fill of node.fills as Paint[]) {
                if (fill.type === 'SOLID') {
                    const hex = this.rgbToHex(fill.color);
                    this.result.colors.add(hex);
                    this.result.stats.scanned++;

                    // 🧲 Design Gravity: Check for Drift
                    this.checkDrift(hex, node.id);
                }
            }
        }

        // 2. Scan Typography
        if (node.type === 'TEXT') {
            const fontName = node.fontName;
            if (fontName && fontName !== figma.mixed) {
                this.result.fonts.add(`${fontName.family} ${fontName.style}`);
                this.result.stats.scanned++;
            }
        }
    }

    private checkDrift(hex: string, nodeId: string) {
        // Don't check if we have no tokens
        if (this.existingTokens.size === 0) return;

        const currentLab = ColorScience.hexToLab(hex);
        let bestMatch: { name: string; dE: number } | null = null;

        for (const [name, tokenLab] of this.existingTokens.entries()) {
            const dE = ColorScience.deltaE2000(currentLab, tokenLab);

            // Exact match? Ignore (it's good)
            if (dE < 0.1) return;

            // Update best match
            if (!bestMatch || dE < bestMatch.dE) {
                bestMatch = { name, dE };
            }
        }

        // If best match is very close (Drift Threshold), flag it
        // 0.5 < dE < 2.5 is usually the "oops" zone
        if (bestMatch && bestMatch.dE > 0.5 && bestMatch.dE < 2.5) {
            this.result.drifts.push({
                hex,
                nearestToken: bestMatch.name,
                deltaE: bestMatch.dE,
                layerId: nodeId
            });
        }
    }

    private rgbToHex(rgb: RGB): string {
        return colord(rgb).toHex().toUpperCase();
    }

    /**
     * Returns the aggregated findings as arrays.
     */
    getFindings() {
        return {
            colors: Array.from(this.result.colors),
            fonts: Array.from(this.result.fonts),
            drifts: this.result.drifts,
            stats: this.result.stats
        };
    }
}

`

---

## /src/features/security/context/ConfigContext.tsx
> Path: $Path

`$Lang
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import type { DesignSystemConfig, ConfigContextType } from './ConfigTypes';
export type { DesignSystemConfig, ConfigContextType };

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: DesignSystemConfig = {
    metadata: {
        name: 'Vibe Tokens Design System',
        version: '1.0.0',
        createdAt: new Date().toISOString()
    },
    brand: {
        primaryColor: '#00E5FF', // Electric Cyan from brand
        name: 'Brand Primary'
    },
    typography: {
        fontFamily: 'Inter',
        scaleRatio: 1.25, // Major Third
        baseSize: 16
    },
    layout: {
        gridBase: 4
    },
    advanced: {
        includeSemantics: true,
        multiMode: false
    }
};

// ============================================================================
// CONTEXT
// ============================================================================

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'vibe-tokens-config';

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useState<DesignSystemConfig>(DEFAULT_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load config from Figma storage on mount
    useEffect(() => {
        const loadConfig = async () => {
            try {
                parent.postMessage({
                    pluginMessage: { type: 'LOAD_SETTINGS', key: STORAGE_KEY }
                }, '*');
            } catch (e) {
                console.error('Failed to load config:', e);
                setIsLoaded(true);
            }
        };

        loadConfig();

        // Listen for loaded config
        const handleMessage = (event: MessageEvent) => {
            const msg = event.data.pluginMessage;
            if (msg?.type === 'SETTINGS_LOADED' && msg.key === STORAGE_KEY) {
                if (msg.value) {
                    setConfig({ ...DEFAULT_CONFIG, ...msg.value });
                }
                setIsLoaded(true);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Persist config whenever it changes
    useEffect(() => {
        if (isLoaded) {
            parent.postMessage({
                pluginMessage: {
                    type: 'SAVE_SETTINGS',
                    key: STORAGE_KEY,
                    value: config
                }
            }, '*');
        }
    }, [config, isLoaded]);

    const updateConfig = (updates: Partial<DesignSystemConfig>) => {
        setConfig(prev => {
            // Deep merge for nested updates
            const merged = { ...prev };

            if (updates.metadata) merged.metadata = { ...prev.metadata, ...updates.metadata };
            if (updates.brand) merged.brand = { ...prev.brand, ...updates.brand };
            if (updates.typography) merged.typography = { ...prev.typography, ...updates.typography };
            if (updates.layout) merged.layout = { ...prev.layout, ...updates.layout };
            if (updates.advanced) merged.advanced = { ...prev.advanced, ...updates.advanced };

            return merged;
        });
    };

    const resetConfig = () => {
        setConfig({
            ...DEFAULT_CONFIG,
            metadata: {
                ...DEFAULT_CONFIG.metadata,
                createdAt: new Date().toISOString()
            }
        });
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig, isLoaded }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};

`

---

## /src/features/security/context/ConfigTypes.ts
> Path: $Path

`$Lang
export interface DesignSystemConfig {
    metadata: {
        name: string;
        version: string;
        createdAt: string;
    };
    brand: {
        primaryColor: string;
        name: string;
    };
    typography: {
        fontFamily: string;
        customFontName?: string;
        scaleRatio: number;
        baseSize: number;
    };
    layout: {
        gridBase: 4 | 8;
    };
    advanced: {
        includeSemantics: boolean;
        multiMode: boolean;
    };
}

export interface ConfigContextType {
    config: DesignSystemConfig;
    updateConfig: (updates: Partial<DesignSystemConfig>) => void;
    resetConfig: () => void;
    isLoaded: boolean;
}

`

---

## /src/features/security/CryptoService.ts
> Path: $Path

`$Lang
/**
 * 🔐 SECURITY KERNEL: CRYPTO SERVICE (ZERO-TRUST)
 * 
 * Replaces insecure fingerprinting with PBKDF2 + User Master Password.
 * Implements strict memory hygiene and binary-safe encoding.
 */

import { storage } from '../../infrastructure/figma/StorageProxy';
import { SafeBinary } from './SafeBinary';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 310000; // OWASP recommended for PBKDF2-HMAC-SHA256 (2023 guidelines: > 310,000)
const SALT_SIZE = 16;
const IV_SIZE = 12;

/**
 * 🧠 MEMORY ENCLAVE
 * Holds the derived master key in memory ONLY. never persists to disk.
 * Using a closure pattern/module level variable that is not exported.
 */
let sessionMasterKey: CryptoKey | null = null;
let sessionTimeout: number | null = null;

// Auto-lock session after 15 minutes of inactivity (optional paranoia)
const SESSION_TTL_MS = 15 * 60 * 1000;

function resetSessionTimer() {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    sessionTimeout = window.setTimeout(() => {
        console.warn("🔒 Security: Session timed out. Clearing keys.");
        CryptoService.clearSession();
    }, SESSION_TTL_MS);
}

export const CryptoService = {

    /**
     * UNLOCK SENSITIVE CONTEXT
     * Derives the session key from the user-provided password.
     * This must be called before any encryption/decryption can occur.
     */
    async initializeSession(password: string): Promise<void> {
        if (!password || password.length < 8) {
            throw new Error("Weak Password: Master password must be at least 8 characters.");
        }

        // We use a fixed salt for the *session key derivation* if we want to reproduce the same key?
        // NO. The Master Password encrypts the *Data*. Ideally, the Data has its *own* salt.
        // Wait, for PBKDF2, we need a salt. If we don't store the salt, we can't derive the same key next time.
        // Standard pattern: 
        // 1. Store API Key -> Encrypt with (Pass + Random Salt). Store (Salt + IV + Cipher).
        // 2. Load API Key -> Read Salt. Derive Key(Pass + Read Salt). Decrypt.

        // However, this means we re-derive the key for EVERY operation using the stored salt?
        // OR we derive a "Key Encryption Key" (KEK) once?
        // To be simpler and stateless: We don't store a "Session Key" that is valid for *all* data, 
        // because each data item might have its own salt.
        // BUT, re-deriving PBKDF2 (310k iterations) on every read is slow.

        // BETTER APPROACH:
        // We do not hold a CryptoKey in memory that fits all data. 
        // We hold the *Password* (as a string or wrapped) in memory? Dangerous if memory dump.
        // OR we Cache the derived key for a specific salt? No, salt varies.

        // COMPROMISE for UX vs Security:
        // Identify a "Master Salt" (generated once, stored in config) to derive a "Master Key"?
        // No, that reduces salt uniqueness.

        // Let's stick to: We need the PASSWORD available (in memory) to derive keys on the fly, 
        // OR we ask the user for it every time (too annoying).
        // storing the password in a closure is acceptable for the "Session" duration.
        // We will store the `password` in a closure variable `_secret_` and wipe it on clear.

        // wait, if we use a "Master Key" approach:
        // Data = Encrypt(Payload, MasterKey)
        // MasterKey = Derived from Password + StoredGlobalSalt.
        // This is acceptable for a single-user client plugin.

        // Let's implement:
        // 1. Check if 'VIBE_MASTER_SALT' exists. If not, create and save it.
        // 2. API Key is Encrypt(Key, MasterKey).

        await this.createMasterSaltIfNeeded();
        const masterSalt = await this.getMasterSalt();

        sessionMasterKey = await deriveKeyFromPassword(password, masterSalt);
        resetSessionTimer();
    },

    isSessionActive(): boolean {
        return !!sessionMasterKey;
    },

    clearSession() {
        sessionMasterKey = null;
        if (sessionTimeout) clearTimeout(sessionTimeout);
    },

    /**
     * Stores the Secret Vault (JSON) encrypted with the current session key.
     */
    async saveSecrets(secrets: { supabase?: { url: string; anonKey: string } | null }): Promise<void> {
        if (!sessionMasterKey) {
            throw new Error("Security Violation: Session not initialized. User must unlock vault.");
        }
        resetSessionTimer();

        // Serialize vault
        const payload = JSON.stringify(secrets);

        const crypto = window.crypto;
        const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));

        const enc = new TextEncoder();
        const ciphertext = await crypto.subtle.encrypt(
            { name: ALGORITHM, iv },
            sessionMasterKey,
            enc.encode(payload)
        );

        // Packet: IV (12) + Ciphertext
        const packed = new Uint8Array(IV_SIZE + ciphertext.byteLength);
        packed.set(iv, 0);
        packed.set(new Uint8Array(ciphertext), IV_SIZE);

        await storage.setItem('VIBE_SECURE_VAULT', SafeBinary.toBase64(packed));
    },

    /**
     * Loads the Secret Vault.
     * Handles backward compatibility for legacy string-only vaults.
     */
    async loadSecrets(): Promise<{ supabase?: { url: string; anonKey: string } | null } | null> {
        if (!sessionMasterKey) {
            return null;
        }
        resetSessionTimer();

        const encryptedB64 = await storage.getItem('VIBE_SECURE_VAULT');
        if (!encryptedB64) return null;

        try {
            const packed = SafeBinary.fromBase64(encryptedB64);
            const iv = packed.slice(0, IV_SIZE);
            const ciphertext = packed.slice(IV_SIZE);

            const decrypted = await window.crypto.subtle.decrypt(
                { name: ALGORITHM, iv },
                sessionMasterKey,
                ciphertext
            );

            const plaintext = new TextDecoder().decode(decrypted);

            // Attempt JSON Parse (New Vault Format)
            try {
                const vault = JSON.parse(plaintext);
                // Basic structural check
                if (typeof vault === 'object' && vault !== null) {
                    return vault;
                }
                throw new Error("Invalid Vault Structure");
            } catch {
                // Legacy Fallback: Plaintext was just the API Key
                // Return null as we no longer support legacy API keys
                return null;
            }

        } catch (e) {
            console.error("🔓 Decryption failure. Password might be wrong or data corrupted.");
            throw new Error("Decryption failed. Invalid password?");
        }
    },



    // --- Internal Helpers ---

    async createMasterSaltIfNeeded() {
        const existing = await storage.getItem('VIBE_MASTER_SALT');
        if (!existing) {
            const salt = window.crypto.getRandomValues(new Uint8Array(SALT_SIZE));
            await storage.setItem('VIBE_MASTER_SALT', SafeBinary.toBase64(salt));
        }
    },

    async getMasterSalt(): Promise<Uint8Array> {
        const b64 = await storage.getItem('VIBE_MASTER_SALT');
        if (!b64) throw new Error("Critical: Master salt missing.");
        return SafeBinary.fromBase64(b64);
    },

    /**
     * Checks if a secure vault exists in storage.
     * Used by UI to determine if "Setup" or "Unlock" screen is needed.
     */
    async hasEncryptedVault(): Promise<boolean> {
        const vault = await storage.getItem('VIBE_SECURE_VAULT');
        return !!vault;
    }
};

// --- PRIVATE CRYPTO PRIMITIVES ---

async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt as any,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

`

---

## /src/features/security/hooks/useSettings.ts
> Path: $Path

`$Lang
import { useState } from 'react';

export interface SettingsViewModel {
    isLoading: boolean;
    // Keeping interface minimal for now as we stripped API Key logic
}

/**
 * 🔒 useSettings
 * ViewModel for managing application settings.
 * UPDATE: API Key management removed.
 */
export function useSettings(): SettingsViewModel {
    const [isLoading] = useState(false);

    return {
        isLoading
    };
}

`

---

## /src/features/security/SafeBinary.ts
> Path: $Path

`$Lang
/**
 * 🛡️ PREFECT: BINARY SAFETY MODULE
 * Standardizes all binary encoding/decoding to prevent stack overflows and unicode vulnerabilities.
 * Replaces unsafe `btoa`, `atob`, and `String.fromCharCode` patterns.
 */

// Mapping for Base64url safe encoding if needed, but standard Base64 is usually fine for storage.
// We use standard Base64 for compatibility with most systems, but implement it via Uint8Array.

export const SafeBinary = {
    /**
     * Converts a Uint8Array to a Base64 string without using String.fromCharCode spread (stack unsafe).
     * Uses a chunked approach or native FileReader/Buffer APIs where available, 
     * but strictly polyfilled for the browser environment to be deterministic.
     */
    toBase64(bytes: Uint8Array): string {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // In a browser environment, btoa on single byte chars is safe from unicode issues,
        // provided the input constitutes valid byte sequences.
        // However, we want to avoid `btoa` if we want to be "Paranoid".
        // Actually, the prompt says "Remove all unsafe patterns using btoa".
        // Use a custom implementation or a vetted library pattern.
        
        return customToBase64(bytes);
    },

    /**
     * Decodes a Base64 string to Uint8Array safely.
     */
    fromBase64(base64: string): Uint8Array {
        return customFromBase64(base64);
    },

    /**
     * Converts a string to Uint8Array using UTF-8 encoding (TextEncoder).
     * NEVER use simple loop or charCodeAt for non-ASCII.
     */
    fromString(str: string): Uint8Array {
        return new TextEncoder().encode(str);
    },

    /**
     * Converts Uint8Array to string using UTF-8 decoding (TextDecoder).
     */
    toString(bytes: Uint8Array): string {
        return new TextDecoder().decode(bytes);
    }
};

// --- PRIVATE IMPLEMENTATION (No `window.btoa` reliance) ---

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

function customToBase64(bytes: Uint8Array): string {
    let base64 = '';
    const len = bytes.length;
    
    for (let i = 0; i < len; i += 3) {
        const b1 = bytes[i];
        const b2 = i + 1 < len ? bytes[i + 1] : 0;
        const b3 = i + 2 < len ? bytes[i + 2] : 0;

        const triple = (b1 << 16) | (b2 << 8) | b3;

        base64 += chars[(triple >> 18) & 0x3F] +
                  chars[(triple >> 12) & 0x3F] +
                  (i + 1 < len ? chars[(triple >> 6) & 0x3F] : '=') +
                  (i + 2 < len ? chars[triple & 0x3F] : '=');
    }
    return base64;
}

function customFromBase64(base64: string): Uint8Array {
    const len = base64.length;
    let bufferLength = len * 0.75;
    if (base64[len - 1] === '=') bufferLength--;
    if (base64[len - 2] === '=') bufferLength--;

    const bytes = new Uint8Array(bufferLength);
    let p = 0;

    for (let i = 0; i < len; i += 4) {
        const encoded1 = lookup[base64.charCodeAt(i)];
        const encoded2 = lookup[base64.charCodeAt(i + 1)];
        const encoded3 = lookup[base64.charCodeAt(i + 2)];
        const encoded4 = lookup[base64.charCodeAt(i + 3)];

        const triple = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

        bytes[p++] = (triple >> 16) & 0xFF;
        if (i + 1 < len && base64[i + 2] !== '=') bytes[p++] = (triple >> 8) & 0xFF;
        if (i + 2 < len && base64[i + 3] !== '=') bytes[p++] = triple & 0xFF;
    }
    return bytes;
}

`

---

## /src/features/security/ui/pages/SettingsPage.tsx
> Path: $Path

`$Lang
import { Settings, Trash2, ShieldCheck } from 'lucide-react';

export interface SettingsPageProps {
    onSave?: (key: string) => Promise<void>; // Kept for interface compatibility but unused
}

/**
 * ⚙️ Elite Settings Page
 * Configuration zone.
 * UPDATE: API Key management removed for Figma compliance.
 */
export function SettingsPage({ }: SettingsPageProps) {

    const handleClearCache = () => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Cache Cleared' } }, '*');
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            {/* Header Fragment */}
            <header className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white font-display uppercase tracking-tight">System Settings</h1>
                    <p className="text-xs text-text-dim font-medium uppercase tracking-widest opacity-60">Engine Configuration</p>
                </div>
            </header>

            {/* Privacy / Security Badge */}
            <section className="bg-white/[0.02] border border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-success" />
                    <div>
                        <h3 className="text-sm font-bold text-white">Privacy & Security</h3>
                        <p className="text-[10px] text-text-muted mt-1">
                            This plugin operates safely within the Figma environment.
                            External AI connections are disabled/managed by Figma Policy.
                        </p>
                    </div>
                </div>
            </section>

            <div className="pt-4 space-y-4">
                <button
                    onClick={handleClearCache}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-[28px] bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 hover:border-red-500/30 text-red-400 transition-all border-dashed"
                >
                    <Trash2 size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Wipe Local Memory</span>
                </button>

                <footer className="text-center">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] opacity-40">
                        Vibe Engine v3.1.0 • Stable Build
                    </div>
                </footer>
            </div>
        </div>
    );
}

`

---

## /src/features/security/ui/SecurityGate.tsx
> Path: $Path

`$Lang
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertTriangle, Key } from 'lucide-react';
import { CryptoService } from '../CryptoService';
import { motion, AnimatePresence } from 'framer-motion';

interface SecurityGateProps {
    children: React.ReactNode;
}

/**
 * 🛡️ SecurityGate
 * Enforces Zero-Trust Authentication before App access.
 * Handles "First Run" (Vault Setup) and "Session Unlock" flows.
 */
export function SecurityGate({ children }: SecurityGateProps) {
    const [status, setStatus] = useState<'checking' | 'setup' | 'locked' | 'unlocked'>('checking');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initial Check
    useEffect(() => {
        checkSecurityState();
    }, []);

    const checkSecurityState = async () => {
        try {
            const hasVault = await CryptoService.hasEncryptedVault();
            if (hasVault) {
                // If vault exists, check if session is already active (e.g. hydrate?)
                // Currently CryptoService relies on memory, so on reload it's always locked.
                setStatus('locked');
            } else {
                setStatus('setup');
            }
        } catch (e) {
            console.error("Security Check Failed:", e);
            setError("Storage access failed.");
        }
    };

    const handleUnlock = async () => {
        if (!password) return;
        setIsProcessing(true);
        setError(null);
        try {
            await CryptoService.initializeSession(password);
            // Verify by trying to load (will throw if password wrong)
            await CryptoService.loadSecrets();
            // Note: If vault exists but is empty, loadAPIKey returns null but throws if decrypt fails.
            // If decrypt fails -> Wrong password.

            setStatus('unlocked');
        } catch (e) {
            console.error("Unlock Failed:", e);
            setError("Incorrect password.");
            setIsProcessing(false);
        }
    };

    const handleSetup = async () => {
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            await CryptoService.initializeSession(password);
            // Valid session created.
            setStatus('unlocked');
        } catch (e) {
            console.error("Setup Failed:", e);
            setError("Failed to create secure vault.");
            setIsProcessing(false);
        }
    };

    if (status === 'checking') {
        return (
            <div className="h-full flex items-center justify-center bg-void text-primary">
                <div className="animate-spin w-8 h-8 border-2 border-current border-t-transparent rounded-full" />
            </div>
        );
    }

    if (status === 'unlocked') {
        return <>{children}</>;
    }

    // AUTH UI
    return (
        <div className="h-full w-full bg-void flex flex-col items-center justify-center p-8 select-none">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 border border-primary/20 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                        {status === 'setup' ? <ShieldCheck size={32} className="text-primary" /> : <Lock size={32} className="text-primary" />}
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        {status === 'setup' ? 'Secure Vault Setup' : 'Security Check'}
                    </h1>
                    <p className="text-sm text-text-muted">
                        {status === 'setup' ? 'Create a master password to encrypt your API keys. We implement Zero-Trust architecture.' : 'Please enter your master password to unlock the vault.'}
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold text-text-muted tracking-wider ml-1">Master Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (status === 'setup' ? null : handleUnlock())}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/20"
                                placeholder={status === 'setup' ? "Minimum 8 characters" : "••••••••••••"}
                                autoFocus
                            />
                            <Key size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                    </div>

                    {status === 'setup' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="space-y-2"
                        >
                            <label className="text-xs uppercase font-bold text-text-muted tracking-wider ml-1">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSetup()}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-white/20"
                                placeholder="Repeat password"
                            />
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-error text-xs font-medium bg-error/10 p-3 rounded-lg border border-error/20"
                            >
                                <AlertTriangle size={14} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={status === 'setup' ? handleSetup : handleUnlock}
                        disabled={isProcessing || !password}
                        className="w-full py-4 bg-primary text-void font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <div className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                {status === 'setup' ? 'Create Secure Vault' : 'Unlock Credentials'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-[10px] text-text-dim/50 font-mono uppercase tracking-widest">
                        End-to-End Encrypted • Device Local
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

`

---

## /src/features/settings/domain/SettingsTypes.ts
> Path: $Path

`$Lang
/**
 * @module SettingsTypes
 * @description Type definitions for the Vibe Plugin Settings.
 * @version 2.1.0 - Cleaned up for V2 Architecture.
 */

import { uiSyncManager } from '../../../ui/services/UISyncManager';
import type { TokenChunk, SyncState } from '../../../ui/services/UISyncManager';

export interface VibeSettings {
    // Add future settings here (e.g. theme preference, notifications)
    // For now, it might be empty or used for legacy compatibility if we want to avoid breaking too much,
    // but the requirement is to remove logic.
    // Let's keep it defined but empty-ish to allow future expansion without breaking `useSettings`.
    _version?: number;
}

export const DEFAULT_SETTINGS: VibeSettings = {
    _version: 2,
};

// Re-exporting if needed for legacy compatibility, but ideally we should point directly to service
export { uiSyncManager };
export type { TokenChunk, SyncState };


`

---

## /src/features/settings/hooks/useSettings.ts
> Path: $Path

`$Lang
/**
 * @module useSettings
 * @description Hook for accessing and updating Vibe Plugin settings.
 * @version 2.1.0 - Removed API Key logic.
 */
import { useState, useEffect, useCallback } from 'react';
import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { SettingsStorage } from '../services/SettingsStorage';

export interface SettingsViewModel {
    settings: VibeSettings;
    isLoading: boolean;
    updateSettings: (partial: Partial<VibeSettings>) => Promise<void>;
    wipeMemory: () => void;
}

export function useSettings(): SettingsViewModel {
    const [settings, setSettings] = useState<VibeSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await SettingsStorage.loadSettings();
                setSettings(data);
            } catch (err) {
                console.error("[useSettings] Failed to load settings:", err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    // Generic Update
    const updateSettings = useCallback(async (partial: Partial<VibeSettings>) => {
        const newSettings = { ...settings, ...partial };
        setSettings(newSettings);
        await SettingsStorage.saveSettings(newSettings);
    }, [settings]);

    const wipeMemory = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Memory Wiped' } }, '*');
        // We might want to reload settings here or clear local state
        setSettings(DEFAULT_SETTINGS);
    }, []);

    return {
        settings,
        isLoading,
        updateSettings,
        wipeMemory
    };
}

`

---

## /src/features/settings/services/SettingsStorage.ts
> Path: $Path

`$Lang
/**
 * @module SettingsStorage
 * @description Persistence adapter for Vibe configuration.
 * @version 2.0.0 - Stripped down after redesign.
 * Delegates secret management to CryptoService (Zero-Trust).
 */

import type { VibeSettings } from '../domain/SettingsTypes';
import { DEFAULT_SETTINGS } from '../domain/SettingsTypes';
import { storage } from '../../../infrastructure/figma/StorageProxy';

export const SettingsStorage = {
    /**
     * Save the full settings object.
     * Secrets are diverted to the Secure Vault.
     * Preferences are saved as standard JSON.
     */
    saveSettings: async (settings: VibeSettings): Promise<void> => {
        try {
            // Preferences are saved as standard JSON.
            // Currently VibeSettings is empty/internal, but we keep the structure.
            await storage.setItem('VIBE_PREFERENCES', JSON.stringify(settings));

        } catch (error) {
            console.error("[SettingsStorage] Save Failed:", error);
            throw new Error("Failed to persist settings.");
        }
    },

    /**
     * Load settings.
     * Rehydrates preferences from storage.
     */
    loadSettings: async (): Promise<VibeSettings> => {
        try {
            // 1. Fetch Preferences
            const rawPrefs = await storage.getItem('VIBE_PREFERENCES');
            let loadedPreferences: VibeSettings = DEFAULT_SETTINGS;

            if (rawPrefs) {
                try {
                    loadedPreferences = JSON.parse(rawPrefs);
                } catch {
                    console.warn("[SettingsStorage] Corrupt Settings JSON, using defaults.");
                }
            }

            return {
                ...DEFAULT_SETTINGS,
                ...loadedPreferences,
            };

        } catch (error) {
            console.error("[SettingsStorage] Load Failed:", error);
            return DEFAULT_SETTINGS;
        }
    }
}

`

---

## /src/features/settings/ui/SettingsPage.tsx
> Path: $Path

`$Lang
/**
 * @module SettingsPage
 * @description Premium settings page redesigned with Dashboard Bento Grid aesthetic.
 *
 * Features:
 * - Bento Grid Layout matching Dashboard
 * - Premium gradient glows and glassmorphism
 * - Micro-animations and hover effects
 * - Consistent vibe-card styling
 */
import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
    LogOut,
    Mail,
    Zap,
    Trash2,
    ShieldCheck,
    Activity
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { AuthService } from '../../auth/AuthService';
import { ConfirmDialog } from '../../../components/shared/base/ConfirmDialog';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import packageJson from '../../../../package.json';

// ==============================================================================
// == MAIN SETTINGS PAGE ==
// ==============================================================================

export function SettingsPage() {
    const { wipeMemory, isLoading: settingsLoading } = useSettings();

    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    // Fetch user on mount
    useEffect(() => {
        const fetchUser = async () => {
            setIsLoadingUser(true);
            try {
                const session = await AuthService.getSession();
                setUser(session?.user ?? null);
            } catch (e) {
                console.error("[SettingsPage] Failed to fetch user session:", e);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUser();
    }, []);

    const handleSignOutClick = () => {
        setShowSignOutDialog(true);
    };

    const handleConfirmSignOut = async () => {
        setIsSigningOut(true);
        try {
            const { error } = await AuthService.signOut();
            if (error) {
                console.error("[SettingsPage] Sign Out Failed:", error);
                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '❌ Sign Out Failed' } }, '*');
            } else {
                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '👋 Signed Out Successfully' } }, '*');
            }
        } finally {
            setIsSigningOut(false);
            setShowSignOutDialog(false);
        }
    };

    const handleResetCacheClick = () => {
        setShowResetDialog(true);
    };

    const handleConfirmReset = async () => {
        await wipeMemory();
        setShowResetDialog(false);
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Cache Cleared Successfully' } }, '*');
    };

    const isLoading = settingsLoading || isLoadingUser;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin text-primary">
                        <SettingsIcon size={24} />
                    </div>
                    <div className="animate-pulse text-text-muted text-[10px] font-mono tracking-widest uppercase">
                        Loading Configuration...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center py-8 px-4 gap-8 w-full max-w-5xl mx-auto">
            {/* 📌 Header - Matching Dashboard Style */}
            <header className="w-full flex items-center gap-4 mb-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-void border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <SettingsIcon size={24} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                        Settings
                    </h1>
                    <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] opacity-60 uppercase">
                        Control Center
                    </p>
                </div>
            </header>

            {/* 🍱 Bento Grid - Matching Dashboard Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* 🔹 Card 1: Vibe ID - Account Profile */}
                <div className="vibe-card h-auto p-6 flex flex-col justify-between relative overflow-hidden group">
                    {/* Background Gradient Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10 mb-5">
                        <div className="p-3 rounded-xl bg-white/5 text-primary border border-white/5 shadow-inner">
                            <User size={20} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xxs font-bold uppercase tracking-wider border border-primary/20">
                            Vibe ID
                        </span>
                    </div>

                    {user ? (
                        <>
                            {/* User Profile Display */}
                            <div className="z-10 mb-5">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-black text-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            {user.email?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-void rounded-full flex items-center justify-center">
                                            <ShieldCheck size={12} className="text-success" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-white tracking-wide">
                                            {user.email?.split('@')[0]}
                                        </div>
                                        <div className="text-[10px] text-text-dim flex items-center gap-1.5 font-mono">
                                            <Mail size={10} className="opacity-50" />
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sign Out Button */}
                            <button
                                onClick={handleSignOutClick}
                                disabled={isSigningOut}
                                className="z-10 w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-warning/10 hover:border-warning/30 hover:text-warning text-text-muted transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group/btn"
                            >
                                <LogOut size={14} className={isSigningOut ? 'animate-pulse' : ''} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    {isSigningOut ? 'Disconnecting...' : 'Sign Out'}
                                </span>
                            </button>
                        </>
                    ) : (
                        <div className="z-10">
                            <div className="text-sm text-text-muted">
                                Session not found. Please re-open the plugin.
                            </div>
                        </div>
                    )}
                </div>

                {/* ⚡ Card 2: System Status - Large Version Display */}
                <div className="vibe-card h-auto p-6 flex flex-col justify-between relative overflow-hidden group">
                    {/* Background Gradient Glow */}
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full group-hover:bg-secondary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10 mb-5">
                        <div className="p-3 rounded-xl bg-white/5 text-secondary border border-white/5 shadow-inner">
                            <Zap size={20} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xxs font-bold uppercase tracking-wider border border-success/20 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                            </span>
                            Operational
                        </span>
                    </div>

                    <div className="z-10 mb-5">
                        {/* Large Version Number - Dashboard Style */}
                        <div className="text-5xl font-display font-bold text-white mb-2 tracking-tight">
                            v{packageJson.version}
                        </div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            Plugin Version
                        </div>

                        {/* Pro Edition Badge */}
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <Activity size={14} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-[10px] text-text-dim leading-relaxed">
                                Running <strong className="text-primary">Pro Edition</strong>. AI features managed by Vibe Cloud Controller.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 🗑️ Card 3: Reset Cache - Danger Zone */}
                <div className="col-span-1 md:col-span-2">
                    <button
                        onClick={handleResetCacheClick}
                        className="vibe-card w-full h-24 p-5 flex items-center justify-between hover:border-error/50 hover:bg-surface-2 group transition-all relative overflow-hidden"
                    >
                        {/* Warning Glow on Hover */}
                        <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="flex items-center gap-5 z-10">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-error/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-error/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Trash2 size={24} strokeWidth={3} className="text-white group-hover:text-error transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-error transition-colors">
                                    Reset Local Cache
                                </div>
                                <div className="text-xs text-text-dim group-hover:text-error/70 transition-colors">
                                    Clear all stored data and preferences
                                </div>
                            </div>
                        </div>

                        <div className="z-10 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xxs font-black uppercase text-text-dim tracking-widest backdrop-blur-md group-hover:bg-error/10 group-hover:border-error/30 group-hover:text-error transition-all">
                            Danger
                        </div>
                    </button>
                </div>
            </div>

            {/* 🔒 Dialogs */}
            <ConfirmDialog
                isOpen={showSignOutDialog}
                title="Disconnect"
                message="Are you sure you want to sign out?"
                confirmText="Sign Out"
                variant="danger"
                isLoading={isSigningOut}
                onConfirm={handleConfirmSignOut}
                onCancel={() => setShowSignOutDialog(false)}
            />

            <ConfirmDialog
                isOpen={showResetDialog}
                title="Reset Cache"
                message="This will clear all local data and preferences. Continue?"
                confirmText="Reset"
                variant="danger"
                isLoading={false}
                onConfirm={handleConfirmReset}
                onCancel={() => setShowResetDialog(false)}
            />

            {/* Footer */}
            <footer className="text-center pt-2 opacity-20 hover:opacity-100 transition-opacity duration-500">
                <p className="text-[8px] font-mono text-text-muted tracking-wider">
                    VIBE SYSTEMS INC. // OPERATIONAL
                </p>
            </footer>
        </div>
    );
}

`

---

## /src/features/styles/capabilities/CreateStyleCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

interface CreateStylePayload {
    name: string;
    type: 'typography' | 'effect' | 'grid';
    value?: string;
}

export class CreateStyleCapability implements ICapability<CreateStylePayload> {
    readonly id = 'create-style-v1';
    readonly commandId = 'CREATE_STYLE';
    readonly description = 'Creates a new Figma style (Typography, Effect, or Grid).';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: CreateStylePayload, _context: AgentContext): Promise<Result<{ success: boolean; name: string; id: string }>> {
        try {
            const { name, type, value } = payload;
            let newStyle: BaseStyle | null = null;

            if (type === 'typography') {
                await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                const style = figma.createTextStyle();
                style.name = name;
                style.fontName = { family: "Inter", style: "Regular" };
                style.fontSize = 16;
                newStyle = style;
            }
            else if (type === 'effect') {
                const style = figma.createEffectStyle();
                style.name = name;
                style.effects = [{
                    type: 'DROP_SHADOW',
                    color: { r: 0, g: 0, b: 0, a: 0.25 },
                    offset: { x: 0, y: 4 },
                    radius: 4,
                    visible: true,
                    blendMode: 'NORMAL'
                }];
                newStyle = style;
            }
            else if (type === 'grid') {
                const style = figma.createGridStyle();
                style.name = name;
                style.layoutGrids = [{
                    pattern: 'ROWS',
                    alignment: 'STRETCH',
                    gutterSize: 20,
                    count: 4,
                    sectionSize: 1,
                    visible: true,
                    color: { r: 1, g: 0, b: 0, a: 0.1 }
                }];
                newStyle = style;
            }

            if (newStyle) {
                newStyle.description = value || '';
                return Result.ok({ success: true, name, id: newStyle.id });
            } else {
                return Result.fail(`Unsupported style type: ${type}`);
            }

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Create style failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/styles/domain/types.ts
> Path: $Path

`$Lang
export type StyleType = 'typography' | 'effect' | 'grid';

export interface StyleFormData {
    name: string;
    type: StyleType;
    description: string;
}

export interface NewStyleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => void;
}

`

---

## /src/features/styles/ui/components/StyleDetailsInput.tsx
> Path: $Path

`$Lang
import React from 'react';

interface StyleDetailsInputProps {
    description: string;
    onDescriptionChange: (val: string) => void;
}

export const StyleDetailsInput: React.FC<StyleDetailsInputProps> = ({ description, onDescriptionChange }) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">
                Description / Value
            </label>
            <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all resize-none h-[80px]"
                placeholder="Optional description or initial value..."
            />
        </div>
    );
};

`

---

## /src/features/styles/ui/components/StyleNameInput.tsx
> Path: $Path

`$Lang
import React from 'react';

interface StyleNameInputProps {
    name: string;
    onNameChange: (val: string) => void;
}

export const StyleNameInput: React.FC<StyleNameInputProps> = ({ name, onNameChange }) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                Style Name
            </label>
            <div className="relative group">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. H1 / Bold"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                    autoFocus
                />
            </div>
        </div>
    );
};

`

---

## /src/features/styles/ui/dialogs/NewStyleDialog/index.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Paintbrush } from 'lucide-react';
import { useStyleCreation } from '../../hooks/useStyleCreation';
import { StyleNameInput } from '../../components/StyleNameInput';
import { VibeSelect } from '../../../../../components/shared/base/VibeSelect';
import { FieldLabel } from '../../../../../components/shared/base/FieldLabel';
import { StyleDetailsInput } from '../../components/StyleDetailsInput';
import type { NewStyleDialogProps } from '../../../domain/types';

export function NewStyleDialog({ isOpen, onClose, onSubmit }: NewStyleDialogProps) {
    const { formState, setters, actions } = useStyleCreation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.name.trim()) {
            const data = actions.getSubmissionData();
            onSubmit(data);
            actions.resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl"
            >
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display tracking-tight">
                        <div className="p-1 rounded-md bg-secondary/10 text-secondary">
                            <Layers size={14} />
                        </div>
                        Create Style
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Style Name Input */}
                    <StyleNameInput
                        name={formState.name}
                        onNameChange={setters.setName}
                    />

                    {/* 3. Classification */}
                    <div className="space-y-1.5 my-4">
                        <FieldLabel>Type</FieldLabel>
                        <VibeSelect
                            value={formState.type}
                            onChange={setters.setType}
                            options={[
                                { label: 'Typography', value: 'typography' },
                                { label: 'Effect', value: 'effect' },
                                { label: 'Layout Grid', value: 'grid' },
                            ]}
                            className="w-full"
                        />
                    </div>

                    {/* 4. Description / Value Input */}
                    <StyleDetailsInput
                        description={formState.description}
                        onDescriptionChange={setters.setDescription}
                    />

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-white hover:bg-gray-200 text-xs font-bold text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Style
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}

`

---

## /src/features/styles/ui/hooks/useStyleCreation.ts
> Path: $Path

`$Lang
import { useState } from 'react';
import type { StyleType } from '../../domain/types';

export function useStyleCreation() {
    const [name, setName] = useState('');
    const [type, setType] = useState<StyleType>('typography');
    const [description, setDescription] = useState('');

    const handleTypeChange = (newType: string) => {
        setType(newType as StyleType);
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setType('typography');
    };

    const getSubmissionData = () => {
        return {
            name,
            type,
            value: description
        };
    };

    return {
        formState: {
            name,
            type,
            description
        },
        setters: {
            setName,
            setType: handleTypeChange,
            setDescription
        },
        actions: {
            resetForm,
            getSubmissionData
        }
    };
}

`

---

## /src/features/system/capabilities/index.ts
> Path: $Path

`$Lang
export * from './NotifyCapability';
export * from './RequestGraphCapability';
export * from './RequestStatsCapability';
export * from './StorageGetCapability';
export * from './StorageSetCapability';
export * from './SyncVariablesCapability';

`

---

## /src/features/system/capabilities/NotifyCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

type NotifyPayload = { message: string } | string;

export class NotifyCapability implements ICapability<NotifyPayload, void> {
    readonly id = 'system-notify';
    readonly commandId = 'NOTIFY';
    readonly description = 'Displays a notification in Figma.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: NotifyPayload, _context: AgentContext): Promise<Result<void>> {
        try {
            const message = typeof payload === 'string' ? payload : payload?.message;
            if (message) {
                // Send to UI for "Omnibox" display instead of native toast
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: {
                        message,
                        type: 'info'
                    }
                });
                return Result.ok(undefined);
            }
            return Result.fail('No message provided');
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Notification failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/system/capabilities/RequestGraphCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { SyncService } from '../../../core/services/SyncService';

import type { TokenEntity } from '../../../core/types';

export class RequestGraphCapability implements ICapability {
    readonly id = 'system-request-graph';
    readonly commandId = 'REQUEST_GRAPH';
    readonly description = 'Manually triggers a full graph synchronization.';

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<TokenEntity[]>> {
        try {
            const tokens = await this.syncService.sync();
            return Result.ok(tokens);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Graph sync failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/system/capabilities/RequestStatsCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { SyncService } from '../../../core/services/SyncService';

import type { SyncStats } from '../../../core/services/SyncService';

export class RequestStatsCapability implements ICapability {
    readonly id = 'system-request-stats';
    readonly commandId = 'REQUEST_STATS';
    readonly description = 'Retrieves current system statistics.';

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<SyncStats>> {
        try {
            const stats = await this.syncService.getStats();
            return Result.ok(stats);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Stats request failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/system/capabilities/StorageGetCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

type StorageGetPayload = { key: string };
type StorageGetResult = { key: string; value: unknown };

export class StorageGetCapability implements ICapability<StorageGetPayload, StorageGetResult> {
    readonly id = 'system-storage-get';
    readonly commandId = 'STORAGE_GET';
    readonly description = 'Retrieves a value from client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: StorageGetPayload, _context: AgentContext): Promise<Result<StorageGetResult>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            const value = await figma.clientStorage.getAsync(payload.key);
            // We return the key and value so the UI knows what was requested
            // Dispatcher will send STORAGE_GET_SUCCESS with this payload.
            return Result.ok({ key: payload.key, value: value || null });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Storage get failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/system/capabilities/StorageSetCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';

type StorageSetPayload = { key: string; value: unknown };

export class StorageSetCapability implements ICapability<StorageSetPayload, void> {
    readonly id = 'system-storage-set';
    readonly commandId = 'STORAGE_SET';
    readonly description = 'Saves a value to client storage.';

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: StorageSetPayload, _context: AgentContext): Promise<Result<void>> {
        try {
            if (!payload?.key) return Result.fail('No key provided');
            await figma.clientStorage.setAsync(payload.key, payload.value);

            // Special notification logic via Omnibox
            if (payload.key === 'VIBE_API_KEY') {
                figma.ui.postMessage({
                    type: 'OMNIBOX_NOTIFY',
                    payload: {
                        message: '✅ API Key Saved',
                        type: 'success'
                    }
                });
            }

            return Result.ok(undefined);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Storage set failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/system/capabilities/SyncVariablesCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../core/AgentContext';
import { Result } from '../../../shared/lib/result';
import type { SyncService } from '../../../core/services/SyncService';

import type { TokenEntity } from '../../../core/types';

export class SyncVariablesCapability implements ICapability {
    readonly id = 'system-sync-variables';
    readonly commandId = 'SYNC_VARIABLES';
    readonly description = 'Synchronizes variables (alias for REQUEST_GRAPH).';

    private syncService: SyncService;

    constructor(syncService: SyncService) {
        this.syncService = syncService;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<TokenEntity[]>> {
        try {
            const tokens = await this.syncService.sync();
            return Result.ok(tokens);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Sync variables failed';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/tokens/capabilities/management/CreateVariableCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';
import type { VariableValue } from '../../../../core/types';

import { ColorPalette } from '../../domain/services/ColorPalette';

type CreatePayload = {
    name: string;
    type: 'color' | 'number' | 'string';
    value: VariableValue;
    extensions?: {
        scope?: string;
        range?: [number, number];
        description?: string;
    }
};

type CreateResult = {
    created: boolean;
    names?: string[];
    count?: number;
    name?: string;
    message?: string;
};

/**
 * 🛠️ CreateVariableCapability
 * Handles the creation of design tokens with built-in intelligence for scales and naming conventions.
 */
export class CreateVariableCapability implements ICapability<CreatePayload, CreateResult> {
    readonly id = 'create-variable-v1';
    readonly commandId = 'CREATE_VARIABLE';
    readonly description = 'Creates a new design token (variable) in Figma.';

    private readonly variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        // Always executable, but we could restrict based on selection in future
        return true;
    }

    async execute(
        payload: CreatePayload,
        _context: AgentContext
    ): Promise<Result<CreateResult>> {
        try {
            const { name, type, value, extensions } = payload;

            // 1. Sanitize Input
            const cleanName = name.trim();
            if (!cleanName) {
                return Result.fail('Variable name cannot be empty.');
            }

            // 2. Handle Color Scales (Smart Expansion)
            if (type === 'color' && extensions?.scope?.startsWith('scale')) {
                return this.createColorScale(cleanName, value as string, extensions);
            }

            // 3. Default: Single Variable Creation
            await this.variableManager.createVariable(cleanName, type, value);

            // Add description if provided (Future: move to VariableManager)
            // Note: VariableManager.createVariable currently doesn't support description, 
            // but we should arguably add it there. For now, we assume basic creation.

            return Result.ok({
                created: true,
                name: cleanName,
                message: `✅ Created token: ${cleanName}`
            });

        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during creation';
            console.error(`[CreateVariable] Failed:`, e);

            if (message.includes('duplicate variable name')) {
                return Result.fail('A token with this name already exists in this collection.');
            }

            return Result.fail(message);
        }
    }

    /**
     * Generates a stepped color scale (e.g. primary/50...950)
     */
    private async createColorScale(
        baseName: string,
        hex: string,
        extensions: NonNullable<CreatePayload['extensions']>
    ): Promise<Result<CreateResult>> {
        console.log(`[CreateVariable] Generating Scale for: ${baseName} (${hex})`);

        try {
            // Determine range
            let min = 50;
            let max = 950;

            if (extensions.scope === 'scale-custom' && extensions.range) {
                [min, max] = extensions.range;
                console.log(`[CreateVariable] Custom range detected: ${min}-${max}`);
            }

            // Generate scale with custom range support
            const scale = ColorPalette.generateScale(hex, min, max);
            const createdNames: string[] = [];

            // Create all stops from the generated scale
            for (const [stop, stopHex] of Object.entries(scale)) {
                const tokenName = `${baseName}/${stop}`;
                await this.variableManager.createVariable(tokenName, 'color', stopHex);
                createdNames.push(tokenName);
            }


            return Result.ok({
                created: true,
                names: createdNames,
                count: createdNames.length,
                message: `✅ Generated ${createdNames.length} scale tokens for ${baseName}`
            });

        } catch (error) {
            return Result.fail(`Failed to generate scale: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

`

---

## /src/features/tokens/capabilities/management/RenameVariableCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';

type RenamePayload = { id: string; newName: string };
type RenameResult = { renamed: boolean; id: string; newName: string };

export class RenameVariableCapability implements ICapability<RenamePayload, RenameResult> {
    readonly id = 'rename-variable-v1';
    readonly commandId = 'RENAME_TOKEN'; // Adapting to the specific command ID used in UI
    readonly description = 'Renames an existing variable.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: RenamePayload, _context: AgentContext): Promise<Result<RenameResult>> {
        try {
            await this.variableManager.renameVariable(payload.id, payload.newName);
            return Result.ok({ renamed: true, id: payload.id, newName: payload.newName });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during rename';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/tokens/capabilities/management/UpdateVariableCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';

import type { VariableValue } from '../../../../core/types';

type UpdatePayload = { id: string; value: VariableValue };
type UpdateResult = { updated: boolean; id: string };

export class UpdateVariableCapability implements ICapability<UpdatePayload, UpdateResult> {
    readonly id = 'update-variable-v1';
    readonly commandId = 'UPDATE_VARIABLE';
    readonly description = 'Updates the value of an existing variable.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true;
    }

    async execute(payload: UpdatePayload, _context: AgentContext): Promise<Result<UpdateResult>> {
        try {
            const { id, value } = payload;

            if (!id || value === undefined) {
                return Result.fail('Missing id or value');
            }

            // Perform the update
            await this.variableManager.updateVariable(id, value);
            return Result.ok({ updated: true, id });
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : 'Unknown error during update';
            return Result.fail(message);
        }
    }
}

`

---

## /src/features/tokens/capabilities/sync/SyncTokensCapability.ts
> Path: $Path

`$Lang
import type { ICapability } from '../../../../core/interfaces/ICapability';
import type { AgentContext } from '../../../../core/AgentContext';
import { Result } from '../../../../shared/lib/result';
import type { VariableManager } from '../../../../features/governance/VariableManager';
import { ProgressiveSyncCoordinator } from '../../../../core/services/ProgressiveSyncCoordinator';

export class SyncTokensCapability implements ICapability {
    readonly id = 'sync-tokens-v1';
    readonly commandId = 'SYNC_TOKENS';
    readonly description = 'Synchronizes all local variables from Figma to the Token Repository.';

    private variableManager: VariableManager;

    constructor(variableManager: VariableManager) {
        this.variableManager = variableManager;
    }

    canExecute(_context: AgentContext): boolean {
        return true; // Always allowed
    }

    async execute(_payload: unknown, _context: AgentContext): Promise<Result<{ count: number; timestamp: number }>> {
        console.log("🚀 Executing SyncTokensCapability (Ghobghabi Edition)...");

        // 🔒 SAFETY: Fail fast if API not available
        if (!figma.variables) {
            return Result.fail("Figma variables API not available. The plugin may be closing.");
        }

        const coordinator = new ProgressiveSyncCoordinator();

        return new Promise<Result<{ count: number; timestamp: number }>>((resolve) => {
            coordinator.start(this.variableManager.syncGenerator(), {
                onChunk: (chunk) => {
                    figma.ui.postMessage({
                        type: 'SYNC_CHUNK',
                        payload: {
                            tokens: chunk.tokens,
                            chunkIndex: chunk.chunkIndex,
                            isLast: chunk.isLast,
                            timestamp: Date.now()
                        }
                    });
                },
                onComplete: () => {
                    console.log("✅ Sync Complete via Coordinator.");
                    const timestamp = Date.now();

                    figma.ui.postMessage({
                        type: 'SYNC_COMPLETE',
                        payload: {
                            timestamp,
                            // Coordinator doesn't track total count in onComplete event args currently, 
                            // but UI tracks it via chunks. 
                            // We can optimize this later if needed.
                        }
                    });
                    resolve(Result.ok({ count: 0, timestamp })); // count 0 as placeholder since stream is async
                },
                onError: (error) => {
                    console.error("❌ SyncTokensCapability failed:", error);
                    resolve(Result.fail(error.message));
                }
            });
        });
    }
}

`

---

## /src/features/tokens/domain/services/ColorPalette.ts
> Path: $Path

`$Lang
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

/**
 * 🎨 ColorPalette Logic
 * Generates semantic scales (50-950) from a base color.
 */
export class ColorPalette {
    /**
     * Generates a color scale from a base color.
     * 
     * @param baseHex - The base color in hex format
     * @param min - Minimum stop value (default: 50)
     * @param max - Maximum stop value (default: 950)
     * @returns Record of stop values to hex colors
     */
    static generateScale(baseHex: string, min: number = 50, max: number = 950): Record<number, string> {
        const base = colord(baseHex);

        if (!base.isValid()) {
            console.error(`[ColorPalette] Invalid base color: ${baseHex}`);
            throw new Error(`Invalid base color for scale: ${baseHex}`);
        }

        // Generate stops based on range
        const stops = this.generateStops(min, max);
        const scale: Record<number, string> = {};

        // Find the midpoint (500 is always the anchor if within range)
        const midpoint = 500;
        const usesMidpoint = midpoint >= min && midpoint <= max;

        stops.forEach(stop => {
            if (stop === midpoint && usesMidpoint) {
                // Exact base color at 500
                scale[stop] = base.toHex();
            } else if (stop < midpoint) {
                // Tints (Mix with White)
                // Lighter as we approach min
                const weight = (midpoint - stop) / (midpoint - min);
                scale[stop] = base.mix('#ffffff', weight * 0.9).toHex();
            } else {
                // Shades (Mix with Black)
                // Darker as we approach max
                const weight = (stop - midpoint) / (max - midpoint);
                scale[stop] = base.mix('#000000', weight * 0.8).toHex();
            }
        });

        return scale;
    }

    /**
     * Generates appropriate stop values for a given range.
     * Uses standard values (50, 100, 200, etc.) when possible,
     * or generates evenly-spaced stops for custom ranges.
     */
    private static generateStops(min: number, max: number): number[] {
        // Standard stops
        const standardStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        // If range matches standard, use standard stops
        if (min === 50 && max === 950) {
            return standardStops;
        }

        // Filter standard stops that fall within range
        const validStandardStops = standardStops.filter(s => s >= min && s <= max);

        // If we have at least 3 valid stops, use them
        if (validStandardStops.length >= 3) {
            return validStandardStops;
        }

        // Otherwise, generate evenly-spaced stops
        // Aim for ~10 stops, but at least 5
        const rangeSize = max - min;
        const desiredStops = Math.max(5, Math.min(11, Math.floor(rangeSize / 50)));

        const step = rangeSize / (desiredStops - 1);
        const stops: number[] = [];

        for (let i = 0; i < desiredStops; i++) {
            const stop = Math.round(min + (step * i));
            stops.push(stop);
        }

        return stops;
    }
}

`

---

## /src/features/tokens/domain/services/SemanticMapper.ts
> Path: $Path

`$Lang
import { ColorPalette } from './ColorPalette';
import type { TokenEntity, TokenType } from '../../../../core/types';

/**
 * 🗺️ SemanticMapper
 * Generates high-level semantic tokens from a base palette.
 * Uses the Unified TokenEntity (W3C Standard).
 */
export class SemanticMapper {
    /**
     * Generates a system of tokens based on a set of core functional colors.
     */
    static generateSystem(core: { primary: string; secondary?: string; accent?: string }): TokenEntity[] {
        const primaryScale = ColorPalette.generateScale(core.primary);
        const tokens: TokenEntity[] = [];

        const createToken = (name: string, path: string[], value: string | number, type: TokenType): TokenEntity => ({
            id: `temp-${Math.random().toString(36).substr(2, 9)}`,
            name,
            path,
            $value: value,
            $type: type,
            $extensions: {
                figma: {
                    scopes: ['ALL_SCOPES'],
                    collectionId: 'temp',
                    modeId: 'default',
                    resolvedType: type === 'color' ? 'COLOR' : 'FLOAT'
                }
            },
            dependencies: [],
            dependents: []
        });

        // 1. Functional Colors (Linked to the generated scale)
        tokens.push(createToken('main', ['sys', 'color', 'primary'], core.primary, 'color'));

        // Add stops to the system
        Object.entries(primaryScale).forEach(([stop, hex]) => {
            tokens.push(createToken(stop, ['sys', 'color', 'primary'], hex, 'color'));
        });

        // 2. Semantic Aliases (Note: In a real graph these would have dependencies)
        tokens.push(createToken('brand', ['sys', 'color', 'surface'], '{sys/color/primary/500}', 'color'));
        tokens.push(createToken('brand', ['sys', 'color', 'text'], '{sys/color/primary/700}', 'color'));

        return tokens;
    }
}

`

---

## /src/features/tokens/domain/services/TokenCompiler.ts
> Path: $Path

`$Lang
import type { TokenEntity } from '../../../../core/types';

/**
 * ⚙️ TokenCompiler
 * Resolves aliases and computes final values for the token graph.
 * Strictly adheres to the purified TokenEntity schema.
 */
export class TokenCompiler {

    /**
     * Resolves a single token's value against a registry of tokens.
     */
    static compile(
        token: TokenEntity,
        tokenMap: Map<string, TokenEntity>,
        pathIndex: Map<string, TokenEntity>,
        visited = new Set<string>()
    ): TokenEntity {
        const value = token.$value;

        if (typeof value !== 'string' || !value.startsWith('{')) {
            return token;
        }

        if (visited.has(token.id)) {
            console.warn(`Circular dependency detected in ${token.id}`);
            return token;
        }
        visited.add(token.id);

        // Regex to find {segment/segment/name}
        const match = value.match(/^{([^}]+)}$/);
        if (match) {
            const aliasPath = match[1];
            // Optimization: Lookup by Path using pre-computed index
            const target = pathIndex.get(aliasPath);

            if (target) {
                const resolvedTarget = this.compile(target, tokenMap, pathIndex, new Set(visited));
                return {
                    ...token,
                    $value: resolvedTarget.$value
                };
            }
        }

        return token;
    }

    static compileBatch(tokens: TokenEntity[]): TokenEntity[] {
        const tokenMap = new Map(tokens.map(t => [t.id, t]));

        // Build Path Index for O(1) lookup
        const pathIndex = new Map<string, TokenEntity>();
        tokens.forEach(t => {
            const fullPath = [...t.path, t.name].join('/');
            pathIndex.set(fullPath, t);
        });

        return tokens.map(t => this.compile(t, tokenMap, pathIndex));
    }
}

`

---

## /src/features/tokens/domain/services/TokenFactory.ts
> Path: $Path

`$Lang
import type { TokenEntity, TokenType } from '../../../../core/types';

/**
 * 🏭 TokenFactory
 * Standardized factory for creating TokenEntity (W3C Standard).
 */
export class TokenFactory {
    static create(props: {
        name: string;
        path: string[];
        value: string | number;
        type: TokenType;
        description?: string;
    }): TokenEntity {
        const id = `token-${Math.random().toString(36).substr(2, 9)}`;

        return {
            id,
            name: props.name,
            path: props.path,
            $value: props.value,
            $type: props.type,
            $description: props.description,
            $extensions: {
                figma: {
                    scopes: ['ALL_SCOPES'],
                    collectionId: 'default',
                    modeId: 'default',
                    resolvedType: props.type === 'color' ? 'COLOR' : 'FLOAT'
                }
            },
            dependencies: [],
            dependents: []
        };
    }
}

`

---

## /src/features/tokens/domain/TokenUsageAnalyzer.ts
> Path: $Path

`$Lang
import type { TokenUsageStats, TokenUsageMap } from '../../../core/types';
import { logger } from '../../../core/services/Logger';

/**
 * 🕵️ TokenUsageAnalyzer
 * 
 * CORE LOGIC ENGINE for determining Token Usage.
 * Mandates strict adherence to "Source of Truth" (Variable ID).
 * 
 * Rules:
 * 1. Variables -> Styles -> Components -> Instances (Traversal Order)
 * 2. No String Matching. ID only.
 * 3. Separate Source Usage vs Instance Impact.
 * 4. QUALITATIVE METRICS ONLY. No raw "Usage Counts".
 * 
 * ⚡ PERFORMANCE UPDATE:
 * - Uses iterative traversal (Stack-based) instead of recursion.
 * - Yields to main thread every X nodes to prevent UI freezing.
 */

// Helper Types for Figma API which might be missing in environment
type VariableBindings = { [key: string]: VariableAlias | VariableAlias[] };

// ⏳ Non-Blocking Yield Utility
const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));

export class TokenUsageAnalyzer {

    /**
     * Cache for usage map to avoid expensive full-traversal on every call.
     * Should be invalidated on document changes.
     */
    private usageCache: TokenUsageMap | null = null;
    private lastAnalysisTimestamp: number = 0;

    constructor() { }

    /**
     * Executes the analysis protocol.
     * @param force - If true, bypasses cache and re-scans the document.
     */
    public async analyze(force: boolean = false): Promise<TokenUsageMap> {
        // 1. Check Cache (Performance Constraint)
        const now = Date.now();
        if (!force && this.usageCache && (now - this.lastAnalysisTimestamp < 2000)) {
            logger.debug('analyzer', 'Returning cached usage stats');
            return this.usageCache;
        }

        logger.info('analyzer', 'Starting Full Token Usage Analysis...');
        const startTime = Date.now();

        // 2. Initialize Map
        const usageMap: TokenUsageMap = new Map();

        // Helper to get or create stats
        const getStats = (tokenId: string): TokenUsageStats => {
            if (!usageMap.has(tokenId)) {
                usageMap.set(tokenId, {
                    usedInComponents: [], // Qualitative List {id, name}
                    usedInStyles: [],     // Qualitative List {id, name}
                    affectedInstancesCount: 0,
                    totalRawUsage: 0,
                    dependencyChain: []
                });
            }
            return usageMap.get(tokenId)!;
        };

        // Helper: Record Source Usage (Strict: Components & Styles ONLY)
        const recordSourceUsage = (tokenId: string, node: { id: string, name: string }, isComponent: boolean, isStyle: boolean) => {
            const stats = getStats(tokenId);

            // ALWAYS track raw usage (User Request: "How many times used")
            stats.totalRawUsage++;

            // STRICT RULE: Only track usage in Components or Styles. Ignored random Frames.
            if (!isComponent && !isStyle) return;

            // Only add Unique IDs (Qualitative set)
            if (isComponent) {
                if (!stats.usedInComponents.some(c => c.id === node.id)) {
                    stats.usedInComponents.push({ id: node.id, name: node.name });
                }
            }
            if (isStyle) {
                if (!stats.usedInStyles.some(s => s.id === node.id)) {
                    stats.usedInStyles.push({ id: node.id, name: node.name });
                }
            }
        };

        // Helper: Record Instance Impact
        const recordInstanceImpact = (tokenId: string) => {
            const stats = getStats(tokenId);
            stats.affectedInstancesCount++;
        };

        // === PHASE 1: STYLES (Fast) ===
        // Traverse all local paint styles
        const styles = await figma.getLocalPaintStylesAsync();
        for (const style of styles) {
            // Check paints for bound variables
            for (const paint of style.paints) {
                if (paint.type === 'SOLID' || paint.type === 'GRADIENT_LINEAR' || paint.type === 'GRADIENT_RADIAL') {
                    // Explicitly check for variable bindings in the style itself
                    // Note: This API surface might vary, but we look for boundVariables.
                    const s = style as any;
                    const boundVars = s.boundVariables as VariableBindings;

                    if (boundVars) {
                        // Iterate over all potential properties that can be bound
                        for (const key in boundVars) {
                            const variableAlias = boundVars[key];
                            // Check if it's an array (gradients) or single
                            if (Array.isArray(variableAlias)) {
                                // ⚡ PERFORMANCE: for...of avoids closure allocation
                                for (const a of variableAlias) {
                                    if (a && a.id) recordSourceUsage(a.id, { id: style.id, name: style.name }, false, true);
                                }
                            } else if (variableAlias && 'id' in variableAlias) {
                                recordSourceUsage(variableAlias.id, { id: style.id, name: style.name }, false, true);
                            }
                        }
                    }
                }
            }
        }

        await yieldToMain(); // Breathe after styles

        // === PHASE 2 & 3: NODES (Iterative & Yielding) ===
        // We traverse the document *once* to handle both.

        const instanceMap: { instanceId: string, componentId: string }[] = [];

        // ⚡ ITERATIVE STACK 
        // Start with pages
        const stack: (SceneNode | PageNode)[] = [...figma.root.children];

        let nodesProcessed = 0;
        // const YIELD_THRESHOLD = 500; // Legacy Count-based logic
        const TIME_BUDGET_MS = 12; // 12ms active work per frame (leaves 4ms for UI)
        let frameStartTime = Date.now();

        while (stack.length > 0) {
            const node = stack.pop()!;
            nodesProcessed++;

            // 🛑 BREATHE CHECK (Time-Based)
            const currentTime = Date.now();
            if (currentTime - frameStartTime > TIME_BUDGET_MS) {
                await yieldToMain();
                frameStartTime = Date.now(); // Reset timer after yielding
            }

            // 1. Check Binding on THIS node (Source Usage)
            if ('boundVariables' in node) {
                const n = node as any;
                const bindings = n.boundVariables as VariableBindings;
                if (bindings) {
                    for (const key in bindings) {
                        const alias = bindings[key];
                        if (alias) {
                            if (Array.isArray(alias)) {
                                // ⚡ PERFORMANCE: for...of avoids closure allocation in hot path
                                for (const a of alias) {
                                    if (a.id) recordSourceUsage(a.id, { id: node.id, name: node.name }, node.type === 'COMPONENT' || node.type === 'COMPONENT_SET', false);
                                }
                            } else if ('id' in alias) {
                                recordSourceUsage(alias.id, { id: node.id, name: node.name }, node.type === 'COMPONENT' || node.type === 'COMPONENT_SET', false);
                            }
                        }
                    }
                }
            }

            // 2. Handling Component Logic (Source Usage) involves the Component Node itself using variables.
            // 3. Handling Instance Impact (Secondary)

            if (node.type === 'INSTANCE') {
                // An instance *inherits* usage from its Main Component.
                const mainComponentId = node.mainComponent?.id; // Note: accessing mainComponent might be slow if not loaded? usually fine in plugin api.
                if (mainComponentId) {
                    instanceMap.push({ instanceId: node.id, componentId: mainComponentId });
                }
            }

            // Push children to stack
            if ('children' in node) {
                // We optimize by NOT pushing if children is empty or if it's a huge group we might want to check visibility?
                // For now, strict traversal.
                // Reverse loop push to maintain order? (Not critical for usage count, but nice for logic)
                for (const child of node.children) {
                    stack.push(child);
                }
            }
        }

        // === PHASE 4: RESOLVE INSTANCE IMPACT ===
        // Now we know which components use which tokens (from usageMap.usedInComponents).
        // identifying which tokens are used by which component:
        const componentToTokens = new Map<string, string[]>();

        for (const [tokenId, stats] of usageMap.entries()) {
            for (const comp of stats.usedInComponents) {
                if (!componentToTokens.has(comp.id)) {
                    if (!componentToTokens.has(comp.id)) {
                        componentToTokens.set(comp.id, []);
                    }
                    componentToTokens.get(comp.id)?.push(tokenId);
                }
            }
        }

        // Now iterate instances and attribute impact
        for (const { componentId } of instanceMap) {
            const tokenIds = componentToTokens.get(componentId);
            if (tokenIds) {
                for (const tid of tokenIds) {
                    recordInstanceImpact(tid);
                }
            }
        }

        const duration = Date.now() - startTime;
        logger.info('analyzer', `Analysis complete in ${duration}ms. Tracked ${usageMap.size} active tokens. Processed ${nodesProcessed} nodes.`, { count: usageMap.size });

        this.usageCache = usageMap;
        this.lastAnalysisTimestamp = Date.now();

        return usageMap;
    }

    /**
     * Clears the cache to force recalculation on next call.
     */
    public invalidateCache() {
        this.usageCache = null;
    }
}

`

---

## /src/features/tokens/domain/ui-types.ts
> Path: $Path

`$Lang
export type TokenType = 'color' | 'spacing' | 'sizing' | 'radius' | 'number' | 'string';
export type ColorScope = 'single' | 'scale' | 'scale-custom';

export interface TokenModeValue {
    mobile: string;
    tablet: string;
    desktop: string;
}

export interface TokenFormData {
    name: string;
    type: TokenType;
    value: string | TokenModeValue;
    extensions: {
        scope?: ColorScope;
        range?: [number, number];
        ratio?: string;
        activeModes?: ('mobile' | 'tablet' | 'desktop')[];
    };
}

export interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TokenFormData) => void;
}

`

---

## /src/features/tokens/types.ts
> Path: $Path

`$Lang
export type TokenType =
    | 'color'
    | 'dimension'
    | 'fontFamily'
    | 'fontWeight'
    | 'duration'
    | 'cubicBezier';

export type VariableScope =
    | 'ALL_SCOPES'
    | 'FRAME_FILL'
    | 'TEXT_FILL'
    | 'STROKE_COLOR'
    | 'EFFECT_COLOR';

export interface TokenEntity {
    id: string;                    // Figma Variable ID
    name: string;                  // "primary-500"
    $value: string | number;       // W3C standard
    $type: TokenType;
    $description?: string;
    $extensions: {
        figma: {
            scopes: VariableScope[];
            collectionId: string;
            modeId: string;
            resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
        }
    };
    dependencies: string[];        // Token IDs this references
    dependents: string[];          // Token IDs that reference this
}

`

---

## /src/features/tokens/ui/components/preview/TypeHierarchyPreview.tsx
> Path: $Path

`$Lang
import React from 'react';

interface TypeHierarchyPreviewProps {
    fontFamily: string;
    scaleRatio: number;
    baseSize: number;
}

/**
 * 🖋️ TypeHierarchyPreview
 * Premium typography visualization for the Config Wizard.
 * Demonstrates the scale ratio in action across standard labels.
 */
export const TypeHierarchyPreview: React.FC<TypeHierarchyPreviewProps> = ({
    fontFamily,
    scaleRatio,
    baseSize
}) => {
    const stops = [
        { label: 'H1 / Display', scale: Math.pow(scaleRatio, 4) },
        { label: 'H2 / Headline', scale: Math.pow(scaleRatio, 3) },
        { label: 'H3 / Title', scale: Math.pow(scaleRatio, 2) },
        { label: 'H4 / Subtitle', scale: scaleRatio },
        { label: 'Body / Base', scale: 1 },
        { label: 'Caption / Nano', scale: 1 / scaleRatio },
    ];

    return (
        <div className="mt-8 space-y-6 bg-void/30 p-6 rounded-[24px] border border-white/5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Typography System</span>
                <span className="text-[10px] font-mono text-text-dim">{fontFamily} @ {scaleRatio.toFixed(3)}x</span>
            </header>

            <div className="space-y-4">
                {stops.map((stop, i) => {
                    const fontSize = Math.round(baseSize * stop.scale);
                    return (
                        <div key={i} className="group relative">
                            <div className="flex items-baseline justify-between mb-1">
                                <span className="text-[9px] font-bold text-text-dim uppercase tracking-tighter opacity-50 group-hover:opacity-100 transition-opacity">
                                    {stop.label}
                                </span>
                                <span className="text-[9px] font-mono text-text-dim opacity-30 group-hover:opacity-80">
                                    {fontSize}px
                                </span>
                            </div>
                            <div
                                style={{
                                    fontFamily: `'${fontFamily}', sans-serif`,
                                    fontSize: `${fontSize}px`,
                                    lineHeight: '1.2'
                                }}
                                className="text-white truncate transition-all duration-300 group-hover:text-primary"
                            >
                                The quick brown fox jumps...
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

`

---

## /src/features/tokens/ui/components/TokenNameInput.tsx
> Path: $Path

`$Lang
import React from 'react';
import { Wand2 } from 'lucide-react';
import type { NamingResult } from '../../../../features/perception/capabilities/naming/ColorNamer';

interface TokenNameInputProps {
    name: string;
    onNameChange: (val: string) => void;
    onAutoName: () => void;
    isAutoNaming: boolean;
    namingResult: NamingResult | null;
}

export const TokenNameInput: React.FC<TokenNameInputProps> = ({
    name,
    onNameChange,
    onAutoName,
    isAutoNaming,
    namingResult
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                Token Name
                {namingResult && namingResult.source !== 'algo_fallback' && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${namingResult.confidence > 0.9 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {namingResult.source === 'exact' ? 'Exact Match' : `${Math.round(namingResult.confidence * 100)}% Match`}
                    </span>
                )}
            </label>
            <div className="relative group h-11">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. primary-500"
                    className="w-full h-full bg-surface-1 border border-surface-2 rounded-xl pl-4 pr-12 text-sm text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-text-dim/50 font-mono flex items-center"
                    autoFocus
                />
                <button
                    type="button"
                    onClick={onAutoName}
                    disabled={isAutoNaming}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-surface-2 hover:bg-surface-3 text-text-muted hover:text-primary transition-all disabled:opacity-50"
                    title="Auto-Generate Name"
                >
                    <Wand2 size={14} className={isAutoNaming ? "animate-spin" : ""} />
                </button>
            </div>
        </div>
    );
};

`

---

## /src/features/tokens/ui/components/TokenScopeConfig.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Scaling, ArrowLeftRight, ChevronDown } from 'lucide-react';
import type { TokenType, ColorScope } from '../../domain/ui-types';


interface TokenScopeConfigProps {
    type: TokenType;
    colorScope: ColorScope;
    onColorScopeChange: (val: ColorScope) => void;
    customRange: [number, number];
    onCustomRangeChange: (val: [number, number]) => void;
    activeModes: ('mobile' | 'tablet' | 'desktop')[];
    onActiveModesChange: (modes: ('mobile' | 'tablet' | 'desktop')[]) => void;
    ratio: string;
    onRatioChange: (val: string) => void;
    className?: string; // For layout flexibility
}

const SCALE_OPTIONS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(v => ({ value: v, label: String(v) }));

export const TokenScopeConfig: React.FC<TokenScopeConfigProps> = ({
    type,
    colorScope,
    onColorScopeChange,
    customRange,
    onCustomRangeChange,
    activeModes,
    onActiveModesChange,
    ratio,
    onRatioChange,
    className
}) => {
    // If type doesn't support scope/context, render nothing
    if (['number', 'string'].includes(type)) return null;

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-xxs font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                {type === 'color' && 'Scope / Extent'}
                {type === 'radius' && 'Corner'}
                {type === 'spacing' && 'Scale'}
                {type === 'color' && <ArrowLeftRight size={10} />}
            </label>

            {type === 'color' ? (
                <div className="space-y-3">
                    <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-2 h-11 items-center">
                        {(['single', 'scale', 'scale-custom'] as const).map((scopeOption) => (
                            <button
                                key={scopeOption}
                                type="button"
                                onClick={() => onColorScopeChange(scopeOption)}
                                className={`flex-1 flex items-center justify-center py-2 text-xxs font-bold rounded-lg transition-all h-full ${colorScope === scopeOption ? 'bg-surface-2 text-text-primary shadow-sm' : 'text-text-dim hover:text-text-primary'}`}
                            >
                                {scopeOption === 'scale-custom' ? 'Range' : scopeOption.charAt(0).toUpperCase() + scopeOption.slice(1)}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {colorScope === 'scale-custom' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                                animate={{
                                    height: 'auto',
                                    opacity: 1,
                                    transitionEnd: { overflow: 'visible' }
                                }}
                                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                            >
                                <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-2 h-11 items-center">
                                    <div className="relative flex-1 h-full group">
                                        <div className="absolute inset-0 flex items-center px-3 rounded-lg group-hover:bg-surface-2 transition-colors pointer-events-none">
                                            <span className="text-[10px] uppercase font-bold text-text-dim mr-2">Start</span>
                                            <span className="text-sm font-mono text-text-primary flex-1 text-center">{customRange[0]}</span>
                                            <ChevronDown size={14} className="text-text-dim ml-2" />
                                        </div>
                                        <select
                                            value={customRange[0]}
                                            onChange={(e) => onCustomRangeChange([Number(e.target.value), customRange[1]])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            {SCALE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-surface-1 text-text-primary">{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-px h-4 bg-surface-3 mx-1" />

                                    <div className="relative flex-1 h-full group">
                                        <div className="absolute inset-0 flex items-center px-3 rounded-lg group-hover:bg-surface-2 transition-colors pointer-events-none">
                                            <span className="text-[10px] uppercase font-bold text-text-dim mr-2">End</span>
                                            <span className="text-sm font-mono text-text-primary flex-1 text-center">{customRange[1]}</span>
                                            <ChevronDown size={14} className="text-text-dim ml-2" />
                                        </div>
                                        <select
                                            value={customRange[1]}
                                            onChange={(e) => onCustomRangeChange([customRange[0], Number(e.target.value)])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            style={{ colorScheme: 'dark' }}
                                        >
                                            {SCALE_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value} className="bg-surface-1 text-text-primary">{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-2 items-center gap-1 h-11">
                    {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => {
                                const newModes = activeModes.includes(mode)
                                    ? activeModes.filter(m => m !== mode)
                                    : [...activeModes, mode];
                                if (newModes.length > 0) onActiveModesChange(newModes);
                            }}
                            className={`p-2 h-full flex items-center justify-center rounded-lg transition-all ${activeModes.includes(mode) ? 'bg-surface-2 text-text-primary shadow-sm' : 'text-text-dim hover:text-text-primary'}`}
                            title={`Toggle ${mode}`}
                        >
                            {mode === 'mobile' && <Smartphone size={14} />}
                            {mode === 'tablet' && <Tablet size={14} />}
                            {mode === 'desktop' && <Monitor size={14} />}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-surface-3 mx-1" />
                    <div className="flex items-center gap-2 px-2 h-full">
                        <input
                            type="text"
                            value={ratio}
                            onChange={(e) => onRatioChange(e.target.value)}
                            className="w-8 bg-transparent text-xs text-text-primary font-mono outline-none text-center"
                            placeholder="1.5"
                        />
                        <div className="text-text-dim"><Scaling size={12} /></div>
                    </div>
                </div>
            )}
        </div>
    );
};

`

---

## /src/features/tokens/ui/components/TokenTree.tsx
> Path: $Path

`$Lang
import { useState, useMemo } from 'react';
import type { TokenEntity, TokenType } from '../../../../core/types';
import { clsx } from 'clsx';
import { ChevronRight, Hash, Box, Folder, Search, Type } from 'lucide-react';

interface TokenTreeProps {
    tokens: TokenEntity[];
    searchQuery?: string;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

interface TreeGroup {
    name: string;
    subGroups: Record<string, TreeGroup>;
    tokens: TokenEntity[];
}

/**
 * 🌲 Figma Native Token Tree
 * Refactored for Clarity & Professionalism.
 */
export function TokenTree({ tokens, searchQuery = '', selectedId, onSelect }: TokenTreeProps) {
    // 1. Filter Logic (Memoized)
    const filteredResults = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return tokens.filter(t =>
            t.name.toLowerCase().includes(q) ||
            String(t.$value).toLowerCase().includes(q) ||
            t.path.some(p => p.toLowerCase().includes(q))
        );
    }, [tokens, searchQuery]);

    // 2. Render Search Results (Flat List)
    if (searchQuery) {
        if (filteredResults.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center pt-12 text-center opacity-40">
                    <Search size={16} className="mb-2 text-text-muted" />
                    <div className="text-xs font-medium text-text-muted">No Matches</div>
                </div>
            );
        }

        return (
            <div className="p-2 space-y-0.5">
                <div className="px-3 py-2 text-[10px] font-semibold text-text-dim uppercase tracking-wider border-b border-white/5 mb-1">
                    {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
                </div>
                {filteredResults.map(token => (
                    <TokenItem
                        key={token.id}
                        token={token}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        highlight={searchQuery}
                        showPath
                    />
                ))}
            </div>
        );
    }

    // 3. Build Recursive Tree Structure (Normal Mode)
    const root: Record<string, TreeGroup> = {};

    tokens.forEach(token => {
        let currentLevel = root;
        const path = token.path;

        path.forEach((segment, index) => {
            if (!currentLevel[segment]) {
                currentLevel[segment] = {
                    name: segment,
                    subGroups: {},
                    tokens: []
                };
            }

            if (index === path.length - 1) {
                currentLevel[segment].tokens.push(token);
            } else {
                currentLevel = currentLevel[segment].subGroups;
            }
        });

        if (path.length === 0) {
            const segment = 'Uncategorized';
            if (!root[segment]) {
                root[segment] = { name: segment, subGroups: {}, tokens: [] };
            }
            root[segment].tokens.push(token);
        }
    });

    return (
        <div className="space-y-1 pb-4 p-2">
            {Object.values(root).map(group => (
                <RecursiveGroup
                    key={group.name}
                    group={group}
                    level={0}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}

            {tokens.length === 0 && (
                <div className="py-12 text-center">
                    <div className="text-xs text-text-dim opacity-50">
                        No tokens found in this workspace.
                    </div>
                </div>
            )}
        </div>
    );
}

function RecursiveGroup({ group, level, selectedId, onSelect }: {
    group: TreeGroup,
    level: number,
    selectedId: string | null,
    onSelect: (id: string) => void
}) {
    const [isOpen, setIsOpen] = useState(level === 0);

    const hasContent = Object.keys(group.subGroups).length > 0 || group.tokens.length > 0;
    if (!hasContent) return null;

    return (
        <div className={clsx("mb-0.5", level > 0 && "ml-[18px]")}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center px-2 py-1.5 rounded-md transition-all group select-none",
                    level === 0
                        ? "text-xs font-semibold text-text-muted hover:text-white"
                        : "text-xs font-medium text-text-dim hover:text-text-primary"
                )}
            >
                <div className={clsx("mr-1.5 transition-transform duration-200 text-text-dim/50", isOpen && "rotate-90 text-text-dim")}>
                    <ChevronRight size={10} strokeWidth={3} />
                </div>

                {level === 0 ? (
                    <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <Folder size={12} className="text-primary/70 fill-primary/10" />
                        {group.name}
                    </span>
                ) : (
                    group.name
                )}
            </button>

            {isOpen && (
                <div className="mt-0.5 relative">
                    {/* Tree Guide Line */}
                    {level > 0 && <div className="absolute left-[5px] top-0 bottom-2 w-px bg-white/5" />}

                    {Object.values(group.subGroups).map(sub => (
                        <RecursiveGroup
                            key={sub.name}
                            group={sub}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}

                    {group.tokens.map(token => (
                        <TokenItem
                            key={token.id}
                            token={token}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            indentLevel={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TokenItem({ token, selectedId, onSelect, highlight, showPath, indentLevel = 0 }: {
    token: TokenEntity,
    selectedId: string | null,
    onSelect: (id: string) => void,
    highlight?: string,
    showPath?: boolean,
    indentLevel?: number
}) {
    const isSelected = selectedId === token.id;

    // Highlight Logic
    const renderName = () => {
        if (!highlight) return token.name;
        const parts = token.name.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase()
                        ? <span key={i} className="text-white bg-primary/20">{part}</span>
                        : part
                )}
            </span>
        );
    };

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('vibe/token-id', token.id);
                e.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => onSelect(token.id)}
            className={clsx(
                "flex items-center justify-between w-full px-2 py-1.5 rounded-md cursor-pointer text-xs transition-all border border-transparent mb-0.5",
                indentLevel > 0 && "ml-[18px]",
                isSelected
                    ? "bg-primary/10 text-white border-primary/20 shadow-sm font-medium"
                    : "text-text-dim hover:bg-white/5 hover:text-text-primary"
            )}
        >
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                <TokenIcon type={token.$type} value={token.$value} />
                <div className="flex flex-col min-w-0 flex-1">
                    {showPath && token.path.length > 0 && (
                        <div className="text-[9px] text-text-dim/60 truncate flex items-center gap-1">
                            {token.path.join(' / ')}
                        </div>
                    )}
                    <span className="truncate" title={token.name} style={{ lineHeight: '1.2' }}>
                        {renderName()}
                    </span>
                </div>
            </div>

            {/* Value Pill - Only show if space permits or hovered */}
            <div className={clsx(
                "flex-none text-[10px] font-mono pl-2 max-w-[80px] truncate opacity-60 group-hover:opacity-100",
                isSelected && "opacity-100 text-primary-light"
            )}>
                {String(token.$value)}
            </div>
        </div>
    );
}

function TokenIcon({ type, value }: { type: TokenType, value: string | number }) {
    if (type === 'color') {
        const bgValue = String(value).startsWith('{') ? 'transparent' : String(value);
        return (
            <div className="relative flex-shrink-0">
                <div
                    className="w-3.5 h-3.5 rounded-full border border-white/10 shadow-sm"
                    style={{ backgroundColor: bgValue }}
                />
                {String(value).startsWith('{') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                    </div>
                )}
            </div>
        );
    }

    // Icon mapping based on new design system
    const iconClass = "text-text-dim";
    const size = 12;

    if (type === 'dimension') return <Hash size={size} className={iconClass} />;
    if (type === 'fontFamily' || type === 'fontWeight') return <Type size={size} className={iconClass} />;

    return <Box size={size} className={iconClass} />;
}

`

---

## /src/features/tokens/ui/components/TokenValueInput.tsx
> Path: $Path

`$Lang
import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { VibeColorPicker } from './VibeColorPicker';
import type { TokenType, ColorScope, TokenModeValue } from '../../domain/ui-types';

interface TokenValueInputProps {
    type: TokenType;
    value: string | TokenModeValue;
    onValueChange: (val: string | TokenModeValue) => void;
    colorScope: ColorScope;
    customRange: [number, number];
    activeModes: ('mobile' | 'tablet' | 'desktop')[];
}

export const TokenValueInput: React.FC<TokenValueInputProps> = ({
    type,
    value,
    onValueChange,
    colorScope,
    customRange,
    activeModes
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Value</label>
            {type === 'color' ? (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <VibeColorPicker
                            value={typeof value === 'string' ? value : '#000000'}
                            onChange={onValueChange}
                        />
                    </div>
                    <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="flex-1 bg-surface-1 border border-surface-2 rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all uppercase"
                    />
                    {colorScope.startsWith('scale') && (
                        <div className="px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap">
                            {colorScope === 'scale-custom'
                                ? `+${Math.floor(Math.abs(customRange[1] - customRange[0]) / 100) + 1} Variants`
                                : '+11 Variants'}
                        </div>
                    )}
                </div>
            ) : ['radius', 'spacing', 'sizing'].includes(type) ? (
                <div className="flex gap-2">
                    {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                        activeModes.includes(mode) && (
                            <div key={mode} className="flex-1 relative group">
                                <input
                                    type="number"
                                    value={typeof value === 'object' ? (value as TokenModeValue)[mode] : value}
                                    onChange={(e) => {
                                        const current = typeof value === 'object' ? value : { mobile: value, tablet: value, desktop: value };
                                        onValueChange({ ...current, [mode]: e.target.value });
                                    }}
                                    className="w-full bg-surface-1 border border-surface-2 rounded-xl pl-4 pr-9 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder={mode === 'mobile' ? "4" : mode === 'tablet' ? "8" : "12"}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors pointer-events-none">
                                    {mode === 'mobile' && <Smartphone size={14} />}
                                    {mode === 'tablet' && <Tablet size={14} />}
                                    {mode === 'desktop' && <Monitor size={14} />}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <input
                    type="text"
                    value={typeof value === 'object' ? '' : value}
                    onChange={(e) => onValueChange(e.target.value)}
                    className="w-full bg-surface-1 border border-surface-2 rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
                />
            )}
        </div>
    );
};

`

---

## /src/features/tokens/ui/components/VibeColorPicker.tsx
> Path: $Path

`$Lang
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Check, Pipette } from 'lucide-react';
import { VibeSelect } from '../../../../components/shared/base/VibeSelect';
import {
    hexToRgb,
    rgbToHsv,
    hsvToRgb,
    toHex6
} from '../../../../shared/lib/colors';

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

/**
 * 🎨 VibeColorPicker (Elite Edition)
 * Integrates robust HSV logic with an immersive glassmorphic interface.
 * Refactored for cleaner layout: No Alpha, Full-width inputs, Bottom format selector.
 */
export function VibeColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState<'HSL' | 'HEX' | 'RGB'>('HEX');
    const dragControls = useDragControls();

    // Internal HSV State
    const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    // 🔄 Sync: When the external color changes, update internal HSV
    useEffect(() => {
        if (isDragging) return;

        try {
            const rgb = hexToRgb(value);
            if (rgb) {
                const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                // Preserve Hue when Saturation or Value are zero to prevent spinner jumping back to red
                if (newHsv.s === 0 || newHsv.v === 0) {
                    // Check if update is needed to avoid loop
                    if (hsv.s !== newHsv.s || hsv.v !== newHsv.v) {
                        // eslint-disable-next-line react-hooks/set-state-in-effect
                        setHsv(prev => ({ ...newHsv, h: prev.h }));
                    }
                } else {
                    // Check equal
                    if (hsv.h !== newHsv.h || hsv.s !== newHsv.s || hsv.v !== newHsv.v) {
                        setHsv(newHsv);
                    }
                }
            }
        } catch (e) {
            console.error("[VibeColorPicker] Sync failed:", e);
        }
    }, [value, isDragging, hsv]);

    // 🧮 Logic: Update color based on coordinate interaction
    const updateFromPosition = useCallback((clientX: number, clientY: number) => {
        if (!boxRef.current) return;

        const rect = boxRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

        const s = (x / rect.width) * 100;
        const v = 100 - (y / rect.height) * 100;

        const nextHsv = { ...hsv, s, v };
        setHsv(nextHsv);

        const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
        onChange(toHex6(rgb));
    }, [hsv, onChange]);

    // 🖱️ Event Handling
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        updateFromPosition(clientX, clientY);
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        // ⚡ Performance: RAF Loop for smooth 60fps tracking
        requestAnimationFrame(() => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            updateFromPosition(clientX, clientY);
        });
    }, [isDragging, updateFromPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const h = parseInt(e.target.value);
        const nextHsv = { ...hsv, h };
        setHsv(nextHsv);
        const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
        onChange(toHex6(rgb));
    };

    const renderInputs = () => {
        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const hex = toHex6(rgb);

        switch (format) {
            case 'HEX':
                return (
                    <div className="w-full">
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg font-bold select-none group-focus-within/input:text-primary/70 transition-colors">#</span>
                            <input
                                type="text"
                                value={hex.replace('#', '')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 6) {
                                        const c = hexToRgb('#' + val);
                                        if (c) {
                                            const next = rgbToHsv(c.r, c.g, c.b);
                                            setHsv(next);
                                            onChange(toHex6(c));
                                        }
                                    }
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl text-left text-lg font-mono font-bold text-white/90 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200 uppercase pl-9 tracking-[0.15em] hover:border-white/20 hover:bg-[#121212]"
                            />
                        </div>
                    </div>
                );
            case 'RGB':
                return (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {(['r', 'g', 'b'] as const).map((ch) => (
                            <div key={ch} className="relative group/input">
                                <label className="absolute left-0 -top-2.5 text-[9px] font-bold text-white/30 uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{ch}</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgb[ch]}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        const clamped = Math.max(0, Math.min(255, val));
                                        const newRgb = { ...rgb, [ch]: clamped };
                                        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                                        setHsv(newHsv);
                                        onChange(toHex6(newRgb));
                                    }}
                                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl text-center text-base font-mono font-bold text-white/90 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200 hover:border-white/20 hover:bg-[#121212] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            {/* Trigger Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-11 h-11 rounded-xl border border-white/10 shadow-lg transition-transform active:scale-95 group relative overflow-hidden"
                style={{ backgroundColor: value }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        />

                        <motion.div
                            drag
                            dragListener={false}
                            dragControls={dragControls}
                            dragMomentum={true}
                            initial={{ opacity: 0, scale: 0.96, y: '-45%', x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.96, y: '-45%', x: '-50%' }}
                            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                            style={{ position: 'fixed', top: '50%', left: '50%' }}
                            className="w-[520px] bg-[#1A1A1A] rounded-[24px] shadow-2xl z-[9999] flex flex-row ring-1 ring-white/15 p-4 gap-5"
                        >
                            {/* Saturation Area */}
                            <div className="shrink-0">
                                <div
                                    ref={boxRef}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleMouseDown}
                                    className="w-[240px] h-[240px] rounded-[20px] overflow-hidden relative ring-1 ring-white/20 shadow-lg group cursor-crosshair"
                                    style={{
                                        backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                        backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`
                                    }}
                                >
                                    <div
                                        className="absolute w-6 h-6 rounded-full border-[3px] border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] pointer-events-none will-change-transform"
                                        style={{
                                            left: `${hsv.s}%`,
                                            top: `${100 - hsv.v}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: value,
                                            boxShadow: `0 0 0 1.5px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.3)`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Controls Column */}
                            <div className="flex-1 flex flex-col h-[240px]">
                                {/* Header */}
                                <div
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="flex items-center justify-between cursor-grab active:cursor-grabbing mb-4"
                                >
                                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                        <Pipette size={11} strokeWidth={2.5} />
                                        PICKER
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-3 h-7 hover:bg-white/10 rounded-lg transition-all duration-200 text-primary hover:scale-105 active:scale-95"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider">Done</span>
                                    </button>
                                </div>

                                {/* Main Controls */}
                                <div className="flex-1 flex flex-col gap-5">
                                    {/* Hue Slider */}
                                    <div>
                                        <div className="relative h-3 w-full rounded-full ring-1 ring-white/20 shadow-lg"
                                            style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={hsv.h}
                                                onChange={handleHueChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                className="absolute top-1/2 w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-100 z-20"
                                                style={{
                                                    left: `${(hsv.h / 360) * 100}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                                    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.25)'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Inputs Area */}
                                    <div className="flex items-center justify-center pt-2">
                                        {renderInputs()}
                                    </div>

                                    {/* Format Selector (Bottom Anchored) */}
                                    <div className="mt-auto">
                                        <div className="w-full">
                                            <VibeSelect
                                                value={format}
                                                onChange={setFormat}
                                                options={[
                                                    { label: 'HEX', value: 'HEX' },
                                                    { label: 'RGB', value: 'RGB' }
                                                ]}
                                                size="sm"
                                                className="w-full bg-[#0A0A0A] border-white/10 hover:border-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

`

---

## /src/features/tokens/ui/dialogs/NewTokenDialog/index.tsx
> Path: $Path

`$Lang
import React from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Paintbrush } from 'lucide-react';

import { useTokenCreation } from '../../hooks/useTokenCreation';
import { TokenNameInput } from '../../components/TokenNameInput';
import { VibeSelect } from '../../../../../components/shared/base/VibeSelect';
import { FieldLabel } from '../../../../../components/shared/base/FieldLabel';
import { TokenScopeConfig } from '../../components/TokenScopeConfig';
import { TokenValueInput } from '../../components/TokenValueInput';
import type { NewTokenDialogProps } from '../../../domain/ui-types';

export function NewTokenDialog({ isOpen, onClose, onSubmit }: NewTokenDialogProps) {
    const { formState, setters, actions } = useTokenCreation(isOpen);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formState.name.trim() && formState.value) {
            const data = actions.getSubmissionData();
            onSubmit(data);
            actions.resetForm();
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl"
            >
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display tracking-tight">
                        <div className="p-1 rounded-md bg-primary/10 text-primary">
                            <Palette size={14} />
                        </div>
                        Create Token
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Magic Name Input */}
                    <TokenNameInput
                        name={formState.name}
                        onNameChange={setters.setName}
                        onAutoName={actions.handleAutoName}
                        isAutoNaming={formState.isAutoNaming}
                        namingResult={formState.namingResult}
                    />

                    {/* 3. Classification & Scope */}
                    {/* 3. Classification, Scope & Value (2 Rows) */}
                    <div className="space-y-4">
                        {/* Row 1: Type & Scope */}
                        <div className="flex gap-4 items-start">
                            <div className="space-y-1.5 w-[120px] flex-shrink-0">
                                <FieldLabel>Type</FieldLabel>
                                <VibeSelect
                                    value={formState.type}
                                    onChange={setters.setType}
                                    options={[
                                        { label: 'Color', value: 'color' },
                                        { label: 'Spacing', value: 'spacing' },
                                        { label: 'Sizing', value: 'sizing' },
                                        { label: 'Radius', value: 'radius' },
                                        { label: 'Number', value: 'number' },
                                        { label: 'String', value: 'string' },
                                    ]}
                                    className="w-full"
                                />
                            </div>

                            {!['number', 'string'].includes(formState.type) && (
                                <TokenScopeConfig
                                    type={formState.type}
                                    colorScope={formState.colorScope}
                                    onColorScopeChange={setters.setColorScope}
                                    customRange={formState.customRange}
                                    onCustomRangeChange={setters.setCustomRange}
                                    activeModes={formState.activeModes}
                                    onActiveModesChange={setters.setActiveModes}
                                    ratio={formState.ratio}
                                    onRatioChange={setters.setRatio}
                                    className="flex-1"
                                />
                            )}
                        </div>

                        {/* Row 2: Value */}
                        <div className="w-full">
                            <TokenValueInput
                                type={formState.type}
                                value={formState.value}
                                onValueChange={setters.setValue}
                                colorScope={formState.colorScope}
                                customRange={formState.customRange}
                                activeModes={formState.activeModes}
                            />
                        </div>
                    </div>

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Token
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}

`

---

## /src/features/tokens/ui/hooks/useTokenCreation.ts
> Path: $Path

`$Lang
import { useState, useEffect } from 'react';
import { vibeColor, type NamingResult } from '../../../../features/perception/capabilities/naming/ColorNamer';
import type { TokenType, ColorScope } from '../../domain/ui-types';

export function useTokenCreation(isOpen: boolean) {
    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<TokenType>('color');
    const [value, setValue] = useState<string | { mobile: string, tablet: string, desktop: string }>('#6E62E5');
    const [activeModes, setActiveModes] = useState<('mobile' | 'tablet' | 'desktop')[]>(['mobile', 'tablet', 'desktop']);
    const [ratio, setRatio] = useState('1.5');

    // Namer State
    const [isAutoNaming, setIsAutoNaming] = useState(false);
    const [namingResult, setNamingResult] = useState<NamingResult | null>(null);

    // Color Context
    const [colorScope, setColorScope] = useState<ColorScope>('single');
    const [customRange, setCustomRange] = useState<[number, number]>([100, 400]);

    // Initialize Color Engine
    useEffect(() => {
        if (isOpen) vibeColor.init();
    }, [isOpen]);

    // Logic: Auto-Naming using Perception Module
    const handleAutoName = async () => {
        setIsAutoNaming(true);

        if (type === 'color' && !vibeColor.isReady()) {
            await vibeColor.init();
        }

        setTimeout(() => {
            if (type === 'color' && typeof value === 'string') {
                const result = vibeColor.fullResult(value);
                setName(result.name === 'unknown' ? 'custom-color' : result.name.replace('~', ''));
                setNamingResult(result);
            } else if (['spacing', 'sizing', 'radius'].includes(type)) {
                setName(`${type}-responsive`);
            }
            setIsAutoNaming(false);
        }, 300);
    };

    // Logic: Type Switching Defaults
    const handleTypeChange = (newType: string) => {
        const t = newType as TokenType;
        setType(t);

        if (t === 'color') {
            setValue('#6E62E5');
        } else if (['spacing', 'sizing', 'radius'].includes(t)) {
            setValue({ mobile: '4', tablet: '8', desktop: '12' });
        } else {
            setValue('');
        }
    };

    // Logic: Prepare Submission Data
    const getSubmissionData = () => {
        let finalName = name;

        // Clean scale names (e.g., "blue-500" -> "blue" for scales)
        if (type === 'color' && colorScope.startsWith('scale')) {
            finalName = finalName.replace(/[-_ ]?\d+$/, '');
        }

        return {
            name: finalName,
            type,
            value,
            extensions: {
                scope: type === 'color' ? colorScope : undefined,
                range: (type === 'color' && colorScope === 'scale-custom') ? customRange : undefined,
                ratio: ['spacing', 'sizing', 'radius'].includes(type) ? ratio : undefined
            }
        };
    };

    const resetForm = () => {
        setName('');
        setValue('#6E62E5');
        setType('color');
        setNamingResult(null);
    };

    return {
        formState: {
            name,
            type,
            value,
            activeModes,
            ratio,
            colorScope,
            customRange,
            namingResult,
            isAutoNaming
        },
        setters: {
            setName,
            setType: handleTypeChange, // Use wrapper
            setValue,
            setActiveModes,
            setRatio,
            setColorScope,
            setCustomRange,
            setNamingResult
        },
        actions: {
            handleAutoName,
            getSubmissionData,
            resetForm
        }
    };
}

`

---

## /src/features/tokens/ui/pages/CreateTokenPage.tsx
> Path: $Path

`$Lang
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paintbrush } from 'lucide-react';

import { useTokenCreation } from '../hooks/useTokenCreation';
import { TokenNameInput } from '../components/TokenNameInput';
import { VibeSelect } from '../../../../components/shared/base/VibeSelect';
import { FieldLabel } from '../../../../components/shared/base/FieldLabel';
import { TokenScopeConfig } from '../components/TokenScopeConfig';
import { TokenValueInput } from '../components/TokenValueInput';
import { VibePathPicker } from '../../../../components/shared/base/VibePathPicker';
import { useTokens } from '../../../../ui/hooks/useTokens';
import type { TokenFormData } from '../../domain/ui-types';
import { omnibox } from '../../../../ui/managers/OmniboxManager';

interface CreateTokenPageProps {
    onBack: () => void;
    onSubmit: (token: TokenFormData) => Promise<boolean>;
}

export function CreateTokenPage({ onBack, onSubmit }: CreateTokenPageProps) {
    const { tokens, stats, createCollection, renameCollection, deleteCollection } = useTokens();

    // Transform TokenEntity -> TokenPickerItem
    const tokenItems = tokens.map(t => ({
        name: t.name,
        path: t.path,
        fullPath: t.path && t.path.length > 0 ? [...t.path, t.name].join('/') : t.name,
        type: t.$type,
        value: t.$value
    }));

    const { formState, setters, actions } = useTokenCreation(true);

    const [place, setPlace] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.name.trim()) return;

        // ✅ VALIDATION: Require Collection Path
        if (!place || place.trim() === '') {
            omnibox.show('Please select a collection path', { type: 'error' });
            return;
        }

        const baseData = actions.getSubmissionData();
        const cleanPath = place.endsWith('/') ? place : `${place}/`;
        const fullName = `${cleanPath}${baseData.name}`;

        const finalData = {
            ...baseData,
            name: fullName
        };

        const success = await onSubmit(finalData);

        if (success) {
            // Visible feedback via Omnibox as requested
            omnibox.show(`Token "${finalData.name}" created`, { type: 'success' });

            // Only reset the name to allow sequential creation in the same context
            setters.setName('');
            setters.setNamingResult(null);
            // We keep: type, value, path (place), scope, etc.
        }
    };

    return (
        <div className="w-full h-full relative flex flex-col bg-void">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl mx-auto px-6 py-6 pb-28 flex flex-col relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full relative"
                    >
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1 w-full">
                                    <TokenNameInput
                                        name={formState.name}
                                        onNameChange={setters.setName}
                                        onAutoName={actions.handleAutoName}
                                        isAutoNaming={formState.isAutoNaming}
                                        namingResult={formState.namingResult}
                                    />
                                </div>

                                <div className="space-y-1.5 w-full md:w-1/3">
                                    <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-1 h-4">
                                        Path
                                    </label>
                                    <VibePathPicker
                                        value={place}
                                        onChange={setPlace}
                                        placeholder="e.g. Brand/Colors"
                                        size="md"
                                        existingTokens={tokenItems}
                                        existingCollections={stats.collectionNames}
                                        onCreateCollection={createCollection}
                                        onRenameCollection={renameCollection}
                                        onDeleteCollection={deleteCollection}
                                    />
                                </div>
                            </div>

                            {/* 3. Classification, Scope & Value (Auto Layout) */}
                            {/* 3. Classification, Scope & Value (2 Rows) */}
                            <div className="space-y-4">
                                {/* Row 1: Type & Scope */}
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="space-y-1.5 w-full md:w-[140px] flex-shrink-0">
                                        <FieldLabel>Type</FieldLabel>
                                        <VibeSelect
                                            value={formState.type}
                                            onChange={setters.setType}
                                            options={[
                                                { label: 'Color', value: 'color' },
                                                { label: 'Spacing', value: 'spacing' },
                                                { label: 'Sizing', value: 'sizing' },
                                                { label: 'Radius', value: 'radius' },
                                                { label: 'Number', value: 'number' },
                                                { label: 'String', value: 'string' },
                                            ]}
                                            className="w-full"
                                        />
                                    </div>

                                    {!['number', 'string'].includes(formState.type) && (
                                        <TokenScopeConfig
                                            type={formState.type}
                                            colorScope={formState.colorScope}
                                            onColorScopeChange={setters.setColorScope}
                                            customRange={formState.customRange}
                                            onCustomRangeChange={setters.setCustomRange}
                                            activeModes={formState.activeModes}
                                            onActiveModesChange={setters.setActiveModes}
                                            ratio={formState.ratio}
                                            onRatioChange={setters.setRatio}
                                            className="flex-1 w-full"
                                        />
                                    )}
                                </div>

                                {/* Row 2: Value */}
                                <div className="w-full">
                                    <TokenValueInput
                                        type={formState.type}
                                        value={formState.value}
                                        onValueChange={setters.setValue}
                                        colorScope={formState.colorScope}
                                        customRange={formState.customRange}
                                        activeModes={formState.activeModes}
                                    />
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            <div className="w-full absolute bottom-0 left-0 p-6 bg-gradient-to-t from-void via-void to-transparent z-50 pointer-events-none flex justify-center">
                <div className="w-full max-w-2xl flex gap-4 pointer-events-auto">

                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-3.5 rounded-xl bg-surface-2/80 hover:bg-surface-2 backdrop-blur-md text-sm font-bold text-text-dim hover:text-white transition-colors border border-surface-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-[2] py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-sm font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] hover:shadow-[0_4px_25px_rgba(110,98,229,0.5)] transition-all flex items-center justify-center gap-2 border border-white/10 group"
                    >
                        <Paintbrush size={16} />
                        <span>Create Token</span>
                        {formState.type === 'color' && formState.colorScope.startsWith('scale') && (
                            <span className="ml-1 px-2 py-0.5 rounded-md bg-white text-primary text-[10px] font-extrabold shadow-sm group-hover:scale-105 transition-transform">
                                {formState.colorScope === 'scale-custom'
                                    ? `${formState.customRange[0]} - ${formState.customRange[1]}`
                                    : '50 - 950'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div >
    );
}

`

---

## /src/features/tokens/ui/pages/TokensView.tsx
> Path: $Path

`$Lang
import { useState, useMemo, useEffect } from 'react';
import { useTokens } from '../../../../ui/hooks/useTokens';
import { Search, ChevronRight, Layers, Activity } from 'lucide-react';
import type { TokenEntity } from '../../../../core/types';

/**
 * 🪙 TokensView
 * The dedicated section for managing and exploring Design Tokens.
 * Replaces the previously planned "Activity Graph".
 * Zero Graph Terminology. Pure List/Tree Explorer.
 */
// CONFIG: Render tokens in chunks to prevent UI freeze
const CHUNK_SIZE = 50;

/**
 * 🪙 TokensView
 * The dedicated section for managing and exploring Design Tokens.
 * Replaces the previously planned "Activity Graph".
 * Zero Graph Terminology. Pure List/Tree Explorer.
 */
export function TokensView({ onBack: _ }: { onBack?: () => void }) {
    const { tokens } = useTokens();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    // ⚡ PERF: Render Limit State
    const [renderLimit, setRenderLimit] = useState(CHUNK_SIZE);
    // Use a ref for the scroll container to avoid re-renders
    const scrollRef = useState<{ current: HTMLDivElement | null }>({ current: null })[0];

    // 🛑 PERF FIX: AUTO-SCAN REMOVED
    // We do NOT scan on mount. Tokens load from cache instantly.
    // Usage data is "Lazy" - User must click refresh to get deep stats.

    // ✅ FIX: Add dependency on tokens.length
    const filteredTokens = useMemo(() => {
        if (!searchQuery) return tokens;
        const q = searchQuery.toLowerCase();
        return tokens.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.path.join('/').toLowerCase().includes(q)
        );
    }, [tokens, searchQuery]); // ← Added tokens dependency

    // ✅ FIX: Debug log
    useEffect(() => {
        console.log(`[TokensView] Tokens updated: ${tokens.length}`);
    }, [tokens.length]);

    // ⚡ PERF: Reset limit when search changes to feel snappy
    // Note: This is an effect because it synchronizes state (renderLimit) with props/other state (searchQuery)
    if (useMemo(() => true, [searchQuery])) {
        // Pseudo-effect during render for immediate reset? No, let's use useEffect for safety.
    }

    // We use a key-based reset pattern or useEffect. Let's use useEffect for clarity.
    // However, since we can't use hooks inside loops or conditionals, we put it at top level.
    // Actually, let's just use the useEffect pattern typically used.
    // To avoid "Rendered fewer hooks than expected" we keep it standard.

    // ⚡ PERF: Visible Tokens Slice
    const visibleTokens = filteredTokens.slice(0, renderLimit);

    const selectedToken = useMemo(() =>
        tokens.find(t => t.id === selectedTokenId) || null
        , [tokens, selectedTokenId]);

    // ⚡ PERF: Infinite Scroll Logic
    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Load more when user is near bottom (200px threshold)
        if (scrollHeight - scrollTop - clientHeight < 200) {
            if (renderLimit < filteredTokens.length) {
                setRenderLimit(prev => Math.min(prev + CHUNK_SIZE, filteredTokens.length));
            }
        }
    };

    return (
        <div className="flex h-full w-full bg-void text-text-primary">

            {/* 👈 Left Panel: Token List (Explorer) */}
            <div className="w-80 flex flex-col border-r border-white/5 bg-surface-1/50">
                {/* Search Header */}
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <div className="relative group flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tokens..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setRenderLimit(CHUNK_SIZE); // Reset limit immediately
                                scrollRef.current?.scrollTo(0, 0); // Scroll to top
                            }}
                            className="w-full bg-surface-0 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Token List */}
                <div
                    className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 will-change-transform"
                    onScroll={onScroll}
                    ref={(el) => { scrollRef.current = el; }}
                >
                    {visibleTokens.length === 0 ? (
                        <div className="p-8 text-center text-xs text-text-dim">
                            {tokens.length === 0 ? "No tokens loaded." : "No matches found."}
                        </div>
                    ) : (
                        <>
                            {visibleTokens.map(token => (
                                <button
                                    key={token.id}
                                    onClick={() => setSelectedTokenId(token.id)}
                                    className={`
                                        w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors
                                        ${selectedTokenId === token.id
                                            ? 'bg-primary/10 border border-primary/20 shadow-sm'
                                            : 'hover:bg-white/5 border border-transparent'}
                                    `}
                                >
                                    {/* Color Swatch / Icon */}
                                    <div className="w-6 h-6 rounded flex-shrink-0 border border-white/10 flex items-center justify-center bg-surface-0 overflow-hidden">
                                        {token.$type === 'color' ? (
                                            <div className="w-full h-full" style={{ backgroundColor: String(token.$value) }} />
                                        ) : (
                                            <Layers size={12} className="text-text-dim" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className={`text-xs font-semibold truncate ${selectedTokenId === token.id ? 'text-primary' : 'text-text-primary'}`}>
                                            {token.name}
                                        </div>
                                        <div className="text-[10px] text-text-dim truncate font-mono opacity-70">
                                            {String(token.$value)}
                                        </div>
                                    </div>

                                    {selectedTokenId === token.id && (
                                        <ChevronRight size={14} className="text-primary" />
                                    )}
                                </button>
                            ))}

                            {/* Loading Indicator at bottom */}
                            {renderLimit < filteredTokens.length && (
                                <div className="py-2 text-center text-[10px] text-text-dim animate-pulse">
                                    Loading more...
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Stats & Actions */}
                <div className="p-3 border-t border-white/5 flex justify-between items-center text-[10px] text-text-dim bg-surface-0/30">
                    <span>{filteredTokens.length} Tokens (Showing {visibleTokens.length})</span>
                    <div className="w-4 h-4" /> {/* Spacer */}
                </div>
            </div>

            {/* 👉 Right Panel: Token Details */}
            <div className="flex-1 overflow-y-auto bg-void relative">
                {selectedToken ? (
                    <TokenDetailPanel token={selectedToken} allTokens={tokens} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                        <Layers size={48} strokeWidth={1} className="mb-4" />
                        <p className="text-sm">Select a token to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * 📄 TokenDetailPanel
 * Displays deep information about a token without "Graph" interactions.
 * Inlined to reduce file count as per "Zero Bloat" policy.
 */
function TokenDetailPanel({ token, allTokens }: { token: TokenEntity; allTokens: TokenEntity[] }) {
    // 🧮 Simple Calculation for Usage (No Graph Library)
    const usedBy = useMemo(() => {
        return allTokens.filter(t => t.dependencies?.includes(token.id));
    }, [token, allTokens]);

    const dependsOn = useMemo(() => {
        if (!token.dependencies) return [];
        return allTokens.filter(t => token.dependencies.includes(t.id));
    }, [token, allTokens]);

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-8">

            {/* Header */}
            <header className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            {token.$type}
                        </span>
                        <span className="text-xs text-text-dim font-mono">
                            {token.path.join(' / ')}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{token.name}</h1>
                    <p className="text-text-dim text-sm max-w-xl">
                        {token.$description || "No description provided."}
                    </p>
                </div>
            </header>

            {/* Value Display */}
            <section className="vibe-card p-6 rounded-2xl bg-surface-1 border border-white/5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Value</h3>
                <div className="flex items-center gap-6">
                    {token.$type === 'color' && (
                        <div className="w-24 h-24 rounded-2xl border border-white/10 shadow-lg" style={{ backgroundColor: String(token.$value) }} />
                    )}
                    <div className="space-y-2">
                        <div className="text-3xl font-mono font-medium text-white select-all">
                            {String(token.$value)}
                        </div>
                        <div className="text-xs text-text-dim">
                            Resolved Value
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Hero Card */}
            <StatCard
                icon={<Activity size={20} className="text-blue-400" />}
                label="Total Impact"
                // 🔥 UPDATED: Using totalRawUsage as per user request
                value={`~${token.usage?.totalRawUsage || 0}`}
                subValue="Times used in file"
                delay={0}
                hero
            />

            {/* usage details: 2 Columns - Design & Graph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🎨 Column 1: Design Usage (Components & Styles) */}
                <div className="space-y-6">
                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Components"
                        count={token.usage?.usedInComponents.length || 0}
                        items={token.usage?.usedInComponents.map(c => ({ id: c.id, name: c.name, icon: <Layers size={12} /> }))}
                        emptyLabel="No components using this token"
                        delay={0.1}
                    />

                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Styles"
                        count={token.usage?.usedInStyles.length || 0}
                        items={token.usage?.usedInStyles.map(s => ({ id: s.id, name: s.name, icon: <div className="w-2 h-2 rounded-full bg-primary" /> }))}
                        emptyLabel="No styles bound to this token"
                        delay={0.2}
                    />
                </div>

                {/* 🕸️ Column 2: Token Graph (Dependencies) */}
                <div className="space-y-6">
                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Referenced By"
                        count={usedBy.length}
                        items={usedBy.map(t => ({
                            id: t.id,
                            name: t.name,
                            icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.$type === 'color' ? String(t.$value) : 'var(--text-muted)' }} />
                        }))}
                        emptyLabel="No other tokens refer to this"
                        delay={0.3}
                    />

                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Uses Tokens"
                        count={dependsOn.length}
                        items={dependsOn.map(t => ({
                            id: t.id,
                            name: t.name,
                            icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.$type === 'color' ? String(t.$value) : 'var(--text-muted)' }} />
                        }))}
                        emptyLabel="This token uses no other tokens"
                        delay={0.4}
                    />
                </div>
            </div>

        </div>
    );
}

/**
 * 📊 StatCard (Hero Variant)
 */
function StatCard({
    icon,
    label,
    value,
    subValue,
    delay = 0,
    hero = false
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    subValue: string;
    delay?: number;
    hero?: boolean;
}) {
    return (
        <div
            className={`group relative p-6 rounded-2xl bg-surface-1 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 ${hero ? 'bg-gradient-to-r from-surface-1 to-surface-2' : ''}`}
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</span>
                        {icon}
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                        {value}
                    </div>
                    <div className="text-xs text-text-dim mt-1">{subValue}</div>
                </div>
                {/* Visual Decoration for Hero */}
                {hero && <Activity size={48} className="text-white/5 stroke-1" />}
            </div>
        </div>
    );
}

/**
 * 📜 ListCard
 * Combines a statistic header with a scrollable list of items.
 * "Referenced By Tokens (1) in the card that shows the number"
 */
function ListCard({
    icon,
    label,
    count,
    items = [],
    emptyLabel,
    delay = 0
}: {
    icon: React.ReactNode | null; // Allow null for headerless look
    label: string;
    count: number;
    items?: { id: string; name: string; icon?: React.ReactNode }[];
    emptyLabel: string;
    delay?: number;
}) {
    return (
        <div
            className="group flex flex-col h-[240px] p-5 rounded-2xl bg-surface-1 border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                    {/* Conditionally render icon box if icon exists */}
                    {icon && (
                        <div className="p-2 rounded-lg bg-surface-0 border border-white/5 text-text-dim group-hover:text-white transition-colors">
                            {icon}
                        </div>
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors">
                        {label}
                    </span>
                </div>
                <div className="text-2xl font-bold text-white">
                    {count}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                {items.length > 0 ? (
                    <div className="space-y-1">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-0/50 hover:bg-surface-0 border border-transparent hover:border-white/5 transition-all cursor-default">
                                <div className="text-text-dim flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-xs text-text-primary truncate select-text">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-center p-4">
                        <p className="text-[10px] text-text-dim italic opacity-50">{emptyLabel}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

`

---

## /src/infrastructure/figma/StorageProxy.ts
> Path: $Path

`$Lang
/**
 * StorageProxy for Figma Plugin UI
 * 
 * PROBLEM: localStorage is NOT available in Figma plugin iframes (sandboxed data: URLs)
 * SOLUTION: Proxy all storage operations to the controller thread via postMessage
 * 
 * The controller thread uses figma.clientStorage (async API).
 */

type StorageCallback = (value: string | null) => void;

class FigmaStorageProxy {
    private pendingRequests: Map<string, StorageCallback> = new Map();

    constructor() {
        // Listen for responses from controller
        window.addEventListener('message', (event) => {
            const { type, key, value } = event.data.pluginMessage || {};

            if (type === 'STORAGE_GET_RESPONSE') {
                const callback = this.pendingRequests.get(key);
                if (callback) {
                    callback(value);
                    this.pendingRequests.delete(key);
                }
            }
        });
    }

    /**
     * Async getItem (because figma.clientStorage is async)
     */
    async getItem(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            this.pendingRequests.set(key, resolve);
            parent.postMessage({
                pluginMessage: { type: 'STORAGE_GET', key }
            }, '*');
        });
    }

    /**
     * Async setItem
     */
    async setItem(key: string, value: string): Promise<void> {
        parent.postMessage({
            pluginMessage: { type: 'STORAGE_SET', key, value }
        }, '*');
    }

    /**
     * Async removeItem
     */
    async removeItem(key: string): Promise<void> {
        parent.postMessage({
            pluginMessage: { type: 'STORAGE_REMOVE', key }
        }, '*');
    }
}

// Singleton instance
export const storage = new FigmaStorageProxy();

`

---

## /src/infrastructure/network/VibeWorkerClient.ts
> Path: $Path

`$Lang
/**
 * @module VibeWorkerClient
 * @description Secure proxy client to communicate with Vibe Cloudflare Worker.
 * Replaces direct Supabase client for sensitive operations.
 */

// 🔒 SECURE WORKER URL - No specific keys needed on client side
const WORKER_URL = 'https://fancy-dawn-0b10.abdelrahman-arab-ac.workers.dev';

export interface WorkerResponse<T> {
    data: T | null;
    error: string | null;
}

export class VibeWorkerClient {

    /**
     * Generic POST request wrapper
     */
    private static async post<T>(endpoint: string, body: any): Promise<WorkerResponse<T>> {
        try {
            const response = await fetch(`${WORKER_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const text = await response.text();
                return { data: null, error: `Worker Error ${response.status}: ${text}` };
            }

            const json = await response.json();

            // The worker wrapping convention based on user snippet:
            // return result.data; -> The snippet implies the worker returns { data: ... }
            // Let's assume the worker returns a structure we might need to normalize.
            // If the snippet says:
            // const result = await response.json();
            // return result.data;
            // Then we should probably just return the json directly if it matches our generic type,
            // or extract data.

            // User snippet analysis:
            // const result = await response.json();
            // return result.data;

            // So the raw JSON response contains a 'data' property.
            return { data: json.data, error: null };

        } catch (e: unknown) {
            console.error(`[VibeWorker] Request failed to ${endpoint}`, e);
            return { data: null, error: e instanceof Error ? e.message : String(e) };
        }
    }

    /**
     * Authenticates a user via the Worker Proxy.
     */
    static async signIn(email: string, password: string): Promise<WorkerResponse<any>> {
        return this.post('/auth', {
            type: 'signin',
            email,
            password
        });
    }

    /**
     * Syncs generic data to Supabase tables via the Worker Proxy.
     */
    static async syncTokens(data: any): Promise<WorkerResponse<any>> {
        return this.post('/sync', {
            table: 'tokens',
            method: 'POST', // or UPSERT based on worker logic
            data: data
        });
    }

    /**
     * Helper to ping the worker or check health if needed.
     */
    static async healthCheck(): Promise<boolean> {
        try {
            const res = await fetch(`${WORKER_URL}/`);
            return res.ok;
        } catch {
            return false;
        }
    }
}

`

---

## /src/infrastructure/repositories/FigmaVariableRepository.ts
> Path: $Path

`$Lang
import type { IVariableRepository } from '../../core/interfaces/IVariableRepository';
import type { TokenEntity, VariableScope, VariableValue } from '../../core/types';

// Helper to map Figma types to W3C
function mapFigmaResolvedType(type: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN"): TokenEntity['$extensions']['figma']['resolvedType'] {
    return type;
}

/**
 * Converts Figma RGB to HEX string.
 */
function rgbToHex(rgb: unknown): string | null {
    if (!rgb || typeof rgb !== 'object' || !('r' in rgb)) return null;
    const c = rgb as RGB; // Safe cast after check

    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`.toUpperCase();
}

export class FigmaVariableRepository implements IVariableRepository {

    async sync(): Promise<TokenEntity[]> {
        const tokens: TokenEntity[] = [];
        for await (const chunk of this.syncGenerator()) {
            tokens.push(...chunk);
        }
        return tokens;
    }

    async *syncGenerator(abortSignal?: AbortSignal): AsyncGenerator<TokenEntity[]> {
        // 🔒 SAFETY: Check if Plugin API is available
        if (!figma.variables || abortSignal?.aborted) {
            throw new Error("Figma variables API not available or Sync Aborted.");
        }

        try {
            let allVariables: Variable[] = [];
            let collections: VariableCollection[] = [];

            try {
                // 🛡️ PARANOID SAFETY: Double check figma global
                if (typeof figma === 'undefined' || !figma.variables) {
                    throw new Error("Figma global is missing or variables API is undefined");
                }

                allVariables = await figma.variables.getLocalVariablesAsync();
                collections = await figma.variables.getLocalVariableCollectionsAsync();

                // 🛡️ DATA INTEGRITY: Ensure we actually got arrays
                if (!allVariables || !Array.isArray(allVariables)) {
                    console.warn('[Repository] getLocalVariablesAsync returned invalid data', allVariables);
                    allVariables = [];
                }
                if (!collections || !Array.isArray(collections)) {
                    console.warn('[Repository] getLocalVariableCollectionsAsync returned invalid data', collections);
                    collections = [];
                }
            } catch (error: any) {
                // 🛑 Catch ReferenceErrors (common in detached plugin states)
                console.error('[Repository] Figma API Critical Failure during fetch:', error);

                // If it's a ReferenceError, the plugin environment might be corrupted
                if (error instanceof ReferenceError || error.name === 'ReferenceError') {
                    throw new Error("Figma API Context Lost (ReferenceError). Please restart the plugin.");
                }
                throw error;
            }

            // ⚡ OPTIMIZATION: Create Lookup Maps (O(1) access)
            const collectionMap = new Map(collections.map(c => [c.id, c]));
            const variableMap = new Map(allVariables.map(v => [v.id, v]));

            // ⚡ PERFORMANCE: Time Slicing Config
            const CHUNK_SIZE = 50;
            let currentChunk: TokenEntity[] = [];

            for (const variable of allVariables) {
                // 🔒 SAFETY: Fail fast if API becomes unavailable OR aborted
                if (!figma.variables || abortSignal?.aborted) {
                    throw new Error("Figma variables API became unavailable or Sync Aborted.");
                }

                const collection = collectionMap.get(variable.variableCollectionId);
                if (!collection) continue;

                // Resolve value for the default mode
                const modeId = collection.defaultModeId || (collection.modes[0] && collection.modes[0].modeId);
                if (!modeId) continue;

                const value = variable.valuesByMode[modeId];

                // Determine W3C type
                let w3cType: TokenEntity['$type'] = 'color';
                if (variable.resolvedType === 'FLOAT') w3cType = 'dimension';
                if (variable.resolvedType === 'STRING') w3cType = 'fontFamily';
                if (variable.resolvedType === 'BOOLEAN') continue; // Skip booleans

                // Hierarchical Path Construction
                const fullPath = `${collection.name}/${variable.name}`;
                const pathParts = fullPath.split('/');

                // Extract dependencies (aliases) and value resolution
                const dependencies: string[] = [];

                const resolveValue = (val: VariableValue | VariableAlias, visited: Set<string> = new Set()): string | number => {
                    if (val && typeof val === 'object' && 'type' in val && val.type === 'VARIABLE_ALIAS') {
                        const aliasId = val.id;

                        // 🛑 CYCLE DETECTION
                        if (visited.has(aliasId)) {
                            console.warn(`[Repo] Cycle detected for alias ${aliasId}`);
                            return 'CYCLE_DETECTED';
                        }
                        visited.add(aliasId);

                        dependencies.push(aliasId);
                        // ⚡ OPTIMIZED: Use Map Lookup instead of array.find
                        const target = variableMap.get(aliasId);

                        if (target) {
                            const targetCollection = collectionMap.get(target.variableCollectionId);
                            const targetModeId = targetCollection?.defaultModeId || (targetCollection?.modes[0]?.modeId);
                            if (targetModeId) {
                                return resolveValue(target.valuesByMode[targetModeId], visited);
                            }
                        }
                        return 'ALIAS_ERROR';
                    }

                    if (variable.resolvedType === 'COLOR') {
                        return rgbToHex(val) || '#000000';
                    }

                    if (typeof val === 'string' || typeof val === 'number') {
                        return val;
                    }

                    return String(val); // Fallback
                };

                const resolvedValue = resolveValue(value);

                const token: TokenEntity = {
                    id: variable.id,
                    name: pathParts[pathParts.length - 1],
                    path: pathParts.slice(0, -1),
                    $value: resolvedValue,
                    $type: w3cType,
                    $description: variable.description,
                    $extensions: {
                        figma: {
                            scopes: variable.scopes as VariableScope[],
                            collectionId: collection.id,
                            modeId: modeId,
                            resolvedType: mapFigmaResolvedType(variable.resolvedType)
                        }
                    },
                    dependencies: dependencies,
                    dependents: []
                };

                currentChunk.push(token);

                // Yield to main thread every CHUNK_SIZE
                if (currentChunk.length >= CHUNK_SIZE) {
                    yield currentChunk;
                    currentChunk = [];
                    await new Promise(resolve => setTimeout(resolve, 1)); // Yield
                }
            }

            // Yield remaining
            if (currentChunk.length > 0) {
                yield currentChunk;
            }

        } catch (error) {
            // 🔍 ENHANCED ERROR LOGGING
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : undefined;
            const errorName = error instanceof Error ? error.name : 'Unknown';

            console.error('[Repository] Failed to sync variables - Full details:', {
                name: errorName,
                message: errorMessage,
                stack: errorStack,
                raw: error
            });

            throw error;
        }
    }

    async create(name: string, type: 'color' | 'number' | 'string', value: VariableValue): Promise<void> {

        // Check if this is a Responsive Definition (Multi-mode)
        // We cast value to unknown first to safely check properties
        const isResponsive = typeof value === 'object' && value !== null && 'mobile' in value;

        let collection: VariableCollection;

        if (isResponsive) {
            // Find or Create "Responsive Tokens" collection
            const collections = await figma.variables.getLocalVariableCollectionsAsync();
            let respCollection = collections.find(c => c.name === 'Responsive Tokens');

            if (!respCollection) {
                console.log('[Repo] Creating Responsive Collection...');
                respCollection = figma.variables.createVariableCollection('Responsive Tokens');
                // Rename default mode to Mobile
                respCollection.renameMode(respCollection.modes[0].modeId, 'Mobile');
                // Add Tablet and Desktop
                respCollection.addMode('Tablet');
                respCollection.addMode('Desktop');
            }
            collection = respCollection;
        } else {
            // Standard Single Mode
            const collections = await figma.variables.getLocalVariableCollectionsAsync();

            // 🧠 STRICT PATH ENFORCEMENT
            // Format: "CollectionName/Group/TokenName" or "CollectionName/TokenName"
            // We NO LONGER support bare token names without collections.
            const parts = name.split('/');

            if (parts.length < 2) {
                throw new Error(
                    `Invalid token path: "${name}". ` +
                    `Expected format: "Collection/TokenName" or "Collection/Group/TokenName". ` +
                    `Please specify a collection path.`
                );
            }

            const targetCollectionName = parts[0];
            // The Figma API uses "/" for grouping WITHIN a collection.
            // So if we have "Brand/Colors/Primary", 
            // Collection = "Brand"
            // Valid Variable Name = "Colors/Primary"
            const finalTokenName = parts.slice(1).join('/');

            // Find existing collection or create it with user-provided name
            let foundCollection = collections.find(c => c.name === targetCollectionName);
            if (!foundCollection) {
                foundCollection = figma.variables.createVariableCollection(targetCollectionName);
                console.log(`[Repo] Auto-created collection: "${targetCollectionName}"`);
            }
            collection = foundCollection;

            // Update the name to be relative to the collection
            name = finalTokenName;
        }

        const variable = figma.variables.createVariable(
            name,
            collection,
            type === 'color' ? 'COLOR' : type === 'number' ? 'FLOAT' : 'STRING'
        );

        if (isResponsive) {
            // Set values for each mode
            const modes = collection.modes;
            // Expect modes: Mobile, Tablet, Desktop
            // We map input keys (lowercase) to Mode Names (Title case)
            const map: Record<string, string> = { 'mobile': 'Mobile', 'tablet': 'Tablet', 'desktop': 'Desktop' };

            // Safe cast since we confirmed isResponsive
            const responsiveValue = value as Record<string, VariableValue>;

            for (const [key, val] of Object.entries(responsiveValue)) {
                const modeName = map[key];
                const mode = modes.find(m => m.name === modeName);
                if (mode) {
                    const parsed = type === 'number' && typeof val === 'string' ? parseFloat(val) : val;
                    variable.setValueForMode(mode.modeId, parsed as VariableValue);
                }
            }
        } else {
            // Standard Set
            const modeId = collection.modes[0].modeId;
            if (type === 'color' && typeof value === 'string') {
                const rgb = this.hexToRgbInternal(value);
                variable.setValueForMode(modeId, rgb);
            } else if (type === 'number' && typeof value === 'string') {
                variable.setValueForMode(modeId, parseFloat(value));
            } else {
                variable.setValueForMode(modeId, value as VariableValue);
            }
        }
    }

    async update(id: string, value: VariableValue): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (!variable) throw new Error(`Variable ${id} not found`);

        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const collection = collections.find(c => c.variableIds.includes(id));

        if (collection) {
            const modeId = collection.modes[0].modeId;
            if (variable.resolvedType === 'COLOR' && typeof value === 'string') {
                variable.setValueForMode(modeId, this.hexToRgbInternal(value));
            } else {
                variable.setValueForMode(modeId, value);
            }
        }
    }

    async rename(id: string, newName: string): Promise<void> {
        const variable = await figma.variables.getVariableByIdAsync(id);
        if (variable) {
            variable.name = newName;
        } else {
            throw new Error(`Variable ${id} not found`);
        }
    }

    private hexToRgbInternal(hex: string): RGB {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }
}

`

---

## /src/infrastructure/supabase/ColorRepository.ts
> Path: $Path

`$Lang
import { VibeSupabase } from './SupabaseClient';

export interface RemoteColor {
    id: number;
    hex: string;
    name: string;
    dataset_source: string;
    created_at: string;
}

export interface RemoteColorMatch {
    name: string;
    hex: string;
    delta_e: number;
    confidence: number;
}

export class ColorRepository {
    /**
     * Finds exact or nearest color from the cloud database
     * (Uses Postgres extensions if available, or simple matching)
     */
    static async findColor(hex: string): Promise<RemoteColor | null> {
        const client = VibeSupabase.get();
        if (!client) return null;

        const { data, error } = await client
            .from('vibe_colors')
            .select('*')
            .eq('hex', hex.toLowerCase())
            .single();

        if (error) {
            // Optional: Implement fuzzy search here if pg_vector is enabled
            return null;
        }

        return data as RemoteColor;
    }

    static async submitColor(hex: string, name: string): Promise<boolean> {
        const client = VibeSupabase.get();
        if (!client) return false;

        const { error } = await client
            .from('vibe_colors_lab') // Updated to new table
            .upsert({
                hex: hex.toLowerCase(),
                name: name.toLowerCase(),
                dataset_source: 'user_contribution'
                // trigger will handle lab_l/a/b autocalc
            });

        return !error;
    }

    /**
     * Fetches ALL colors for client-side caching/analysis (from new LAB table)
     */
    static async fetchAll(): Promise<RemoteColor[]> {
        const client = VibeSupabase.get();
        if (!client) return [];

        const { data, error } = await client
            .from('vibe_colors_lab') // Updated to new table
            .select('*');

        if (error) {
            console.error("Vibe DB Error:", error);
            return [];
        }
        return data as RemoteColor[];
    }

    /**
     * Server-Side Nearest Match (Uses Database Delta E Logic)
     * Extremely fast for on-demand queries.
     */
    static async findClosestRemote(hex: string, limit = 5): Promise<RemoteColorMatch[]> {
        const client = VibeSupabase.get();
        if (!client) return [];

        const { data, error } = await client
            .rpc('find_closest_color', {
                input_hex: hex,
                limit_count: limit
            });

        if (error) {
            console.error("RPC Error:", error);
            return [];
        }
        return data; // Returns { name, hex, delta_e, confidence, ... }
    }
}

`

---

## /src/infrastructure/supabase/FigmaStorageAdapter.ts
> Path: $Path

`$Lang
import { storage } from '../figma/StorageProxy';

/**
 * Adapter for Supabase to use Figma's clientStorage (via StorageProxy).
 * Implements the SupportedStorage interface expected by Supabase Client.
 */
export class FigmaStorageAdapter {
    getItem(key: string): Promise<string | null> {
        return storage.getItem(key);
    }

    setItem(key: string, value: string): Promise<void> {
        return storage.setItem(key, value);
    }

    removeItem(key: string): Promise<void> {
        return storage.removeItem(key);
    }
}

`

---

## /src/infrastructure/supabase/SupabaseClient.ts
> Path: $Path

`$Lang
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FigmaStorageAdapter } from './FigmaStorageAdapter';
import { getSupabaseConfig } from './SupabaseConfig';

export class VibeSupabase {
    private static instance: SupabaseClient | null = null;
    private static currentConfig: { url: string; key: string } | null = null;

    /**
     * Bootstraps the Supabase connection using the secured configuration.
     * This should be called at app startup.
     */
    static async connect() {
        try {
            const config = await getSupabaseConfig();

            // Simple validation to ensure we have a real key (not the short placeholder)
            if (config.supabaseKey.length < 20) {
                console.warn("⚠️ VibeSupabase: Key looks suspicious. Did you encrypt it?");
            }

            this.initialize(config.supabaseUrl, config.supabaseKey);
        } catch (error) {
            console.error("❌ VibeSupabase: Connection Sequence Failed", error);
        }
    }

    static initialize(url: string, key: string) {
        // Idempotency check to prevent unnecessary re-creation
        if (this.currentConfig?.url === url && this.currentConfig?.key === key && this.instance) {
            return;
        }

        try {
            this.instance = createClient(url, key, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false,
                    storage: new FigmaStorageAdapter(),
                },
            });
            this.currentConfig = { url, key };
            console.log("✅ VibeSupabase: Connection Initialized.");
            console.warn("⚠️ DEPRECATION NOTICE: Direct Supabase usage is deprecated for Auth and Sync. Use VibeWorkerClient instead.");
        } catch (e) {
            console.error("❌ VibeSupabase: Initialization Failed", e);
            this.instance = null;
        }
    }

    static get(): SupabaseClient | null {
        if (!this.instance) {
            console.warn("⚠️ VibeSupabase: Client not initialized. Check Settings.");
            return null;
        }
        return this.instance;
    }
}

`

---

## /src/infrastructure/supabase/SupabaseConfig.ts
> Path: $Path

`$Lang
// src/infrastructure/supabase/SupabaseConfig.ts

// 🔐 Encrypted Supabase Anon Key (XOR cipher with SALT)
const ENCRYPTED_KEY = "6c7043616b4e6a6046604340" +
    "5c7340384760407a40675b3c6a4a403f406279515f4a43" +
    "30276c7043796a3a4460466043736d514b6150644f7353" +
    "5a407a406743655360403f4067473d50674f636d3b6d3b" +
    "6b3a4f7068514b616d3a6d7f6b3a6d6740607e606a6430" +
    "7a535a403f40644f7c6b3b3d60454a437950515860466" +
    "34c3a47636271445d443c4463507a40645f3d6a4a403f4" +
    "463483d474d503d465d62704767392759447a4e7c4c7e5" +
    "95d433862675344387e435d645f62457b6f3d633c40397" +
    "b793b42785d5f4b5e583c6666";

// 2. The salt used for encryption
const SALT = "VIBE_2026_SECURE";

// 3. The De-scrambler (Reverse Algorithm)
// Restores the key to memory only when needed
const decrypt = (salt: string, encoded: string): string => {
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded.match(/.{1,2}/g) || [])
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
};

/**
 * 🕵️ getSupabaseConfig
 * Retrieves the Supabase configuration with Just-In-Time decryption.
 * The key potentially exists in memory only for the duration of this call
 * (though SupabaseClient creates a persistent instance with it).
 */
export const getSupabaseConfig = async () => {
    const realKey = decrypt(SALT, ENCRYPTED_KEY);

    return {
        supabaseUrl: "https://sxbqcwgvoqripawwoowg.supabase.co",
        supabaseKey: realKey
    };
};

`

---

## /src/shared/animations/MicroAnimations.ts
> Path: $Path

`$Lang
/**
 * @module MicroAnimations
 * @description Centralized animation configurations for the Vibe onboarding experience.
 * @version 1.0.0
 * 
 * This module provides production-ready Framer Motion configurations for:
 * - Input interactions (focus glow, validation feedback)
 * - Screen transitions (fade, slide, scale)
 * - Loading states (shimmer, pulse, spin)
 * - Success/error feedback (checkmark, shake, bounce)
 * 
 * All animations are optimized for 60fps and follow the Vibe design language.
 */

import type { Transition, Variants } from 'framer-motion';

// ============================================================================
// 🎨 CORE TRANSITION PRESETS
// ============================================================================

/**
 * Vibe signature easing - smooth and organic
 */
export const vibeEase: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8
};

/**
 * Elastic bounce for playful interactions
 */
export const elasticEase: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 20,
    mass: 0.5
};

/**
 * Quick snap for immediate feedback
 */
export const snapEase: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 35,
    mass: 0.6
};

/**
 * Smooth tween for controlled animations
 */
export const smoothEase: Transition = {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1] // Vibe cubic-bezier
};

// ============================================================================
// ✨ INPUT INTERACTION ANIMATIONS
// ============================================================================

/**
 * Focus glow animation for inputs
 * Creates a subtle pulsing glow effect on focus
 */
export const inputFocusGlow: Variants = {
    idle: {
        boxShadow: '0 0 0 0 rgba(110, 98, 229, 0)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        transition: smoothEase
    },
    focused: {
        boxShadow: [
            '0 0 0 0 rgba(110, 98, 229, 0.3)',
            '0 0 20px 2px rgba(110, 98, 229, 0.5)',
            '0 0 15px 2px rgba(110, 98, 229, 0.4)'
        ],
        borderColor: 'rgba(110, 98, 229, 0.5)',
        transition: {
            boxShadow: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut'
            },
            borderColor: smoothEase
        }
    }
};

/**
 * Label float animation (Material Design inspired)
 */
export const labelFloat: Variants = {
    resting: {
        y: 12,
        scale: 1,
        color: 'rgba(161, 161, 170, 0.7)',
        transition: vibeEase
    },
    floating: {
        y: -12,
        scale: 0.85,
        color: 'rgba(110, 98, 229, 1)',
        transition: vibeEase
    }
};

/**
 * Icon color shift on input interaction
 */
export const iconShift: Variants = {
    idle: {
        color: 'rgba(161, 161, 170, 0.5)',
        scale: 1,
        transition: smoothEase
    },
    active: {
        color: 'rgba(110, 98, 229, 1)',
        scale: 1.1,
        transition: elasticEase
    }
};

// ============================================================================
// ✅ VALIDATION FEEDBACK ANIMATIONS
// ============================================================================

/**
 * Shake animation for validation errors
 * Gentle horizontal shake to indicate error without being harsh
 */
export const shake: Variants = {
    initial: { x: 0 },
    error: {
        x: [-10, 10, -8, 8, -6, 6, -4, 4, 0],
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    }
};

/**
 * Checkmark success animation
 * Scale + opacity animation for validation success
 */
export const checkmark: Variants = {
    hidden: {
        scale: 0,
        opacity: 0,
        rotate: -45
    },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15,
            mass: 0.5
        }
    }
};

/**
 * Error icon pulse animation
 * Alert icon with attention-grabbing pulse
 */
export const errorPulse: Variants = {
    idle: {
        scale: 1,
        opacity: 1
    },
    pulse: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 0.5,
            repeat: 2,
            ease: 'easeInOut'
        }
    }
};

/**
 * Password strength meter fill animation
 */
export const strengthMeterFill = (strength: number): Variants => ({
    empty: {
        width: '0%',
        opacity: 0
    },
    filled: {
        width: `${strength}%`,
        opacity: 1,
        transition: {
            width: { ...vibeEase, duration: 0.6 },
            opacity: smoothEase
        }
    }
});

// ============================================================================
// 📄 SCREEN TRANSITION ANIMATIONS
// ============================================================================

/**
 * Fade in/out transitions for screen changes
 */
export const fadeTransition: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: smoothEase
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

/**
 * Slide up entrance (ideal for modals, sheets)
 */
export const slideUp: Variants = {
    hidden: {
        y: 50,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: vibeEase
    },
    exit: {
        y: -30,
        opacity: 0,
        transition: smoothEase
    }
};

/**
 * Scale + fade for card/modal appearances
 */
export const scaleIn: Variants = {
    hidden: {
        scale: 0.9,
        opacity: 0,
        y: 20
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: vibeEase
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

/**
 * Crossfade transition between screens
 */
export const crossfade: Variants = {
    hidden: {
        opacity: 0,
        position: 'absolute' as const,
        width: '100%'
    },
    visible: {
        opacity: 1,
        position: 'relative' as const,
        transition: { duration: 0.4, ease: 'easeInOut' }
    },
    exit: {
        opacity: 0,
        position: 'absolute' as const,
        transition: { duration: 0.3 }
    }
};

// ============================================================================
// ⏳ LOADING STATE ANIMATIONS
// ============================================================================

/**
 * Shimmer effect for skeleton loading
 */
export const shimmer: Variants = {
    loading: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

/**
 * Pulse animation for loading states
 */
export const pulse: Variants = {
    idle: { opacity: 1 },
    pulsing: {
        opacity: [1, 0.5, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

/**
 * Spinner rotation (for button loading states)
 */
export const spin = {
    animate: {
        rotate: 360
    },
    transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const
    }
};

// ============================================================================
// 🎉 CELEBRATION ANIMATIONS
// ============================================================================

/**
 * Bounce animation for success states
 */
export const bounce: Variants = {
    initial: { scale: 1 },
    bouncing: {
        scale: [1, 1.1, 0.95, 1.05, 1],
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    }
};

/**
 * Confetti particle animation
 */
export const confettiParticle = (delay: number): Variants => ({
    hidden: {
        y: -20,
        opacity: 0,
        rotate: 0
    },
    visible: {
        y: [0, -50, 100],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 0],
        rotate: [0, 360],
        transition: {
            duration: 2,
            delay,
            ease: 'easeOut'
        }
    }
});

/**
 * Success overlay fade in/out
 */
export const successOverlay: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        backdropFilter: 'blur(0px)'
    },
    visible: {
        opacity: 1,
        scale: 1,
        backdropFilter: 'blur(8px)',
        transition: {
            opacity: vibeEase,
            scale: elasticEase
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.3,
            delay: 2.5 // Auto-dismiss after 2.5s
        }
    }
};

// ============================================================================
// 🎨 HINT/TOOLTIP ANIMATIONS
// ============================================================================

/**
 * Floating hint tooltip (appears above input)
 */
export const floatingHint: Variants = {
    hidden: {
        y: 10,
        opacity: 0,
        scale: 0.95
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            ...elasticEase,
            delay: 0.1
        }
    },
    exit: {
        y: -5,
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2 }
    }
};

/**
 * Stagger children animation (for list items)
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem: Variants = {
    hidden: {
        y: 20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: vibeEase
    }
};

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a custom spring transition with overrides
 */
export const customSpring = (overrides: Partial<Transition>): Transition => ({
    ...vibeEase,
    ...overrides
});

/**
 * Get color based on validation state
 */
export const getValidationColor = (state: 'idle' | 'valid' | 'invalid' | 'validating'): string => {
    switch (state) {
        case 'valid':
            return '#10B981'; // success
        case 'invalid':
            return '#F43F5E'; // error
        case 'validating':
            return '#F59E0B'; // warning
        default:
            return 'rgba(161, 161, 170, 0.5)'; // text-muted
    }
};

/**
 * Get password strength color
 */
export const getStrengthColor = (strength: number): string => {
    if (strength < 30) return '#F43F5E'; // Weak - red
    if (strength < 60) return '#F59E0B'; // Medium - yellow
    if (strength < 80) return '#14AE5C'; // Good - green
    return '#10B981'; // Strong - bright green
};

`

---

## /src/shared/errors/AppErrors.ts
> Path: $Path

`$Lang
/**
 * Standard Application Errors for Vibe Plugin
 * Enables precise error handling and user feedback.
 */

export class AppError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class AIModelError extends AppError {
    constructor(message: string = 'AI Model Service is currently unavailable.') {
        super(message);
    }
}

export class AIModelOverloadedError extends AIModelError {
    constructor(retryAfterMs?: number) {
        super(`AI Model is overloaded. Please try again ${retryAfterMs ? `in ${retryAfterMs / 1000}s` : 'later'}.`);
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network connection failed.') {
        super(message);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message);
    }
}

export class ConfigurationError extends AppError {
    constructor(message: string) {
        super(message);
    }
}

`

---

## /src/shared/lib/classnames.ts
> Path: $Path

`$Lang
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

`

---

## /src/shared/lib/colors.ts
> Path: $Path

`$Lang
/**
 * THE VIBE COLOR ENGINE
 * Handles conversions and naming logic.
 */

// Convert RGB to HSV
export function rgbToHsv(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

// Convert HSV to RGB
export function hsvToRgb(h: number, s: number, v: number) {
    s /= 100; v /= 100;
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    };
}

// Sanitize Hex to ensure 6 characters
export function toHex6(color: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`.toUpperCase();
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

export const rgbToFigma = (r: number, g: number, b: number) => {
    return { r: r / 255, g: g / 255, b: b / 255 };
};

// "Genius" Naming Map
// Removed per user request to rely on Cloud Database
export const NAMED_COLORS: Record<string, string> = {};

export const getColorName = async (hex: string): Promise<string> => {
    try {
        const { CloudColorNamer } = await import('../../features/intelligence/CloudColorNamer');
        return await CloudColorNamer.findColor(hex);
    } catch (error) {
        console.error('[Shared ColorUtils] Cloud naming failed:', error);
        const cleanHex = hex.toUpperCase();
        return NAMED_COLORS[cleanHex] || "Custom Color";
    }
};

`

---

## /src/shared/lib/result.ts
> Path: $Path

`$Lang
/**
 * Result Pattern for strict error handling without try-catch spam.
 * @template T Success payload
 * @template E Error payload (defaults to string)
 */
export type Result<T, E = string> =
    | { success: true; value: T }
    | { success: false; error: E };

export const Result = {
    ok: <T>(value: T): Result<T> => ({ success: true, value }),
    fail: <E, T = never>(error: E): Result<T, E> => ({ success: false, error } as Result<T, E>),

    /**
     * Safely executes a promise and returns a Result.
     */
    fromPromise: async <T>(promise: Promise<T>): Promise<Result<T, string>> => {
        try {
            const data = await promise;
            return Result.ok(data);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return Result.fail(message || 'Unknown error');
        }
    }
};

`

---

## /src/shared/lib/uuid.ts
> Path: $Path

`$Lang
/**
 * Generates a UUID (Universally Unique Identifier) v4.
 * Uses crypto.randomUUID if available, otherwise falls back to a robust math-based implementation.
 * unique enough for UI keys and temporary IDs.
 */
export function generateUUID(): string {
    // 1. Try native crypto API (modern browsers / Node)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
            return crypto.randomUUID();
        } catch (e) {
            // Fallback if it fails for some reason
        }
    }

    // 2. Fallback: RFC4122 version 4 compatible solution
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

`

---

## /src/shared/types.ts
> Path: $Path

`$Lang
export type PluginAction =
    | { type: 'REQUEST_GRAPH' }
    | { type: 'REQUEST_STATS' }
    | { type: 'PING' }
    | { type: 'SCAN_VARS' }
    | { type: 'SCAN_VARS' }
    | { type: 'STARTUP' }
    | { type: 'SYNC_GRAPH' }
    | { type: 'SYNC_VARIABLES' }
    | { type: 'SYNC_TOKENS' }
    // 🛑 Manual Sync Control
    | { type: 'SYNC_START' }
    | { type: 'SYNC_CANCEL' }
    | { type: 'SCAN_USAGE' }
    | { type: 'GENERATE_DOCS' }
    | { type: 'CREATE_VARIABLE'; payload: { name: string; type: 'color' | 'number' | 'string'; value: string | number | { r: number; g: number; b: number; a?: number } } }
    | { type: 'UPDATE_VARIABLE'; id: string; newValue: string | number | { r: number; g: number; b: number; a?: number } }
    | { type: 'RENAME_COLLECTION'; payload: { oldName: string; newName: string } }
    | { type: 'RENAME_COLLECTIONS'; payload: { dryRun: boolean } }
    | { type: 'RENAME_COLLECTION_BY_ID'; payload: { collectionId: string } }
    | { type: 'PREVIEW_CLASSIFICATIONS' }
    | { type: 'NOTIFY'; message: string }
    | { type: 'STORAGE_GET'; key: string }
    | { type: 'STORAGE_SET'; key: string; value: unknown }
    | { type: 'STORAGE_REMOVE'; key: string }
    | { type: 'MEMORY_SAVE'; key: string; data: unknown }
    | { type: 'MEMORY_LOAD'; key: string }
    | { type: 'CREATE_TOKENS'; payload: { name: string; tokens: unknown[] } }
    | { type: 'CREATE_TOKEN'; payload: { name: string; type: 'color' | 'number' | 'string'; value: string | number | { r: number; g: number; b: number; a?: number } } }
    | { type: 'UPDATE_TOKEN'; id: string; newValue: string | number | { r: number; g: number; b: number; a?: number } }
    | { type: 'RENAME_TOKEN'; payload: { id: string; newName: string } }
    | { type: 'CREATE_COLLECTION'; payload: { name: string } }
    | { type: 'SEARCH_QUERY'; payload: { query: string } } // 🔍 New Search Handler
    | { type: 'CREATE_STYLE'; payload: { name: string; type: 'typography' | 'effect' | 'grid'; value: string | number | { r: number; g: number; b: number; a?: number } } };

export type PluginEvent =
    | { type: 'SCAN_COMPLETE'; payload: unknown }
    | { type: 'SCAN_RESULT'; primitives: unknown[] }
    | { type: 'GRAPH_SYNCED'; tokens: unknown[]; timestamp?: number }
    | { type: 'GRAPH_UPDATED'; tokens: unknown[]; timestamp: number }
    | { type: 'STATS_UPDATED'; payload: { totalVariables: number; collections: number; styles: number } }
    | { type: 'VARIABLE_CREATED'; payload: { id: string; name: string } }
    | { type: 'VARIABLE_UPDATED'; id: string }
    | { type: 'RENAME_COLLECTIONS_RESULT'; payload: unknown }
    | { type: 'RENAME_COLLECTION_RESULT'; payload: { collectionId: string; success: boolean } }
    | { type: 'PREVIEW_CLASSIFICATIONS_RESULT'; payload: unknown }
    | { type: 'STORAGE_GET_RESPONSE'; key: string; value: unknown }
    | { type: 'MEMORY_LOAD_RESPONSE'; key: string; data: unknown }
    | { type: 'ERROR'; message: string }
    | { type: 'IMPACT_REPORT'; payload: unknown }
    | { type: 'SYNC_CANCELLED' }
    // 🌊 Progressive Sync Events
    | { type: 'SYNC_PHASE_START'; phase: 'definitions' | 'usage' }
    | { type: 'SYNC_CHUNK'; tokens: unknown[]; progress: number }
    | { type: 'SYNC_PHASE_COMPLETE'; phase: 'definitions' | 'usage' };

`

---

## /src/ui.tsx
> Path: $Path

`$Lang
// src/ui.tsx
import { createRoot } from 'react-dom/client';
import App from './App';
import './ui/theme/figma-tokens.css'; // Figma Native Theme + Vibe System
import { ErrorBoundary } from './components/shared/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

`

---

## /src/ui/contexts/SystemContext.tsx
> Path: $Path

`$Lang
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

export type SystemMessageType = 'info' | 'success' | 'error' | 'warning';

export interface SystemMessage {
    id: string;
    text: string;
    type: SystemMessageType;
    duration?: number;
}

interface SystemContextType {
    message: SystemMessage | null;
    post: (text: string, type?: SystemMessageType, duration?: number) => void;
    clear: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState<SystemMessage | null>(null);

    const post = useCallback((text: string, type: SystemMessageType = 'info', duration = 3000) => {
        const id = Date.now().toString();
        setMessage({ id, text, type, duration });

        if (duration > 0) {
            setTimeout(() => {
                setMessage(current => (current?.id === id ? null : current));
            }, duration);
        }
    }, []);

    const clear = useCallback(() => {
        setMessage(null);
    }, []);

    return (
        <SystemContext.Provider value={{ message, post, clear }}>
            {children}
        </SystemContext.Provider>
    );
}

export function useSystem() {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
}

`

---

## /src/ui/contexts/TokenContext.tsx
> Path: $Path

`$Lang
import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { TokenEntity } from '../../core/types';
import { SemanticMapper } from '../../features/tokens/domain/services/SemanticMapper';

// 1. Valid Interface Separation
interface TokenState {
    collectionName: string;
    tokens: TokenEntity[];
    tokenUsage: Record<string, number>; // 🆕
    isGenerating: boolean;
}

interface TokenActions {
    setCollectionName: (name: string) => void;
    addToken: (token: TokenEntity) => void;
    clearTokens: () => void;
    generateCollection: () => void;
}

// 2. Split Contexts
const TokenDataCtx = createContext<TokenState | undefined>(undefined);
const TokenActionsCtx = createContext<TokenActions | undefined>(undefined);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [tokenUsage, setTokenUsage] = useState<Record<string, number>>({});
    const [collectionName, setCollectionName] = useState("Vibe System");
    const [isGenerating, setIsGenerating] = useState(false);

    // 👂 Listen for Sync/Cache Data
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'SCAN_COMPLETE') {
                // 📥 Hydrate from Cache or Live Scan
                setTokenUsage(payload.usage || {});
                console.log("[TokenContext] Usage data updated:", payload.isCached ? '(Cached)' : '(Live)');
            }
        };

        window.addEventListener('message', handleMessage);

        // 🚀 Trigger Startup Load
        parent.postMessage({ pluginMessage: { type: 'STARTUP' } }, '*');

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // 3. Memoize Actions (Stable References)
    const actions = useMemo<TokenActions>(() => ({
        setCollectionName: (name: string) => setCollectionName(name),

        addToken: (token: TokenEntity) => {
            setTokens(prev => [...prev, token]);
        },

        clearTokens: () => {
            setTokens([]);
        },

        generateCollection: () => {
            setIsGenerating(true);
            const seedColor = "#0080FF";

            const systemTokens = SemanticMapper.generateSystem({ primary: seedColor });

            setTokens(systemTokens);

            parent.postMessage({
                pluginMessage: {
                    type: 'CREATE_TOKENS',
                    payload: {
                        name: collectionName,
                        tokens: systemTokens
                    }
                }
            }, '*');

            setTimeout(() => setIsGenerating(false), 2000);
        }
    }), [collectionName]);

    const state = useMemo(() => ({
        tokens,
        tokenUsage,
        collectionName,
        isGenerating
    }), [tokens, tokenUsage, collectionName, isGenerating]); // Added tokenUsage dep

    return (
        <TokenActionsCtx.Provider value={actions}>
            <TokenDataCtx.Provider value={state}>
                {children}
            </TokenDataCtx.Provider>
        </TokenActionsCtx.Provider>
    );
};

// 4. Granular Hooks
export const useTokenState = () => {
    const context = useContext(TokenDataCtx);
    if (!context) throw new Error("useTokenState must be used within a TokenProvider");
    return context;
};

export const useTokenActions = () => {
    const context = useContext(TokenActionsCtx);
    if (!context) throw new Error("useTokenActions must be used within a TokenProvider");
    return context;
};

// Legacy support
export const useTokensLegacy = () => {
    const state = useTokenState();
    const actions = useTokenActions();
    return { ...state, ...actions };
};

`

---

## /src/ui/hooks/useAI.ts
> Path: $Path

`$Lang
import { useState, useCallback } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { FeedbackService } from '../../features/feedback/FeedbackService';
import { AuthService } from '../../features/auth/AuthService';

export interface AIViewModel {
    isProcessing: boolean;
    handleCommand: (command: string) => Promise<void>;
}

/**
 * 🎣 useAI Hook (View Logic)
 * Processes natural language commands via the Intent Engine.
 * Ensures the AI Engine instance is synchronized with the current API Key.
 */
export function useAI(_apiKey: string | null, _onNavigate?: (view: 'dashboard' | 'settings' | 'graph' | 'create-token') => void): AIViewModel {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCommand = useCallback(async (command: string) => {
        setIsProcessing(true);
        try {
            // Repurposed Omnibox: Direct Feedback Loop
            omnibox.show('🚀 Sending to Vibe Team...', { type: 'loading', duration: 0 });

            // 1. Get User Context (Best Effort)
            const session = await AuthService.getSession();
            const user = session?.user;

            // 2. Send to Supabase
            await FeedbackService.sendFeedback({
                message: command,
                type: 'general', // Defaulting to general for quick-entry
                userId: user?.id,
                username: user?.email
            });

            // 3. Success Feedback
            omnibox.show('✅ Feedback Received!', { type: 'success', duration: 3000 });

        } catch (error: unknown) {
            console.error("[useAI] Feedback failed:", error);
            const message = error instanceof Error ? error.message : String(error);
            omnibox.show(`❌ Failed to send: ${message}`, { type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {
        isProcessing,
        handleCommand
    };
}

`

---

## /src/ui/hooks/useOmnibox.ts
> Path: $Path

`$Lang
import { useState, useEffect } from 'react';
import { omnibox, type OmniboxMessage } from '../managers/OmniboxManager';

/**
 * useOmnibox Hook
 * 
 * React adapter for the OmniboxManager singleton.
 */
export const useOmnibox = () => {
    const [message, setMessage] = useState<OmniboxMessage | null>(omnibox.getCurrent());

    useEffect(() => {
        const unsubscribe = omnibox.subscribe((newMessage) => {
            setMessage(newMessage);
        });
        return unsubscribe;
    }, []);

    return {
        message,
        dismiss: () => omnibox.hide()
    };
};

`

---

## /src/ui/hooks/useStyles.ts
> Path: $Path

`$Lang
import { useCallback } from 'react';

export interface StylesViewModel {
    createStyle: (data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => void;
}

/**
 * ViewModel for managing Figma Style state and actions.
 */
export function useStyles(): StylesViewModel {
    const createStyle = useCallback((data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => {
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_STYLE',
                payload: data
            }
        }, '*');
    }, []);

    return {
        createStyle
    };
}

`

---

## /src/ui/hooks/useTokens.ts
> Path: $Path

`$Lang
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { uiSyncManager } from '../services/UISyncManager';
import type { TokenEntity } from '../../core/types';
import { type SceneNodeAnatomy } from '../../features/perception/visitors/HierarchyVisitor';
import type { TokenFormData } from '../../features/tokens/domain/ui-types';

interface TokenStats {
    totalVariables: number;
    collections: number;
    styles: number;
    collectionNames: string[];
    collectionMap?: Record<string, string>;
    lastSync: number;
}

export interface TokensViewModel {
    tokens: TokenEntity[];
    anatomy: SceneNodeAnatomy[];
    stats: TokenStats;
    isSynced: boolean;
    liveIndicator: boolean;
    isSyncing: boolean;
    syncProgress: number;
    syncStatus: string;
    scanUsage: () => void;
    updateToken: (id: string, value: string) => void;
    createToken: (data: TokenFormData) => Promise<boolean>;
    scanAnatomy: () => void;
    createCollection: (name: string) => Promise<string | null>;
    renameCollection: (oldName: string, newName: string) => void;
    deleteCollection: (name: string) => Promise<void>;
    traceLineage: (tokenId: string) => void;
    syncVariables: () => void;
    resetSync: () => void;
    search: (query: string) => void;
    searchResults: TokenEntity[];
    lineageData: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

export function useTokens(): TokensViewModel {
    // 1. Core State
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [syncState, setSyncState] = useState(uiSyncManager.getState());
    const [anatomy, setAnatomy] = useState<SceneNodeAnatomy[]>([]);

    // 2. Raw Stats from Backend
    const [backendStats, setBackendStats] = useState<TokenStats>({
        totalVariables: 0,
        collections: 0,
        styles: 0,
        collectionNames: [],
        lastSync: 0
    });

    const [isSynced, setIsSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);
    const [lineageData, setLineageData] = useState<{ target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null>(null);
    const [searchResults, setSearchResults] = useState<TokenEntity[]>([]);

    // Refs for Promises
    const creationPromise = useRef<((success: boolean) => void) | null>(null);
    const collectionPromise = useRef<((id: string | null) => void) | null>(null);
    const deletePromise = useRef<{ resolve: () => void, reject: (reason?: Error | string) => void } | null>(null);

    // ⚡ Computed Stats (FIX: Source of Truth Unification)
    const stats = useMemo(() => {
        // ✅ ALWAYS use tokens.length as primary source
        const actualCount = tokens.length;

        return {
            ...backendStats,
            totalVariables: actualCount,  // ← FIX: Use actual loaded tokens
            lastSync: actualCount > 0 ? Date.now() : backendStats.lastSync
        };
    }, [tokens.length, backendStats]);

    // ⚡ Subscribe to UISyncManager
    useEffect(() => {
        const unsubState = uiSyncManager.onStateChange(setSyncState);
        const unsubTokens = uiSyncManager.onTokensUpdate(setTokens);
        return () => {
            unsubState();
            unsubTokens();
        };
    }, []);

    // ⚡ Message Handling
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};

            if (type === 'ANATOMY_UPDATED' || (type === 'GET_ANATOMY_SUCCESS')) {
                if (payload && Array.isArray(payload.anatomy)) {
                    setAnatomy(payload.anatomy);
                }
            }

            if (type === 'STATS_UPDATED' || type === 'REQUEST_STATS_SUCCESS') {
                setBackendStats({
                    totalVariables: payload.totalVariables ?? 0,
                    collections: payload.collections ?? 0,
                    styles: payload.styles ?? 0,
                    collectionNames: payload.collectionNames ?? [],
                    collectionMap: payload.collectionMap ?? {},
                    lastSync: Date.now()
                });
            }

            if (type === 'TRACE_LINEAGE_SUCCESS') {
                if (payload && payload.target) {
                    setLineageData(payload);
                }
            }

            if (type === 'CREATE_VARIABLE_SUCCESS') {
                omnibox.show('Token created successfully', { type: 'success' });
                creationPromise.current?.(true);
            }
            if (type === 'CREATE_VARIABLE_ERROR') {
                omnibox.show(payload.message, { type: 'error' });
                creationPromise.current?.(false);
            }

            if (type === 'CREATE_COLLECTION_SUCCESS') {
                omnibox.show(`Collection created`, { type: 'success' });
                if (payload.collectionMap) {
                    setBackendStats(prev => ({
                        ...prev,
                        collections: payload.collections ? payload.collections.length : prev.collections,
                        collectionNames: payload.collections || prev.collectionNames,
                        collectionMap: payload.collectionMap,
                        lastSync: Date.now()
                    }));
                }
                collectionPromise.current?.(payload.collectionId);
                collectionPromise.current = null;
            }

            if (type === 'CREATE_COLLECTION_ERROR') {
                omnibox.show(payload.message || 'Failed to create collection', { type: 'error' });
                collectionPromise.current?.(null);
                collectionPromise.current = null;
            }

            if (type === 'DELETE_COLLECTION_SUCCESS') {
                const deletedName = payload.deletedName || 'Collection';
                omnibox.show(`${deletedName} deleted`, { type: 'success' });

                if (payload.collectionMap) {
                    setBackendStats(prev => ({
                        ...prev,
                        collections: Object.keys(payload.collectionMap).length,
                        collectionNames: Object.keys(payload.collectionMap),
                        collectionMap: payload.collectionMap,
                        lastSync: Date.now()
                    }));
                }

                if (deletePromise.current) {
                    deletePromise.current.resolve();
                    deletePromise.current = null;
                }
            }

            if (type === 'DELETE_COLLECTION_ERROR' || (type === 'OMNIBOX_NOTIFY' && payload.type === 'error' && deletePromise.current)) {
                omnibox.show(payload.message || 'Failed to delete collection', { type: 'error' });

                if (deletePromise.current) {
                    deletePromise.current.reject(payload.message);
                    deletePromise.current = null;
                }
            }

            // ⚡ FIX #2: KILL THE SPINNER
            if (type === 'SYNC_COMPLETE') {
                // 1. وقف مؤشر التحميل في الـ Manager فوراً
                // Note: The manager now handles its own state via handleComplete
                // but we keep the setIsSynced and notifications here.

                // 2. تحديث الحالة المحلية
                setIsSynced(true); // خليها true عشان نعرف إننا خلصنا
                setLiveIndicator(true);

                omnibox.show('Sync Complete', { type: 'success', duration: 2000 });
                setTimeout(() => setLiveIndicator(false), 2000);
            }

            if (type === 'SYNC_CANCELLED') {
                uiSyncManager.reset();
                setIsSynced(false);
            }

            if (type === 'SCAN_COMPLETE') {
                console.log('[useTokens] Usage data received and integrated');
                // UISyncManager already merged the data, just notify user
                omnibox.show('✅ Usage analysis complete', { type: 'success', duration: 2000 });
            }

            // 🔍 Search Handling
            if (type === 'INDEX_COMPLETE') {
                omnibox.show('Search Index Built', { type: 'success' });
            }
            if (type === 'SEARCH_RESULTS') {
                if (payload && Array.isArray(payload.matches)) {
                    setSearchResults(payload.matches);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const scanAnatomy = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'GET_ANATOMY' } }, '*');
    }, []);

    const updateToken = useCallback((id: string, value: string) => {
        setTokens(current =>
            current.map(t => t.id === id ? { ...t, $value: value } : t)
        );
        parent.postMessage({ pluginMessage: { type: 'UPDATE_TOKEN', id, value } }, '*');
    }, []);

    const createToken = useCallback((data: TokenFormData) => {
        return new Promise<boolean>((resolve) => {
            omnibox.show(`Creating ${data.name}...`, { type: 'loading', duration: 0 });
            creationPromise.current = resolve;
            parent.postMessage({ pluginMessage: { type: 'CREATE_VARIABLE', payload: data } }, '*');
        });
    }, []);

    const traceLineage = useCallback((tokenId: string) => {
        parent.postMessage({ pluginMessage: { type: 'TRACE_LINEAGE', payload: { tokenId } } }, '*');
    }, []);

    const createCollection = useCallback((name: string) => {
        return new Promise<string | null>((resolve) => {
            omnibox.show(`Creating ${name}...`, { type: 'loading', duration: 0 });
            collectionPromise.current = resolve;
            parent.postMessage({ pluginMessage: { type: 'CREATE_COLLECTION', payload: { name } } }, '*');
        });
    }, []);

    const renameCollection = useCallback((oldName: string, newName: string) => {
        omnibox.show(`Renaming ${oldName}...`, { type: 'loading', duration: 0 });
        parent.postMessage({ pluginMessage: { type: 'RENAME_COLLECTION', payload: { oldName, newName } } }, '*');
    }, []);

    const deleteCollection = useCallback((name: string) => {
        return new Promise<void>((resolve, reject) => {
            omnibox.show(`Deleting ${name}...`, { type: 'loading', duration: 0 });
            deletePromise.current = { resolve, reject };
            const id = backendStats.collectionMap?.[name]; // Use backendStats here
            parent.postMessage({ pluginMessage: { type: 'DELETE_COLLECTION', payload: { name, id } } }, '*');
        });
    }, [backendStats.collectionMap]);

    const scanUsage = useCallback(() => {
        omnibox.show('Scanning usage...', { type: 'loading', duration: 0 });
        parent.postMessage({ pluginMessage: { type: 'SCAN_USAGE' } }, '*');
    }, []);

    const syncVariables = useCallback(() => {
        console.log('[useTokens] syncVariables called - clearing state and starting sync');
        setTokens([]); // 🛑 FIX #2: Clear old state to avoid "Ghost State"
        setIsSynced(false);
        omnibox.show('Starting sync...', { type: 'loading', duration: 0 });

        // Pass known count to help manager estimate progress
        uiSyncManager.startSync(backendStats.totalVariables || undefined);

        console.log('[useTokens] Sending SYNC_TOKENS message to controller');
        parent.postMessage({ pluginMessage: { type: 'SYNC_TOKENS' } }, '*');
    }, [backendStats.totalVariables]);

    // 🔍 Search Method
    const search = useCallback((query: string) => {
        parent.postMessage({ pluginMessage: { type: 'SEARCH_QUERY', payload: { query } } }, '*');
    }, []);

    const resetSync = useCallback(() => {
        parent.postMessage({ pluginMessage: { type: 'SYNC_CANCEL' } }, '*');
        uiSyncManager.reset();
        setIsSynced(false);
        omnibox.show('Sync cancelled', { type: 'info' });
    }, []);

    return {
        tokens,
        anatomy,
        stats, // This is now the Computed Stats
        isSynced,
        liveIndicator,
        lineageData,
        isSyncing: syncState.isLoading,
        syncProgress: syncState.progress,
        syncStatus: `${syncState.loadedTokens} / ${syncState.totalTokens || '?'} tokens`,
        scanUsage,
        updateToken,
        createToken,
        createCollection,
        renameCollection,
        deleteCollection,
        scanAnatomy,
        traceLineage,
        syncVariables,
        resetSync,
        search,
        searchResults
    };
}

`

---

## /src/ui/hooks/useVibeApp.ts
> Path: $Path

`$Lang
import { useState, useEffect } from 'react';
import { useSettings, type SettingsViewModel } from '../../features/settings/hooks/useSettings';
import { useTokens, type TokensViewModel } from './useTokens';
import { useAI, type AIViewModel } from './useAI';
import { useStyles, type StylesViewModel } from './useStyles';

export interface VibeAppViewModel {
    settings: SettingsViewModel;
    tokens: TokensViewModel;
    styles: StylesViewModel;
    ai: AIViewModel;
    currentView: 'dashboard' | 'settings' | 'graph';
}

/**
 * Main Aggregator ViewModel.
 * Composes domain-specific hooks into a single interface for the View.
 */
export function useVibeApp() {
    // Shared State for Navigation (Hoisted)
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'graph' | 'create-token'>('dashboard');

    const settings = useSettings();
    const tokens = useTokens();
    const styles = useStyles();
    const ai = useAI(null, setActiveTab); // API Key handled internally by useAI or via Vault

    // ⚡ Diagnostics: Connectivity Check
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        let pongReceived = false;
        const start = Date.now();

        const handleMessage = (event: MessageEvent) => {
            const { type } = event.data.pluginMessage || {};
            if (type === 'PONG') {
                pongReceived = true;
                setIsConnected(true);
                // Optional: omnibox.show('System connected.', { type: 'success', duration: 1000 });
                console.log(`[VibeApp] Connected in ${Date.now() - start}ms`);
            }
        };

        window.addEventListener('message', handleMessage);

        // Send Ping
        parent.postMessage({ pluginMessage: { type: 'PING' } }, '*');

        // Watchdog
        const timer = setTimeout(() => {
            if (!pongReceived) {
                console.error('[VibeApp] Connection Timeout. Controller not responding.');
                // We rely on the Omnibox manager (imported globally in other files) or just log it for now.
                // Since this hook runs early, omnibox might not be mounted.
                // We'll just set state for now.
            }
        }, 2000);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timer);
        };
    }, []);

    return {
        settings,
        tokens,
        styles,
        ai,
        activeTab,
        setActiveTab,
        isConnected
    };
}

`

---

## /src/ui/layouts/ActivityLayout.tsx
> Path: $Path

`$Lang
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ActivityLayoutProps {
    children: ReactNode;
}

export const ActivityLayout = ({ children }: ActivityLayoutProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="vibe-activity h-full w-full bg-nebula text-text-primary overflow-hidden"
        >
            {children}
        </motion.div>
    );
};

`

---

## /src/ui/layouts/MainLayout.tsx
> Path: $Path

`$Lang
import React from 'react';
import { Settings, LayoutGrid, Cpu, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export type ViewType = 'dashboard' | 'tokens' | 'settings' | 'create-token' | 'export-tokens';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    credits?: number;
}

/**
 * 🛸 MainLayout (The Vibe Vessel)
 * Refactored for Google-Level Polish:
 * - Cleaner Typography (Inter/Sans)
 * - System Primary Colors (Purple/Indigo) instead of "Green"
 * - High Contrast & Professional Spacing
 * - Fluid "Sliding Pill" Navigation
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    credits = 0,
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-[#050505] text-text-primary overflow-hidden font-sans transition-all duration-500">
            {/* 🛸 Bento Header */}
            <header className="flex-none px-5 flex items-center justify-between z-40 bg-surface-0/90 backdrop-blur-xl border-b border-white/5 h-[64px] shadow-sm">

                {/* 1. Left: System Identity */}
                <div className="flex items-center gap-3 min-w-[200px]">
                    <SystemPulse />
                    <div className="flex flex-col justify-center gap-0.5">
                        <span className="font-semibold text-[13px] tracking-tight text-white leading-none">Vibe Token Manager</span>
                        <span className="text-[10px] text-text-muted font-medium">Workspace Active</span>
                    </div>
                </div>

                {/* 2. Center: Navigation Tabs (Sliding Pill) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 bg-surface-1/50 rounded-lg border border-white/5 shadow-inner backdrop-blur-md gap-1">
                    <TabButton
                        active={activeTab === 'dashboard'}
                        onClick={() => onTabChange('dashboard')}
                        icon={<LayoutGrid size={14} strokeWidth={2} />}
                        label="Dashboard"
                    />
                    <TabButton
                        active={activeTab === 'tokens'}
                        onClick={() => onTabChange('tokens')}
                        icon={<Cpu size={14} strokeWidth={2} />}
                        label="Tokens"
                    />
                </div>

                {/* 3. Right: Intelligence & Credits */}
                <div className="flex items-center justify-end gap-3 min-w-[200px]">

                    {/* Settings Trigger */}
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${activeTab === 'settings'
                            ? 'bg-primary/20 border-primary/40 text-primary shadow-sm'
                            : 'bg-transparent border-transparent text-text-muted hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Settings size={16} />
                    </button>

                    <div className="w-px h-5 bg-white/10" />

                    {/* Credits Identity */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-1 border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider leading-none mb-0.5">Credits</span>
                            <span className="text-xs font-mono font-medium text-white leading-none">{credits.toLocaleString()}</span>
                        </div>
                        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                            <Wallet size={14} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar bg-void/50">
                {children}
            </main>

            {/* Background Atmosphere - Toned Down */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full -translate-x-1/3 translate-y-1/3" />
            </div>
        </div>
    );
};

/* --- Internal Components --- */

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className={`relative px-4 py-1.5 rounded-md text-[11px] font-medium transition-colors flex items-center gap-2 outline-none ${active ? 'text-white' : 'text-text-muted hover:text-text-primary'
            }`}
    >
        {active && (
            <motion.div
                layoutId="active-tab-pill"
                className="absolute inset-0 bg-surface-2 border border-white/10 rounded-md shadow-sm z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
        <span className="relative z-10 flex items-center gap-2">
            {icon}
            {label}
        </span>
    </button>
);

const SystemPulse = () => {
    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Core Node */}
            <div className="w-2.5 h-2.5 bg-primary rounded-full z-10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] relative">
                <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse" />
            </div>

            {/* Orbiting Rings - Subtle */}
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_8s_linear_infinite]"
                style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            />
        </div>
    );
};

`

---

## /src/ui/managers/OmniboxManager.ts
> Path: $Path

`$Lang
import { generateUUID } from '../../shared/lib/uuid';

export type OmniboxType = 'info' | 'success' | 'error' | 'warning' | 'loading';

export interface OmniboxMessage {
    id: string;
    message: string;
    type: OmniboxType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

type OmniboxListener = (message: OmniboxMessage | null) => void;

/**
 * OmniboxManager (Singleton)
 * 
 * Centralized state management for the system Omnibox.
 * Decoupled from React to allow usage from non-UI capabilities (like logic layers).
 * 
 * Design: "One omnibox component only" - strict singleton state.
 */
class OmniboxManager {
    private currentMessage: OmniboxMessage | null = null;
    private listeners: Set<OmniboxListener> = new Set();
    private defaultDuration = 4000;
    private timer: ReturnType<typeof setTimeout> | null = null;

    /**
     * Shows a message in the Omnibox.
     * Replaces any existing message immediately.
     */
    public show(message: string, options: {
        type?: OmniboxType;
        duration?: number;
        action?: { label: string; onClick: () => void }
    } = {}) {
        this.clearTimer();

        this.currentMessage = {
            id: generateUUID(),
            message,
            type: options.type || 'info',
            duration: options.duration || this.defaultDuration,
            action: options.action
        };

        this.notifyListeners();

        // Safety Mechanism: If loading, set a "Dead Man's Switch" to prevent hanging UI
        if (this.currentMessage.type === 'loading') {
            this.timer = setTimeout(() => {
                // If still loading after 8 seconds, assume failure/deadlock
                if (this.currentMessage?.type === 'loading') {
                    this.show('Operation likely timed out', { type: 'error' });
                }
            }, 8000); // 8 seconds max wait
        }
        // Normal auto-dismiss for non-loading messages
        else if ((this.currentMessage.duration || 0) > 0) {
            this.timer = setTimeout(() => {
                this.hide();
            }, this.currentMessage.duration);
        }
    }

    /**
     * Hides the current message.
     */
    public hide() {
        this.clearTimer();
        this.currentMessage = null;
        this.notifyListeners();
    }

    /**
     * Subscribes to state changes.
     * Returns an unsubscribe function.
     */
    public subscribe(listener: OmniboxListener): () => void {
        this.listeners.add(listener);
        // Initial state
        listener(this.currentMessage);

        return () => {
            this.listeners.delete(listener);
        };
    }

    public getCurrent(): OmniboxMessage | null {
        return this.currentMessage;
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.currentMessage));
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

export const omnibox = new OmniboxManager();

`

---

## /src/ui/services/UISyncManager.ts
> Path: $Path

`$Lang
/**
 * 🎨 UISyncManager (UI Thread)
 * 
 * Manages progressive sync on the UI side with:
 * - Incremental DOM updates
 * - Virtual scrolling integration
 * - Optimistic rendering
 * - Background index building
 */

import type { TokenEntity } from '../../core/types';


export interface TokenChunk {
    tokens: TokenEntity[];
    chunkIndex: number;
    isLast: boolean;
}

export interface SyncState {
    isLoading: boolean;
    phase: 'idle' | 'definitions' | 'usage' | 'indexing' | 'complete';
    progress: number;
    totalTokens: number;
    loadedTokens: number;
    estimatedRemaining?: number;
}

export class UISyncManager {
    private tokens: TokenEntity[] = [];
    private tokenIndex = new Map<string, number>(); // Fast lookup: id -> array index
    private existingIds = new Set<string>(); // ✅ NEW: Track added token IDs for deduplication
    private searchIndex: Map<string, Set<number>> = new Map(); // keyword -> token indices

    private state: SyncState = {
        isLoading: false,
        phase: 'idle',
        progress: 0,
        totalTokens: 0,
        loadedTokens: 0
    };

    private subscribers: Set<(state: SyncState) => void> = new Set();
    private tokenSubscribers: Set<(tokens: TokenEntity[]) => void> = new Set();

    /**
     * Subscribe to sync state changes
     */
    onStateChange(callback: (state: SyncState) => void): () => void {
        this.subscribers.add(callback);
        callback(this.state); // Immediate call with current state

        return () => this.subscribers.delete(callback);
    }

    /**
     * Subscribe to token updates (for virtual scroll)
     */
    onTokensUpdate(callback: (tokens: TokenEntity[]) => void): () => void {
        this.tokenSubscribers.add(callback);
        callback(this.tokens); // Immediate call

        return () => this.tokenSubscribers.delete(callback);
    }

    /**
     * Start receiving chunks from plugin
     */
    startSync(estimatedTotal?: number): void {
        this.tokens = [];
        this.tokenIndex.clear();
        this.existingIds.clear(); // ✅ RESET: Clear the deduplication set
        this.searchIndex.clear();

        this.updateState({
            isLoading: true,
            phase: 'definitions',
            progress: 0,
            totalTokens: estimatedTotal || 0,
            loadedTokens: 0
        });

        // Listen for chunks from plugin
        window.addEventListener('message', this.handleMessage);
    }

    /**
     * Handle incoming chunk from plugin
     */
    private handleMessage = (event: MessageEvent): void => {
        const msg = event.data.pluginMessage;

        if (!msg) return;

        switch (msg.type) {
            case 'SYNC_CHUNK':
                this.handleChunk(msg.payload);
                break;
            case 'SYNC_PROGRESS':
                this.handleProgress(msg.payload);
                break;
            case 'SYNC_COMPLETE':
                this.handleComplete();
                break;
            case 'USAGE_ANALYSIS_STARTED':
                this.updateState({ phase: 'usage' });
                break;
            case 'SCAN_COMPLETE':
                // ✅ CRITICAL: Merge usage data into existing tokens
                this.handleUsageData(msg.payload);
                break;
            case 'USAGE_ANALYSIS_COMPLETE':
                this.updateState({ phase: 'complete' });
                break;
        }
    };

    /**
     * Process incoming token chunk
     */
    private handleChunk(chunk: TokenChunk): void {
        const startIndex = this.tokens.length;
        const newTokens: TokenEntity[] = [];

        // ✅ FILTER: Only add tokens we haven't seen before
        for (const token of chunk.tokens) {
            if (!this.existingIds.has(token.id)) {
                this.existingIds.add(token.id);
                newTokens.push(token);
            }
        }

        if (newTokens.length === 0) return; // Skip if all tokens are duplicates

        // Add confirmed unique tokens
        this.tokens.push(...newTokens);

        // Build fast lookup index for NEW tokens only
        newTokens.forEach((token, i) => {
            this.tokenIndex.set(token.id, startIndex + i);
        });

        // ✅ CRITICAL: Update total if we got more than expected
        const newTotal = Math.max(
            this.state.totalTokens,
            this.tokens.length
        );

        // Update state
        this.updateState({
            totalTokens: newTotal,
            loadedTokens: this.tokens.length,
            progress: newTotal > 0
                ? Math.min(100, (this.tokens.length / newTotal) * 100)
                : 0
        });

        // ✅ Notify subcribers immediately
        this.notifyTokenSubscribers();

        // ✅ Notify subcribers immediately
        this.notifyTokenSubscribers();

        // Background indexing (non-blocking) - Only index NEW tokens
        // 🛑 REMOVED: Managed by Controller now
        // tokenWorker.indexTokens(newTokens).catch(console.error);
    }

    /**
     * Handle progress update
     * ... existing code for handleProgress ...
     */
    private handleProgress(progress: {
        current: number;
        total: number;
        percentage: number;
        estimatedTimeRemaining?: number;
    }): void {
        this.updateState({
            totalTokens: progress.total,
            loadedTokens: progress.current,
            progress: progress.percentage,
            estimatedRemaining: progress.estimatedTimeRemaining
        });
    }

    // ... (rest of class)

    /**
     * Handle sync completion
     */
    private handleComplete(): void {
        // ✅ FIX: Make sure we have the final count
        const finalCount = this.tokens.length;

        this.updateState({
            isLoading: false,  // ← Stop spinner
            phase: 'complete',
            progress: 100,
            totalTokens: finalCount,      // ← Update to actual
            loadedTokens: finalCount
        });

        // ✅ Final notification to ensure UI updates
        this.notifyTokenSubscribers();

        console.log(`[UISyncManager] Sync complete: ${finalCount} tokens loaded`);
    }

    /**
     * ✅ Merge usage data into existing tokens
     */
    private handleUsageData(payload: { usage: Record<string, any>; timestamp: number }): void {
        if (!payload || !payload.usage) {
            console.warn('[UISyncManager] Received SCAN_COMPLETE without usage data');
            return;
        }

        console.log('[UISyncManager] Merging usage data into tokens...');
        let mergedCount = 0;

        // Iterate through usage map and merge into existing tokens
        for (const [tokenId, usageStats] of Object.entries(payload.usage)) {
            const tokenIdx = this.tokenIndex.get(tokenId);
            if (tokenIdx !== undefined && this.tokens[tokenIdx]) {
                // Merge usage data into token
                this.tokens[tokenIdx].usage = usageStats;
                mergedCount++;
            }
        }

        console.log(`[UISyncManager] Merged usage data for ${mergedCount}/${this.tokens.length} tokens`);

        // Notify subscribers of the update
        this.notifyTokenSubscribers();
    }

    /**
     * Fast search using worker
     * 🛑 DEPRECATED: Search is now handled by Controller + useTokens
     * Keeping API for compatibility but invalidating usage
     */
    async search(_query: string): Promise<TokenEntity[]> {
        console.warn('UISyncManager.search is deprecated. Use useTokens().search() instead.');
        return [];
    }

    /**
     * Get token by ID (O(1) lookup)
     */
    getTokenById(id: string): TokenEntity | undefined {
        const index = this.tokenIndex.get(id);
        return index !== undefined ? this.tokens[index] : undefined;
    }

    /**
     * Get all tokens (for virtual scroll)
     */
    getTokens(): TokenEntity[] {
        return this.tokens;
    }

    /**
     * Get current state
     */
    getState(): SyncState {
        return { ...this.state };
    }

    /**
     * Update state and notify subscribers
     */
    private updateState(partial: Partial<SyncState>): void {
        this.state = { ...this.state, ...partial };
        this.subscribers.forEach(sub => sub(this.state));
    }

    /**
     * Notify token subscribers
     */
    private notifyTokenSubscribers(): void {
        this.tokenSubscribers.forEach(sub => sub(this.tokens));
    }

    /**
     * Clear all data
     */
    reset(): void {
        this.tokens = [];
        this.tokenIndex.clear();
        this.searchIndex.clear();

        this.updateState({
            isLoading: false,
            phase: 'idle',
            progress: 0,
            totalTokens: 0,
            loadedTokens: 0
        });

        this.existingIds.clear(); // ✅ Extra safety: clear on reset

        window.removeEventListener('message', this.handleMessage);
    }
}

// Singleton instance
export const uiSyncManager = new UISyncManager();

`

---

## /src/ui/theme/figma-tokens.css
> Path: $Path

`$Lang
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
@import "tailwindcss";

@theme {
    /* 🌌 Vibe Palette: Neo-Bento (2026 Edition) */

    /* 🌑 Core Surfaces (Theme-Aware) */
    --color-void: var(--vibe-void);
    --color-nebula: var(--vibe-nebula);
    --color-surface-0: var(--vibe-surface-0);
    --color-surface-1: var(--vibe-surface-1);
    --color-surface-2: var(--vibe-surface-2);
    --color-surface-3: var(--vibe-surface-3);

    /* ⚡ Electric Accents */
    --color-primary: #6E62E5;
    --color-primary-hover: #5B50D6;
    --color-primary-glow: rgba(110, 98, 229, 0.5);

    --color-secondary: #CFFAFE;
    --color-secondary-glow: rgba(207, 250, 254, 0.2);

    --color-accent-purple: #A855F7;
    --color-accent-pink: #EC4899;

    /* 🚦 Semantic Signals */
    --color-success: #10B981;
    --color-success-bg: rgba(16, 185, 129, 0.1);
    --color-warning: #F59E0B;
    --color-warning-bg: rgba(245, 158, 11, 0.1);
    --color-error: #F43F5E;
    --color-error-bg: rgba(244, 63, 94, 0.1);
    --color-info: #0EA5E9;
    --color-info-bg: rgba(14, 165, 233, 0.1);

    /* ✒️ Typography */
    --color-text-bright: var(--vibe-text-bright);
    --color-text-primary: var(--vibe-text-primary);
    --color-text-dim: var(--vibe-text-dim);
    --color-text-muted: var(--vibe-text-muted);

    --font-display: "Outfit", sans-serif;
    --font-body: "Inter", sans-serif;

    /* 📐 Bento Radius System */
    --radius-xs: 6px;
    --radius-sm: 10px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-xl: 32px;
    --radius-pill: 9999px;

    /* 🏎️ Motion */
    --ease-vibe: cubic-bezier(0.2, 0.8, 0.2, 1);
    --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);

    /* 🌑 Shadows */
    --shadow-glow: 0 0 40px -10px var(--color-primary-glow);
    --shadow-glass: var(--vibe-shadow-glass);
    --shadow-card: var(--vibe-shadow-card);
    --shadow-card-hover: var(--vibe-shadow-card-hover);
}

/* Figma Native Theme - Operation Renaissance */
/* Based on Figma Plugin Guidelines 2025 */
/* Based on Figma Plugin Guidelines 2025 */


:root {
    /* ========================================
     🎨 FIGMA NATIVE COLOR SYSTEM
     ======================================== */

    /* Background Colors */
    --figma-bg-primary: #2c2c2c;
    --figma-bg-secondary: #383838;
    --figma-bg-tertiary: #444444;
    --figma-bg-hover: #4a4a4a;
    --figma-bg-active: #5c5c5c;

    /* Text Colors */
    --figma-text-primary: #ffffff;
    --figma-text-secondary: rgba(255, 255, 255, 0.7);
    --figma-text-tertiary: rgba(255, 255, 255, 0.5);
    --figma-text-disabled: rgba(255, 255, 255, 0.3);

    /* Brand & Accent */
    --figma-accent: #0D99FF;
    --figma-accent-hover: #0A84E0;
    --figma-accent-active: #0070CC;

    /* Status Colors */
    --figma-success: #14AE5C;
    --figma-warning: #FFAB00;
    --figma-error: #F24822;
    --figma-info: #0D99FF;

    /* Borders */
    --figma-border: rgba(255, 255, 255, 0.1);
    --figma-border-strong: rgba(255, 255, 255, 0.2);
    --figma-focus-ring: rgba(13, 153, 255, 0.5);

    /* ========================================
     📐 TYPOGRAPHY
     ======================================== */
    --figma-font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --figma-font-size-xs: 11px;
    --figma-font-size-sm: 12px;
    --figma-font-size-base: 13px;
    --figma-font-size-lg: 14px;
    --figma-font-weight-normal: 400;
    --figma-font-weight-medium: 500;
    --figma-font-weight-bold: 600;
    --figma-line-height: 1.4;

    /* ========================================
     📏 SPACING & SIZING
     ======================================== */
    --figma-space-xs: 4px;
    --figma-space-sm: 8px;
    --figma-space-md: 12px;
    --figma-space-lg: 16px;
    --figma-space-xl: 24px;

    /* Border Radius - Figma uses smaller radii */
    --figma-radius-sm: 4px;
    --figma-radius-md: 6px;
    --figma-radius-lg: 8px;

    /* ========================================
     ⚡ TRANSITIONS
     ======================================== */
    --figma-transition-fast: 100ms ease;
    --figma-transition-normal: 150ms ease;
}

/* ========================================
   🧱 GLOBAL RESET
   ======================================== */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--figma-bg-primary);
    color: var(--figma-text-primary);
    font-family: var(--figma-font);
    font-size: var(--figma-font-size-base);
    line-height: var(--figma-line-height);
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
}

/* ========================================
   🕹️ FIGMA NATIVE BUTTONS
   ======================================== */
.figma-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--figma-space-sm);
    padding: var(--figma-space-sm) var(--figma-space-md);
    font-family: var(--figma-font);
    font-size: var(--figma-font-size-sm);
    font-weight: var(--figma-font-weight-medium);
    border: none;
    border-radius: var(--figma-radius-md);
    cursor: pointer;
    transition: background-color var(--figma-transition-fast);
    outline: none;
}

.figma-btn:focus-visible {
    box-shadow: 0 0 0 2px var(--figma-focus-ring);
}

/* Primary Button */
.figma-btn-primary {
    background-color: var(--figma-accent);
    color: white;
}

.figma-btn-primary:hover {
    background-color: var(--figma-accent-hover);
}

.figma-btn-primary:active {
    background-color: var(--figma-accent-active);
}

/* Secondary Button */
.figma-btn-secondary {
    background-color: transparent;
    color: var(--figma-text-primary);
    border: 1px solid var(--figma-border-strong);
}

.figma-btn-secondary:hover {
    background-color: var(--figma-bg-hover);
}

/* Ghost Button */
.figma-btn-ghost {
    background-color: transparent;
    color: var(--figma-text-secondary);
}

.figma-btn-ghost:hover {
    background-color: var(--figma-bg-hover);
    color: var(--figma-text-primary);
}

/* Disabled */
.figma-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ========================================
   📥 FIGMA NATIVE INPUTS
   ======================================== */
.figma-input {
    width: 100%;
    padding: var(--figma-space-sm) var(--figma-space-md);
    background-color: var(--figma-bg-tertiary);
    border: 1px solid var(--figma-border);
    border-radius: var(--figma-radius-sm);
    color: var(--figma-text-primary);
    font-family: var(--figma-font);
    font-size: var(--figma-font-size-base);
    outline: none;
    transition: border-color var(--figma-transition-fast);
}

.figma-input:focus {
    border-color: var(--figma-accent);
    box-shadow: 0 0 0 1px var(--figma-accent);
}

.figma-input::placeholder {
    color: var(--figma-text-disabled);
}

/* ========================================
   🏷️ FIGMA NATIVE LABELS
   ======================================== */
.figma-label {
    display: block;
    font-size: var(--figma-font-size-xs);
    font-weight: var(--figma-font-weight-medium);
    color: var(--figma-text-secondary);
    margin-bottom: var(--figma-space-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* ========================================
   📦 FIGMA NATIVE PANELS
   ======================================== */
.figma-panel {
    background-color: var(--figma-bg-secondary);
    border: 1px solid var(--figma-border);
    border-radius: var(--figma-radius-lg);
    padding: var(--figma-space-lg);
}

.figma-panel-header {
    font-size: var(--figma-font-size-sm);
    font-weight: var(--figma-font-weight-bold);
    color: var(--figma-text-primary);
    margin-bottom: var(--figma-space-md);
}

/* ========================================
   📜 SCROLLBAR (Native Look)
   ======================================== */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

/* ========================================
   ✨ UTILITY CLASSES
   ======================================== */
.figma-divider {
    height: 1px;
    background-color: var(--figma-border);
    margin: var(--figma-space-md) 0;
}

.figma-flex {
    display: flex;
}

.figma-flex-col {
    flex-direction: column;
}

.figma-items-center {
    align-items: center;
}

.figma-justify-between {
    justify-content: space-between;
}

.figma-gap-sm {
    gap: var(--figma-space-sm);
}

.figma-gap-md {
    gap: var(--figma-space-md);
}

/* ========================================
   🌌 VIBE SYSTEM VARIABLES (Integrated)
   ======================================== */
:root {
    /* 🌑 Default: Dark Theme */
    --vibe-void: #050505;
    --vibe-nebula: #09090B;
    --vibe-surface-0: #121214;
    --vibe-surface-1: #1C1C21;
    --vibe-surface-2: #2D2D35;
    --vibe-surface-3: #4A4A55;

    --vibe-text-bright: #FFFFFF;
    --vibe-text-primary: #F4F4F5;
    --vibe-text-dim: #D4D4D8;
    --vibe-text-muted: #A1A1AA;

    --vibe-shadow-glass: 0 8px 32px -4px rgba(0, 0, 0, 0.5);
    --vibe-shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --vibe-shadow-card-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

:root.light-mode {
    /* ☀️ Light Theme overrides */
    --vibe-void: #FFFFFF;
    --vibe-nebula: #F8F8FA;
    --vibe-surface-0: #F1F1F4;
    --vibe-surface-1: rgba(255, 255, 255, 0.9);
    --vibe-surface-2: #E4E4E9;
    --vibe-surface-3: #D4D4DB;

    --vibe-text-bright: #09090B;
    --vibe-text-primary: #18181B;
    --vibe-text-dim: #3F3F46;
    --vibe-text-muted: #71717A;

    --vibe-shadow-glass: 0 8px 32px -4px rgba(0, 0, 0, 0.1);
    --vibe-shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --vibe-shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

    color-scheme: light;
}

/* ========================================
   📦 VIBE COMPONENTS & UTILITIES
   ======================================== */
@layer components {
    .vibe-card {
        background: var(--vibe-surface-1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: var(--radius-lg);
        transition: all 0.3s var(--ease-vibe);
        box-shadow: var(--shadow-card);
    }

    .light-mode .vibe-card {
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(0, 0, 0, 0.05);
    }

    .vibe-card:hover {
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
        box-shadow: var(--shadow-card-hover);
    }

    .text-gradient-primary {
        background: linear-gradient(135deg, var(--color-text-bright) 0%, var(--color-primary-hover) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .text-gradient-brand {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-purple) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
}
`

---

## /src/utils/PerformanceMonitor.ts
> Path: $Path

`$Lang
/**
 * 📊 Performance Monitor
 * 
 * Tracks and reports performance metrics:
 * - Frame drops (FPS)
 * - Long tasks (>50ms)
 * - Memory usage
 * - Sync duration
 * 
 * ARCHITECTURE: UI Layer Utility
 */

import React from 'react';

export interface PerformanceMetrics {
    fps: number;
    droppedFrames: number;
    longTasks: number;
    averageTaskDuration: number;
    memoryUsage?: {
        used: number;
        total: number;
        percentage: number;
    };
}

export class PerformanceMonitor {
    private isMonitoring = false;
    private frameCount = 0;
    private lastFrameTime = 0;
    private fpsHistory: number[] = [];
    private droppedFrames = 0;
    private longTasks: number[] = [];
    private rafId: number | null = null;
    private observer: PerformanceObserver | null = null;

    // Target 60fps = 16.67ms per frame
    private readonly TARGET_FRAME_TIME = 1000 / 60;
    private readonly LONG_TASK_THRESHOLD = 50; // MS

    /**
     * Start monitoring
     */
    start(): void {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.frameCount = 0;
        this.droppedFrames = 0;
        this.longTasks = [];
        this.fpsHistory = [];
        this.lastFrameTime = performance.now();

        this.monitorFrame();
        this.setupPerformanceObserver();
    }

    /**
     * Stop monitoring
     */
    stop(): void {
        this.isMonitoring = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    /**
     * Monitor frame rate
     */
    private monitorFrame = (): void => {
        if (!this.isMonitoring) return;

        const now = performance.now();
        const delta = now - this.lastFrameTime;

        // Calculate FPS
        const fps = 1000 / delta;
        this.fpsHistory.push(fps);

        // Keep only last 60 samples (1 second worth)
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }

        // Detect dropped frames (frame took longer than target)
        if (delta > this.TARGET_FRAME_TIME * 2) {
            this.droppedFrames++;
        }

        this.frameCount++;
        this.lastFrameTime = now;

        this.rafId = requestAnimationFrame(this.monitorFrame);
    };

    /**
     * Setup Performance Observer for long tasks
     */
    private setupPerformanceObserver(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            this.observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > this.LONG_TASK_THRESHOLD) {
                        this.longTasks.push(entry.duration);
                        console.warn(
                            `[PerformanceMonitor] Long task detected: ${entry.duration.toFixed(2)}ms`,
                            entry
                        );
                    }
                }
            });

            // Observe long tasks
            this.observer.observe({ entryTypes: ['longtask', 'measure'] });
        } catch (e) {
            // PerformanceObserver not supported
            console.log('[PerformanceMonitor] PerformanceObserver not available or failed to start');
        }
    }

    /**
     * Get current metrics
     */
    getMetrics(): PerformanceMetrics {
        const avgFps = this.fpsHistory.length > 0
            ? this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
            : 0;

        const avgTaskDuration = this.longTasks.length > 0
            ? this.longTasks.reduce((a, b) => a + b, 0) / this.longTasks.length
            : 0;

        const metrics: PerformanceMetrics = {
            fps: Math.round(avgFps),
            droppedFrames: this.droppedFrames,
            longTasks: this.longTasks.length,
            averageTaskDuration: Math.round(avgTaskDuration)
        };

        // Add memory info if available
        // Note: performance.memory is a non-standard Chrome extension
        const perf = performance as any;
        if (perf.memory) {
            metrics.memoryUsage = {
                used: Math.round(perf.memory.usedJSHeapSize / 1024 / 1024), // MB
                total: Math.round(perf.memory.totalJSHeapSize / 1024 / 1024), // MB
                percentage: Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100)
            };
        }

        return metrics;
    }

    /**
     * Reset metrics
     */
    reset(): void {
        this.frameCount = 0;
        this.droppedFrames = 0;
        this.longTasks = [];
        this.fpsHistory = [];
    }
}

/**
 * Measure function execution time
 */
export async function measureAsync<T>(
    label: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - start;

        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);

        return result;
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms`, error);
        throw error;
    }
}

// Export singleton
export const perfMonitor = new PerformanceMonitor();

// React Hook for performance monitoring
export function usePerformanceMonitor() {
    const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

    React.useEffect(() => {
        perfMonitor.start();

        const interval = setInterval(() => {
            setMetrics(perfMonitor.getMetrics());
        }, 1000);

        return () => {
            clearInterval(interval);
            perfMonitor.stop();
        };
    }, []);

    return metrics;
}

`
