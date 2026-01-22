import { useEffect, useState } from 'react';
import { MainLayout, type ViewType } from './ui/layouts/MainLayout';
import { Dashboard } from './ui/Dashboard';
import { EditorView } from './ui/EditorView';
import { SmartInspector } from './ui/components/SmartInspector';
import { SettingsScreen } from './ui/screens/SettingsScreen';
import { ImpactWarning, type ImpactReport } from './ui/components/ImpactWarning';
import { SettingsService } from './infra/SettingsService';
import { type TokenEntity } from './core/types';
import type { PluginEvent } from './shared/types';

/**
 * 🎯 Vibe Tokens - Main Application
 * Updated for Pure Token Management with Live Sync
 */
export default function App() {
    // Core State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);

    // Live Sync State
    const [isGraphSynced, setIsGraphSynced] = useState(false);
    const [liveIndicator, setLiveIndicator] = useState(false);
    // const [lastSyncTime, setLastSyncTime] = useState<number>(0);

    // UI State
    const [activeTab, setActiveTab] = useState<ViewType>('graph'); // Default to Graph/List
    const [tokens, setTokens] = useState<TokenEntity[]>([]);

    // Unused state removed for clean build
    const [isProcessing, setIsProcessing] = useState(false);

    const [stats, setStats] = useState({ totalVariables: 0, collections: 0, styles: 0, lastSync: 0 });

    // Load API Key on Mount
    useEffect(() => {
        SettingsService.loadApiKey()
            .then(key => {
                setApiKey(key || null);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));

        // Initial manual sync request
        parent.postMessage({ pluginMessage: { type: 'SYNC_GRAPH' } }, '*');
    }, []);

    // Message Handler (Observer Pattern)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const msg: PluginEvent = event.data?.pluginMessage;
            if (!msg) return;

            switch (msg.type) {
                case 'GRAPH_UPDATED':
                case 'GRAPH_SYNCED':
                    setTokens(msg.tokens || []);
                    setIsGraphSynced(true);
                    // setLastSyncTime(msg.timestamp || Date.now());

                    // Flash Live Indicator
                    setLiveIndicator(true);
                    setTimeout(() => setLiveIndicator(false), 2000);

                    // Update stats implicitly from tokens
                    setStats(prev => ({ ...prev, totalVariables: msg.tokens?.length || 0, lastSync: Date.now() }));
                    break;

                case 'SCAN_COMPLETE':
                    setStats(msg.payload);
                    break;

                case 'ERROR':
                    console.error('Controller Error:', msg.message);
                    setImpactReport(prev => ({
                        ...prev!,
                        timestamp: Date.now(),
                        changes: [],
                        overallImpact: 'LOW',
                        summary: msg.message
                    }));
                    break;

                case 'IMPACT_REPORT':
                    setImpactReport(msg.payload);
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

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
            // Simplified Commands
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
            const { IntentEngine } = await import('./modules/intelligence/IntentEngine');

            const ai = new GeminiService(apiKey);
            const intentEngine = new IntentEngine(ai);

            // 🧠 Classify Intent
            const intent = await intentEngine.classify(query);

            if (intent.type === 'RENAME_COLLECTION' && intent.payload) {
                parent.postMessage({
                    pluginMessage: {
                        type: 'RENAME_COLLECTION',
                        payload: intent.payload
                    }
                }, '*');
                return;
            }

            // Fallback: Generate AI response
            const prompt = `You are Vibe Token OS, a Figma design token assistant. 
User request: "${query}"

Provide a brief, actionable response (max 2 sentences) on how to accomplish this task in Figma or with design tokens.`;

            const response = await ai.generate(prompt, 'LITE');

            parent.postMessage({
                pluginMessage: {
                    type: 'NOTIFY',
                    message: `💡 ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`
                }
            }, '*');

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

    // No API Key - Simple Inline Setup
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
        <div className="h-full flex flex-col overflow-hidden relative">
            {/* Live Indicator Overlay */}
            <div className={`absolute top-3 right-3 flex items-center gap-2 transition-opacity duration-300 ${isGraphSynced ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-2 h-2 rounded-full ${liveIndicator ? 'bg-green-400 animate-pulse' : 'bg-green-600/50'}`}></div>
                <span className="text-[10px] text-white/30 font-mono">LIVE</span>
            </div>

            <MainLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onCommand={handleCommand}
                isSearchLoading={isProcessing}
            >
                {/* Re-ordered Views: Graph is now primary */}
                {activeTab === 'graph' && <EditorView tokens={tokens} searchFocus="" />}
                {activeTab === 'dashboard' && <Dashboard tokens={tokens} stats={stats} />}
                {activeTab === 'table' && <SmartInspector tokens={tokens} onUpdate={handleUpdate} />}
                {activeTab === 'settings' && <SettingsScreen />}

                <ImpactWarning
                    report={impactReport}
                    onDismiss={() => setImpactReport(null)}
                />
            </MainLayout>
        </div>
    );
}
