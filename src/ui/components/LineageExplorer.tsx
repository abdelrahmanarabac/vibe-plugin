import { useState, useMemo } from 'react';
import { Search, ArrowDown, ArrowUp, GitCommit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type TokenEntity } from '../../core/types';

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
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-void">
            {/* 🔍 Floating Search Bar */}
            <div className="relative z-30 pt-6 px-6 pb-2 w-full max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
                    <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-glass transition-all group-focus-within:border-primary/50 group-focus-within:ring-1 group-focus-within:ring-primary/20">
                        <Search className="text-primary w-5 h-5 mr-3 shrink-0" />
                        <input
                            type="text"
                            placeholder="Find a token to decode lineage..."
                            className="bg-transparent border-none outline-none text-text-primary text-sm w-full font-medium placeholder:text-text-muted"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearching(true);
                            }}
                            onFocus={() => setIsSearching(true)}
                        />
                        {searchQuery && (
                            <div className="text-[10px] bg-surface-2 px-2 py-0.5 rounded text-text-dim font-mono">ESC</div>
                        )}
                    </div>
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {isSearching && searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="absolute top-full left-6 right-6 mt-2 bg-surface-0/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                        >
                            {filteredTokens.length > 0 ? (
                                filteredTokens.map(token => (
                                    <button
                                        key={token.id}
                                        onClick={() => checkLineage(token.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-surface-2 flex items-center justify-between group transition-colors border-b border-white/5 last:border-0"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
                                                <GitCommit size={14} className="text-text-dim group-hover:text-primary" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-text-primary font-bold text-xs truncate group-hover:text-primary transition-colors">{token.name}</span>
                                                <span className="text-[10px] text-text-dim truncate">{token.path.join(' / ')}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-surface-2 px-2 py-1 rounded text-text-muted font-mono group-hover:bg-primary/10 group-hover:text-primary">{String(token.$value).slice(0, 12)}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-text-muted text-xs">
                                    No tokens found matching "{searchQuery}"
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🧬 DNA Lineage Stream */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 pb-12">
                {lineageData ? (
                    <div className="flex flex-col items-center gap-0 w-full max-w-md mx-auto relative mt-8">

                        {/* ⛓️ The Spine (Decor) */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 z-0" />

                        {/* ⬆️ Ancestors (Upstream) */}
                        <div className="flex flex-col items-center w-full gap-4 z-10">
                            <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mb-4 bg-void px-4 py-1 rounded-full border border-white/5 backdrop-blur">
                                Origins
                            </h3>

                            {lineageData.ancestors.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 mb-8 opacity-40">
                                    <div className="w-2 h-2 rounded-full bg-surface-2" />
                                    <span className="text-[10px] text-text-muted italic">Pure Primitive</span>
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
                            className="my-8 relative z-20 group"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
                            <div className="relative bg-surface-1 border border-primary/50 shadow-glass rounded-3xl p-6 w-[320px] text-center backdrop-blur-xl">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-surface-0 px-3 py-1 rounded-full border border-primary/30 shadow-lg flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Active Core</span>
                                </div>

                                <div className="flex flex-col items-center mt-2">
                                    <div className="text-[10px] text-text-muted font-mono mb-1">{lineageData.target.path.join(' / ')}</div>
                                    <h1 className="text-xl font-display font-bold text-text-bright mb-3 text-gradient-primary">{lineageData.target.name}</h1>

                                    <div className="w-full h-px bg-white/10 mb-3" />

                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <div className="bg-void rounded-lg p-2 border border-white/5 flex flex-col items-center">
                                            <span className="text-[9px] text-text-dim uppercase">Type</span>
                                            <span className="text-xs font-bold text-text-primary uppercase">{lineageData.target.$type}</span>
                                        </div>
                                        <div className="bg-void rounded-lg p-2 border border-white/5 flex flex-col items-center">
                                            <span className="text-[9px] text-text-dim uppercase">Value</span>
                                            <span className="text-xs font-bold text-secondary truncate w-full text-center" title={String(lineageData.target.$value)}>
                                                {String(lineageData.target.$value)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* ⬇️ Descendants (Downstream) */}
                        <div className="flex flex-col items-center w-full gap-4 z-10">
                            {lineageData.descendants.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 mt-4 opacity-40">
                                    <div className="w-2 h-2 rounded-full bg-surface-2" />
                                    <span className="text-[10px] text-text-muted italic">Terminal Node (Leaf)</span>
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

                            <h3 className="text-[10px] font-bold text-text-dim uppercase tracking-[0.2em] mt-8 bg-void px-4 py-1 rounded-full border border-white/5 backdrop-blur">
                                Downstream
                            </h3>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                        <div className="w-24 h-24 bg-surface-1 rounded-full flex items-center justify-center mb-6 relative group border border-white/5">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                            <GitCommit size={48} className="text-text-muted group-hover:text-primary transition-colors duration-500" strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-display font-bold text-text-bright mb-2">Awaiting Target</h3>
                        <p className="text-sm text-text-dim max-w-xs leading-relaxed">
                            Search for any token above to decode its genetic makeup and see how it propagates through your system.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function NodeCard({ node, type, onClick, index }: { node: TokenEntity, type: 'ancestor' | 'descendant', onClick: () => void, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: type === 'ancestor' ? -20 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative"
        >
            {/* Connector Line */}
            <div className={`absolute left-1/2 w-px bg-white/10 h-6 -translate-x-1/2 z-0 ${type === 'ancestor' ? 'top-full' : 'bottom-full'}`} />

            <button
                onClick={onClick}
                className="relative z-10 w-[260px] p-3 bg-surface-1/40 hover:bg-surface-2 border border-white/5 hover:border-white/20 hover:shadow-card rounded-xl flex items-center justify-between transition-all backdrop-blur-md"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-1.5 h-6 rounded-full ${type === 'ancestor' ? 'bg-secondary/40' : 'bg-accent-pink/40'}`} />
                    <div className="flex flex-col items-start min-w-0">
                        <span className="text-xs font-bold text-text-primary truncate w-full">{node.name}</span>
                        <span className="text-[9px] text-text-dim font-mono">{String(node.$value).slice(0, 15)}</span>
                    </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {type === 'ancestor' ? <ArrowDown size={12} className="text-secondary" /> : <ArrowUp size={12} className="text-accent-pink" />}
                </div>
            </button>
        </motion.div>
    )
}
