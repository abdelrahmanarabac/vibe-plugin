import React from 'react';
import { LayoutGrid, Layers, Settings, Zap } from 'lucide-react';
import { Omnibox } from '../components/Omnibox';

export type ViewType = 'dashboard' | 'graph' | 'settings';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    onCommand: (query: string) => void;
    isSearchLoading: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    onCommand,
    isSearchLoading
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-[#090B12] text-white overflow-hidden font-sans">
            {/* 🛸 Anti-Gravity Header */}
            <header className="flex-none px-6 py-4 flex items-center justify-between z-40 relative">
                {/* Background overlay for floating effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* 1. Left: Vibe Logo */}
                <div className="flex items-center gap-2 z-10">
                    <Zap className="text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" size={18} />
                    <span className="font-bold tracking-wider text-sm">VIBE<span className="text-white/30">.AI</span></span>
                </div>

                {/* 2. Center: Fragment Identity (Dashboard & Tokens Only) */}
                <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center p-1 bg-[#121726]/80 backdrop-blur-xl rounded-full border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        <FragmentTab
                            active={activeTab === 'dashboard'}
                            onClick={() => onTabChange('dashboard')}
                            label="Dashboard"
                            icon={<LayoutGrid size={14} />}
                        />
                        <FragmentTab
                            active={activeTab === 'graph'}
                            onClick={() => onTabChange('graph')}
                            label="Tokens"
                            icon={<Layers size={14} />}
                        />
                    </div>
                </div>

                {/* 3. Right: Settings & Tokens Card */}
                <div className="flex items-center gap-3 z-10">
                    {/* Settings Icon */}
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`p-2.5 rounded-full transition-all duration-300 ${activeTab === 'settings' ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
                        aria-label="Settings"
                    >
                        <Settings size={16} />
                    </button>

                    {/* Action Card: Tokens (Floating Action) */}
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00F0FF]/10 to-[#A855F7]/10 border border-[#00F0FF]/20 rounded-full text-sm font-medium transition-all hover:border-[#00F0FF]/50 hover:shadow-[0_4px_24px_rgba(0,240,255,0.2)] active:scale-95"
                        aria-label="View Tokens"
                    >
                        <Layers size={14} className="text-[#00F0FF]" />
                        <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">24 Tokens</span>
                    </button>
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

// Component: The Floating Pill Tab (Fragment Identity)
interface FragmentTabProps {
    active: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}

const FragmentTab: React.FC<FragmentTabProps> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${active
            ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.2)]'
            : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        {label}
    </button>
);
