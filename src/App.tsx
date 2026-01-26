import { useState, useEffect } from 'react';
import { useVibeApp } from './ui/hooks/useVibeApp';
import { SettingsPage } from './modules/security/ui/pages/SettingsPage';
import { EditorView } from './ui/EditorView';
import { Dashboard } from './ui/Dashboard';
import { CreateTokenPage } from './modules/tokens/ui/pages/CreateTokenPage';

import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from './ui/layouts/MainLayout';
import { OmniboxTrigger, OmniboxModal } from './modules/intelligence/omnibox';
import type { TokenFormData } from './modules/tokens/domain/ui-types';


export default function App() {
    const vm = useVibeApp();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'graph' | 'create-token'>('dashboard');
    const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Sync theme class to root
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('vibe-light');
        } else {
            root.classList.remove('vibe-light');
        }
    }, [theme]);

    // Fake credits for demo (Matches Dashboard)
    const credits = 1250;

    if (vm.settings.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-void text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs font-bold tracking-widest text-primary animate-pulse uppercase">Booting Vibe...</div>
                </div>
            </div>
        );
    }



    return (
        <div className="vibe-root relative h-full">
            {/* Full-Screen Activity Mode: Create Token */}
            {activeTab === 'create-token' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="vibe-activity h-full w-full bg-nebula text-text-primary overflow-hidden"
                >
                    <CreateTokenPage
                        onBack={() => setActiveTab('dashboard')}
                        onSubmit={(data: TokenFormData) => {
                            vm.tokens.createToken(data);
                            setActiveTab('dashboard');
                        }}
                    />
                </motion.div>
            ) : (
                /* Normal Layout Mode: Dashboard, Tokens, Settings */
                <MainLayout
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    credits={credits}
                    theme={theme}
                    onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
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
                                        theme={theme}
                                        onThemeToggle={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                                        onTabChange={setActiveTab}
                                        onCreateStyle={vm.styles.createStyle}
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
                                <SettingsPage apiKey={vm.settings.apiKey} onSave={vm.settings.saveApiKey} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </MainLayout>
            )}

            {/* Omnibox Feature - Always Available */}
            <OmniboxTrigger
                isOpen={isOmniboxOpen}
                onClick={() => setIsOmniboxOpen(!isOmniboxOpen)}
            />

            <OmniboxModal
                isOpen={isOmniboxOpen}
                onClose={() => setIsOmniboxOpen(false)}
                onCommand={(cmd) => {
                    vm.ai.handleCommand(cmd);
                }}
                isProcessing={vm.ai.isProcessing}
            />

            {/* Background Vibe Overlays (Decorative) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
