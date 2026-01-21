import { useEffect, useState } from 'react';
import { MainLayout, type ViewType } from './ui/layouts/MainLayout';
import { Dashboard } from './ui/Dashboard';
import { EditorView } from './ui/EditorView';
import { SmartInspector } from './ui/components/SmartInspector';
import { OnboardingFlow } from './ui/components/OnboardingFlow';
import { ImpactWarning, type ImpactReport } from './ui/components/ImpactWarning';
import { SettingsService } from './infra/SettingsService';


import { AIOrchestrator } from './modules/ai/AIOrchestrator';
import { CommandParser } from './modules/ai/CommandParser';

export default function App() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
    const [isGraphSynced, setIsGraphSynced] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
    const [tokens, setTokens] = useState<any[]>([]);

    // Search & Command State
    const [searchQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Initial Load
    useEffect(() => {
        SettingsService.loadApiKey().then(key => {
            if (key) setApiKey(key);
        });

        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};
            switch (type) {
                case 'GRAPH_SYNCED':
                    console.log('Graph Synced:', payload);
                    setTokens(payload || []);
                    setIsGraphSynced(true);
                    break;
                case 'ERROR':
                    console.error('Controller Error:', payload);
                    break;
                case 'IMPACT_REPORT':
                    setImpactReport(payload);
                    break;
                case 'SCAN_RESULT':
                    console.log('Perception Engine Result:', payload.primitives);
                    parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: `Scanned ${payload.primitives.length} design primitives.` } }, '*');
                    break;
                case 'SCAN_IMAGE_RESULT':
                    console.log('Vision Data Received (Bytes):', payload.bytes.length);
                    // 1. Notify User
                    parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Analyzing Image..." } }, '*');

                    // 2. Trigger AI Vision
                    if (apiKey) {
                        const orchestrator = new AIOrchestrator(apiKey);
                        orchestrator.execute('semantic-description', `Analyze this design screenshot and extract the color palette and typography style.`)
                            .then(response => {
                                console.log("Vision AI Response:", response);
                                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Vision Analysis Complete!" } }, '*');
                            })
                            .catch(err => {
                                console.error("Vision AI Error:", err);
                                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Vision Analysis Failed." } }, '*');
                            });
                    }
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [apiKey]); // Added apiKey dependency for Vision trigger

    // 2. Lifecycle
    useEffect(() => {
        if (apiKey && !isGraphSynced) {
            parent.postMessage({ pluginMessage: { type: 'SYNC_GRAPH' } }, '*');
            parent.postMessage({ pluginMessage: { type: 'RESIZE_WINDOW', width: 1200, height: 800 } }, '*');
        }
    }, [apiKey, isGraphSynced]);

    // 3. Command Handlers
    const handleCommand = async (query: string) => {
        if (!apiKey) return;

        setIsProcessing(true);
        try {
            const orchestrator = new AIOrchestrator(apiKey);
            const parser = new CommandParser(orchestrator);
            const command = await parser.parse(query);

            if (command) {
                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: `Executing: ${command.action} on ${command.target}` } }, '*');
                // Future: Dispatch to CommandExecutor
            } else {
                parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Command not recognized." } }, '*');
            }
        } catch (e) {
            console.error(e);
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "AI Engine Failure." } }, '*');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdate = (id: string, newValue: any) => {
        parent.postMessage({ pluginMessage: { type: 'UPDATE_VARIABLE', id, newValue } }, '*');
    };

    const handleSaveKey = async (key: string) => {
        await SettingsService.saveApiKey(key);
        setApiKey(key);
        setIsGraphSynced(false);
    };

    if (!apiKey) {
        return <OnboardingFlow onSaveKey={handleSaveKey} />;
    }

    return (
        <MainLayout
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onCommand={handleCommand}
            isSearchLoading={isProcessing}
        >
            {activeTab === 'dashboard' && <Dashboard tokens={tokens} />}
            {activeTab === 'graph' && <EditorView tokens={tokens} searchFocus={searchQuery} />}
            {activeTab === 'table' && <SmartInspector tokens={tokens} onUpdate={handleUpdate} />}

            <ImpactWarning
                report={impactReport}
                onDismiss={() => setImpactReport(null)}
            />
        </MainLayout>
    );
}
