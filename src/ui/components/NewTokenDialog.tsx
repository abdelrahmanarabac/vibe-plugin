import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Palette, Wand2, ArrowLeftRight, Paintbrush } from 'lucide-react';
import { vibeColor } from '../../features/naming/ColorNamer';
import { VibeColorPicker } from './ColorPicker';

interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: string; extensions?: any }) => void;
}

type TokenType = 'color' | 'spacing' | 'radius' | 'number' | 'string';
type ColorScope = 'single' | 'scale';

export function NewTokenDialog({ isOpen, onClose, onSubmit }: NewTokenDialogProps) {
    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<TokenType>('color');
    const [value, setValue] = useState('#6E62E5');

    // Namer State
    const [isAutoNaming, setIsAutoNaming] = useState(false);

    // Color Context
    const [colorScope, setColorScope] = useState<ColorScope>('single');

    // Spacing Context
    const [spacingRatio, setSpacingRatio] = useState<number | 'custom'>('custom');

    // Naming Logic
    const handleAutoName = () => {
        setIsAutoNaming(true);
        setTimeout(() => {
            if (type === 'color') {
                const generatedName = vibeColor.name(value);
                setName(generatedName === 'unknown' ? 'custom-color' : generatedName.replace('~', ''));
            } else if (type === 'spacing') {
                setName(`space-${String(value).replace('.', '-')}`);
            }
            setIsAutoNaming(false);
        }, 600); // Fake delay for UX "Thinking" feel
    };

    const handleTypeChange = (newType: string) => {
        const t = newType as TokenType;
        setType(t);
        // Defaults
        if (t === 'color') setValue('#6E62E5');
        if (t === 'spacing') setValue('4');
        if (t === 'radius') setValue('8');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && value) {
            onSubmit({
                name,
                type,
                value,
                extensions: {
                    scope: type === 'color' ? colorScope : undefined,
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
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl overflow-hidden"
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
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider">Token Name</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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

                    {/* 3. Classification (Split Row) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider">Classification</label>
                            <select
                                value={type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-3 py-3 text-sm text-white focus:border-white/20 outline-none appearance-none cursor-pointer"
                            >
                                <option value="color">Color</option>
                                <option value="spacing">Spacing</option>
                                <option value="radius">Radius</option>
                                <option value="number">Number</option>
                                <option value="string">String</option>
                            </select>
                        </div>

                        {/* Context Config (Dynamic) */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between">
                                {type === 'color' ? 'Scope / Extent' : 'Configuration'}
                                {type === 'color' && <ArrowLeftRight size={10} />}
                            </label>

                            {type === 'color' ? (
                                <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setColorScope('single')}
                                        className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all ${colorScope === 'single' ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                    >
                                        Single
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setColorScope('scale')}
                                        className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all ${colorScope === 'scale' ? 'bg-[#2E2E2E] text-white shadow-sm' : 'text-text-dim hover:text-white'}`}
                                    >
                                        50-950
                                    </button>
                                </div>
                            ) : type === 'spacing' ? (
                                <div className="flex bg-[#1A1A1A] rounded-xl p-1 border border-white/5">
                                    {[4, 8].map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => { setSpacingRatio(r); setValue(String(r)); }}
                                            className={`w-8 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all ${spacingRatio === r ? 'bg-[#2E2E2E] text-white' : 'text-text-dim hover:text-white'}`}
                                        >
                                            {r}px
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setSpacingRatio('custom')}
                                        className={`flex-1 flex items-center justify-center py-2 text-[10px] font-bold rounded-lg transition-all ${spacingRatio === 'custom' ? 'bg-[#2E2E2E] text-white' : 'text-text-dim hover:text-white'}`}
                                    >
                                        Custom
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[42px] px-3 border border-white/5 rounded-xl bg-white/[0.02] text-[10px] text-text-dim">
                                    Standard Input
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Value Input */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider">Value Definition</label>
                        {type === 'color' ? (
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <VibeColorPicker value={value} onChange={setValue} />
                                </div>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="flex-1 bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-primary/50 outline-none uppercase"
                                />
                                {colorScope === 'scale' && (
                                    <div className="px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap">
                                        +9 Variants
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={type === 'spacing' && spacingRatio !== 'custom'}
                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-primary/50 outline-none disabled:opacity-50"
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
        </div>
    );
}
