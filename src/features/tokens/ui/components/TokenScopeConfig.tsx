import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tablet, Monitor, Scaling, ArrowLeftRight } from 'lucide-react';
import type { TokenType, ColorScope } from '../../domain/ui-types';
import { VibeSelect } from '../../../../components/shared/base/VibeSelect';

interface TokenScopeConfigProps {
    type: TokenType;
    colorScope: ColorScope;
    onColorScopeChange: (val: ColorScope) => void;
    customRange: [number, number];
    onCustomRangeChange: (val: [number, number]) => void;
    activeModes: ('mobile' | 'tablet' | 'desktop')[];
    onActiveModesChange: (modes: ('mobile' | 'tablet' | 'desktop')[]) => void;
    ratio: string;
    onRatioChange: (val: string) => void;
    className?: string; // For layout flexibility
}

const SCALE_OPTIONS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(v => ({ value: v, label: String(v) }));

export const TokenScopeConfig: React.FC<TokenScopeConfigProps> = ({
    type,
    colorScope,
    onColorScopeChange,
    customRange,
    onCustomRangeChange,
    activeModes,
    onActiveModesChange,
    ratio,
    onRatioChange,
    className
}) => {
    // If type doesn't support scope/context, render nothing
    if (['number', 'string'].includes(type)) return null;

    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-xxs font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                {type === 'color' && 'Scope / Extent'}
                {type === 'radius' && 'Corner'}
                {type === 'spacing' && 'Scale'}
                {type === 'color' && <ArrowLeftRight size={10} />}
            </label>

            {type === 'color' ? (
                <div className="space-y-3">
                    <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-2 h-11 items-center">
                        {(['single', 'scale', 'scale-custom'] as const).map((scopeOption) => (
                            <button
                                key={scopeOption}
                                type="button"
                                onClick={() => onColorScopeChange(scopeOption)}
                                className={`flex-1 flex items-center justify-center py-2 text-xxs font-bold rounded-lg transition-all h-full ${colorScope === scopeOption ? 'bg-surface-2 text-text-primary shadow-sm' : 'text-text-dim hover:text-text-primary'}`}
                            >
                                {scopeOption === 'scale-custom' ? 'Range' : scopeOption.charAt(0).toUpperCase() + scopeOption.slice(1)}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {colorScope === 'scale-custom' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                                animate={{
                                    height: 'auto',
                                    opacity: 1,
                                    transitionEnd: { overflow: 'visible' }
                                }}
                                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                            >
                                <div className="flex gap-2 items-center px-1 pb-1 pt-2">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1 block">Start</label>
                                        <VibeSelect<number>
                                            value={customRange[0]}
                                            onChange={(val) => onCustomRangeChange([val, customRange[1]])}
                                            options={SCALE_OPTIONS}
                                            size="sm"
                                        />
                                    </div>
                                    <div className="text-text-dim/20 pt-5">→</div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider ml-1 block">End</label>
                                        <VibeSelect<number>
                                            value={customRange[1]}
                                            onChange={(val) => onCustomRangeChange([customRange[0], val])}
                                            options={SCALE_OPTIONS}
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex bg-surface-1 rounded-xl p-1 border border-surface-2 items-center gap-1 h-11">
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
                            className={`p-2 h-full flex items-center justify-center rounded-lg transition-all ${activeModes.includes(mode) ? 'bg-surface-2 text-text-primary shadow-sm' : 'text-text-dim hover:text-text-primary'}`}
                            title={`Toggle ${mode}`}
                        >
                            {mode === 'mobile' && <Smartphone size={14} />}
                            {mode === 'tablet' && <Tablet size={14} />}
                            {mode === 'desktop' && <Monitor size={14} />}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-surface-3 mx-1" />
                    <div className="flex items-center gap-2 px-2 h-full">
                        <input
                            type="text"
                            value={ratio}
                            onChange={(e) => onRatioChange(e.target.value)}
                            className="w-8 bg-transparent text-xs text-text-primary font-mono outline-none text-center"
                            placeholder="1.5"
                        />
                        <div className="text-text-dim"><Scaling size={12} /></div>
                    </div>
                </div>
            )}
        </div>
    );
};
