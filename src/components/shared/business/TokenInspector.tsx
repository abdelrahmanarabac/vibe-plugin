import React from 'react';
import { Surface } from '../base/Surface';
import type { TokenPickerItem } from '../base/VibePathPicker';

interface TokenInspectorProps {
    token: TokenPickerItem;
    className?: string;
}

export const TokenInspector: React.FC<TokenInspectorProps> = ({ token, className }) => {
    return (
        <Surface
            level={2}
            className={`p-3 w-64 border border-white/10 shadow-xl shadow-black/50 overflow-hidden ${className}`}
        >
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-text-primary truncate">{token.name}</h4>
                        <p className="text-[10px] text-text-dim truncate font-mono">{token.fullPath}</p>
                    </div>
                </div>

                {/* Properties */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-text-dim">Type</span>
                        <span className="px-1.5 py-0.5 rounded bg-surface-3 text-text-bright font-mono text-[10px] uppercase">
                            {token.type}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 text-xs">
                        <span className="text-text-dim">Value</span>
                        <div className="p-2 rounded bg-surface-0 border border-white/5 font-mono text-text-primary break-all">
                            {typeof token.value === 'object'
                                ? JSON.stringify(token.value)
                                : String(token.value)}
                        </div>
                    </div>
                </div>
            </div>
        </Surface>
    );
};
