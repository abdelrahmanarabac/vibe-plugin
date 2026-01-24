import { useState } from 'react';
import { Settings, Key, Trash2, Zap, CheckCircle, XCircle, Sparkles } from 'lucide-react';

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';
type ModelTier = 'AUTO' | 'LITE' | 'SMART';

export interface SettingsScreenProps {
    apiKey: string | null;
    onSave: (key: string) => Promise<void>;
}

/**
 * ⚙️ Elite Settings Fragment
 * High-contrast API configuration zone with premium rounding.
 */
export function SettingsScreen({ apiKey, onSave }: SettingsScreenProps) {
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
            const { GeminiService } = await import('../../infra/api/GeminiService');
            const ai = new GeminiService(apiKey);
            const effectiveTier = modelTier === 'AUTO' ? 'LITE' : modelTier;
            await ai.generate('Respond with OK', { tier: effectiveTier, retries: 1 });
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
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            {/* Header Fragment */}
            <header className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white font-display uppercase tracking-tight">System Settings</h1>
                    <p className="text-xs text-text-dim font-medium uppercase tracking-widest opacity-60">Engine Configuration</p>
                </div>
            </header>

            {/* API Key Identity */}
            <section className="vibe-card bg-white/[0.02] border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Key size={16} className="text-primary" />
                        <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-[0.2em]">API Authorization</span>
                    </div>
                    <span className={`font-mono text-[10px] px-3 py-1 rounded-full border ${apiKey ? 'bg-success/5 border-success/30 text-success' : 'bg-error/5 border-error/30 text-error'}`}>
                        {maskedKey}
                    </span>
                </div>

                <div className="space-y-4">
                    {apiKey && (
                        <button
                            onClick={handleTestConnection}
                            disabled={status === 'testing'}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-[20px] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/[0.08] transition-all group"
                        >
                            <StatusIcon />
                            <span className="text-xs font-bold text-text-primary uppercase tracking-tight">
                                {status === 'testing' ? 'Testing Core...' :
                                    status === 'success' ? 'Link Established' :
                                        status === 'error' ? 'Link Failure - Retry?' :
                                            'Test Connection'}
                            </span>
                        </button>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="password"
                            value={newKey}
                            onChange={e => setNewKey(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleUpdateKey()}
                            placeholder="Overwrite Gemini API Key..."
                            className="flex-1 px-4 py-3 text-xs bg-[#030407] border border-white/5 rounded-[18px] text-white placeholder-text-muted/50 focus:border-primary/50 focus:outline-none transition-all"
                        />
                        <button
                            onClick={handleUpdateKey}
                            disabled={!newKey.trim()}
                            className="px-6 py-3 bg-primary text-void rounded-[18px] text-xs font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-2"
                        >
                            Update
                        </button>
                    </div>
                </div>

                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-4 text-[10px] text-primary/80 hover:text-primary transition-colors text-center font-bold uppercase tracking-tighter"
                >
                    Provision new key via Google AI Studio ↗
                </a>
            </section>

            {/* intelligence Tier */}
            <section className="vibe-card bg-white/[0.02] border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={16} className="text-secondary" />
                    <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-[0.1em]">Compute Strategy</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {(['AUTO', 'LITE', 'SMART'] as const).map(tier => (
                        <button
                            key={tier}
                            onClick={() => setModelTier(tier)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-[24px] border transition-all relative overflow-hidden ${modelTier === tier
                                ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_20px_rgba(255,46,224,0.15)]'
                                : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
                                }`}
                        >
                            <div className="text-lg">
                                {tier === 'AUTO' && <Sparkles size={18} />}
                                {tier === 'LITE' && '⚡'}
                                {tier === 'SMART' && '🧠'}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">
                                {tier === 'AUTO' ? 'Auto-Vibe' : tier === 'LITE' ? 'Flash' : 'Deep Thought'}
                            </span>
                            {tier === 'AUTO' && (
                                <div className="absolute top-0 right-0 p-1 bg-secondary text-[#030407] text-[8px] font-black uppercase rounded-bl-lg">
                                    Rec
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            <div className="pt-4 space-y-4">
                <button
                    onClick={handleClearCache}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-[28px] bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 hover:border-red-500/30 text-red-400 transition-all border-dashed"
                >
                    <Trash2 size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Wipe Local Memory</span>
                </button>

                <footer className="text-center">
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] opacity-40">
                        Vibe Engine v3.1.0-Elite • Powered by Gemini Flash
                    </div>
                </footer>
            </div>
        </div>
    );
}
