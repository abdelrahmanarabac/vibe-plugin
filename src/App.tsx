import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useVibeApp } from './ui/hooks/useVibeApp';
import { MainLayout } from './ui/layouts/MainLayout';
import { EditorView } from './ui/EditorView';
import { Dashboard } from './ui/Dashboard';
import { SettingsPage } from './modules/settings/ui/SettingsPage';
import { CreateTokenPage } from './modules/tokens/ui/pages/CreateTokenPage';
import { OmniboxTrigger, OmniboxModal } from './modules/intelligence/omnibox';

// System Messaging
import { SystemProvider } from './ui/contexts/SystemContext';
import { SystemMessageBar } from './ui/components/system/SystemMessageBar';

import { SecurityGate } from './modules/security/ui/SecurityGate';

export default function App() {
    return (
        <SystemProvider>
            <SecurityGate>
                <VibeAppContent />
            </SecurityGate>
        </SystemProvider>
    );
}

function VibeAppContent() {
    const vm = useVibeApp();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'graph' | 'create-token'>('dashboard');
    const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);

    // Fake credits for demo (Matches Dashboard)
    const credits = 1250;

    // 1. Boot Sequence (Premium Initialization)
    if (vm.settings.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-void text-white select-none cursor-wait">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border border-white/10 rounded-full animate-[spin_3s_linear_infinite]" />
                        <div className="absolute inset-0 border-t border-primary rounded-full animate-[spin_2s_linear_infinite]" />
                        <div className="absolute inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                            VIBE // SYNC_ENGINE
                        </span>
                        <span className="text-[10px] font-mono text-primary/80 animate-pulse">
                            ESTABLISHING CONNECTION...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="vibe-root relative h-full bg-void text-foreground font-sans antialiased overflow-hidden">
            <MainLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                credits={credits}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -4, scale: 0.99 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 4, scale: 0.99 }}
                        transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="h-full"
                    >
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                tokens={vm.tokens.tokens}
                                stats={vm.tokens.stats}
                                onTabChange={(tab) => setActiveTab(tab)}
                            />
                        )}

                        {activeTab === 'graph' && (
                            <EditorView
                                tokens={vm.tokens.tokens}
                                onTraceLineage={vm.tokens.traceLineage}
                                lineageData={vm.tokens.lineageData}
                            />
                        )}

                        {activeTab === 'create-token' && (
                            <CreateTokenPage
                                onBack={() => setActiveTab('dashboard')}
                                onSubmit={async (tokenData) => {
                                    return await vm.tokens.createToken(tokenData);
                                }}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsPage />
                        )}
                    </motion.div>
                </AnimatePresence>
            </MainLayout>

            {/* AI Intelligence Layer */}
            <OmniboxTrigger
                isOpen={isOmniboxOpen}
                onClick={() => setIsOmniboxOpen(!isOmniboxOpen)}
                isLifted={activeTab === 'create-token'}
            />

            <OmniboxModal
                isOpen={isOmniboxOpen}
                onClose={() => setIsOmniboxOpen(false)}
                onCommand={(cmd) => {
                    vm.ai.handleCommand(cmd);
                }}
                isProcessing={vm.ai.isProcessing}
            />

            {/* Ambient Atmosphere */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            {/* System Message Overlay */}
            <SystemMessageBar />
        </div>
    );
}
