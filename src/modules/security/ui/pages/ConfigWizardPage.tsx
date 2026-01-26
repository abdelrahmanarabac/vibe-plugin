import { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { VibeColorPicker } from '../../../tokens/ui/components/VibeColorPicker';
import { TypeHierarchyPreview } from '../../../tokens/ui/components/preview/TypeHierarchyPreview';

interface ConfigWizardProps {
    onComplete: () => void;
}

/**
 * ⚡ ConfigWizard
 * The onboarding experience for Vibe Plugin.
 * Guides users through branding, typography, and system generation.
 */
export const ConfigWizard = ({ onComplete }: ConfigWizardProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { config, updateConfig } = useConfig();

    const totalSteps = 3;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return 'Branding Strategy';
            case 2: return 'Typography Genesis';
            case 3: return 'Neural Synthesis';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col h-full bg-void text-text-primary p-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="shrink-0 mb-10">
                <header className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">
                        {getStepTitle()}
                    </h2>
                    <div className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        Step 0{currentStep} / 0{totalSteps}
                    </div>
                </header>

                <div className="flex items-center gap-2">
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
                            <div
                                className={`h-full transition-all duration-700 ease-out ${i + 1 <= currentStep ? 'bg-gradient-to-r from-primary to-secondary shadow-glow-primary' : 'bg-transparent'}`}
                                style={{ width: i + 1 <= currentStep ? '100%' : '0%' }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <section className="space-y-3">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">System Identity</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-text-dim/30 font-bold"
                                value={config.metadata.name}
                                onChange={(e) => updateConfig({
                                    metadata: { ...config.metadata, name: e.target.value }
                                })}
                                placeholder="e.g. Acme Design Language"
                            />
                        </section>

                        <section className="space-y-3">
                            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Primary Signature</label>
                            <div className="flex items-center gap-6 bg-white/[0.02] p-6 rounded-[32px] border border-white/5">
                                <VibeColorPicker
                                    value={config.brand.primaryColor}
                                    onChange={(color: string) => updateConfig({
                                        brand: { ...config.brand, primaryColor: color }
                                    })}
                                />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white mb-1">Brand Main</span>
                                    <span className="text-[11px] text-text-dim font-mono">{config.brand.primaryColor}</span>
                                    <p className="text-[10px] text-text-dim mt-2 italic opacity-60">
                                        ⚡ Generates a full 10-stop functional scale.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <section className="space-y-3">
                            <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Family</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-primary/50 outline-none appearance-none cursor-pointer font-bold"
                                value={config.typography.fontFamily}
                                onChange={(e) => updateConfig({
                                    typography: { ...config.typography, fontFamily: e.target.value }
                                })}
                            >
                                <option value="Inter">Inter</option>
                                <option value="Roboto">Roboto</option>
                                <option value="Poppins">Poppins</option>
                                <option value="Outfit">Outfit</option>
                            </select>
                        </section>

                        <section className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Scale Intensity</label>
                                <span className="text-[10px] font-mono text-secondary font-bold">{config.typography.scaleRatio.toFixed(3)}x</span>
                            </div>
                            <input
                                type="range"
                                min="1.125"
                                max="1.5"
                                step="0.025"
                                value={config.typography.scaleRatio}
                                onChange={(e) => updateConfig({
                                    typography: { ...config.typography, scaleRatio: parseFloat(e.target.value) }
                                })}
                                className="w-full accent-secondary h-1.5 bg-white/5 rounded-full"
                            />
                            <div className="flex justify-between text-[9px] text-text-dim font-bold uppercase tracking-tighter opacity-40">
                                <span>Compact</span>
                                <span>Experimental</span>
                                <span>Spacious</span>
                            </div>
                        </section>

                        <TypeHierarchyPreview
                            fontFamily={config.typography.fontFamily}
                            scaleRatio={config.typography.scaleRatio}
                            baseSize={config.typography.baseSize}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-500">
                        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[40px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />

                            <h3 className="text-lg font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-glow-emerald" />
                                Ready for Deployment
                            </h3>

                            <div className="space-y-4">
                                <SummaryItem label="Domain" value={config.metadata.name} />
                                <SummaryItem label="Primary" value={config.brand.primaryColor} isMono />
                                <SummaryItem label="Typeface" value={config.typography.fontFamily} />
                                <SummaryItem label="Genetic Scale" value={`${config.typography.scaleRatio} Ratio`} />
                            </div>

                            <p className="mt-8 text-[11px] text-text-dim text-center opacity-60 leading-relaxed font-medium">
                                This procedure will generate <span className="text-primary font-black">95+ design tokens</span> and <span className="text-secondary font-black">12 atomic text styles</span> tailored to your signature.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <footer className="shrink-0 mt-8 flex flex-col gap-4">
                <div className="flex gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={handleBack}
                            className="flex-1 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-[0.2em] transition-all"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className={`flex-[2] bg-gradient-to-r from-primary to-secondary text-void rounded-2xl py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] hover:shadow-glow-primary active:scale-[0.98] ${currentStep === 1 ? 'w-full' : ''}`}
                    >
                        {currentStep < totalSteps ? 'Next Protocol' : 'Synthesize System ⚡'}
                    </button>
                </div>
                <div className="text-[9px] text-center text-text-dim font-bold uppercase tracking-[0.3em] opacity-30 px-8">
                    Vibe Initialization Protocol • Secured Section L7
                </div>
            </footer>
        </div>
    );
};

const SummaryItem = ({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) => (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[10px] font-black text-text-dim uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-bold text-white ${isMono ? 'font-mono text-primary' : ''}`}>{value}</span>
    </div>
);
