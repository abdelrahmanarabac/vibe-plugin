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
            await CryptoService.loadAPIKey();
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
