import React, { useState } from 'react';
import {
    Settings as SettingsIcon, Key, Zap, CheckCircle, XCircle, Sparkles,
    Trash2, FileCode, ShieldCheck, BrainCircuit
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import type { NamingConvention, ColorSpace, OutputFormat } from '../domain/SettingsTypes';
import { GeminiService } from '../../../infrastructure/api/GeminiService';

// --- UI Components (Locally Scoped) ---

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ size?: number; className?: string }>, title: string, subtitle: string }) => (
    <div className="flex items-center gap-3 mb-4">
        <Icon size={18} className="text-secondary" />
        <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] text-text-muted font-mono">{subtitle}</p>
        </div>
    </div>
);

const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <section className={`bg-white/[0.02] border border-white/10 p-5 rounded-[24px] backdrop-blur-sm ${className}`}>
        {children}
    </section>
);

const Chip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all border ${active
            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(0,240,255,0.2)]'
            : 'bg-white/5 border-white/5 text-text-muted hover:bg-white/10 hover:border-white/20'
            }`}
    >
        {label}
    </button>
);

// --- Page Component ---

export function SettingsPage() {
    const { settings, updateSettings, updateStandard, updateGovernance, wipeMemory } = useSettings();
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [tempKey, setTempKey] = useState('');

    const handleUpdateKey = async () => {
        if (!tempKey.trim()) return;
        await updateSettings({ apiKey: tempKey.trim() });
        setTempKey('');
        setStatus('idle');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🔒 API Key Updated' } }, '*');
    };

    const handleTestConnection = async () => {
        // Use the key from settings (which might be null if not loaded yet, but UI disables button if so?)
        // Actually, settings.apiKey is the decrypted key if session is active.
        if (!settings.apiKey) return;

        setStatus('testing');
        try {
            // Use the hardened GeminiService directly
            const ai = new GeminiService(settings.apiKey);
            // Simple ping prompt
            await ai.generate('Ping. Reply with Pong only.', { tier: 'LITE' });
            setStatus('success');
        } catch (e) {
            console.error("Connection Test Failed:", e);
            setStatus('error');
        }
    };

    const StatusIcon = () => {
        switch (status) {
            case 'testing': return <Zap className="animate-pulse text-warning" size={14} />;
            case 'success': return <CheckCircle className="text-success" size={14} />;
            case 'error': return <XCircle className="text-error" size={14} />;
            default: return <Zap className="text-text-muted" size={14} />;
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8 pb-20 fade-in">
            {/* Header */}
            <header className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                    <SettingsIcon size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white font-display uppercase tracking-tight">
                        Vibe <span className="text-primary">Config</span>
                    </h1>
                    <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] opacity-60">
                        System Control Center
                    </p>
                </div>
            </header>

            {/* 1. Engine Configuration */}
            <Card>
                <SectionHeader icon={BrainCircuit} title="Neural Engine" subtitle="API Authorization & Tier Selection" />

                <div className="space-y-4">
                    {/* API Key Display */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-3">
                            <Key size={14} className="text-primary/70" />
                            <span className="text-[10px] font-mono text-text-muted">
                                {settings.apiKey ? `••••••••${settings.apiKey.slice(-5)}` : 'UNKNOWN'}
                            </span>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${settings.apiKey ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            {settings.apiKey ? 'Authenticated' : 'Missing Key'}
                        </div>
                    </div>

                    {/* Input & Test */}
                    <div className="flex gap-2">
                        <input
                            type="password"
                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/20 focus:border-primary/50 outline-none transition-all"
                            placeholder="Enter Gemini API Key..."
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                        />
                        <button
                            onClick={handleUpdateKey}
                            disabled={!tempKey}
                            className="px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-white/10 disabled:opacity-30 transition-all"
                        >
                            Update
                        </button>
                    </div>

                    {settings.apiKey && (
                        <button
                            onClick={handleTestConnection}
                            disabled={status === 'testing'}
                            className="w-full py-2.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            <StatusIcon />
                            <span className="text-[10px] font-bold text-primary group-hover:tracking-widest transition-all">
                                {status === 'testing' ? 'Handshaking...' : 'Test Connection'}
                            </span>
                        </button>
                    )}

                    {/* Tier Selector */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                        {(['AUTO', 'LITE', 'SMART'] as const).map(tier => (
                            <button
                                key={tier}
                                onClick={() => updateSettings({ modelTier: tier })}
                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${settings.modelTier === tier
                                    ? 'bg-secondary/10 border-secondary text-secondary'
                                    : 'bg-transparent border-transparent hover:bg-white/5 text-text-muted'
                                    }`}
                            >
                                {tier === 'AUTO' && <Sparkles size={14} />}
                                {tier === 'LITE' && <Zap size={14} />}
                                {tier === 'SMART' && <BrainCircuit size={14} />}
                                <span className="text-[9px] font-bold uppercase">{tier}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* 2. Token Standards */}
            <Card>
                <SectionHeader icon={FileCode} title="Token Standards" subtitle="Generation Formats & Conventions" />

                <div className="space-y-6">
                    {/* Format */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-text-muted/80 uppercase font-bold">Output Format</label>
                        <div className="flex flex-wrap gap-2">
                            {(['JSON', 'CSS', 'SCSS', 'Swift'] as OutputFormat[]).map(fmt => (
                                <Chip
                                    key={fmt}
                                    label={fmt}
                                    active={settings.standards.outputFormat === fmt}
                                    onClick={() => updateStandard('outputFormat', fmt)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Naming */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-text-muted/80 uppercase font-bold">Naming Convention</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['kebab-case', 'camelCase', 'snake_case', 'PascalCase'] as NamingConvention[]).map(nc => (
                                <button
                                    key={nc}
                                    onClick={() => updateStandard('namingConvention', nc)}
                                    className={`px-3 py-2 text-xs rounded-lg border text-left font-mono transition-all ${settings.standards.namingConvention === nc
                                        ? 'bg-primary/10 border-primary/50 text-white'
                                        : 'bg-black/20 border-white/5 text-text-muted hover:border-white/20'
                                        }`}
                                >
                                    {nc}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Space */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-text-muted/80 uppercase font-bold">Color Space</label>
                        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
                            {(['HSL', 'RGB', 'OKLCH'] as ColorSpace[]).map(cs => (
                                <button
                                    key={cs}
                                    onClick={() => updateStandard('colorSpace', cs)}
                                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold transition-all ${settings.standards.colorSpace === cs
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'text-text-muted hover:text-white'
                                        }`}
                                >
                                    {cs}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Governance */}
            <Card>
                <SectionHeader icon={ShieldCheck} title="Governance" subtitle="Consistency & Accessibility Gates" />

                <div className="space-y-6">
                    {/* WCAG Level */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="text-xs text-white font-medium">Accessibility Target</div>
                            <div className="text-[9px] text-text-muted">Minimum contrast ratio compliance</div>
                        </div>
                        <div className="flex p-0.5 bg-black/40 rounded-lg border border-white/5">
                            {(['AA', 'AAA'] as const).map(level => (
                                <button
                                    key={level}
                                    onClick={() => updateGovernance('accessibilityLevel', level)}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-bold transition-all ${settings.governance.accessibilityLevel === level
                                        ? 'bg-success/20 text-success shadow-sm'
                                        : 'text-text-muted/50'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Semantic Strictness Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-text-muted">
                            <span>Loose</span>
                            <span>Semantic Strictness</span>
                            <span>Strict</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={settings.governance.semanticStrictness}
                            onChange={(e) => updateGovernance('semanticStrictness', parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(255,46,224,0.5)]"
                        />
                        <p className="text-[9px] text-text-muted text-center italic">
                            {settings.governance.semanticStrictness < 30 ? 'Allow raw values (Hex/RGB) in tokens' :
                                settings.governance.semanticStrictness > 80 ? 'Force strict aliasing (System -> Reference -> Base)' :
                                    'Balanced aliasing approach'}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Danger Zone */}
            <button
                onClick={wipeMemory}
                className="w-full mt-8 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/40 transition-all group flex items-center justify-center gap-3"
            >
                <Trash2 size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wide">Emergency Reset</div>
                    <div className="text-[9px] text-red-400/60">Clear all local storage and cache</div>
                </div>
            </button>

            <footer className="text-center pt-8 pb-4 opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[9px] font-mono text-text-muted">VIBE.SYSTEM.SETTINGS_MODULE // v4.2.0</p>
            </footer>
        </div>
    );
}
