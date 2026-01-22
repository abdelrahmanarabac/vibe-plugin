import React from 'react';
import { LayoutGrid, Settings, Layers } from 'lucide-react';
import { Omnibox } from '../components/Omnibox';

export type ViewType = 'dashboard' | 'graph' | 'table' | 'settings';

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
        <div className="h-full w-full flex flex-col bg-[#1E1E1E] text-white overflow-hidden font-sans">
            {/* Minimal Header with Pill Tabs */}
            <header className="flex-none p-3 flex items-center justify-between border-b border-white/5 bg-[#1E1E1E]/90 backdrop-blur-md z-40">
                <div className="flex items-center gap-1">
                    <TabButton active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} label="Overview" icon={<LayoutGrid size={14} />} />
                    <TabButton active={activeTab === 'graph'} onClick={() => onTabChange('graph')} label="Tokens" icon={<Layers size={14} />} />
                    {/* <TabButton active={activeTab === 'table'} onClick={() => onTabChange('table')} label="Data" icon={<Table2 size={14} />} /> */}
                    <TabButton active={activeTab === 'settings'} onClick={() => onTabChange('settings')} label="Settings" icon={<Settings size={14} />} />
                </div>
                <div className="text-[10px] font-mono text-white/20 tracking-widest uppercase">VIBE v3</div>
            </header>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                {children}
            </main>

            {/* Floating Omnibox (FAB Style) */}
            <div className="absolute bottom-6 right-6 z-50">
                <Omnibox onCommand={onCommand} isProcessing={isSearchLoading} />
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${active
            ? 'bg-white text-black shadow-lg shadow-white/10'
            : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        {label}
    </button>
);
