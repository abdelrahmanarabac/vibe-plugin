// import React from 'react'; // JSX Transform active
import { ShieldCheck, Zap, FileText, Download, Plus } from 'lucide-react';

export function Dashboard({ tokens = [] }: { tokens?: any[] }) {
    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-xl font-bold text-text-primary mb-6">System Status</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard
                    label="System Health"
                    value="100%"
                    icon={<ShieldCheck className="text-success" size={20} />}
                    subtext="All systems nominal"
                />
                <StatCard
                    label="Active Tokens"
                    value={tokens.length.toString()}
                    icon={<Zap className="text-primary" size={20} />}
                    subtext={`${tokens.filter(t => t.updatedAt > Date.now() - 86400000).length} Updated recently`}
                />
                <StatCard
                    label="Docs Sync"
                    value="Active"
                    icon={<FileText className="text-warning" size={20} />}
                    subtext="Last sync: 2m ago"
                />
            </div>

            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionCard
                    title="New Token"
                    icon={<Plus size={18} />}
                    onClick={() => { }}
                />
                <ActionCard
                    title="Generate Docs"
                    icon={<FileText size={18} />}
                    onClick={() => parent.postMessage({ pluginMessage: { type: 'GENERATE_DOCS' } }, '*')}
                />
                <ActionCard
                    title="Export JSON"
                    icon={<Download size={18} />}
                    onClick={() => { }}
                />
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon, subtext }: any) => (
    <div className="p-4 rounded-xl bg-surface-1 border border-surface-active">
        <div className="flex justify-between items-start mb-2">
            <span className="text-text-secondary text-xs font-medium">{label}</span>
            {icon}
        </div>
        <div className="text-2xl font-bold text-text-primary mb-1">{value}</div>
        <div className="text-[10px] text-text-muted">{subtext}</div>
    </div>
);

const ActionCard = ({ title, icon, onClick }: any) => (
    <button
        onClick={onClick}
        className="flex items-center gap-3 p-4 rounded-lg bg-surface-1 border border-transparent hover:border-primary/30 hover:bg-surface-active transition-all group text-left"
    >
        <div className="p-2 rounded-md bg-surface-0 text-text-secondary group-hover:text-primary transition-colors">
            {icon}
        </div>
        <span className="text-sm font-medium text-text-primary">{title}</span>
    </button>
);
