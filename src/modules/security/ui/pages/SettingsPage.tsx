import { useState } from 'react';
import { Settings, Key, Trash2, Zap, CheckCircle, XCircle, Sparkles, Plus, AlertCircle } from 'lucide-react';

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';
type ModelTier = 'AUTO' | 'LITE' | 'SMART';

export interface SettingsPageProps {
    apiKey: string | null;
    onSave: (key: string) => Promise<void>;
}

/**
 * ⚙️ Elite Settings Page
 * High-contrast API configuration zone within the Security module.
 * Redesigned for better hierarchy, theme support, and accessibility.
 */
export function SettingsPage({ apiKey, onSave }: SettingsPageProps) {
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [modelTier, setModelTier] = useState<ModelTier>('AUTO');

    const handleUpdateKey = async () => {
        const trimmed = newKey.trim();
        if (!trimmed.startsWith('AIza') || trimmed.length < 20) {
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '❌ Invalid key format. Must start with "AIza".' }
            }, '*');
            return;
        }

        await onSave(trimmed);
        setNewKey('');
        setStatus('idle');
        parent.postMessage({
            pluginMessage: { type: 'NOTIFY', message: '🔒 API Key Updated Successfully' }
        }, '*');
    };

    const handleTestConnection = async () => {
        if (!apiKey) return;
        setStatus('testing');
        try {
            // Use the purified AI Module instead of legacy infra
            if (modelTier === 'SMART') {
                const { Flash3Service } = await import('../../../ai/Flash3Service');
                const ai = new Flash3Service(apiKey);
                await ai.generate('Respond with OK');
            } else {
                const { FlashLiteService } = await import('../../../ai/FlashLiteService');
                const ai = new FlashLiteService(apiKey);
                await ai.generate('Respond with OK');
            }

            setStatus('success');
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '✅ Connection Successful' } }, '*');
        } catch (error) {
            setStatus('error');
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '❌ Connection Failed' } }, '*');
        }
    };

    const handleClearCache = () => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Cache Cleared' } }, '*');
    };

    const maskedKey = apiKey ? `••••••••${apiKey.slice(-4)}` : 'Not Configured';

    const StatusIcon = () => {
        switch (status) {
            case 'testing': return <Zap className="animate-pulse text-warning" size={16} />;
            case 'success': return <CheckCircle className="text-success" size={16} />;
            case 'error': return <XCircle className="text-error" size={16} />;
            default: return <Zap className="text-text-muted" size={16} />;
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Fragment */}
            <header className="flex items-center gap-5">
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-glow">
                    <Settings size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-bright font-display tracking-tight">Settings & Configuration</h1>
                    <p className="text-sm text-text-dim font-medium">Manage your engine preferences and security keys</p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">

                {/* 1. API Configuration Section */}
                <section className="vibe-card p-6 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-surface-2 rounded-lg text-primary">
                                <Key size={18} />
                            </div>
                            <h3 className="text-base font-bold text-text-bright">API Authorization</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${apiKey ? 'bg-success/10 border-success/20 text-success' : 'bg-error/10 border-error/20 text-error'}`}>
                            {apiKey ? 'Active' : 'Missing Key'}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-2/50 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full">
                            <span className="text-xs font-bold text-text-dim uppercase tracking-wider">Current Key</span>
                            <code className="font-mono text-xs text-text-primary px-2 py-1 bg-surface-3 rounded border border-border">
                                {maskedKey}
                            </code>
                        </div>
                        {apiKey && (
                            <button
                                onClick={handleTestConnection}
                                disabled={status === 'testing'}
                                className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-3 hover:bg-surface-3/80 border border-border transition-colors text-xs font-bold text-text-primary disabled:opacity-50"
                            >
                                <StatusIcon />
                                {status === 'testing' ? 'Testing...' :
                                    status === 'success' ? 'Connected' :
                                        status === 'error' ? 'Failed' :
                                            'Test Connection'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Update API Key</label>
                        <div className="flex gap-3">
                            <input
                                type="password"
                                value={newKey}
                                onChange={e => setNewKey(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleUpdateKey()}
                                placeholder="Enter Gemini API Key (starts with AIza...)"
                                className="flex-1 px-4 py-3 bg-surface-0 border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                            />
                            <button
                                onClick={handleUpdateKey}
                                disabled={!newKey.trim()}
                                className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                            >
                                Save
                            </button>
                        </div>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary hover:text-primary-hover transition-colors ml-1 group"
                        >
                            Get a free API key from Google AI Studio
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </a>
                    </div>
                </section>

                {/* 2. Compute Strategy Section */}
                <section className="vibe-card p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-2 rounded-lg text-secondary">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-text-bright">Compute Strategy</h3>
                            <p className="text-xs text-text-dim mt-0.5">Select the intelligence model for your workflow</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(['AUTO', 'LITE', 'SMART'] as const).map(tier => (
                            <button
                                key={tier}
                                onClick={() => setModelTier(tier)}
                                className={`relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${modelTier === tier
                                    ? 'bg-secondary/10 border-secondary text-secondary'
                                    : 'bg-surface-0 border-transparent hover:border-border text-text-dim hover:text-text-primary'
                                    }`}
                            >
                                <div className={`text-2xl ${modelTier === tier ? 'scale-110' : 'scale-100'} transition-transform`}>
                                    {tier === 'AUTO' && '✨'}
                                    {tier === 'LITE' && '⚡'}
                                    {tier === 'SMART' && '🧠'}
                                </div>
                                <div className="text-center">
                                    <div className="text-xs font-bold uppercase tracking-wider">{tier === 'AUTO' ? 'Auto-Vibe' : tier === 'LITE' ? 'Flash Lite' : 'Deep Thought'}</div>
                                    <div className="text-[10px] opacity-70 mt-1">
                                        {tier === 'AUTO' ? 'Balanced' : tier === 'LITE' ? 'Fast & Cheap' : 'High Precision'}
                                    </div>
                                </div>
                                {tier === 'AUTO' && (
                                    <div className="absolute top-0 right-0 px-2 py-1 bg-secondary text-void text-[9px] font-black uppercase rounded-bl-lg">
                                        Best
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 3. Data Management */}
                <section className="vibe-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-surface-2 rounded-lg text-error">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-text-bright">Reset Local Memory</h3>
                            <p className="text-xs text-text-dim mt-0.5">Clear cached patterns and temporary data.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClearCache}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-error/5 border border-error/20 hover:bg-error/10 text-error transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <Trash2 size={14} />
                        Clear Cache
                    </button>
                </section>

                {/* 4. Bottom Button (New Requirement) */}
                <div className="flex justify-center pt-4 pb-2">
                    <button className="group relative flex items-center gap-3 px-8 py-3 bg-surface-2 hover:bg-surface-3 text-text-primary rounded-full transition-all border border-border hover:border-border-strong">
                        <Plus size={16} className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm">Add Mode</span>
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <div className="ml-1 px-1.5 py-0.5 rounded-md bg-surface-3 text-[10px] font-bold text-text-dim uppercase tracking-wider group-hover:bg-surface-0 transition-colors">
                            Soon
                        </div>
                    </button>
                </div>

            </div>

            <footer className="text-center pt-4">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] opacity-50">
                    Vibe Engine v3.1.0-Elite • Powered by Gemini Flash
                </div>
            </footer>
        </div>
    );
}
