import { useState } from 'react';
import type { TokenEntity } from '../../core/types';
import { clsx } from 'clsx';

interface TokenTreeProps {
    tokens: TokenEntity[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

// Simplified Tree Item for MVP (Flat list with indentation simulation or just flat for now)
// In a real generic graph, we'd need to deduce hierarchy from names (primary/50, primary/100).

export function TokenTree({ tokens, selectedId, onSelect }: TokenTreeProps) {
    // Simple grouping by name "prefix" (first segment)
    const groups = tokens.reduce((acc, token) => {
        const groupName = token.name.split(/[\/-]/)[0] || 'Uncategorized';
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(token);
        return acc;
    }, {} as Record<string, TokenEntity[]>);

    return (
        <div className="space-y-1">
            {Object.entries(groups).map(([groupName, groupTokens]) => (
                <TokenGroup
                    key={groupName}
                    name={groupName}
                    tokens={groupTokens}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}

function TokenGroup({ name, tokens, selectedId, onSelect }: { name: string, tokens: TokenEntity[], selectedId: string | null, onSelect: (id: string) => void }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-white uppercase tracking-wider hover:bg-white/5 rounded transition-all"
            >
                <span className={`transform transition-transform mr-2 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                {name} <span className="ml-auto opacity-40 font-normal normal-case text-[10px]">{tokens.length}</span>
            </button>

            {isOpen && (
                <div className="ml-2 pl-2 border-l border-white/5 space-y-0.5 mt-1">
                    {tokens.map(token => (
                        <div
                            key={token.id}
                            onClick={() => onSelect(token.id)}
                            className={clsx(
                                "flex items-center px-2 py-1.5 rounded cursor-pointer text-xs transition-colors group",
                                selectedId === token.id
                                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            <TokenIcon type={token.$type} value={token.$value} />
                            <span className="truncate">{token.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TokenIcon({ type, value }: { type: string, value: string | number }) {
    if (type === 'color') {
        return (
            <div
                className="w-3 h-3 rounded-full mr-2 border border-white/10 shadow-sm"
                style={{ backgroundColor: String(value) }}
            />
        );
    }
    return (
        <div className="w-3 h-3 rounded mr-2 bg-slate-700 flex items-center justify-center text-[8px] font-mono text-slate-300">
            #
        </div>
    );
}
