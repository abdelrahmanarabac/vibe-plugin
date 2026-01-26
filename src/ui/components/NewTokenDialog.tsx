import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Wand2, ArrowLeftRight, Paintbrush, Smartphone, Tablet, Monitor, Scaling } from 'lucide-react';
<<<<<<< HEAD
import { vibeColor, type NamingResult } from '../../modules/perception/capabilities/naming/ColorNamer';
=======
import { vibeColor, type NamingResult } from '../../features/naming/ColorNamer';
>>>>>>> 703e0dd0de5fda5e7ebba74e5f09b2313a2d5f47
import { VibeColorPicker } from './ColorPicker';
import { VibeSelect } from './inputs/VibeSelect';

interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: any; extensions?: any }) => void;
}

type TokenType = 'color' | 'spacing' | 'sizing' | 'radius' | 'number' | 'string';
type ColorScope = 'single' | 'scale' | 'scale-custom';

export function NewTokenDialog({ isOpen, onClose, onSubmit }: NewTokenDialogProps) {
    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<TokenType>('color');
    const [value, setValue] = useState<string | { mobile: string, tablet: string, desktop: string }>('#6E62E5');
    const [activeModes, setActiveModes] = useState<('mobile' | 'tablet' | 'desktop')[]>(['mobile', 'tablet', 'desktop']);
    const [ratio, setRatio] = useState('1.5');

    // Namer State
    const [isAutoNaming, setIsAutoNaming] = useState(false);
    const [namingResult, setNamingResult] = useState<NamingResult | null>(null);

    // Color Context
    const [colorScope, setColorScope] = useState<ColorScope>('single');
    const [customRange, setCustomRange] = useState<[number, number]>([100, 400]);

    // Spacing Context - Legacy removed

    // Lifecycle
    React.useEffect(() => {
        if (isOpen) vibeColor.init();
    }, [isOpen]);

    // Naming Logic
    const handleAutoName = async () => {
        setIsAutoNaming(true);

        // Ensure color engine is ready
        if (type === 'color' && !vibeColor.isReady()) {
            await vibeColor.init();
        }

        setTimeout(() => {
            if (type === 'color' && typeof value === 'string') {
                const result = vibeColor.fullResult(value);
                setName(result.name === 'unknown' ? 'custom-color' : result.name.replace('~', ''));
                setNamingResult(result);
            } else if (['spacing', 'sizing', 'radius'].includes(type)) {
                setName(`${type}-responsive`);
            }
            setIsAutoNaming(false);
        }, 300); // Shorter delay since we might have awaited init
    };

    const handleTypeChange = (newType: string) => {
        const t = newType as TokenType;
        setType(t);
        // Defaults
        if (t === 'color') setValue('#6E62E5');
        // Default responsive object for spatial types
        if (['spacing', 'sizing', 'radius'].includes(t)) {
            setValue({ mobile: '4', tablet: '8', desktop: '12' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && value) {
            let finalName = name;

            // If creating a scale, strip numeric suffixes (e.g. "blue-500" -> "blue")
            // This ensures the backend creates "blue/50" instead of "blue-500/50"
            if (type === 'color' && colorScope.startsWith('scale')) {
                finalName = finalName.replace(/[-_ ]?\d+$/, '');
            }

            onSubmit({
                name: finalName,
                type,
                value,
                extensions: {
                    scope: type === 'color' ? colorScope : undefined,
                    range: (type === 'color' && colorScope === 'scale-custom') ? customRange : undefined,
                    ratio: ['spacing', 'sizing', 'radius'].includes(type) ? ratio : undefined
                }
            });
            // Reset
            setName('');
            setValue('#6E62E5');
            setType('color');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl"
            >
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display tracking-tight">
                        <div className="p-1 rounded-md bg-primary/10 text-primary">
                            <Palette size={14} />
                        </div>
                        Create Token
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Magic Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                            Token Name
                            {namingResult && namingResult.source !== 'algo_fallback' && (
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${namingResult.confidence > 0.9 ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {namingResult.source === 'exact' ? 'Exact Match' : `${Math.round(namingResult.confidence * 100)}% Match`}
                                </span>
                            )}
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNamingResult(null); // Clear confidence if user edits
                                }}
                                placeholder="e.g. primary-500"
                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                autoFocus
                            />
                            {/* Auto Magic Button */}
                            <button
                                type="button"
                                onClick={handleAutoName}
                                disabled={isAutoNaming}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-primary transition-all disabled:opacity-50"
                                title="Auto-Generate Name"
                            >
                                <Wand2 size={14} className={isAutoNaming ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* 3. Classification (Conditional Layout) */}
                    <div className={['number', 'string'].includes(type) ? "space-y-4" : "grid grid-cols-2 gap-4"}>
                        {/* Type Selection */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Type</label>
                            <div className="">
                                <VibeSelect
                                    value={type}
                                    onChange={(val) => handleTypeChange(val)}
                                    options={[
                                        { label: 'Color', value: 'color' },
                                        { label: 'Spacing', value: 'spacing' },
                                        { label: 'Sizing', value: 'sizing' },
                                        { label: 'Radius', value: 'radius' },
                                        { label: 'Number', value: 'number' },
                                        { label: 'String', value: 'string' },
                                    ]}
                                    className="w-full h-[46px]"
                                />
                            </div>
                        </div>

                        {/* Context Config (Dynamic) - Hide completely if number/string */}
                        {!['number', 'string'].includes(type) && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                                    {type === 'color' && 'Scope / Extent'}
                                    {type === 'radius' && 'Corner'}
                                    {type === 'spacing' && 'Scale'}
                                    {type === 'color' && <ArrowLeftRight size={10} />}
                                </label>

                                {type === 'color' ? (
                                    <div className="space-y-3">
                                        <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5 h-[46px] items-center">
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('single')}
                                                className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all h-full ${colorScope === 'single' ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Single
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('scale')}
                                                className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all h-full ${colorScope === 'scale' ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Scale
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('scale-custom')}
                                                className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all h-full ${colorScope === 'scale-custom' ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Range
                                            </button>
                                        </div>

                                        {/* Custom Range Inputs */}
                                        <AnimatePresence>
                                            {colorScope === 'scale-custom' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex gap-2 items-center px-1">
                                                        <div className="flex-1 space-y-1">
                                                            <label className="text-[9px] font-bold text-text-dim ml-1">START (e.g. 100)</label>
                                                            <input
                                                                type="number"
                                                                value={customRange[0]}
                                                                onChange={e => setCustomRange([parseInt(e.target.value), customRange[1]])}
                                                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                                                step={50}
                                                                min={50}
                                                                max={950}
                                                            />
                                                        </div>
                                                        <div className="text-white/20 pt-4">→</div>
                                                        <div className="flex-1 space-y-1">
                                                            <label className="text-[9px] font-bold text-text-dim ml-1">END (e.g. 400)</label>
                                                            <input
                                                                type="number"
                                                                value={customRange[1]}
                                                                onChange={e => setCustomRange([customRange[0], parseInt(e.target.value)])}
                                                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                                                step={50}
                                                                min={50}
                                                                max={950}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5 items-center gap-1 h-[46px]">
                                        {/* Device Toggles */}
                                        {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => {
                                                    const newModes = activeModes.includes(mode)
                                                        ? activeModes.filter(m => m !== mode)
                                                        : [...activeModes, mode];
                                                    if (newModes.length > 0) setActiveModes(newModes);
                                                }}
                                                className={`p-2 h-full flex items-center justify-center rounded-lg transition-all ${activeModes.includes(mode) ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                                title={`Toggle ${mode}`}
                                            >
                                                {mode === 'mobile' && <Smartphone size={14} />}
                                                {mode === 'tablet' && <Tablet size={14} />}
                                                {mode === 'desktop' && <Monitor size={14} />}
                                            </button>
                                        ))}
                                        <div className="w-px h-4 bg-white/10 mx-1" />
                                        {/* Ratio Input */}
                                        <div className="flex items-center gap-2 px-2 h-full">
                                            <input
                                                type="text"
                                                value={ratio}
                                                onChange={(e) => setRatio(e.target.value)}
                                                className="w-8 bg-transparent text-xs text-white font-mono outline-none text-center"
                                                placeholder="1.5"
                                            />
                                            <div className="text-text-dim">
                                                <Scaling size={12} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 4. Value Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Value</label>
                        {type === 'color' ? (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <VibeColorPicker
                                        value={typeof value === 'string' ? value : '#000000'}
                                        onChange={(val) => setValue(val)}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={typeof value === 'string' ? value : ''}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all uppercase"
                                />
                                {colorScope.startsWith('scale') && (
                                    <div className="px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap">
                                        {colorScope === 'scale-custom'
                                            ? `+${Math.floor((customRange[1] - customRange[0]) / 100) + 1} Variants`
                                            : '+11 Variants'}
                                    </div>
                                )}
                            </div>
                        ) : ['radius', 'spacing', 'sizing'].includes(type) ? (
                            <div className="flex gap-2">
                                {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                                    activeModes.includes(mode) && (
                                        <div key={mode} className="flex-1 relative group">
                                            <input
                                                type="number"
                                                value={typeof value === 'object' ? (value as any)[mode] : value}
                                                onChange={(e) => {
                                                    const current = typeof value === 'object' ? value : { mobile: value, tablet: value, desktop: value };
                                                    setValue({ ...(current as any), [mode]: e.target.value });
                                                }}
                                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl pl-4 pr-9 py-3 text-sm text-white font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                                                placeholder={mode === 'mobile' ? "4" : mode === 'tablet' ? "8" : "12"}
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors pointer-events-none">
                                                {mode === 'mobile' && <Smartphone size={14} />}
                                                {mode === 'tablet' && <Tablet size={14} />}
                                                {mode === 'desktop' && <Monitor size={14} />}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={typeof value === 'object' ? '' : value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
                            />
                        )}
                    </div>

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Token
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}
