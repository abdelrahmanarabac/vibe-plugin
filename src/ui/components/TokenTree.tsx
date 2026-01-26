import { useState } from 'react';
import type { TokenEntity, TokenType } from '../../core/types';
import { clsx } from 'clsx';
import { ChevronRight, Hash, Box, Folder } from 'lucide-react';

interface TokenTreeProps {
    tokens: TokenEntity[];
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
 */
export function TokenTree({ tokens, selectedId, onSelect }: TokenTreeProps) {
    // 1. Build Recursive Tree Structure
    // Path format: [Collection, Group1, Group2, ...]
    const root: Record<string, TreeGroup> = {};

    tokens.forEach(token => {
        let currentLevel = root;
        const path = token.path; // e.g. ["Brand", "Colors", "Global"]

        path.forEach((segment, index) => {
            if (!currentLevel[segment]) {
                currentLevel[segment] = {
                    name: segment,
                    subGroups: {},
                    tokens: []
                };
            }

            // If it's the last segment of the path, we don't necessarily add tokens here
            // because tokens are added to the leaf group that contains them.
            if (index === path.length - 1) {
                currentLevel[segment].tokens.push(token);
            } else {
                currentLevel = currentLevel[segment].subGroups;
            }
        });

        // Corner case: If path is empty (shouldn't happen with Repo logic), add to Uncategorized
        if (path.length === 0) {
            const segment = 'Uncategorized';
            if (!root[segment]) {
                root[segment] = { name: segment, subGroups: {}, tokens: [] };
            }
            root[segment].tokens.push(token);
        }
    });

    return (
        <div className="space-y-1 pb-4">
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
    const [isOpen, setIsOpen] = useState(level === 0); // Auto-open collections (top level)

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
                    {/* Render Subgroups */}
                    {Object.values(group.subGroups).map(sub => (
                        <RecursiveGroup
                            key={sub.name}
                            group={sub}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}

                    {/* Render Tokens */}
                    {group.tokens.map(token => (
                        <div
                            key={token.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('vibe/token-id', token.id);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
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
                                <span className="truncate font-medium" title="Drag to Graph Editor">{token.name}</span>
                            </div>

                            <div className={clsx(
                                "flex-none text-[9px] font-mono px-1.5 py-0.5 rounded-lg border uppercase ml-2",
                                selectedId === token.id
                                    ? "bg-primary/20 border-primary/20 text-primary"
                                    : "bg-void/40 border-white/5 text-text-muted group-hover:text-text-primary"
                            )}>
                                {String(token.$value).length > 8 ? 'Value' : token.$value}
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
