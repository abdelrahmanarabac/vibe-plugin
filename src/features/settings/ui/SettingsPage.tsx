/**
 * @module SettingsPage
 * @description Premium settings page for Vibe Plugin.
 *
 * Features:
 * - Account Card (Premium Profile)
 * - About/Info Card (System Status)
 * - Emergency Reset
 */
import React, { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
    LogOut,
    Mail,
    Info,
    Trash2,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { AuthService } from '../../auth/AuthService';
import { ConfirmDialog } from '../../../components/shared/base/ConfirmDialog';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import packageJson from '../../../../package.json';

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
            <SectionHeader icon={User} title="Vibe ID" subtitle="Member Profile" />

            {/* User Info Display */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 mb-4 group-hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-white font-black text-base border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            {user.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0A0A0A] rounded-full flex items-center justify-center">
                            <ShieldCheck size={12} className="text-success" />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white tracking-wide">{user.email?.split('@')[0]}</div>
                        <div className="text-[10px] text-text-muted flex items-center gap-1.5 font-mono">
                            <Mail size={10} className="opacity-50" />
                            {user.email}
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
                    p-3.5 rounded-xl border border-white/5 bg-white/[0.02]
                    hover:bg-warning/10 hover:border-warning/30 hover:text-warning
                    text-text-muted transition-all duration-300
                    disabled:opacity-30 disabled:cursor-not-allowed
                "
            >
                <LogOut size={14} className={isSigningOut ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isSigningOut ? 'Disconnecting...' : 'Sign Out'}
                </span>
            </button>
        </Card>
    );
};

// ==============================================================================
// == ABOUT SECTION ==
// ==============================================================================

const AboutSection: React.FC = () => (
    <Card>
        <SectionHeader icon={Info} title="System" subtitle="Version & status" />

        <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-medium text-text-muted">Plugin Version</span>
                <span className="text-[10px] font-mono font-bold text-primary">v{packageJson.version}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-medium text-text-muted">Status</span>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                    </span>
                    <span className="text-[10px] font-bold text-success uppercase tracking-wider">Operational</span>
                </div>
            </div>

            <div className="pt-2">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                    <Zap size={14} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-text-muted leading-relaxed">
                        You are running the <strong className="text-primary">Pro Edition</strong>.
                        AI features are managed by the Vibe Cloud Controller.
                        No local configuration required.
                    </p>
                </div>
            </div>
        </div>
    </Card>
);

// ==============================================================================
// == MAIN SETTINGS PAGE ==
// ==============================================================================

export function SettingsPage() {
    const { wipeMemory, isLoading: settingsLoading } = useSettings();

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
        <div className="p-6 max-w-xl mx-auto space-y-6 pb-24 fade-in">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <div
                    className="
                        w-12 h-12 flex items-center justify-center
                        rounded-2xl bg-[#0A0A0A]
                        border border-white/10
                        shadow-[0_0_30px_rgba(255,255,255,0.05)]
                    "
                >
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

            {/* Sections */}
            <AccountSection user={user} onSignOut={handleSignOutClick} isSigningOut={isSigningOut} />
            <AboutSection />

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

            {/* Danger Zone - Subtle */}
            <div className="pt-8 flex justify-center">
                <button
                    onClick={wipeMemory}
                    className="
                        group flex items-center gap-2
                        px-4 py-2 rounded-full
                        hover:bg-error/5 transition-colors
                    "
                >
                    <Trash2 size={12} className="text-text-muted group-hover:text-error transition-colors" />
                    <span className="text-[9px] font-bold text-text-muted group-hover:text-error uppercase tracking-wider transition-colors">
                        Reset Local Cache
                    </span>
                </button>
            </div>

            {/* Footer */}
            <footer className="text-center pt-2 opacity-20 hover:opacity-100 transition-opacity duration-500">
                <p className="text-[8px] font-mono text-text-muted tracking-wider">
                    VIBE SYSTEMS INC. // OPERATIONAL
                </p>
            </footer>
        </div>
    );
}
