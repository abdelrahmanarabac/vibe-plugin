import React from 'react';

interface StyleDetailsInputProps {
    description: string;
    onDescriptionChange: (val: string) => void;
}

export const StyleDetailsInput: React.FC<StyleDetailsInputProps> = ({ description, onDescriptionChange }) => {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">
                Description / Value
            </label>
            <textarea
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all resize-none h-[80px]"
                placeholder="Optional description or initial value..."
            />
        </div>
    );
};
