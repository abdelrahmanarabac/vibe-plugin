// import React from 'react'; // JSX Transform active
import { ShieldCheck, Zap, FileText, Download, Plus, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { type TokenEntity } from '../core/types';
import { NewTokenDialog } from './components/NewTokenDialog';
import { useState } from 'react';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };
}

export function Dashboard({ tokens = [], stats }: DashboardProps) {
    const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);

    const handleNewToken = () => {
        setShowNewTokenDialog(true);
    };

    const handleCreateToken = (data: { name: string; type: string; value: string }) => {
        // Send to controller to create Figma variable
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_VARIABLE',
                payload: data
            }
        }, '*');
        parent.postMessage({
            pluginMessage: {
                type: 'NOTIFY',
                message: `Token "${data.name}" created!`
            }
        }, '*');
    };

    const handleExport = () => {
        const exportData = {
            version: '3.0',
            exportedAt: new Date().toISOString(),
            stats,
            tokens: tokens.map(t => ({
                id: t.id,
                name: t.name,
                type: t.$type,
                value: t.$value
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibe-tokens-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        parent.postMessage({
            pluginMessage: {
                type: 'NOTIFY',
                message: 'Tokens exported successfully!'
            }
        }, '*');
    };

    // const recentlyUpdated = tokens.filter(t => (t as any).updatedAt > Date.now() - 86400000).length;

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard
                    label="Local Vars"
                    value={stats?.totalVariables.toString() || "0"}
                    icon={<Zap className="text-[#A855F7]" size={18} />}
                    subtext={`${stats?.collections || 0} collections found`}
                    accentColor="#A855F7"
                />
                <StatCard
                    label="Figma Styles"
                    value={stats?.styles.toString() || "0"}
                    icon={<ShieldCheck className="text-[#22C55E]" size={18} />}
                    subtext="Paint & Text styles"
                    accentColor="#22C55E"
                />
                <StatCard
                    label="Graph Nodes"
                    value={tokens.length.toString()}
                    icon={<FileText className="text-[#F59E0B]" size={18} />}
                    subtext="Synced in graph"
                    accentColor="#F59E0B"
                />
            </div>

            {/* Empty State or Quick Actions */}
            {tokens.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Quick Actions</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <ActionCard
                            title="New Token"
                            icon={<Plus size={16} />}
                            onClick={handleNewToken}
                        />
                        <ActionCard
                            title="Generate Docs"
                            icon={<FileText size={16} />}
                            onClick={() => parent.postMessage({ pluginMessage: { type: 'GENERATE_DOCS' } }, '*')}
                        />
                        <ActionCard
                            title="Export JSON"
                            icon={<Download size={16} />}
                            onClick={handleExport}
                        />
                    </div>
                </>
            )}

            <NewTokenDialog
                isOpen={showNewTokenDialog}
                onClose={() => setShowNewTokenDialog(false)}
                onSubmit={handleCreateToken}
            />
        </div>
    );
}

/**
 * Empty State Component - Shown when no tokens exist
 */
function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
        >
            <div className="w-32 h-32 mb-6 relative">
                <img
                    src="/empty-state.png"
                    alt="Empty State"
                    className="w-full h-full object-contain opacity-80"
                    onError={(e) => {
                        // Fallback to icon if image fails
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Layers size={48} className="text-[#A855F7]/30" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Tokens Yet</h3>
            <p className="text-sm text-white/40 max-w-xs mb-6">
                Use the Omnibox above to describe your vibe and generate a complete token system.
            </p>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => parent.postMessage({ pluginMessage: { type: 'SCAN_SELECTION' } }, '*')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white text-sm font-medium rounded-lg shadow-lg shadow-[#A855F7]/20 hover:shadow-[#A855F7]/40 transition-all"
            >
                Scan Selection
            </motion.button>
        </motion.div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    subtext: string;
    accentColor: string;
}

const StatCard = ({ label, value, icon, subtext, accentColor }: StatCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        className="p-4 rounded-xl bg-[#1E1E1E]/60 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all"
        style={{ boxShadow: `0 4px 20px ${accentColor}10` }}
    >
        <div className="flex justify-between items-start mb-2">
            <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
        <div className="text-[10px] text-white/30">{subtext}</div>
    </motion.div>
);

interface ActionCardProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
}

const ActionCard = ({ title, icon, onClick }: ActionCardProps) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="flex items-center gap-3 p-3 rounded-lg bg-[#1E1E1E]/40 border border-white/5 hover:border-[#A855F7]/30 hover:bg-[#1E1E1E]/60 transition-all group text-left"
    >
        <div className="p-2 rounded-md bg-[#2C2C2C] text-white/50 group-hover:text-[#A855F7] transition-colors">
            {icon}
        </div>
        <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{title}</span>
    </motion.button>
);
