import { useState } from 'react';
import { NamingEnforcer } from '../../modules/creation/NamingEnforcer';
import { AIOrchestrator } from '../../modules/ai/AIOrchestrator';
import { clsx } from 'clsx';
import { loadAPIKey } from '../../infra/CryptoService';

export function TokenEditor({ tokenId }: { tokenId: string }) {
    const [name, setName] = useState(tokenId);
    const [error, setError] = useState<string | null>(null);
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isFixing, setIsFixing] = useState(false);
    const [enforcer, setEnforcer] = useState<NamingEnforcer | null>(null);

    // Initialize enforcer with API key
    useState(() => {
        loadAPIKey().then(key => {
            if (key) {
                const ai = new AIOrchestrator(key);
                setEnforcer(new NamingEnforcer('^[a-z]+-[a-z]+-[a-z0-9]+$', ai));
            }
        });
    });

    const validate = (val: string) => {
        if (!enforcer) return true; // Skip if not initialized yet
        if (!enforcer.validate(val)) {
            setError('Invalid Naming Convention. Expected: category-element-variant');
            return false;
        }
        setError(null);
        setSuggestion(null);
        return true;
    };

    const handleBlur = () => {
        validate(name);
    };

    const handleFix = async () => {
        if (!enforcer) return;
        setIsFixing(true);
        try {
            const fixed = await enforcer.suggestCorrection(name);
            setSuggestion(fixed);
        } catch (e) {
            console.error(e);
        } finally {
            setIsFixing(false);
        }
    };

    const applyFix = () => {
        if (suggestion) {
            setName(suggestion);
            setError(null);
            setSuggestion(null);
        }
    };

    return (
        <div className="bg-slate-900 border border-white/5 p-6 rounded-lg max-w-lg">
            <h3 className="text-lg font-bold mb-6 text-slate-200">Token Properties</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs uppercase text-slate-500 mb-1">Token Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleBlur}
                            className={clsx(
                                "w-full bg-black/40 border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors",
                                error ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-indigo-500"
                            )}
                        />
                        {/* Status Icon */}
                        <div className="absolute right-3 top-2.5">
                            {error ? (
                                <span className="text-red-500">✕</span>
                            ) : (
                                <span className="text-green-500/50">✓</span>
                            )}
                        </div>
                    </div>

                    {/* Error / Blocking UI */}
                    {error && (
                        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-200 animate-fadeIn">
                            <p className="font-bold flex items-center gap-2">
                                <span>⚠️</span> Name Syntax Violation
                            </p>
                            <p className="opacity-80 mt-1">{error}</p>

                            {!suggestion ? (
                                <button
                                    onClick={handleFix}
                                    disabled={isFixing}
                                    className="mt-3 text-indigo-300 hover:text-white underline decoration-indigo-500/30 underline-offset-2 flex items-center gap-2"
                                >
                                    {isFixing ? 'Consulting AI...' : 'Ask AI to Fix'}
                                </button>
                            ) : (
                                <div className="mt-3 bg-slate-950/50 p-2 rounded border border-white/10 flex items-center justify-between">
                                    <span className="font-mono text-green-400">{suggestion}</span>
                                    <button
                                        onClick={applyFix}
                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded shadow-lg shadow-green-500/20 transition-all font-bold tracking-wide"
                                    >
                                        APPLY FIX
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs uppercase text-slate-500 mb-1">Value</label>
                    <input
                        type="text"
                        defaultValue="#6366F1"
                        className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-slate-400 font-mono"
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-white/5 pt-4">
                <button className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
                <button
                    disabled={!!error}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs tracking-wide transition-all"
                >
                    SAVE CHANGES
                </button>
            </div>
        </div>
    );
}
