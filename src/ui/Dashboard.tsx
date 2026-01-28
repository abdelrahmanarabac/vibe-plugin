import { Download, Plus, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { type TokenEntity } from '../core/types';
import { NewStyleDialog } from '../modules/styles/ui/dialogs/NewStyleDialog';
import { useState } from 'react';
import type { ViewType } from './layouts/MainLayout';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };
    theme?: 'dark' | 'light';
    onThemeToggle?: () => void;
    onTabChange?: (tab: ViewType) => void;
    onCreateStyle?: (data: { name: string; type: string; value: any }) => void;
}

/**
 * 📊 Elite Dashboard Fragment
 * Higher contrast, super rounded corners, and clear information hierarchy.
 */
export function Dashboard({ tokens = [], stats, onTabChange, onCreateStyle }: DashboardProps) {
    const [showNewStyleDialog, setShowNewStyleDialog] = useState(false);

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
        <div className="flex flex-col items-center py-8 px-4 gap-8 w-full max-w-[1008px] mx-auto">

            {/* 🍱 Bento Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* 📊 Stat Card: Total Tokens (Large) */}
                <div className="vibe-card h-[180px] p-6 flex flex-col justify-between relative overflow-hidden group">
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 rounded-xl bg-surface-2 text-primary border border-border shadow-inner">
                            <Zap size={24} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider border border-primary/20">Active System</span>
                    </div>

                    <div className="z-10">
                        <div className="text-5xl font-display font-bold text-text-bright mb-1 tracking-tight">{stats?.totalVariables ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Total Design Tokens
                        </div>
                    </div>
                </div>

                {/* 🎨 Stat Card: Styles (Large) */}
                <div className="vibe-card h-[180px] p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full group-hover:bg-secondary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 rounded-xl bg-surface-2 text-secondary border border-border shadow-inner">
                            <Layers size={24} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold uppercase tracking-wider border border-secondary/20">Linked Styles</span>
                    </div>

                    <div className="z-10">
                        <div className="text-5xl font-display font-bold text-text-bright mb-1 tracking-tight">{stats?.styles ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            Figma Styles Mapped
                        </div>
                    </div>
                </div>

                {/* 🚀 Quick Actions Grid (Nested) */}
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* 🚀 Quick Action: New Token */}
                    <button
                        onClick={() => {
                            onTabChange && onTabChange('create-token');
                        }}
                        className="vibe-card h-[96px] p-5 flex items-center justify-between hover:border-primary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-surface-0 flex items-center justify-center border border-border-strong group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Plus size={24} strokeWidth={3} className="text-text-bright group-hover:text-primary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-primary transition-colors">New Token</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Create a primitive</div>
                            </div>
                        </div>
                    </button>

                    {/* 🖌️ Quick Action: Add Style */}
                    <button
                        onClick={() => setShowNewStyleDialog(true)}
                        className="vibe-card h-[96px] p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-surface-0 flex items-center justify-center border border-border-strong group-hover:border-secondary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Layers size={24} strokeWidth={3} className="text-text-bright group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-secondary transition-colors">Add Style</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Map to Figma Style</div>
                            </div>
                        </div>
                    </button>

                    {/* 🌓 Quick Action: Add Mode (Soon) */}
                    <button
                        disabled
                        className="vibe-card h-[96px] p-5 flex items-center justify-between opacity-60 cursor-not-allowed border-border-strong"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-surface-0 flex items-center justify-center border border-border-strong shadow-inner grayscale">
                                <Plus size={20} strokeWidth={3} className="text-text-dim relative z-10" />
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-bold text-text-dim">Add Mode</div>
                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-surface-3 text-text-dim uppercase tracking-wider border border-border">Soon</span>
                                </div>
                                <div className="text-[10px] text-text-dim opacity-70">
                                    Advanced Features
                                </div>
                            </div>
                        </div>
                    </button>

                    {/* 💾 Quick Action: Export */}
                    <button
                        onClick={handleExport}
                        className="vibe-card h-[96px] p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-surface-0 flex items-center justify-center border border-border-strong group-hover:border-secondary/50 transition-colors shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Download size={20} strokeWidth={3} className="text-text-bright group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-text-bright group-hover:text-secondary transition-colors">Export JSON</div>
                                <div className="text-[10px] text-text-dim">Download Token Map</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* 🧩 Empty State Fragment */}
            {tokens.length === 0 && <EmptyStateFragment />}

            {/* 🆕 New Style Dialog */}
            <NewStyleDialog
                isOpen={showNewStyleDialog}
                onClose={() => setShowNewStyleDialog(false)}
                onSubmit={(data) => {
                    onCreateStyle?.(data);
                    setShowNewStyleDialog(false);
                }}
            />
        </div>
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
                <Layers size={112} strokeWidth={0.5} className="relative text-text-dim/20" />
            </div>
            <h3 className="text-2xl font-black text-text-bright mb-3 font-display uppercase tracking-widest italic">System Ready</h3>
            <p className="text-xs text-text-dim max-w-xs mb-8 leading-relaxed">
                Your token graph is currently a void. Type a brand vibe or specific styles in the Omnibox to start building.
            </p>
        </motion.div>
    );
}
