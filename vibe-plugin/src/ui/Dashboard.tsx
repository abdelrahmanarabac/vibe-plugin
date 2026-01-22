import { ShieldCheck, Zap, Download, Plus, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { type TokenEntity } from '../core/types';
import { NewTokenDialog } from './components/NewTokenDialog';
import { useState } from 'react';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };
}

/**
 * 📊 Elite Dashboard Fragment
 * Higher contrast, super rounded corners, and clear information hierarchy.
 */
export function Dashboard({ tokens = [], stats }: DashboardProps) {
    const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);

    const handleNewToken = () => {
        setShowNewTokenDialog(true);
    };

    const handleCreateToken = (data: { name: string; type: string; value: string }) => {
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_VARIABLE',
                payload: data
            }
        }, '*');
    };

    const handleExport = () => {
        const exportData = {
            version: '3.1',
            exportedAt: new Date().toISOString(),
            tokens: tokens.map(t => ({ id: t.id, name: t.name, type: t.$type, value: t.$value }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibe-tokens-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-2">
            {/* 📈 Stats Dashboard Fragment */}
            <div className="grid grid-cols-2 gap-4">
                <StatFragment
                    label="Tokens in Graph"
                    value={String(stats?.totalVariables ?? 0)}
                    icon={<Zap size={20} className="text-primary" />}
                    subtext={`${stats?.collections ?? 0} Collections Synced`}
                    color="primary"
                />
                <StatFragment
                    label="Figma Styles"
                    value={String(stats?.styles ?? 0)}
                    icon={<ShieldCheck size={20} className="text-secondary" />}
                    subtext="Visual Definitions"
                    color="secondary"
                />
            </div>

            {/* 🕹️ Action Surface */}
            <div className="vibe-card bg-white/[0.02] border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold tracking-tight text-white mb-1">Quick Workspace</h2>
                        <p className="text-[11px] text-text-dim">Build and export your token systems at light speed.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        title="Create New Token"
                        description="Add color, spacing, or radius"
                        icon={<Plus size={18} />}
                        onClick={handleNewToken}
                    />
                    <ActionButton
                        title="Export System"
                        description="W3C JSON Compatible"
                        icon={<Download size={18} />}
                        onClick={handleExport}
                    />
                </div>
            </div>

            {/* 🧩 Empty State Fragment */}
            {tokens.length === 0 && <EmptyStateFragment />}

            <NewTokenDialog
                isOpen={showNewTokenDialog}
                onClose={() => setShowNewTokenDialog(false)}
                onSubmit={handleCreateToken}
            />
        </div>
    );
}

function StatFragment({ label, value, icon, subtext, color }: { label: string, value: string, icon: React.ReactNode, subtext: string, color: 'primary' | 'secondary' }) {
    const accents = {
        primary: 'border-primary/20 bg-primary/5',
        secondary: 'border-secondary/20 bg-secondary/5'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
            className={`p-5 rounded-[32px] border border-white/10 bg-[#0A0C14]/60 backdrop-blur-xl transition-all ${accents[color]}`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                    {icon}
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                    Active
                </div>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1 font-display leading-none">{value}</div>
            <div className="text-[11px] font-bold text-text-dim uppercase tracking-tighter opacity-80">{label}</div>
            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-text-muted flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${color === 'primary' ? 'bg-primary animate-pulse' : 'bg-secondary'}`} />
                {subtext}
            </div>
        </motion.div>
    );
}

function ActionButton({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="flex flex-col gap-3 p-4 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] text-left transition-all"
        >
            <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#030407] border border-white/10 text-text-bright shadow-lg">
                {icon}
            </div>
            <div>
                <div className="text-sm font-bold text-white mb-0.5">{title}</div>
                <div className="text-[10px] text-text-dim line-clamp-1">{description}</div>
            </div>
        </motion.button>
    );
}

function EmptyStateFragment() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 flex flex-col items-center text-center px-10"
        >
            <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <Layers size={96} strokeWidth={1} className="relative text-white/20" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display uppercase tracking-tight">System Ready for Inputs</h3>
            <p className="text-xs text-text-dim max-w-xs mb-8">
                Your token graph is empty. Type a brand vibe or specific styles in the Omnibox below to start building.
            </p>
        </motion.div>
    );
}
