import { useEffect, useState } from 'react';
import { MainLayout, type ViewType } from './ui/layouts/MainLayout';
import { Dashboard } from './ui/Dashboard';
import { EditorView } from './ui/EditorView';
import { SmartInspector } from './ui/components/SmartInspector';
import { OnboardingFlow } from './ui/components/OnboardingFlow';
import { ImpactWarning, type ImpactReport } from './ui/components/ImpactWarning';
import { loadAPIKey, saveAPIKey } from './infra/CryptoService';

import { AIOrchestrator } from './modules/ai/AIOrchestrator';
import { CommandParser } from './modules/ai/CommandParser';

export default function App() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [impactReport, setImpactReport] = useState<ImpactReport | null>(null);
    const [isGraphSynced, setIsGraphSynced] = useState(false);
    const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
    const [tokens, setTokens] = useState<any[]>([]);

    // Search & Command State
    const [searchQuery, setSearchQuery] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Initial Load
    useEffect(() => {
        loadAPIKey().then(key => {
            if (key) setApiKey(key);
        });

        window.onmessage = (event) => {
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
            }
        };
    }, []);

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
        await saveAPIKey(key);
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
            onSearch={setSearchQuery}
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
