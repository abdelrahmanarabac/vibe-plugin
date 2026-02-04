import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { VibeColorPicker } from './VibeColorPicker';
import type { TokenType, ColorScope, TokenModeValue } from '../../domain/ui-types';

interface TokenValueInputProps {
    type: TokenType;
    value: string | TokenModeValue;
    onValueChange: (val: string | TokenModeValue) => void;
    colorScope: ColorScope;
    customRange: [number, number];
    activeModes: ('mobile' | 'tablet' | 'desktop')[];
}

export const TokenValueInput: React.FC<TokenValueInputProps> = ({
    type,
    value,
    onValueChange,
    colorScope,
    customRange,
    activeModes
}) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Value</label>
            {type === 'color' ? (
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <VibeColorPicker
                            value={typeof value === 'string' ? value : '#000000'}
                            onChange={onValueChange}
                        />
                    </div>
                    <input
                        type="text"
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="flex-1 bg-surface-1 border border-surface-2 rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all uppercase"
                    />
                    {colorScope.startsWith('scale') && (
                        <div className="px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap">
                            {colorScope === 'scale-custom'
                                ? `+${Math.floor(Math.abs(customRange[1] - customRange[0]) / 100) + 1} Variants`
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
                                    value={typeof value === 'object' ? (value as TokenModeValue)[mode] : value}
                                    onChange={(e) => {
                                        const current = typeof value === 'object' ? value : { mobile: value, tablet: value, desktop: value };
                                        onValueChange({ ...current, [mode]: e.target.value });
                                    }}
                                    className="w-full bg-surface-1 border border-surface-2 rounded-xl pl-4 pr-9 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    onChange={(e) => onValueChange(e.target.value)}
                    className="w-full bg-surface-1 border border-surface-2 rounded-xl px-4 py-3 text-sm text-text-primary font-mono focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
                />
            )}
        </div>
    );
};
