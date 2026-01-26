import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Scaling, ArrowLeftRight } from 'lucide-react';
import { VibeSelect } from '../../../../ui/components/inputs/VibeSelect';
import type { TokenType, ColorScope } from '../../domain/ui-types';

interface TokenScopeSelectProps {
    type: TokenType;
    onTypeChange: (val: string) => void;
    colorScope: ColorScope;
    onColorScopeChange: (val: ColorScope) => void;
    customRange: [number, number];
    onCustomRangeChange: (val: [number, number]) => void;
    activeModes: ('mobile' | 'tablet' | 'desktop')[];
    onActiveModesChange: (modes: ('mobile' | 'tablet' | 'desktop')[]) => void;
    ratio: string;
    onRatioChange: (val: string) => void;
}

export const TokenScopeSelect: React.FC<TokenScopeSelectProps> = ({
    type,
    onTypeChange,
    colorScope,
    onColorScopeChange,
    customRange,
    onCustomRangeChange,
    activeModes,
    onActiveModesChange,
    ratio,
    onRatioChange,
}) => {
    return (
        <div className={['number', 'string'].includes(type) ? "space-y-4" : "grid grid-cols-2 gap-4"}>
            {/* Type Selection */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Type</label>
                <div className="">
                    <VibeSelect
                        value={type}
                        onChange={onTypeChange}
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
            </div>

            {/* Context Config */}
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
                                {(['single', 'scale', 'scale-custom'] as const).map((scopeOption) => (
                                    <button
                                        key={scopeOption}
                                        type="button"
                                        onClick={() => onColorScopeChange(scopeOption)}
                                        className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all h-full ${colorScope === scopeOption ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                    >
                                        {scopeOption === 'scale-custom' ? 'Range' : scopeOption.charAt(0).toUpperCase() + scopeOption.slice(1)}
                                    </button>
                                ))}
                            </div>

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
                                                <label className="text-[9px] font-bold text-text-dim ml-1">START</label>
                                                <input
                                                    type="number"
                                                    value={customRange[0]}
                                                    onChange={e => onCustomRangeChange([parseInt(e.target.value), customRange[1]])}
                                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                                    step={50} min={50} max={950}
                                                />
                                            </div>
                                            <div className="text-white/20 pt-4">→</div>
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-bold text-text-dim ml-1">END</label>
                                                <input
                                                    type="number"
                                                    value={customRange[1]}
                                                    onChange={e => onCustomRangeChange([customRange[0], parseInt(e.target.value)])}
                                                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                                    step={50} min={50} max={950}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5 items-center gap-1 h-[46px]">
                            {(['mobile', 'tablet', 'desktop'] as const).map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => {
                                        const newModes = activeModes.includes(mode)
                                            ? activeModes.filter(m => m !== mode)
                                            : [...activeModes, mode];
                                        if (newModes.length > 0) onActiveModesChange(newModes);
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
                            <div className="flex items-center gap-2 px-2 h-full">
                                <input
                                    type="text"
                                    value={ratio}
                                    onChange={(e) => onRatioChange(e.target.value)}
                                    className="w-8 bg-transparent text-xs text-white font-mono outline-none text-center"
                                    placeholder="1.5"
                                />
                                <div className="text-text-dim"><Scaling size={12} /></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
