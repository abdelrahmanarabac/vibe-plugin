import React from 'react';
import { Settings, Zap } from 'lucide-react';
import { Omnibox } from '../components/Omnibox';

export type ViewType = 'dashboard' | 'graph' | 'settings';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    onCommand: (query: string) => void;
    isSearchLoading: boolean;
    credits?: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    onCommand,
    isSearchLoading,
    credits
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-nebula text-white overflow-hidden font-sans">
            {/* 🛸 Bento Header */}
            <header className="flex-none px-6 py-4 flex items-center justify-between z-40 bg-void border-b border-white/5 h-[72px]">
                {/* 1. Left: Identity */}
                <div className="flex items-center gap-3 w-[200px]">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_15px_rgba(110,98,229,0.3)]">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-base tracking-wide text-white leading-tight">VIBE</span>
                        <span className="text-[10px] text-text-dim font-medium uppercase tracking-wider">Design System</span>
                    </div>
                </div>

                {/* 2. Center: Fragment Identity (Tabs) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 bg-[#1A1A1A] rounded-full border border-white/5">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#2E2E2E] text-white shadow-lg' : 'text-text-dim hover:text-white'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => onTabChange('graph')}
                        className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'graph' ? 'bg-[#2E2E2E] text-white shadow-lg' : 'text-text-dim hover:text-white'}`}
                    >
                        Tokens
                    </button>
                </div>

                {/* 3. Right: Controls & Credits */}
                <div className="flex items-center justify-end gap-4 w-[200px]">
                    <div className="bg-[#1A1A1A] rounded-full p-1 flex items-center border border-white/5">
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => onTabChange('settings')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-[#1A1A1A] border border-white/5 text-text-dim hover:text-white hover:bg-white/10`}
                    >
                        <Settings size={18} />
                    </button>

                    {/* Credits Identifier */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-white/5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_var(--color-warning)]" />
                        <span className="text-xs font-bold text-white font-mono">{(credits || 0).toLocaleString()}</span>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar px-6 pb-6">
                {children}
            </main>

            {/* Floating Omnibox */}
            <div className="absolute bottom-6 right-6 z-50">
                <Omnibox onCommand={onCommand} isProcessing={isSearchLoading} />
            </div>
        </div>
    );
};

// Re-add Import
// Re-add Omnibox component usage or removal?
// Use the original file reference to ensure I don't break Omnibox.
// Step 552 showed `import { Omnibox } from '../components/Omnibox';` at line 3.
// And usage at line 72.
// So I will include it.

const ThemeToggle = () => (
    <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        </button>
        <button className="px-3 py-1 rounded-full bg-[#2E2E2E] text-[10px] font-bold text-white flex items-center gap-2 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            Dark
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-text-dim hover:text-white transition-colors">
            {/* Bat Icon (Custom Path) */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M22,10.6c0-1.8-2.6-2.2-4.2-2.3c-0.2-1.7-1.1-2.4-1.7-2.8c-1.3-0.8-2-0.5-2.2-0.3c0.1-1.6-1-1.6-1.9-1.7c-0.9,0.1-2,0.1-1.9,1.7c-0.2-0.1-0.9-0.5-2.2,0.3C7.3,6,6.4,6.7,6.2,8.4
	C4.6,8.4,2,8.8,2,10.6c0,2.1,3.4,4.2,4.8,4.9c0.7,0.4,1.4,1.8,1.4,1.8s1.6-0.6,2.7-0.9c0.4-0.1,1.1-0.1,1.1-0.1s0.8,0,1.1,0.1
	c1.1,0.3,2.7,0.9,2.7,0.9s0.7-1.4,1.4-1.8C18.6,14.8,22,12.7,22,10.6z"/>            </svg>
        </button>
    </div>
);
