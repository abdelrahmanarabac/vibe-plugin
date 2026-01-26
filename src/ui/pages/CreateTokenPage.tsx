import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Paintbrush, Settings, Sparkles } from 'lucide-react';
import { vibeColor, type NamingResult } from '../../modules/perception/capabilities/naming/ColorNamer';
import { VibeColorPicker } from '../components/ColorPicker';
import { VibeSelect } from '../components/inputs/VibeSelect';
import { VibeInput } from '../components/inputs/VibeInput';
import { VibePathPicker } from '../components/inputs/VibePathPicker';
import { useTokens } from '../hooks/useTokens';

// Local Type Definitions
type TokenType = 'color' | 'spacing' | 'sizing' | 'radius' | 'number' | 'string' | 'raduis';
type ColorScope = 'single' | 'scale' | 'scale-custom';

interface CreateTokenPageProps {
    onBack: () => void;
    onSubmit: (token: { name: string; type: TokenType; value: string | { mobile: string; tablet: string; desktop: string; }; extensions: { scope?: ColorScope; range?: [number, number]; ratio?: string; }; }) => void;
}

export function CreateTokenPage({ onBack, onSubmit }: CreateTokenPageProps) {
    const { tokens } = useTokens(); // Removed unused createToken
    // Reconstruct full path: Collection/Group/TokenName using the path array from repository
    const tokenNames = tokens.map(t => [...t.path, t.name].join('/'));

    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<TokenType>('color');
    const [value, setValue] = useState<string>('#6E62E5');
    const [colorScope, setColorScope] = useState<ColorScope>('single');
    const [customRange, setCustomRange] = useState<[number, number]>([100, 400]);

    // Place (Path) State
    const [place, setPlace] = useState('');

    // Namer State
    const [namingResult, setNamingResult] = useState<NamingResult | null>(null);

    // Lifecycle
    useEffect(() => {
        vibeColor.init();
    }, []);

    const handleTypeChange = (newType: string) => {
        const t = newType as TokenType;
        setType(t);
        // Defaults
        if (t === 'color') setValue('#6E62E5');
        // Default values for spatial types
        if (['spacing', 'sizing', 'radius'].includes(t)) {
            setValue('4');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name.trim()) return;

        // Combine Path + Name (e.g., "Brand/Colors" + "Primary" -> "Brand/Colors/Primary")
        const cleanPath = place.endsWith('/') ? place : (place ? `${place}/` : '');
        const fullName = `${cleanPath}${name}`;

        const tokenData = {
            name: fullName,
            type,
            value: type === 'color' && colorScope !== 'single' ? '#000000' : value,
            extensions: {
                scope: type === 'color' ? colorScope : undefined,
                range: (type === 'color' && colorScope === 'scale-custom') ? customRange : undefined,
            }
        };

        console.log('[CreatePage] Submitting:', tokenData);
        onSubmit(tokenData);
    };

    return (
        <div className="w-full h-full relative flex flex-col bg-[#09090b]">
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-2xl mx-auto px-6 py-6 pb-28 flex flex-col relative z-10">

                    {/* Top Bar: Back + Settings + Credits */}
                    <div className="w-full mb-6 flex items-center justify-between gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-text-dim hover:text-white transition-all group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold">Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button className="w-9 h-9 rounded-full flex items-center justify-center transition-all bg-surface-1 border border-white/5 text-text-dim hover:text-white hover:bg-surface-2">
                                <Settings size={16} />
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-1 border border-white/5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                                <span className="text-xs font-bold text-white font-mono">1,250</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Content (No Card) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full relative"
                    >
                        {/* Background Decor */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                            {/* 1. Identity Grid (Name & Place) - Unified Alignment */}
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                {/* Name Input */}
                                <div className="space-y-2 flex-1 w-full">
                                    <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center justify-between">
                                        Name
                                        {namingResult && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${namingResult.confidence > 0.8 ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                {Math.round(namingResult.confidence * 100)}% Match
                                            </span>
                                        )}
                                    </label>
                                    <VibeInput
                                        value={name}
                                        onChange={(val) => {
                                            setName(val);
                                            setNamingResult(null);
                                        }}
                                        placeholder="e.g. primary-500"
                                        size="md"
                                        autoFocus
                                        action={type === 'color' ? (
                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    const result = vibeColor.fullResult(typeof value === 'string' ? value : '#000000');
                                                    if (result) {
                                                        setName(result.name);
                                                        setNamingResult(result);
                                                    }
                                                }}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                                title="Auto-name with Magic Wand"
                                            >
                                                <motion.div
                                                    animate={{ rotate: 0 }}
                                                    whileTap={{ rotate: 360, transition: { duration: 0.5, ease: "easeOut" } }}
                                                >
                                                    <Sparkles size={14} />
                                                </motion.div>
                                            </motion.button>
                                        ) : undefined}
                                    />
                                </div>

                                {/* Path Input */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 flex items-center gap-1">
                                        Path
                                    </label>
                                    <VibePathPicker
                                        value={place}
                                        onChange={setPlace}
                                        placeholder="e.g. Brand/Colors"
                                        size="md"
                                        existingTokens={tokenNames}
                                    />
                                </div>
                            </div>

                            {/* 2. Type Selector & Scope (Row) - Unified Alignment */}
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                {/* Type Select */}
                                <div className="space-y-2 flex-1 w-full">
                                    <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1">Token Type</label>
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
                                        className="w-full"
                                    />
                                </div>

                                {/* Scope Controls (Moved Here) */}
                                {type === 'color' && (
                                    <div className="space-y-2 flex-1 w-full">
                                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1">Scope</label>
                                        <div className="flex bg-surface-2 rounded-xl p-1 border border-white/5 gap-1 h-[44px]">
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('single')}
                                                className={`flex-1 text-[10px] font-bold rounded-lg transition-all ${colorScope === 'single' ? 'bg-void text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Single
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('scale')}
                                                className={`flex-1 text-[10px] font-bold rounded-lg transition-all ${colorScope === 'scale' ? 'bg-void text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Scale
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setColorScope('scale-custom')}
                                                className={`flex-1 text-[10px] font-bold rounded-lg transition-all ${colorScope === 'scale-custom' ? 'bg-void text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                            >
                                                Range
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Spacing/Sizing Controls (Moved Here) */}
                                {['spacing', 'sizing', 'radius'].includes(type) && (
                                    <div className="space-y-2 flex-1 w-full">
                                        <div className="flex items-center gap-2 h-[44px]">
                                            <div className="flex items-center gap-2 px-3 bg-surface-2 rounded-xl h-full border border-white/5 w-full">
                                                <span className="text-white text-xs font-mono">{typeof value === 'string' ? value : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 3. Value Input (Contextual) */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider pl-1 font-mono">
                                    Value
                                </label>

                                {type === 'color' ? (
                                    <div className="space-y-4">
                                        {/* Color Picker + Hex Input - Balanced Alignment */}
                                        <div className="flex flex-col md:flex-row gap-4 items-end">
                                            <div className="border border-white/10 p-1 rounded-2xl bg-void/30">
                                                <VibeColorPicker
                                                    value={typeof value === 'string' ? value : '#000000'}
                                                    onChange={(val) => setValue(val)}
                                                />
                                            </div>
                                            <div className="flex-1 w-full space-y-3">
                                                <VibeInput
                                                    value={typeof value === 'string' ? value : ''}
                                                    onChange={(val) => setValue(val)}
                                                    placeholder="#6E62E5"
                                                    size="md"
                                                />

                                                {/* Custom Range Inputs */}
                                                <AnimatePresence>
                                                    {colorScope === 'scale-custom' && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <VibeInput
                                                                label="START"
                                                                type="number"
                                                                value={String(customRange[0])}
                                                                onChange={e => setCustomRange([parseInt(e), customRange[1]])}
                                                                size="sm"
                                                            />
                                                            <VibeInput
                                                                label="END"
                                                                type="number"
                                                                value={String(customRange[1])}
                                                                onChange={e => setCustomRange([customRange[0], parseInt(e)])}
                                                                size="sm"
                                                            />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Scale Info */}
                                                {colorScope.startsWith('scale') && (
                                                    <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                        Generates {colorScope === 'scale-custom'
                                                            ? `variants ${customRange[0]} to ${customRange[1]}`
                                                            : '11 scale variants (50-950)'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <VibeInput
                                            value={typeof value === 'string' ? value : ''}
                                            onChange={(val) => setValue(val)}
                                            placeholder="e.g. 100%"
                                            size="md"
                                        />
                                    </div>
                                )}
                            </div>

                        </form>
                    </motion.div>
                </div>
            </div>

            {/* 4. Action Bar (Sticky Bottom) */}
            <div className="w-full absolute bottom-0 left-0 p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent z-50 pointer-events-none flex justify-center">
                <div className="w-full max-w-2xl flex gap-4 pointer-events-auto">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 py-3.5 rounded-xl bg-surface-2/80 hover:bg-surface-2 backdrop-blur-md text-sm font-bold text-text-dim hover:text-white transition-colors border border-white/5"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any)}
                        className="flex-[2] py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-sm font-bold text-white shadow-[0_4px_20px_rgba(110,98,229,0.3)] hover:shadow-[0_4px_25px_rgba(110,98,229,0.5)] transition-all flex items-center justify-center gap-2 border border-white/10 group"
                    >
                        <Paintbrush size={16} />
                        <span>Create Token</span>
                        {type === 'color' && colorScope.startsWith('scale') && (
                            <span className="ml-1 px-2 py-0.5 rounded-md bg-white text-primary text-[10px] font-extrabold shadow-sm group-hover:scale-105 transition-transform">
                                {colorScope === 'scale-custom'
                                    ? `${customRange[0]} - ${customRange[1]}`
                                    : '50 - 950'}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
