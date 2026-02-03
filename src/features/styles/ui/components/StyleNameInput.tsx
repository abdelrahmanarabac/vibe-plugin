import React from 'react';

interface StyleNameInputProps {
    name: string;
    onNameChange: (val: string) => void;
}

export const StyleNameInput: React.FC<StyleNameInputProps> = ({ name, onNameChange }) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                Style Name
            </label>
            <div className="relative group">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="e.g. H1 / Bold"
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                    autoFocus
                />
            </div>
        </div>
    );
};
