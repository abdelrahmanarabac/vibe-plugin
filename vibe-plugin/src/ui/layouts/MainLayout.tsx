import React from 'react';
import { Settings, Activity, Layers, Grid } from 'lucide-react';
import { Omnibox } from '../components/Omnibox';

export type ViewType = 'dashboard' | 'graph' | 'table';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: ViewType;
    onTabChange: (tab: ViewType) => void;
    onSearch: (query: string) => void;
    onCommand: (query: string) => void;
    isSearchLoading?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    onTabChange,
    onSearch,
    onCommand,
    isSearchLoading
}) => {
    return (
        <div className="flex flex-col h-screen bg-surface-0 text-text-primary font-sans overflow-hidden">
            {/* Level 0: Command Center (Header) */}
            <header className="h-14 border-b border-surface-1 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                        <Activity size={18} />
                    </div>
                    <span className="font-bold tracking-tight text-sm">Vibe Token OS</span>
                </div>

                {/* OmniBox */}
                <Omnibox
                    onSearch={onSearch}
                    onCommand={onCommand}
                    isLoading={isSearchLoading}
                />

                <div className="flex items-center gap-2 text-text-secondary">
                    <button className="p-2 hover:bg-surface-active rounded-md transition-colors">
                        <Settings size={16} />
                    </button>
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-surface-1 border border-surface-active">
                        <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <span className="text-[10px] font-mono font-bold text-text-muted uppercase">System Live</span>
                    </div>
                </div>
            </header>

            {/* Level 1: Workspace Navigation (Tabs) */}
            <div className="flex items-center gap-1 p-2 border-b border-surface-1 bg-surface-0/50 shrink-0">
                <NavButton
                    active={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                    icon={<Activity size={14} />}
                    label="Dashboard"
                />
                <NavButton
                    active={activeTab === 'graph'}
                    onClick={() => onTabChange('graph')}
                    icon={<Layers size={14} />}
                    label="Graph Editor"
                />
                <NavButton
                    active={activeTab === 'table'}
                    onClick={() => onTabChange('table')}
                    icon={<Grid size={14} />}
                    label="Inspector"
                />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-surface-0 relative">
                {children}
            </main>
        </div>
    );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all
            ${active
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-glow-primary'
                : 'text-text-secondary hover:bg-surface-active hover:text-text-primary border border-transparent'}
        `}
    >
        {icon}
        {label}
    </button>
);
