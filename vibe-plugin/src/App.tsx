import { useEffect, useState } from 'react';
import { MainLayout, type ViewType } from './ui/layouts/MainLayout';
import { Dashboard } from './ui/Dashboard';
import { EditorView } from './ui/EditorView';
import { SmartInspector } from './ui/components/SmartInspector';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { ImpactWarning, type ImpactReport } from './ui/components/ImpactWarning';
import { SettingsService } from './infra/SettingsService';
import { type TokenEntity } from './core/types';

/**
 * 🎯 Vibe Tokens - Main Application
 * Clean, minimal, Figma-native design
 */
export default function App() {
    // Core State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
    const [isGraphSynced, setIsGraphSynced] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
    const [tokens, setTokens] = useState<TokenEntity[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const [stats, setStats] = useState({ totalVariables: 0, collections: 0, styles: 0, lastSync: 0 });

    // Load API Key on Mount & Initial Scan
    useEffect(() => {
        SettingsService.loadApiKey()
            .then(key => {
                setApiKey(key || null);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        // Trigger initial data scan
        parent.postMessage({ pluginMessage: { type: 'SCAN_VARS' } }, '*');
    }, []);

    // Message Handler
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const msg = event.data?.pluginMessage;
            if (!msg) return;

            switch (msg.type) {
                case 'GRAPH_SYNCED':
                    setTokens(msg.payload || []);
                    setIsGraphSynced(true);
                    break;
                case 'SCAN_COMPLETE':
                    setStats(msg.payload);
                    break;
                case 'ERROR':
                    console.error('Controller Error:', msg.payload);
                    break;
                case 'IMPACT_REPORT':
                    setImpactReport(msg.payload);
                    break;
                case 'SCAN_RESULT':
                    parent.postMessage({
                        pluginMessage: {
                            type: 'NOTIFY',
                            message: `Scanned ${msg.payload.primitives.length} design primitives.`
                        }
                    }, '*');
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Sync Graph when API Key is available
    useEffect(() => {
        if (apiKey && !isGraphSynced) {
            parent.postMessage({ pluginMessage: { type: 'SYNC_GRAPH' } }, '*');
        }
    }, [apiKey, isGraphSynced]);

    // Command Handler (Omnibox)
    const handleCommand = async (query: string) => {
        if (!apiKey) {
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: 'API Key required. Go to Settings.' }
            }, '*');
            return;
        }

        setIsProcessing(true);
        try {
            // Simple command shortcuts
            if (query.startsWith('/button')) {
                parent.postMessage({
                    pluginMessage: {
                        type: 'CREATE_COMPONENT',
                        recipe: { type: 'BUTTON', variant: 'PRIMARY' }
                    }
                }, '*');
                parent.postMessage({
                    pluginMessage: { type: 'NOTIFY', message: '🎨 Creating button component...' }
                }, '*');
                return;
            }

            if (query.startsWith('/rename-collections') || query.startsWith('/rename')) {
                parent.postMessage({
                    pluginMessage: {
                        type: 'RENAME_COLLECTIONS',
                        payload: { dryRun: false }
                    }
                }, '*');
                parent.postMessage({
                    pluginMessage: { type: 'NOTIFY', message: '🔄 Auto-renaming collections...' }
                }, '*');
                return;
            }

            // AI Processing
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '🤖 AI is thinking...' }
            }, '*');

            const { GeminiService } = await import('./infra/api/GeminiService');
            const ai = new GeminiService(apiKey);

            // Generate AI response
            const prompt = `You are Vibe Token OS, a Figma design token assistant. 
User request: "${query}"

Provide a brief, actionable response (max 2 sentences) on how to accomplish this task in Figma or with design tokens.`;

            const response = await ai.generate(prompt, 'LITE');

            // Show response in notification
            parent.postMessage({
                pluginMessage: {
                    type: 'NOTIFY',
                    message: `💡 ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`
                }
            }, '*');

            console.log('AI Response:', response);
        } catch (e) {
            console.error(e);
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '❌ Command failed. Check console.' }
            }, '*');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdate = (id: string, newValue: any) => {
        parent.postMessage({ pluginMessage: { type: 'UPDATE_VARIABLE', id, newValue } }, '*');
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-[#2c2c2c]">
                <div className="text-white/50 text-sm">Loading...</div>
            </div>
        );
    }

    // No API Key - Simple Inline Setup (No Onboarding)
    if (!apiKey) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#2c2c2c] p-8">
                <div className="max-w-sm w-full space-y-6">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-white mb-2">Vibe Tokens</h1>
                        <p className="text-sm text-white/50">Enter your Gemini API Key to continue</p>
                    </div>
                    <input
                        type="password"
                        placeholder="AIza..."
                        className="figma-input w-full"
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const key = (e.target as HTMLInputElement).value.trim();
                                if (key.startsWith('AIza') && key.length > 20) {
                                    await SettingsService.saveApiKey(key);
                                    setApiKey(key);
                                }
                            }
                        }}
                    />
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-center text-sm text-[#0D99FF] hover:underline"
                    >
                        Get free API key →
                    </a>
                </div>
            </div>
        );
    }

    // Main Application
    return (
        <MainLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCommand={handleCommand}
            isSearchLoading={isProcessing}
        >
            {activeTab === 'dashboard' && <Dashboard tokens={tokens} stats={stats} />}
            {activeTab === 'graph' && <EditorView tokens={tokens} searchFocus="" />}
            {activeTab === 'table' && <SmartInspector tokens={tokens} onUpdate={handleUpdate} />}
            {activeTab === 'settings' && <SettingsScreen />}

            <ImpactWarning
                report={impactReport}
                onDismiss={() => setImpactReport(null)}
            />
        </MainLayout>
    );
}
