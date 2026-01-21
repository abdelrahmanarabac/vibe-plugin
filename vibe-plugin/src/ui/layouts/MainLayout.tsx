import React from 'react';
import { LayoutGrid, Network, Table2 } from 'lucide-react';
import { Omnibox } from '../components/Omnibox';

export type ViewType = 'dashboard' | 'graph' | 'table';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    onCommand: (query: string) => void;
    isSearchLoading: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active
            ? 'border-indigo-400 text-indigo-400'
            : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
            }`}
    >
        {icon}
        {label}
    </button>
);

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    onCommand,
    isSearchLoading
}) => {
    return (
        <div className="h-full w-full flex flex-col bg-slate-900/50 backdrop-blur-xl text-white overflow-hidden">
            {/* Header / Command Center */}
            <header className="flex-none p-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="text-xs font-mono text-white/30">VIBE OS v3.0</div>
                </div>

                <Omnibox
                    onCommand={onCommand}
                    isProcessing={isSearchLoading}
                />
            </header>

            {/* Navigation Tabs (Secondary) */}
            <nav className="flex-none px-6 mt-4 flex gap-6 border-b border-white/5">
                <TabButton active={activeTab === 'dashboard'} onClick={() => onTabChange('dashboard')} label="Dashboard" icon={<LayoutGrid size={16} />} />
                <TabButton active={activeTab === 'graph'} onClick={() => onTabChange('graph')} label="Visual Graph" icon={<Network size={16} />} />
                <TabButton active={activeTab === 'table'} onClick={() => onTabChange('table')} label="Data Grid" icon={<Table2 size={16} />} />
            </nav>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto relative custom-scrollbar p-6">
                {children}
            </main>
        </div>
    );
};

// NavButton removed
