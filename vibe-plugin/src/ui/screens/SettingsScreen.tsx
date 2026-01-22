import { useState, useEffect } from 'react';
import { Settings, Key, Trash2, Zap, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { SettingsService } from '../../infra/SettingsService';

type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error';

/**
 * SettingsScreen - API Configuration Zone
 * Provides centralized management for API keys, model selection, and cache control.
 */
export function SettingsScreen() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [newKey, setNewKey] = useState('');
    const [status, setStatus] = useState<ConnectionStatus>('idle');
    const [modelTier, setModelTier] = useState<'LITE' | 'SMART'>('LITE');
    const [isLoading, setIsLoading] = useState(true);

    // Load existing API key on mount
    useEffect(() => {
        SettingsService.loadApiKey()
            .then(key => {
                setApiKey(key || null);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    /**
     * Validate and save a new API key
     */
    const handleUpdateKey = async () => {
        const trimmed = newKey.trim();

        // Validation: Gemini keys start with "AIza" and are ~39 chars
        if (!trimmed.startsWith('AIza') || trimmed.length < 20) {
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '❌ Invalid key format. Must start with "AIza".' }
            }, '*');
            return;
        }

        await SettingsService.saveApiKey(trimmed);
        setApiKey(trimmed);
        setNewKey('');
        setStatus('idle');
        parent.postMessage({
            pluginMessage: { type: 'NOTIFY', message: '🔒 API Key Updated Successfully' }
        }, '*');
    };

    /**
     * Test connection to Gemini API
     */
    const handleTestConnection = async () => {
        if (!apiKey) return;

        setStatus('testing');
        try {
            const { GeminiService } = await import('../../infra/api/GeminiService');
            const ai = new GeminiService(apiKey);
            await ai.generate('Respond with OK', { tier: 'LITE', retries: 1 });
            setStatus('success');
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '✅ Connection Successful' }
            }, '*');
        } catch (error) {
            setStatus('error');
            parent.postMessage({
                pluginMessage: { type: 'NOTIFY', message: '❌ Connection Failed. Check your key.' }
            }, '*');
        }
    };

    /**
     * Clear all cached memory/data
     */
    const handleClearCache = () => {
        parent.postMessage({
            pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' }
        }, '*');
        parent.postMessage({
            pluginMessage: { type: 'NOTIFY', message: '🗑️ Cache Cleared' }
        }, '*');
    };

    /**
     * Mask the API key for display (show only last 4 chars)
     */
    const maskedKey = apiKey ? `••••••••${apiKey.slice(-4)}` : 'Not Configured';

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <RefreshCw className="animate-spin text-text-muted" size={24} />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-text-primary">API Settings</h1>
                    <p className="text-xs text-text-muted">Configure your AI connection</p>
                </div>
            </div>

            {/* Current API Key Card */}
            <div className="p-5 rounded-xl bg-surface-1 border border-surface-active">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-text-secondary">Current API Key</span>
                    <span className={`font-mono text-xs px-2 py-1 rounded ${apiKey ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {maskedKey}
                    </span>
                </div>

                <div className="flex gap-2">
                    <input
                        type="password"
                        value={newKey}
                        onChange={e => setNewKey(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdateKey()}
                        placeholder="Enter new Gemini API key..."
                        className="flex-1 px-3 py-2 text-sm bg-surface-0 border border-surface-active rounded-lg text-text-primary placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleUpdateKey}
                        disabled={!newKey.trim()}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <Key size={14} />
                        Save
                    </button>
                </div>

                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-3 text-xs text-primary hover:underline"
                >
                    Get a free API key from Google AI Studio →
                </a>
            </div>

            {/* Model Tier Selection */}
            <div className="p-5 rounded-xl bg-surface-1 border border-surface-active">
                <span className="text-sm font-medium text-text-secondary block mb-3">Model Tier</span>
                <p className="text-xs text-text-muted mb-4">
                    LITE: Faster, cheaper. SMART: More capable, slower.
                </p>
                <div className="flex gap-2">
                    {(['LITE', 'SMART'] as const).map(tier => (
                        <button
                            key={tier}
                            onClick={() => setModelTier(tier)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${modelTier === tier
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-surface-0 border-surface-active text-text-muted hover:text-text-primary hover:border-text-muted'
                                }`}
                        >
                            {tier === 'LITE' ? '⚡ Flash Lite' : '🧠 Flash Smart'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                {/* Test Connection */}
                <button
                    onClick={handleTestConnection}
                    disabled={!apiKey || status === 'testing'}
                    className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-1 border border-surface-active hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {status === 'testing' && <Zap className="animate-pulse text-warning" size={18} />}
                    {status === 'success' && <CheckCircle className="text-success" size={18} />}
                    {status === 'error' && <XCircle className="text-error" size={18} />}
                    {status === 'idle' && <Zap className="text-text-muted" size={18} />}
                    <span className="text-sm font-medium text-text-primary">
                        {status === 'testing' ? 'Testing...' : 'Test Connection'}
                    </span>
                </button>

                {/* Clear Cache */}
                <button
                    onClick={handleClearCache}
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-error/5 border border-error/20 hover:bg-error/10 transition-all"
                >
                    <Trash2 className="text-error" size={18} />
                    <span className="text-sm font-medium text-error">Clear Cache</span>
                </button>
            </div>

            {/* Footer Info */}
            <div className="text-center text-[10px] text-text-muted pt-4 border-t border-surface-active">
                Vibe Token OS v3.0 • Data stored locally in Figma
            </div>
        </div>
    );
}
