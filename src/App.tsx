import { useState, useEffect } from 'react';
import { VibeSupabase } from './infrastructure/supabase/SupabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeApp } from './ui/hooks/useVibeApp';
import { MainLayout } from './ui/layouts/MainLayout';
import { TokensView } from './features/tokens/ui/pages/TokensView';
import { Dashboard } from './features/dashboard/ui/Dashboard';
import { SettingsPage } from './features/settings/ui/SettingsPage';
import { CreateTokenPage } from './features/tokens/ui/pages/CreateTokenPage';
import { ExportTokensPage } from './features/export/ui/pages/ExportTokensPage';
import { OmniboxTrigger } from './features/intelligence/omnibox';
import { FeedbackOmnibox } from './features/feedback/ui/FeedbackOmnibox';


// System Messaging
import { SystemProvider } from './ui/contexts/SystemContext';
import { SystemMessageBar } from './components/shared/system/SystemMessageBar';
import { BootScreen } from './components/shared/system/BootScreen';
import { AmbientBackground } from './components/shared/system/AmbientBackground';

import { AuthGate } from './features/auth/ui/AuthGate';

export default function App() {
    const [ready, setReady] = useState(false);

    // ⚡ Initialize Supabase Connection
    useEffect(() => {
        const init = async () => {
            await VibeSupabase.connect();
            setReady(true);
        };
        init();
    }, []);

    if (!ready) return null; // Or a splash screen, but AuthGate has one. 
    // Actually AuthGate has a loading state, but it fails if Supabase isn't ready.
    // So we block here.

    return (
        <SystemProvider>
            <AuthGate>
                <VibeAppContent />
            </AuthGate>
        </SystemProvider>
    );
}

function VibeAppContent() {
    const vm = useVibeApp();
    const [activeTab, setActiveTab] = useState<import('./ui/layouts/MainLayout').ViewType>('dashboard');
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Fake credits for demo (Matches Dashboard)
    const credits = 1250;

    // 1. Boot Sequence (Premium Initialization)
    if (vm.settings.isLoading) {
        return <BootScreen />;
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
                                onSync={vm.tokens.syncVariables}
                                onResetSync={vm.tokens.resetSync}
                                isSyncing={vm.tokens.isSyncing}
                                isSynced={vm.tokens.isSynced}

                                // 🌊 Progressive Feedback
                                syncStatus={vm.tokens.syncStatus}
                                syncProgress={vm.tokens.syncProgress}
                            />
                        )}

                        {activeTab === 'tokens' && (
                            <TokensView onBack={() => setActiveTab('dashboard')} />
                        )}



                        {activeTab === 'create-token' && (
                            <CreateTokenPage
                                onBack={() => setActiveTab('dashboard')}
                                onSubmit={async (tokenData) => {
                                    return await vm.tokens.createToken(tokenData);
                                }}
                            />
                        )}

                        {activeTab === 'export-tokens' && (
                            <ExportTokensPage
                                tokens={vm.tokens.tokens}
                                onBack={() => setActiveTab('dashboard')}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsPage />
                        )}
                    </motion.div>
                </AnimatePresence>
            </MainLayout>

            {/* Feedback Layer */}
            <OmniboxTrigger
                isOpen={isFeedbackOpen}
                onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                isLifted={activeTab === 'create-token'}
            />

            <FeedbackOmnibox
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />

            {/* Ambient Atmosphere */}
            <AmbientBackground />

            {/* System Message Overlay */}
            <SystemMessageBar />



        </div>
    );
}
