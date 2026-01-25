import { Zap, Download, Plus, Layers } from 'lucide-react';
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
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
            {/* 📈 Stats Dashboard Fragment: Anti-Gravity Blueprint */}
            <div className="grid grid-cols-2 gap-4">
                <StatFragment
                    label="Tokens in Graph"
                    value={String(stats?.totalVariables ?? 0)}
                    icon={<Zap size={22} className="text-primary" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' }} />}
                    subtext={`${stats?.collections ?? 0} Collections Synced`}
                    color="primary"
                />
                <StatFragment
                    label="Figma Styles"
                    value={String(stats?.styles ?? 0)}
                    icon={<Layers size={22} className="text-secondary" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 46, 224, 0.5))' }} />}
                    subtext="Visual Definitions"
                    color="secondary"
                />
            </div>

            {/* 🕹️ Action Surface: Glassmorphism Card */}
            <div className="vibe-card bg-[#121726]/40 border-white/[0.05] p-6 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold tracking-tight text-white mb-1 font-display uppercase italic">Quick Workspace</h2>
                        <p className="text-[11px] text-text-dim">Build and export your token systems at light speed.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ActionButton
                        title="Create New Token"
                        description="Add color, spacing, or radius"
                        icon={<Plus size={20} />}
                        onClick={handleNewToken}
                    />
                    <ActionButton
                        title="Export System"
                        description="W3C JSON Compatible"
                        icon={<Download size={20} />}
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
        primary: 'border-primary/10 bg-primary/2',
        secondary: 'border-secondary/10 bg-secondary/2'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -6,
                boxShadow: color === 'primary'
                    ? "0 20px 40px rgba(0, 240, 255, 0.15)"
                    : "0 20px 40px rgba(255, 46, 224, 0.15)",
                borderColor: 'rgba(255,255,255,0.15)'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`p-6 rounded-[32px] border border-white/[0.05] bg-[#121726]/60 backdrop-blur-2xl transition-all ${accents[color]}`}
        >
            <div className="flex items-center justify-between mb-5">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.08] shadow-2xl">
                    {icon}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                    Live
                </div>
            </div>
            <div className="text-4xl font-black text-white mb-1 font-display tracking-tight leading-none">{value}</div>
            <div className="text-[11px] font-bold text-text-dim uppercase tracking-wider">{label}</div>
            <div className="mt-5 pt-4 border-t border-white/[0.05] text-[10px] text-text-muted flex items-center gap-2">
                <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`w-1.5 h-1.5 rounded-full ${color === 'primary' ? 'bg-primary' : 'bg-secondary'}`}
                />
                {subtext}
            </div>
        </motion.div>
    );
}

function ActionButton({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderColor: 'rgba(255,255,255,0.2)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col gap-4 p-5 rounded-[28px] bg-white/[0.04] border border-white/[0.04] text-left transition-all"
        >
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#030407] border border-white/[0.08] text-primary shadow-2xl">
                {icon}
            </div>
            <div>
                <div className="text-sm font-black text-white mb-0.5 font-display uppercase tracking-tight">{title}</div>
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
            className="py-16 flex flex-col items-center text-center px-10"
        >
            <div className="w-32 h-32 mb-8 relative">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                <Layers size={112} strokeWidth={0.5} className="relative text-white/10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 font-display uppercase tracking-widest italic">System Ready</h3>
            <p className="text-xs text-text-dim max-w-xs mb-8 leading-relaxed">
                Your token graph is currently a void. Type a brand vibe or specific styles in the Omnibox to start building.
            </p>
        </motion.div>
    );
}
