import { useState } from 'react';
import { ScaleGenerator, type ColorScaleStep } from '../../modules/creation/ScaleGenerator';
import { AIOrchestrator } from '../../modules/ai/AIOrchestrator';
import { clsx } from 'clsx';
import { loadAPIKey } from '../../infra/CryptoService';

export function ScaleGeneratorUI() {
    const [baseColor, setBaseColor] = useState('#6366F1');
    const [scaleName, setScaleName] = useState('primary');
    const [scale, setScale] = useState<ColorScaleStep[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);

    // Load API key on mount
    useState(() => {
        loadAPIKey().then(key => setApiKey(key));
    });

    const handleGenerate = async () => {
        if (!apiKey) {
            console.error('No API key available');
            return;
        }

        setLoading(true);
        try {
            const orchestrator = new AIOrchestrator(apiKey);
            const generator = new ScaleGenerator(orchestrator);
            const result = await generator.generateScale(baseColor, scaleName);
            setScale(result);
        } catch (error) {
            console.error('Scale generation failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Values Scale Generator</h3>

            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <label className="text-xs text-slate-500">Base Color</label>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            value={baseColor}
                            onChange={(e) => setBaseColor(e.target.value)}
                            className="h-9 w-9 bg-transparent border-0 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={baseColor}
                            onChange={(e) => setBaseColor(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded px-2 text-sm font-mono text-white"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <label className="text-xs text-slate-500">Token Name</label>
                    <input
                        type="text"
                        value={scaleName}
                        onChange={(e) => setScaleName(e.target.value)}
                        className="w-full h-9 bg-black/40 border border-white/10 rounded px-2 text-sm text-white"
                    />
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={loading}
                className={clsx(
                    "w-full py-2 rounded font-semibold text-xs uppercase tracking-wide transition-all",
                    loading
                        ? "bg-slate-800 text-slate-500 cursor-wait"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                )}
            >
                {loading ? 'Generating Harmonics...' : 'Generate Scale'}
            </button>

            {scale.length > 0 && (
                <div className="space-y-1 mt-4">
                    {scale.map((step) => (
                        <div key={step.name} className="flex items-center gap-3 text-xs">
                            <div
                                className="w-8 h-8 rounded shadow-inner"
                                style={{ backgroundColor: step.hex }}
                            />
                            <div className="flex-1 font-mono text-slate-400">
                                <span className="text-white font-bold mr-2">{step.name}</span>
                                {step.hex}
                            </div>
                            <div className="flex flex-col text-[10px] text-right text-slate-600">
                                <span title="Contrast on White">W: {step.contrastOnWhite.toFixed(1)}</span>
                                <span title="Contrast on Black">B: {step.contrastOnBlack.toFixed(1)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
