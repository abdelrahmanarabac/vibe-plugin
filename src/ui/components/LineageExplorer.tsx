import { useState, useMemo } from 'react';
import { Search, ArrowDown, ArrowUp, Box } from 'lucide-react';
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

    const checkLineage = (id: string, name: string) => {
        setSearchQuery(name);
        setIsSearching(false);
        onTrace(id);
    };

    const filteredTokens = useMemo(() => {
        if (!searchQuery) return [];
        const q = searchQuery.toLowerCase();
        return tokens.filter(t => t.name.toLowerCase().includes(q)).slice(0, 10);
    }, [tokens, searchQuery]);

    return (
        <div className="w-full h-full flex flex-col p-6 relative overflow-hidden">
            {/* 🔍 Search Header */}
            <div className="relative z-20 mb-8 max-w-xl mx-auto w-full">
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center bg-nebula/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
                        <Search className="text-primary w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder="Find a token to trace lineage..."
                            className="bg-transparent border-none outline-none text-white text-sm w-full font-medium placeholder:text-white/20"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearching(true);
                            }}
                            onFocus={() => setIsSearching(true)}
                        />
                    </div>
                </div>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                    {isSearching && searchQuery && filteredTokens.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-nebula/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
                        >
                            {filteredTokens.map(token => (
                                <button
                                    key={token.id}
                                    onClick={() => checkLineage(token.id, token.name)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-primary/50 rounded-full group-hover:bg-primary transition-colors" />
                                        <span className="text-white font-medium">{token.name}</span>
                                    </div>
                                    <span className="text-xs text-white/30 font-mono">{token.$value as string}</span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 🌳 Lineage Tree */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
                {lineageData ? (
                    <div className="flex flex-col items-center gap-4 py-8">

                        {/* ⬆️ Ancestors (Upstream) */}
                        <div className="flex flex-col items-center gap-2 w-full">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <ArrowUp size={12} /> Ancestry (Parents)
                            </h3>
                            {lineageData.ancestors.length === 0 ? (
                                <div className="text-xs text-white/10 italic">No dependencies found (Root Token)</div>
                            ) : (
                                lineageData.ancestors.map((node, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={node.id}
                                        onClick={() => checkLineage(node.id, node.name)}
                                        className="w-full max-w-md p-3 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xs text-white/70">{node.name}</span>
                                        <div className="w-1 h-3 bg-white/20" />
                                    </motion.div>
                                ))
                            )}
                            {lineageData.ancestors.length > 0 && <div className="w-px h-8 bg-gradient-to-b from-white/10 to-primary/50" />}
                        </div>

                        {/* 💎 Target Token (Hero) */}
                        <motion.div
                            layoutId={lineageData.target.id}
                            className="bg-gradient-to-br from-elevated to-void border border-primary/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.1)] w-full max-w-lg text-center relative z-20"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-void px-4 py-1 rounded-full border border-primary/30 text-[10px] font-bold text-primary uppercase tracking-widest">
                                Selected Token
                            </div>
                            <h1 className="text-2xl font-bold text-white font-display mb-2">{lineageData.target.name}</h1>
                            <div className="inline-block px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs text-white/50 font-mono">
                                {String(lineageData.target.$value)}
                            </div>
                        </motion.div>

                        {/* ⬇️ Descendants (Downstream) */}
                        <div className="flex flex-col items-center gap-2 w-full mt-2">
                            {lineageData.descendants.length > 0 && <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-white/10" />}
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest my-2 flex items-center gap-2">
                                <ArrowDown size={12} /> Impact (Children)
                            </h3>
                            {lineageData.descendants.length === 0 ? (
                                <div className="text-xs text-white/10 italic">No usage found (Leaf Token)</div>
                            ) : (
                                lineageData.descendants.map((node, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={node.id}
                                        onClick={() => checkLineage(node.id, node.name)}
                                        className="w-full max-w-md p-3 bg-white/5 border border-dashed border-white/10 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                                    >
                                        <span className="text-xs text-white/70">{node.name}</span>
                                        <div className="w-1 h-3 bg-white/20" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                        <Box size={48} className="mb-4 text-white/20" />
                        <h3 className="text-lg font-bold text-white">Lineage Explorer</h3>
                        <p className="text-sm text-white/50 max-w-xs mt-2">Search for a token to visualize its entire family tree from root to leaf.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
