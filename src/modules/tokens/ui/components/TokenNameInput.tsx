import React from 'react';
import { Wand2 } from 'lucide-react';
import type { NamingResult } from '../../../perception/capabilities/naming/ColorNamer';

interface TokenNameInputProps {
    name: string;
    onNameChange: (val: string) => void;
    onAutoName: () => void;
    isAutoNaming: boolean;
    namingResult: NamingResult | null;
}

export const TokenNameInput: React.FC<TokenNameInputProps> = ({
    name,
    onNameChange,
    onAutoName,
    isAutoNaming,
    namingResult
}) => {
    return (
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
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. primary-500"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                    autoFocus
                />
                <button
                    type="button"
                    onClick={onAutoName}
                    disabled={isAutoNaming}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-primary transition-all disabled:opacity-50"
                    title="Auto-Generate Name"
                >
                    <Wand2 size={14} className={isAutoNaming ? "animate-spin" : ""} />
                </button>
            </div>
        </div>
    );
};
