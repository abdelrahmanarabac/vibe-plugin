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
