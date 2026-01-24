import { useState } from 'react';
import { useVibeApp } from './ui/hooks/useVibeApp';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { EditorView } from './ui/EditorView';
import { Dashboard } from './ui/Dashboard';
import { Omnibox } from './ui/components/Omnibox';
import { Coins, LayoutGrid, Layers, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ui/theme.css';

export default function App() {
    const vm = useVibeApp();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'graph'>('dashboard');

    // Fake credits for demo (Matches Dashboard)
    const credits = 1250;

    if (vm.settings.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#030407] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">Booting Vibe...</div>
                </div>
            </div>
        );
    }

    if (!vm.settings.apiKey) {
        return <SettingsScreen apiKey={vm.settings.apiKey} onSave={vm.settings.saveApiKey} />;
    }

    return (
        <div className="vibe-root relative">
            {/* 💎 Elite Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-void/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-primary to-secondary animate-pulse shadow-[0_0_15px_var(--primary-glow)]" />
                        <div className="absolute inset-0 bg-white/20 blur-[2px] rounded-full" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 font-display">
                        Vibe
                    </h1>
                </div>

                {/* Navigation Pill */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full h-8">
                        <Coins size={14} className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-200">{credits.toLocaleString()}</span>
                    </div>

                    <nav className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
                        <NavButton
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                            icon={<LayoutGrid size={16} />}
                            label="Overview"
                        />
                        <NavButton
                            active={activeTab === 'graph'}
                            onClick={() => setActiveTab('graph')}
                            icon={<Layers size={16} />}
                            label="Tokens"
                        />
                        <NavButton
                            active={activeTab === 'settings'}
                            onClick={() => setActiveTab('settings')}
                            icon={<SettingsIcon size={16} />}
                            label="Settings"
                        />
                    </nav>
                </div>
            </header>

            {/* 🌌 Main Content - Fragment Logic */}
            <main className="vibe-content relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className="h-full"
                    >
                        {activeTab === 'dashboard' && (
                            <div className="fragment-dashboard">
                                <Dashboard
                                    tokens={vm.tokens.tokens}
                                    stats={vm.tokens.stats}
                                />
                            </div>
                        )}

                        {activeTab === 'graph' && (
                            <div className="fragment-tokens h-full">
                                <EditorView tokens={vm.tokens.tokens} />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <SettingsScreen apiKey={vm.settings.apiKey} onSave={vm.settings.saveApiKey} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* 🔮 Global Floating Omnibox - Centered Bottom */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[440px] px-4">
                <Omnibox
                    onCommand={vm.ai.handleCommand}
                    isProcessing={vm.ai.isProcessing}
                />
            </div>

            {/* Background Vibe Overlays (Decorative) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active
                    ? 'bg-white text-black shadow-lg shadow-white/10'
                    : 'text-text-dim hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            <span className={active ? 'block' : 'hidden'}>{label}</span>
        </button>
    );
}
