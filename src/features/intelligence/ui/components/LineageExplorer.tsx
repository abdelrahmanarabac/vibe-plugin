import { useState, useMemo } from 'react';
import { Search, ArrowDown, ArrowUp, GitCommit, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TokenEntity } from '../../../../core/types';

interface LineageExplorerProps {
    tokens: TokenEntity[];
    onTrace: (tokenId: string) => void;
    lineageData: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

export function LineageExplorer({ tokens, onTrace, lineageData }: LineageExplorerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const checkLineage = (id: string) => {
        setSearchQuery('');
        setIsSearching(false);
        onTrace(id);
    };

    const filteredTokens = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return tokens.filter(t => t.name.toLowerCase().includes(q) || t.path.join('/').toLowerCase().includes(q)).slice(0, 8);
    }, [tokens, searchQuery]);

    return (
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-surface-0">
            {/* 🔍 Internal Quick Jump (Optional, since we have sidebar) */}
            <div className="relative z-30 pt-4 px-6 pb-2 w-full max-w-xl mx-auto">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Quick trace..."
                        className="w-full bg-surface-1 border border-surface-active rounded-lg py-2 pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:bg-surface-2 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsSearching(true);
                        }}
                        onFocus={() => setIsSearching(true)}
                    />
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {isSearching && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 4 }}
                            className="absolute top-full left-6 right-6 mt-1 bg-surface-0 border border-surface-active rounded-lg overflow-hidden shadow-xl z-50 ring-1 ring-black/5"
                        >
                            {filteredTokens.length > 0 ? (
                                filteredTokens.map(token => (
                                    <button
                                        key={token.id}
                                        onClick={() => checkLineage(token.id)}
                                        className="w-full text-left px-3 py-2.5 hover:bg-surface-1 flex items-center justify-between group transition-colors border-b border-surface-active/50 last:border-0"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-text-primary font-medium text-xs truncate">{token.name}</span>
                                            <span className="text-[10px] text-text-muted truncate">{token.path.join(' / ')}</span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-text-muted text-xs">
                                    No tokens found
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🧬 Lineage Graph */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 pb-12 pt-4">
                {lineageData ? (
                    <div className="flex flex-col items-center gap-0 w-full max-w-md mx-auto relative">

                        {/* ⛓️ The Spine */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-surface-active -translate-x-1/2 z-0" />

                        {/* ⬆️ Ancestors (Upstream) */}
                        <div className="flex flex-col items-center w-full gap-3 z-10 pb-8">
                            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-0 px-3 py-1 rounded-full border border-surface-active mb-2">
                                References (Upstream)
                            </h3>

                            {lineageData.ancestors.length === 0 ? (
                                <div className="px-4 py-2 bg-surface-1 rounded-md border border-dashed border-surface-active text-[10px] text-text-dim">
                                    No dependencies (Primitive)
                                </div>
                            ) : (
                                lineageData.ancestors.map((node, idx) => (
                                    <NodeCard
                                        key={node.id}
                                        node={node}
                                        type="ancestor"
                                        onClick={() => checkLineage(node.id)}
                                        index={idx}
                                    />
                                ))
                            )}
                        </div>

                        {/* 💎 Target Nucleus (Center) */}
                        <motion.div
                            layoutId={lineageData.target.id}
                            className="my-4 relative z-20 w-full max-w-[340px]"
                        >
                            <div className="bg-surface-0 border-2 border-primary/20 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-primary/40 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                                <div className="flex justify-between items-start mb-3">
                                    <div className="text-[10px] text-text-muted font-mono bg-surface-1 px-1.5 py-0.5 rounded border border-surface-active">
                                        {lineageData.target.path.join(' / ')}
                                    </div>
                                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">Active</div>
                                </div>

                                <h1 className="text-lg font-bold text-text-primary mb-4 truncate text-center select-text">
                                    {lineageData.target.name}
                                </h1>

                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div className="bg-surface-1/50 rounded-lg p-2.5 border border-surface-active flex flex-col items-center text-center">
                                        <span className="text-[9px] text-text-dim uppercase tracking-wider mb-1">Type</span>
                                        <span className="text-xs font-semibold text-text-primary">{lineageData.target.$type}</span>
                                    </div>
                                    <div className="bg-surface-1/50 rounded-lg p-2.5 border border-surface-active flex flex-col items-center text-center">
                                        <span className="text-[9px] text-text-dim uppercase tracking-wider mb-1">Value</span>
                                        <ValueDisplay value={lineageData.target.$value} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ⬇️ Descendants (Downstream) */}
                        <div className="flex flex-col items-center w-full gap-3 z-10 pt-8">
                            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-0 px-3 py-1 rounded-full border border-surface-active mb-2">
                                Usage (Downstream)
                            </h3>

                            {lineageData.descendants.length === 0 ? (
                                <div className="px-4 py-2 bg-surface-1 rounded-md border border-dashed border-surface-active text-[10px] text-text-dim">
                                    Unused leaf node
                                </div>
                            ) : (
                                lineageData.descendants.map((node, idx) => (
                                    <NodeCard
                                        key={node.id}
                                        node={node}
                                        type="descendant"
                                        onClick={() => checkLineage(node.id)}
                                        index={idx}
                                    />
                                ))
                            )}

                        </div>

                    </div>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
}

function NodeCard({ node, type, onClick, index }: { node: TokenEntity, type: 'ancestor' | 'descendant', onClick: () => void, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: type === 'ancestor' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="group relative"
        >
            <button
                onClick={onClick}
                className="relative z-10 w-[240px] px-3 py-2.5 bg-surface-0 hover:bg-surface-1 border border-surface-active hover:border-primary/30 rounded-lg flex items-center justify-between transition-all shadow-sm group-hover:shadow-md text-left"
            >
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-text-primary truncate">{node.name}</span>
                    <span className="text-[10px] text-text-dim font-mono truncate max-w-[180px]">{String(node.$value)}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted">
                    {type === 'ancestor' ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
                </div>
            </button>
        </motion.div>
    )
}

function ValueDisplay({ value }: { value: string | number }) {
    const [copied, setCopied] = useState(false);
    const strVal = String(value);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(strVal);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button onClick={handleCopy} className="flex items-center gap-1.5 max-w-full group hover:text-primary transition-colors">
            <span className="text-xs font-mono font-medium truncate" title={strVal}>{strVal}</span>
            {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
    )
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center opacity-60">
            <div className="w-16 h-16 bg-surface-1 rounded-2xl flex items-center justify-center mb-4 border border-surface-active">
                <GitCommit size={32} className="text-text-muted" />
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">Select a Token</h3>
            <p className="text-xs text-text-dim max-w-[200px]">
                Choose a token from the sidebar to visualize its relationships.
            </p>
        </div>
    );
}
