import { useState, useMemo } from 'react';
import type { TokenEntity, TokenType } from '../../../../core/types';
import { clsx } from 'clsx';
import { ChevronRight, Hash, Box, Folder, Search } from 'lucide-react';

interface TokenTreeProps {
    tokens: TokenEntity[];
    searchQuery?: string;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

interface TreeGroup {
    name: string;
    subGroups: Record<string, TreeGroup>;
    tokens: TokenEntity[];
}

/**
 * 🌲 Figma Native Token Tree
 * Organizes tokens strictly according to their Figma Collection and Path.
 * Adapts to a Flat List when searching for better utility.
 */
export function TokenTree({ tokens, searchQuery = '', selectedId, onSelect }: TokenTreeProps) {
    // 1. Filter Logic (Memoized)
    const filteredResults = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return tokens.filter(t =>
            t.name.toLowerCase().includes(q) ||
            String(t.$value).toLowerCase().includes(q) ||
            t.path.some(p => p.toLowerCase().includes(q))
        );
    }, [tokens, searchQuery]);

    // 2. Render Search Results (Flat List)
    if (searchQuery) {
        if (filteredResults.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center pt-12 text-center opacity-40">
                    <Search size={24} className="mb-2 text-white/50" />
                    <div className="text-[10px] font-bold text-white uppercase tracking-widest">No Matches</div>
                </div>
            );
        }

        return (
            <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
                    {filteredResults.length} Result{filteredResults.length !== 1 ? 's' : ''}
                </div>
                {filteredResults.map(token => (
                    <TokenItem
                        key={token.id}
                        token={token}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        highlight={searchQuery}
                        showPath
                    />
                ))}
            </div>
        );
    }

    // 3. Build Recursive Tree Structure (Normal Mode)
    const root: Record<string, TreeGroup> = {};

    tokens.forEach(token => {
        let currentLevel = root;
        const path = token.path;

        path.forEach((segment, index) => {
            if (!currentLevel[segment]) {
                currentLevel[segment] = {
                    name: segment,
                    subGroups: {},
                    tokens: []
                };
            }

            if (index === path.length - 1) {
                currentLevel[segment].tokens.push(token);
            } else {
                currentLevel = currentLevel[segment].subGroups;
            }
        });

        if (path.length === 0) {
            const segment = 'Uncategorized';
            if (!root[segment]) {
                root[segment] = { name: segment, subGroups: {}, tokens: [] };
            }
            root[segment].tokens.push(token);
        }
    });

    return (
        <div className="space-y-1 pb-4 p-2">
            {Object.values(root).map(group => (
                <RecursiveGroup
                    key={group.name}
                    group={group}
                    level={0}
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

function RecursiveGroup({ group, level, selectedId, onSelect }: {
    group: TreeGroup,
    level: number,
    selectedId: string | null,
    onSelect: (id: string) => void
}) {
    const [isOpen, setIsOpen] = useState(level === 0);

    const hasContent = Object.keys(group.subGroups).length > 0 || group.tokens.length > 0;
    if (!hasContent) return null;

    return (
        <div className={clsx("mb-1", level > 0 && "ml-2")}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center px-2 py-1.5 rounded-lg transition-all group",
                    level === 0
                        ? "text-[10px] font-black text-white/50 hover:text-white uppercase tracking-[0.1em]"
                        : "text-[11px] font-bold text-text-dim hover:text-text-primary"
                )}
            >
                <ChevronRight
                    size={level === 0 ? 12 : 10}
                    className={clsx("mr-1.5 transition-transform duration-300", isOpen && "rotate-90 text-primary")}
                />
                {level === 0 ? (
                    <span className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                        <Folder size={12} className="text-secondary" />
                        {group.name}
                    </span>
                ) : (
                    group.name
                )}
            </button>

            {isOpen && (
                <div className={clsx("mt-0.5 space-y-0.5", level === 0 ? "ml-1" : "ml-2 pl-2 border-l border-white/5")}>
                    {Object.values(group.subGroups).map(sub => (
                        <RecursiveGroup
                            key={sub.name}
                            group={sub}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}

                    {group.tokens.map(token => (
                        <TokenItem
                            key={token.id}
                            token={token}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TokenItem({ token, selectedId, onSelect, highlight, showPath }: {
    token: TokenEntity,
    selectedId: string | null,
    onSelect: (id: string) => void,
    highlight?: string,
    showPath?: boolean
}) {
    const isSelected = selectedId === token.id;

    // Highlight Logic
    const renderName = () => {
        if (!highlight) return token.name;
        const parts = token.name.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase()
                        ? <span key={i} className="text-secondary bg-secondary/10 px-0.5 rounded">{part}</span>
                        : part
                )}
            </span>
        );
    };

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('vibe/token-id', token.id);
                e.dataTransfer.effectAllowed = 'move';
            }}
            onClick={() => onSelect(token.id)}
            className={clsx(
                "flex flex-col p-2 rounded-xl cursor-pointer text-[11px] transition-all group border",
                isSelected
                    ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                    : "text-text-dim border-transparent hover:bg-white/5 hover:text-white"
            )}
        >
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <TokenIcon type={token.$type} value={token.$value} />
                    <div className="flex flex-col min-w-0">
                        {showPath && token.path.length > 0 && (
                            <div className="text-[9px] text-white/30 truncate flex items-center gap-1">
                                {token.path.join(' / ')}
                            </div>
                        )}
                        <span className="truncate font-medium flex-1" title={token.name}>
                            {renderName()}
                        </span>
                    </div>
                </div>

                <div className={clsx(
                    "flex-none text-[9px] font-mono px-1.5 py-0.5 rounded-lg border uppercase ml-2 max-w-[80px] truncate",
                    isSelected
                        ? "bg-primary/20 border-primary/20 text-primary"
                        : "bg-void/40 border-white/5 text-text-muted group-hover:text-text-primary"
                )}>
                    {token.$value}
                </div>
            </div>
        </div>
    );
}

function TokenIcon({ type, value }: { type: TokenType, value: string | number }) {
    if (type === 'color') {
        const bgValue = String(value).startsWith('{') ? 'transparent' : String(value);
        return (
            <div className="relative flex-shrink-0">
                <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                    style={{ backgroundColor: bgValue }}
                />
                {String(value).startsWith('{') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-3.5 h-3.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            {type === 'dimension' ? <Box size={10} className="text-secondary" /> : <Hash size={10} className="text-primary" />}
        </div>
    );
}
