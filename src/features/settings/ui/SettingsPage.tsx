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
