import React from 'react';
import { Settings } from 'lucide-react';

export type ViewType = 'dashboard' | 'graph' | 'settings' | 'create-token';

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
    credits
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

                {/* 3. Right: Tools (Settings -> Credits) */}
                <div className="flex items-center justify-end gap-6 min-w-[240px]">

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
