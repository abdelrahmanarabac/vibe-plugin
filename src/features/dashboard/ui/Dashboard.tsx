import { Download, Plus, Layers, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { type TokenEntity } from '../../../core/types';
import { NewStyleDialog } from '../../styles/ui/dialogs/NewStyleDialog';
import { useState } from 'react';
import type { ViewType } from '../../../ui/layouts/MainLayout';
import { SyncToggle } from './components/SyncToggle';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };

    onTabChange?: (tab: ViewType) => void;
    onSync?: () => void;
    onResetSync?: () => void;
    isSyncing?: boolean;
    isSynced?: boolean;

    // 🌊 Progressive Feedback
    syncStatus?: string;
    syncProgress?: number;

    onCreateStyle?: (data: { name: string; type: string; value: string | number | { r: number; g: number; b: number; a?: number } }) => void;
}

/**
 * 📊 Elite Dashboard Fragment
 * Higher contrast, super rounded corners, and clear information hierarchy.
 */
export function Dashboard({
    tokens: _tokens = [],
    stats,
    onTabChange,
    onCreateStyle,
    onSync,
    onResetSync,
    isSyncing,
    isSynced,
    syncStatus,
    syncProgress: _swallowedProgress // 🗑️ Unused for now, status has the text
}: DashboardProps) {
    const [showNewStyleDialog, setShowNewStyleDialog] = useState(false);

    // Toggle is "Active" if we are consistently synced OR currently syncing
    const isToggleActive = isSynced || isSyncing;

    return (
        <div className="flex flex-col items-center py-8 px-4 gap-8 w-full max-w-5xl mx-auto">

            {/* 🍱 Bento Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                {/* 📊 Stat Card: Total Tokens (Large) */}
                <div
                    className="vibe-card h-44 p-6 flex flex-col justify-between relative overflow-hidden group transition-all"
                >
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 rounded-xl bg-white/5 text-primary border border-white/5 shadow-inner">
                            <Zap size={24} strokeWidth={1.5} />
                        </div>
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 z-20 flex flex-col items-end gap-2">
                            {/* 🌊 Progressive Status Label */}
                            {isSyncing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xxs font-bold uppercase tracking-widest text-primary animate-pulse"
                                >
                                    {syncStatus || 'Syncing...'}
                                </motion.div>
                            )}

                            <SyncToggle
                                isActive={isToggleActive}
                                isSyncing={isSyncing}
                                onClick={() => {
                                    // Logic:
                                    // 1. If currently Syncing -> Cancel (Reset)
                                    // 2. If Active (Synced) -> Reset (Turn Off)
                                    // 3. If Inactive -> Sync (Turn On)
                                    if (isSyncing) {
                                        onResetSync?.();
                                    } else if (isToggleActive) {
                                        onResetSync?.();
                                    } else {
                                        onSync?.();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="z-10">
                        <div className="text-5xl font-display font-bold text-white mb-1 tracking-tight">{stats?.totalVariables ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSyncing ? 'bg-primary animate-ping' : 'bg-primary'}`} />
                            Total Design Tokens
                        </div>
                    </div>
                </div>

                {/* 🎨 Stat Card: Styles (Large) */}
                <div className="vibe-card h-44 p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full group-hover:bg-secondary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-3 rounded-xl bg-white/5 text-secondary border border-white/5 shadow-inner">
                            <Layers size={24} strokeWidth={1.5} />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xxs font-bold uppercase tracking-wider border border-secondary/20">Linked Styles</span>
                    </div>

                    <div className="z-10">
                        <div className="text-5xl font-display font-bold text-white mb-1 tracking-tight">{stats?.styles ?? 0}</div>
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
                            onTabChange?.('create-token');
                        }}
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-primary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Plus size={24} strokeWidth={3} className="text-white group-hover:text-primary transition-colors relative z-10 drop-shadow-md" />
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
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Layers size={24} strokeWidth={3} className="text-white group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-secondary transition-colors">Add Style</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Map to Figma Style</div>
                            </div>
                        </div>
                    </button>

                    {/* 🌐 Quick Action: Add Mode (SOON) */}
                    <button
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-emerald-500/50 hover:bg-surface-2 group transition-all relative overflow-hidden"
                        onClick={() => { }} // No-op for now
                        disabled
                    >
                        <div className="flex items-center gap-5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-emerald-500/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Globe size={24} strokeWidth={3} className="text-white group-hover:text-emerald-500 transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-emerald-500 transition-colors">Add Mode</div>
                                <div className="text-xs text-text-dim group-hover:text-emerald-500 transition-colors">Figma variable mode</div>
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-xxs font-black uppercase text-text-dim tracking-widest backdrop-blur-md">
                            Soon
                        </div>
                    </button>



                    {/* 💾 Quick Action: Export */}
                    <button
                        onClick={() => onTabChange?.('export-tokens')}
                        className="vibe-card h-24 p-5 flex items-center justify-between hover:border-secondary/50 hover:bg-surface-2 group transition-all"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Download size={24} strokeWidth={3} className="text-white group-hover:text-secondary transition-colors relative z-10 drop-shadow-md" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-text-bright group-hover:text-secondary transition-colors">Export Tokens</div>
                                <div className="text-xs text-text-dim group-hover:text-text-primary transition-colors">Multiple formats</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

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
