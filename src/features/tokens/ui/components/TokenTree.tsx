import { useState, useMemo } from 'react';
import type { TokenEntity, TokenType } from '../../../../core/types';
import { clsx } from 'clsx';
import { ChevronRight, Hash, Box, Folder, Search, Type } from 'lucide-react';

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
 * Refactored for Clarity & Professionalism.
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
                    <Search size={16} className="mb-2 text-text-muted" />
                    <div className="text-xs font-medium text-text-muted">No Matches</div>
                </div>
            );
        }

        return (
            <div className="p-2 space-y-0.5">
                <div className="px-3 py-2 text-[10px] font-semibold text-text-dim uppercase tracking-wider border-b border-white/5 mb-1">
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
                    <div className="text-xs text-text-dim opacity-50">
                        No tokens found in this workspace.
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
        <div className={clsx("mb-0.5", level > 0 && "ml-[18px]")}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "w-full flex items-center px-2 py-1.5 rounded-md transition-all group select-none",
                    level === 0
                        ? "text-xs font-semibold text-text-muted hover:text-white"
                        : "text-xs font-medium text-text-dim hover:text-text-primary"
                )}
            >
                <div className={clsx("mr-1.5 transition-transform duration-200 text-text-dim/50", isOpen && "rotate-90 text-text-dim")}>
                    <ChevronRight size={10} strokeWidth={3} />
                </div>

                {level === 0 ? (
                    <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <Folder size={12} className="text-primary/70 fill-primary/10" />
                        {group.name}
                    </span>
                ) : (
                    group.name
                )}
            </button>

            {isOpen && (
                <div className="mt-0.5 relative">
                    {/* Tree Guide Line */}
                    {level > 0 && <div className="absolute left-[5px] top-0 bottom-2 w-px bg-white/5" />}

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
                            indentLevel={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function TokenItem({ token, selectedId, onSelect, highlight, showPath, indentLevel = 0 }: {
    token: TokenEntity,
    selectedId: string | null,
    onSelect: (id: string) => void,
    highlight?: string,
    showPath?: boolean,
    indentLevel?: number
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
                        ? <span key={i} className="text-white bg-primary/20">{part}</span>
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
                "flex items-center justify-between w-full px-2 py-1.5 rounded-md cursor-pointer text-xs transition-all border border-transparent mb-0.5",
                indentLevel > 0 && "ml-[18px]",
                isSelected
                    ? "bg-primary/10 text-white border-primary/20 shadow-sm font-medium"
                    : "text-text-dim hover:bg-white/5 hover:text-text-primary"
            )}
        >
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                <TokenIcon type={token.$type} value={token.$value} />
                <div className="flex flex-col min-w-0 flex-1">
                    {showPath && token.path.length > 0 && (
                        <div className="text-[9px] text-text-dim/60 truncate flex items-center gap-1">
                            {token.path.join(' / ')}
                        </div>
                    )}
                    <span className="truncate" title={token.name} style={{ lineHeight: '1.2' }}>
                        {renderName()}
                    </span>
                </div>
            </div>

            {/* Value Pill - Only show if space permits or hovered */}
            <div className={clsx(
                "flex-none text-[10px] font-mono pl-2 max-w-[80px] truncate opacity-60 group-hover:opacity-100",
                isSelected && "opacity-100 text-primary-light"
            )}>
                {String(token.$value)}
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
                    className="w-3.5 h-3.5 rounded-full border border-white/10 shadow-sm"
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

    // Icon mapping based on new design system
    const iconClass = "text-text-dim";
    const size = 12;

    if (type === 'dimension') return <Hash size={size} className={iconClass} />;
    if (type === 'fontFamily' || type === 'fontWeight') return <Type size={size} className={iconClass} />;

    return <Box size={size} className={iconClass} />;
}
