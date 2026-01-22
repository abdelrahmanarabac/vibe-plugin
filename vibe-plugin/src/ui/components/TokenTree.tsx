import { useState } from 'react';
import type { TokenEntity, TokenType } from '../../core/types';
import { clsx } from 'clsx';
import { ChevronRight, Hash, Box } from 'lucide-react';

interface TokenTreeProps {
    tokens: TokenEntity[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

/**
 * 🌲 Elite Token Tree
 * Organizes tokens into expandable groups with high-contrast value display.
 */
export function TokenTree({ tokens, selectedId, onSelect }: TokenTreeProps) {
    // Grouping logic based on name hierarchy
    const groups = tokens.reduce((acc, token) => {
        const groupName = token.name.split(/[\/-]/)[0] || 'Uncategorized';
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(token);
        return acc;
    }, {} as Record<string, TokenEntity[]>);

    return (
        <div className="space-y-2 pb-4">
            {Object.entries(groups).map(([groupName, groupTokens]) => (
                <TokenGroup
                    key={groupName}
                    name={groupName}
                    tokens={groupTokens}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            ))}

            {tokens.length === 0 && (
                <div className="py-12 text-center">
                    <div className="text-[10px] font-bold text-text-muted tracking-widest uppercase opacity-40">
                        Awaiting Sync...
                    </div>
                </div>
            )}
        </div>
    );
}

function TokenGroup({ name, tokens, selectedId, onSelect }: {
    name: string,
    tokens: TokenEntity[],
    selectedId: string | null,
    onSelect: (id: string) => void
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center px-1 py-2 text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.15em] transition-all group"
            >
                <ChevronRight
                    size={12}
                    className={clsx("mr-2 transition-transform duration-300", isOpen && "rotate-90 text-primary")}
                />
                {name}
                <span className="ml-auto px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-text-muted group-hover:text-primary transition-colors">
                    {tokens.length}
                </span>
            </button>

            {isOpen && (
                <div className="mt-1 space-y-1 ml-1 pl-3 border-l border-white/5">
                    {tokens.map(token => (
                        <div
                            key={token.id}
                            onClick={() => onSelect(token.id)}
                            className={clsx(
                                "flex items-center justify-between p-2 rounded-xl cursor-pointer text-[11px] transition-all group border",
                                selectedId === token.id
                                    ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                                    : "text-text-dim border-transparent hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <TokenIcon type={token.$type} value={token.$value} />
                                <span className="truncate font-medium">{token.name}</span>
                            </div>

                            <div className={clsx(
                                "flex-none text-[9px] font-mono px-1.5 py-0.5 rounded-lg border uppercase",
                                selectedId === token.id
                                    ? "bg-primary/20 border-primary/20 text-primary"
                                    : "bg-void/40 border-white/5 text-text-muted group-hover:text-text-primary"
                            )}>
                                {String(token.$value).length > 10 ? 'Complex' : token.$value}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TokenIcon({ type, value }: { type: TokenType, value: string | number }) {
    if (type === 'color') {
        return (
            <div
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                style={{ backgroundColor: String(value) }}
            />
        );
    }

    return (
        <div className="w-3.5 h-3.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            {type === 'dimension' ? <Box size={10} className="text-secondary" /> : <Hash size={10} className="text-primary" />}
        </div>
    );
}
