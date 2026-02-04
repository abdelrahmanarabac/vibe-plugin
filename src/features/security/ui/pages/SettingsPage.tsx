import { Settings, Trash2, ShieldCheck } from 'lucide-react';

export interface SettingsPageProps {
    onSave?: (key: string) => Promise<void>; // Kept for interface compatibility but unused
}

/**
 * ⚙️ Elite Settings Page
 * Configuration zone.
 * UPDATE: API Key management removed for Figma compliance.
 */
export function SettingsPage({ }: SettingsPageProps) {

    const handleClearCache = () => {
        parent.postMessage({ pluginMessage: { type: 'STORAGE_REMOVE', key: 'VIBE_MEMORY' } }, '*');
        parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: '🗑️ Cache Cleared' } }, '*');
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

            {/* Privacy / Security Badge */}
            <section className="bg-white/[0.02] border border-white/10 p-6 rounded-[32px]">
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} className="text-success" />
                    <div>
                        <h3 className="text-sm font-bold text-white">Privacy & Security</h3>
                        <p className="text-[10px] text-text-muted mt-1">
                            This plugin operates safely within the Figma environment.
                            External AI connections are disabled/managed by Figma Policy.
                        </p>
                    </div>
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
                        Vibe Engine v3.1.0 • Stable Build
                    </div>
                </footer>
            </div>
        </div>
    );
}
