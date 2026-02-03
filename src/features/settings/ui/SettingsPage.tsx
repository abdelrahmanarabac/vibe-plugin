/**
 * @module SettingsPage
 * @description Premium settings page for Vibe Plugin.
 *
 * Features:
 * - Account Settings (view email, sign out)
 * - AI Configuration (Gemini API Key, Model Tier)
 * - Emergency Reset
 */
import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    Key,
    Zap,
    CheckCircle,
    XCircle,
    Sparkles,
    Trash2,
    BrainCircuit,
    User,
    LogOut,
    Mail
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import type { VibeSettings } from '../domain/SettingsTypes';
import { GeminiService } from '../../../infrastructure/api/GeminiService';
import { AuthService } from '../../auth/AuthService';
import { ConfirmDialog } from '../../../components/shared/base/ConfirmDialog';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ==============================================================================
// == DESIGN SYSTEM COMPONENTS ==
// ==============================================================================

interface SectionHeaderProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
            <Icon size={16} className="text-primary" />
        </div>
        <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-widest">{title}</h3>
            <p className="text-[9px] text-text-muted font-mono opacity-70">{subtitle}</p>
        </div>
    </div>
);

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <section
        className={`
            bg-gradient-to-b from-white/[0.03] to-transparent
            border border-white/[0.07]
            p-6 rounded-3xl
            backdrop-blur-xl
            hover:border-white/[0.12] transition-all duration-300
            group
            ${className}
        `}
    >
        {children}
    </section>
);

// ==============================================================================
// == ACCOUNT SECTION ==
// ==============================================================================

interface AccountSectionProps {
    user: SupabaseUser | null;
    onSignOut: () => void;
    isSigningOut: boolean;
}

const AccountSection: React.FC<AccountSectionProps> = ({ user, onSignOut, isSigningOut }) => {
    if (!user) {
        return (
            <Card>
                <SectionHeader icon={User} title="Account" subtitle="Not Authenticated" />
                <p className="text-xs text-text-muted">
                    Session not found. Please re-open the plugin.
                </p>
            </Card>
        );
    }

    return (
        <Card>
            <SectionHeader icon={User} title="Your Account" subtitle="Identity & Session" />

            {/* User Info Display */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/30 border border-white/5 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-black text-sm border border-white/10">
                        {user.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-white break-all">{user.email}</div>
                        <div className="text-[9px] text-text-muted flex items-center gap-1">
                            <Mail size={9} className="opacity-50" />
                            Verified Account
                        </div>
                    </div>
                </div>
            </div>

            {/* Sign Out Button */}
            <button
                onClick={onSignOut}
                disabled={isSigningOut}
                className="
                    w-full flex items-center justify-center gap-2.5
                    p-3 rounded-xl border border-warning/20 bg-warning/5
                    hover:bg-warning/10 hover:border-warning/40
                    text-warning transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed
                "
            >
                <LogOut size={14} className={isSigningOut ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </span>
            </button>
        </Card>
    );
};

// ==============================================================================
// == AI CONFIGURATION SECTION ==
// ==============================================================================

interface AIConfigSectionProps {
    settings: VibeSettings;
    updateSettings: (partial: Partial<VibeSettings>) => Promise<void>;
}

const AIConfigSection: React.FC<AIConfigSectionProps> = ({ settings, updateSettings }) => {
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [tempKey, setTempKey] = useState('');

    const handleUpdateKey = async () => {
        if (!tempKey.trim()) return;
        await updateSettings({ apiKey: tempKey.trim() });
        setTempKey('');
        setStatus('idle');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🔒 API Key Updated' } }, '*');
    };

    const handleTestConnection = async () => {
        if (!settings.apiKey) return;

        setStatus('testing');
        try {
            const ai = new GeminiService(settings.apiKey);
            await ai.generate('Ping. Reply with Pong only.', { tier: 'LITE' });
            setStatus('success');
        } catch (e) {
            console.error("[SettingsPage] Connection Test Failed:", e);
            setStatus('error');
        }
    };

    const StatusIcon = () => {
        switch (status) {
            case 'testing': return <Zap className="animate-pulse text-warning" size={14} />;
            case 'success': return <CheckCircle className="text-success" size={14} />;
            case 'error': return <XCircle className="text-error" size={14} />;
            default: return <Zap className="text-text-muted" size={14} />;
        }
    };

    return (
        <Card>
            <SectionHeader icon={BrainCircuit} title="AI Engine" subtitle="Gemini Configuration" />

            <div className="space-y-4">
                {/* Current Key Status */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
                    <div className="flex items-center gap-3">
                        <Key size={14} className="text-primary/70" />
                        <span className="text-[10px] font-mono text-text-muted tracking-wider">
                            {settings.apiKey ? `••••••••${settings.apiKey.slice(-5)}` : 'NOT CONFIGURED'}
                        </span>
                    </div>
                    <div
                        className={`
                            px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider
                            ${settings.apiKey ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/5'}
                        `}
                    >
                        {settings.apiKey ? 'Linked' : 'Missing'}
                    </div>
                </div>

                {/* API Key Input */}
                <div className="flex gap-2">
                    <input
                        type="password"
                        className="
                            flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5
                            text-xs text-white placeholder-white/20
                            focus:border-primary/50 focus:bg-white/[0.04] outline-none transition-all duration-200
                        "
                        placeholder="Enter Gemini API Key..."
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                    />
                    <button
                        onClick={handleUpdateKey}
                        disabled={!tempKey}
                        className="
                            px-5 bg-primary/10 border border-primary/30 rounded-xl
                            text-[10px] font-bold uppercase text-primary
                            hover:bg-primary/20 disabled:opacity-30 transition-all duration-200
                        "
                    >
                        Save
                    </button>
                </div>

                {/* Connection Test Button */}
                {settings.apiKey && (
                    <button
                        onClick={handleTestConnection}
                        disabled={status === 'testing'}
                        className="
                            w-full py-2.5 rounded-xl bg-white/[0.03] border border-white/10
                            hover:bg-white/[0.06] hover:border-white/15
                            transition-all duration-200 flex items-center justify-center gap-2
                        "
                    >
                        <StatusIcon />
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            {status === 'testing' ? 'Handshaking...' : 'Test Connection'}
                        </span>
                    </button>
                )}

                {/* Model Tier Selector */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    {(['AUTO', 'LITE', 'SMART'] as const).map(tier => (
                        <button
                            key={tier}
                            onClick={() => updateSettings({ modelTier: tier })}
                            className={`
                                flex flex-col items-center gap-1.5 p-3.5 rounded-xl border transition-all duration-200
                                ${settings.modelTier === tier
                                    ? 'bg-secondary/10 border-secondary/50 text-secondary shadow-[0_0_20px_rgba(255,46,224,0.1)]'
                                    : 'bg-transparent border-white/5 hover:bg-white/[0.03] hover:border-white/10 text-text-muted'
                                }
                            `}
                        >
                            {tier === 'AUTO' && <Sparkles size={15} />}
                            {tier === 'LITE' && <Zap size={15} />}
                            {tier === 'SMART' && <BrainCircuit size={15} />}
                            <span className="text-[9px] font-black uppercase tracking-wider">{tier}</span>
                        </button>
                    ))}
                </div>
                <p className="text-[9px] text-text-muted/50 text-center font-mono">
                    {settings.modelTier === 'AUTO' && 'System will intelligently select the best model.'}
                    {settings.modelTier === 'LITE' && 'Faster responses, lower cost. Best for simple tasks.'}
                    {settings.modelTier === 'SMART' && 'Maximum intelligence. Best for complex naming.'}
                </p>
            </div>
        </Card>
    );
};

// ==============================================================================
// == MAIN SETTINGS PAGE ==
// ==============================================================================

export function SettingsPage() {
    const { settings, updateSettings, wipeMemory, isLoading: settingsLoading } = useSettings();

    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [showSignOutDialog, setShowSignOutDialog] = useState(false);

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
                // AuthGate will detect the session change and switch to Login Screen
            }
        } finally {
            setIsSigningOut(false);
            setShowSignOutDialog(false);
        }
    };

    const isLoading = settingsLoading || isLoadingUser;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full p-10">
                <div className="animate-pulse text-primary text-xs font-mono tracking-widest">
                    LOADING SETTINGS...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6 pb-24 fade-in">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6">
                <div
                    className="
                        w-11 h-11 flex items-center justify-center
                        rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20
                        border border-white/10
                        shadow-[0_0_40px_rgba(0,240,255,0.15),0_0_20px_rgba(255,46,224,0.1)]
                    "
                >
                    <SettingsIcon size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                        Vibe <span className="text-primary">Config</span>
                    </h1>
                    <p className="text-[9px] text-text-muted font-bold tracking-[0.25em] opacity-60">
                        SYSTEM CONTROL CENTER
                    </p>
                </div>
            </header>

            {/* Sections */}
            <AccountSection user={user} onSignOut={handleSignOutClick} isSigningOut={isSigningOut} />
            <AIConfigSection settings={settings} updateSettings={updateSettings} />

            <ConfirmDialog
                isOpen={showSignOutDialog}
                title="Sign Out"
                message="Are you sure you want to sign out? You will need to sign in again to manage your tokens."
                confirmText="Sign Out"
                variant="danger"
                isLoading={isSigningOut}
                onConfirm={handleConfirmSignOut}
                onCancel={() => setShowSignOutDialog(false)}
            />

            {/* Danger Zone */}
            <button
                onClick={wipeMemory}
                className="
                    w-full p-4 rounded-2xl
                    border border-error/20 bg-error/5
                    hover:bg-error/10 hover:border-error/40
                    transition-all duration-200 group
                    flex items-center justify-center gap-3
                "
            >
                <Trash2 size={16} className="text-error group-hover:scale-110 transition-transform" />
                <div className="text-left">
                    <div className="text-[10px] font-bold text-error uppercase tracking-wider">Emergency Reset</div>
                    <div className="text-[9px] text-error/60">Clear all local storage and cache</div>
                </div>
            </button>

            {/* Footer */}
            <footer className="text-center pt-6 pb-4 opacity-30 hover:opacity-80 transition-opacity duration-500">
                <p className="text-[8px] font-mono text-text-muted tracking-wider">
                    VIBE.SYSTEM.SETTINGS_MODULE // v5.0.0
                </p>
            </footer>
        </div>
    );
}
