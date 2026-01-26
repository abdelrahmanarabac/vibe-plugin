import React from 'react';
import { Settings } from 'lucide-react';

export type ViewType = 'dashboard' | 'graph' | 'settings';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    credits?: number;
    theme: 'dark' | 'light';
    onThemeToggle: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    credits,
    theme,
    onThemeToggle
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-nebula text-text-primary overflow-hidden font-sans transition-colors duration-300">
            {/* 🛸 Bento Header */}
            <header className="flex-none px-6 py-4 flex items-center justify-between z-40 bg-surface-0 border-b border-white/5 h-[80px]">

                {/* 1. Left: System Identity (Animation + Title) */}
                <div className="flex items-center gap-4 min-w-[240px]">
                    <SystemPulse />
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-lg tracking-wide text-white leading-none">Vibe Tokens</span>
                        <span className="text-[10px] text-text-dim font-medium uppercase tracking-[0.2em] ml-[1px]">Manager</span>
                    </div>
                </div>

                {/* 2. Center: Navigation Tabs */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center p-1.5 bg-surface-0 rounded-full border border-white/5 shadow-2xl">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-surface-2 text-text-bright shadow-lg' : 'text-text-dim hover:text-text-primary'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => onTabChange('graph')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'graph' ? 'bg-surface-2 text-text-bright shadow-lg' : 'text-text-dim hover:text-text-primary'}`}
                    >
                        Tokens
                    </button>
                </div>

                {/* 3. Right: Tools (Theme -> Settings -> Credits) */}
                <div className="flex items-center justify-end gap-6 min-w-[240px]">
                    {/* Theme Toggle */}
                    <ThemeToggle theme={theme} onThemeToggle={onThemeToggle} />

                    <div className="h-6 w-[1px] bg-white/10" /> {/* Divider */}

                    {/* Settings */}
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-surface-1 border border-white/5 text-text-dim hover:text-text-primary hover:bg-white/10 ${activeTab === 'settings' ? 'bg-white/10 text-text-primary' : ''}`}
                    >
                        <Settings size={18} />
                    </button>

                    {/* Credits Identifier */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-1 border border-white/5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                        <span className="text-xs font-bold text-white font-mono">{(credits || 0).toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar px-6 pb-6">
                {children}
            </main>
        </div>
    );
};

// Re-add Import
// Re-add Omnibox component usage or removal?
// Use the original file reference to ensure I don't break Omnibox.
// Step 552 showed `import { Omnibox } from '../components/Omnibox';` at line 3.
// And usage at line 72.
// So I will include it.

interface ThemeToggleProps {
    theme: 'dark' | 'light';
    onThemeToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeToggle }) => {
    return (
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-full border border-white/5">
            {/* Light Mode */}
            <button
                onClick={() => theme === 'dark' && onThemeToggle()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'light' ? 'bg-text-bright text-void shadow-sm' : 'text-text-dim hover:text-text-primary hover:bg-white/5'}`}
                title="Light Mode"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            </button>

            {/* Dark Mode */}
            <button
                onClick={() => theme === 'light' && onThemeToggle()}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-surface-3 text-text-bright shadow-sm border border-white/5' : 'text-text-dim hover:text-text-primary hover:bg-white/5'}`}
                title="Dark Mode"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
        </div>
    );
};

/**
 * 🧬 System Pulse Animation
 * A non-traditional, abstract representation of the "Vibe" system.
 * It's a breathing organic node structure.
 */
const SystemPulse = () => {
    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Core Node */}
            <div className="w-3 h-3 bg-primary rounded-full z-10 shadow-[0_0_15px_var(--color-primary)] relative">
                <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping" />
            </div>

            {/* Orbiting Ring 1 */}
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_8s_linear_infinite]"
                style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            />

            {/* Orbiting Ring 2 (Counter-rotate) */}
            <div className="absolute inset-1 border border-secondary/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            />

            {/* Connecting Lines (Decor) */}
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent rotate-45" />
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent -rotate-45" />
        </div>
    );
};
