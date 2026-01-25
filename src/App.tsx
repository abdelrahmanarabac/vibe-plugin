import { useState } from 'react';
import { useVibeApp } from './ui/hooks/useVibeApp';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { EditorView } from './ui/EditorView';
import { Dashboard } from './ui/Dashboard';

import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from './ui/layouts/MainLayout';


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
        <div className="vibe-root relative h-full">
            <MainLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCommand={vm.ai.handleCommand}
                isSearchLoading={vm.ai.isProcessing}
                credits={credits}
            >
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
                            <div className="fragment-dashboard animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <Dashboard
                                    tokens={vm.tokens.tokens}
                                    stats={vm.tokens.stats}
                                />
                            </div>
                        )}

                        {activeTab === 'graph' && (
                            <div className="fragment-tokens h-full">
                                <EditorView
                                    tokens={vm.tokens.tokens}
                                    onTraceLineage={vm.tokens.traceLineage}
                                    lineageData={vm.tokens.lineageData}
                                />
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <SettingsScreen apiKey={vm.settings.apiKey} onSave={vm.settings.saveApiKey} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </MainLayout>

            {/* Background Vibe Overlays (Decorative) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
            </div>
        </div >
    );
}
