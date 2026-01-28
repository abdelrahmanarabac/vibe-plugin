import React from 'react';
import { Settings, LayoutGrid, Cpu, Moon, Sun, Wallet } from 'lucide-react';

export type ViewType = 'dashboard' | 'graph' | 'settings' | 'create-token';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    credits?: number;
    theme: 'dark' | 'light';
    onThemeToggle: () => void;
}

/**
 * 🛸 MainLayout (The Vibe Vessel)
 * The primary layout wrapper for the Vibe Plugin.
 * Features a bento-styled header with glassmorphism and organic animations.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    credits = 0,
    theme,
    onThemeToggle
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-void text-text-primary overflow-hidden font-sans transition-all duration-500">
            {/* 🛸 Bento Header */}
            <header className="flex-none px-6 flex items-center justify-between z-40 bg-surface-0/80 backdrop-blur-xl border-b border-border h-[72px] shadow-glass">

                {/* 1. Left: System Identity */}
                <div className="flex items-center gap-4 min-w-[200px]">
                    <SystemPulse />
                    <div className="flex flex-col">
                        <span className="font-display font-black text-sm tracking-tighter text-text-bright uppercase leading-none">Vibe OS</span>
                        <span className="text-[9px] text-primary font-bold uppercase tracking-[0.3em] mt-1 ml-[1px] opacity-80">v3.1.0-Elite</span>
                    </div>
                </div>

                {/* 2. Center: Navigation Tabs */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 bg-surface-0/40 rounded-2xl border border-border shadow-inner backdrop-blur-md">
                    <TabButton
                        active={activeTab === 'dashboard'}
                        onClick={() => onTabChange('dashboard')}
                        icon={<LayoutGrid size={14} />}
                        label="Dashboard"
                    />
                    <TabButton
                        active={activeTab === 'graph'}
                        onClick={() => onTabChange('graph')}
                        icon={<Cpu size={14} />}
                        label="Graph"
                    />
                </div>

                {/* 3. Right: Intelligence & Credits */}
                <div className="flex items-center justify-end gap-4 min-w-[200px]">

                    {/* Theme Switcher */}
                    <button
                        onClick={onThemeToggle}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-1 border border-border hover:bg-surface-2 hover:border-border-strong transition-all group"
                    >
                        {theme === 'dark' ? (
                            <Moon size={18} className="text-text-dim group-hover:text-primary transition-colors" />
                        ) : (
                            <Sun size={18} className="text-warning group-hover:text-warning/80 transition-colors" />
                        )}
                    </button>

                    <div className="w-px h-6 bg-border" />

                    {/* Settings Trigger */}
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${activeTab === 'settings'
                            ? 'bg-primary/20 border-primary/40 text-primary shadow-glow-primary'
                            : 'bg-surface-1 border-border text-text-dim hover:text-text-bright hover:bg-surface-2'
                            }`}
                    >
                        <Settings size={18} />
                    </button>

                    {/* Credits Identity */}
                    <div className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-surface-1 border border-border rounded-2xl">
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-text-dim uppercase tracking-tighter leading-none">Credits</span>
                            <span className="text-xs font-mono font-bold text-text-bright leading-none mt-1">{credits.toLocaleString()}</span>
                        </div>
                        <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary shadow-glow-secondary">
                            <Wallet size={16} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                {children}
            </main>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
            </div>
        </div>
    );
};

/* --- Internal Components --- */

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 relative group ${active
            ? 'bg-surface-2 text-text-bright shadow-lg'
            : 'text-text-dim hover:text-text-primary hover:bg-surface-1'
            }`}
    >
        {icon}
        {label}
        {active && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary rounded-full shadow-glow-primary" />
        )}
    </button>
);

const SystemPulse = () => {
    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Core Node */}
            <div className="w-3.5 h-3.5 bg-gradient-to-tr from-primary to-secondary rounded-full z-10 shadow-glow-primary relative">
                <div className="absolute inset-0 bg-surface-0 opacity-40 rounded-full animate-ping" />
            </div>

            {/* Orbiting Rings */}
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"
                style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
            />
            <div className="absolute inset-2 border border-secondary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
            />
        </div>
    );
};
