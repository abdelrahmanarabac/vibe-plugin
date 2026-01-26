<<<<<<< HEAD
import { Zap, Download, Plus, Layers, Sun, Moon } from 'lucide-react';
=======
import { Zap, Download, Plus, Layers } from 'lucide-react';
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
import { motion } from 'framer-motion';
import { type TokenEntity } from '../core/types';
import { NewTokenDialog } from './components/NewTokenDialog';
import { NewStyleDialog } from './components/NewStyleDialog';
import { useState } from 'react';

interface DashboardProps {
    tokens?: TokenEntity[];
    stats?: { totalVariables: number; collections: number; styles: number; lastSync: number };
<<<<<<< HEAD
    theme?: 'dark' | 'light';
    onThemeToggle?: () => void;
=======
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
}

/**
 * 📊 Elite Dashboard Fragment
 * Higher contrast, super rounded corners, and clear information hierarchy.
 */
<<<<<<< HEAD
export function Dashboard({ tokens = [], stats, theme, onThemeToggle }: DashboardProps) {
=======
export function Dashboard({ tokens = [], stats }: DashboardProps) {
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
    const [showNewTokenDialog, setShowNewTokenDialog] = useState(false);
    const [showNewStyleDialog, setShowNewStyleDialog] = useState(false);

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

    const handleCreateStyle = (data: { name: string; type: string; value: any }) => {
        parent.postMessage({
            pluginMessage: {
                type: 'CREATE_STYLE',
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

<<<<<<< HEAD

=======
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
    return (
        <div className="flex flex-col items-center py-8 gap-8">

            {/* 🍱 Bento Grid - Fixed 328px Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-fit">

                {/* 📊 Stat Card: Total Tokens */}
                <div className="vibe-card w-[328px] h-[180px] p-6 flex flex-col justify-between relative overflow-hidden group">
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-primary border border-white/5">
                            <Zap size={20} />
                        </div>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Active</span>
                    </div>

                    <div className="z-10">
                        <div className="text-4xl font-display font-bold text-white mb-1">{stats?.totalVariables ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium">Total Tokens</div>
                    </div>
                </div>

                {/* 🎨 Stat Card: Styles */}
                <div className="vibe-card w-[328px] h-[180px] p-6 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 blur-[60px] rounded-full group-hover:bg-secondary/20 transition-all duration-500" />

                    <div className="flex justify-between items-start z-10">
                        <div className="p-2 rounded-lg bg-white/5 text-secondary border border-white/5">
                            <Layers size={20} />
                        </div>
                        <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">Styles</span>
                    </div>

                    <div className="z-10">
                        <div className="text-4xl font-display font-bold text-white mb-1">{stats?.styles ?? 0}</div>
                        <div className="text-sm text-text-dim font-medium">Figma Styles</div>
                    </div>
                </div>

                {/* 🚀 Quick Action: New Token */}
                <button
                    onClick={handleNewToken}
                    className="vibe-card w-[328px] h-[80px] p-4 flex items-center justify-between hover:border-primary/50 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                            <Plus size={18} className="text-white group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">New Token</div>
                            <div className="text-[10px] text-text-dim">Create a variable</div>
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={12} className="text-text-dim" />
                    </div>
                </button>

                {/* 🖌️ Quick Action: Add Style (Requested Feature) */}
                <button
                    onClick={() => setShowNewStyleDialog(true)}
                    className="vibe-card w-[328px] h-[80px] p-4 flex items-center justify-between hover:border-secondary/50 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 transition-colors">
                            <Layers size={18} className="text-white group-hover:text-secondary transition-colors" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white group-hover:text-secondary transition-colors">Add Style</div>
                            <div className="text-[10px] text-text-dim">Create a style</div>
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={12} className="text-text-dim" />
                    </div>
                </button>

<<<<<<< HEAD
                {/* 🌓 Quick Action: Toggle Theme (Redesigned) */}
                <button
                    onClick={onThemeToggle}
                    className="vibe-card w-[328px] h-[80px] p-4 flex items-center justify-between hover:border-primary/50 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                            {theme === 'dark' ? (
                                <Sun size={18} className="text-white group-hover:text-primary transition-colors" />
                            ) : (
                                <Moon size={18} className="text-white group-hover:text-primary transition-colors" />
                            )}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                Add Mode
                            </div>
                            <div className="text-[10px] text-text-dim">
                                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                            </div>
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Zap size={12} className="text-text-dim" />
                    </div>
                </button>

                {/* 💾 Quick Action: Export (Redesigned & Restored) */}
                <button
                    onClick={handleExport}
                    className="vibe-card w-[328px] h-[80px] p-4 flex items-center justify-between hover:border-secondary/50 group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-void flex items-center justify-center border border-white/10 group-hover:border-secondary/50 transition-colors">
                            <Download size={18} className="text-white group-hover:text-secondary transition-colors" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-white group-hover:text-secondary transition-colors">Export System</div>
                            <div className="text-[10px] text-text-dim">Download JSON package</div>
                        </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <Plus size={12} className="text-text-dim" />
                    </div>
=======
                {/* 💾 Quick Action: Export */}
                <button
                    onClick={handleExport}
                    className="vibe-card w-[328px] h-[60px] p-4 flex items-center justify-center gap-2 hover:bg-white/5"
                >
                    <Download size={14} className="text-text-dim" />
                    <span className="text-xs font-bold text-text-dim uppercase tracking-wider">Export System</span>
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
                </button>

            </div>

            {/* 🧩 Empty State Fragment */}
            {tokens.length === 0 && <EmptyStateFragment />}

            <NewTokenDialog
                isOpen={showNewTokenDialog}
                onClose={() => setShowNewTokenDialog(false)}
                onSubmit={handleCreateToken}
            />

            <NewStyleDialog
                isOpen={showNewStyleDialog}
                onClose={() => setShowNewStyleDialog(false)}
                onSubmit={handleCreateStyle}
            />
        </div>
    );
}

// Removed StatFragment & ActionButton helper components as they are now inlined for Bento Grid control



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
