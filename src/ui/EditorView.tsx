import { useState, useEffect } from 'react';
import { omnibox } from './managers/OmniboxManager';
import { TokenTree } from '../modules/tokens/ui/components/TokenTree';
import { LineageExplorer } from '../modules/intelligence/ui/components/LineageExplorer';
import { SmartInspector } from '../modules/intelligence/ui/components/SmartInspector';
import { type TokenEntity } from '../core/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Omnibox } from './components/feedback/Omnibox';


interface EditorViewProps {
    tokens: TokenEntity[];
    searchFocus?: string;
    onTraceLineage?: (id: string) => void;
    lineageData?: { target: TokenEntity, ancestors: TokenEntity[], descendants: TokenEntity[] } | null;
}

/**
 * 🏷️ Elite Tokens Fragment
 * A dual-identity view with a persistent sidebar and a spatial graph/inspector workspace.
 */
export function EditorView({ tokens = [], searchFocus, onTraceLineage, lineageData }: EditorViewProps) {
    const [searchQuery, setSearchQuery] = useState(searchFocus || '');
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    // allow external control but keep local state sync
    if (searchFocus && searchFocus !== searchQuery) {
        setSearchQuery(searchFocus);
    }

    const clearSearch = () => setSearchQuery('');

    const selectedToken = selectedTokenId
        ? tokens.find(t => t.id === selectedTokenId)
        : null;

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, payload } = event.data.pluginMessage || {};
            if (type === 'OMNIBOX_NOTIFY') {
                omnibox.show(payload.message, { type: payload.type || 'info' });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="flex w-full h-full overflow-hidden bg-void/20 p-2 gap-2">
            {/* 🌲 Left Fragment: Sidebar (Token Tree) */}
            <aside className="w-[280px] bg-nebula/40 backdrop-blur-3xl border border-white/10 rounded-[28px] flex flex-col shrink-0 overflow-hidden transition-all duration-500 shadow-2xl mr-1">
                {/* Collections Identity & Search */}
                <div className="p-4 border-b border-white/5 flex flex-col gap-3 bg-white/[0.01]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary-glow)]" />
                            <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.1em]">Collections</span>
                        </div>
                        <div className="text-[9px] text-white/30 font-mono">{tokens.length}</div>
                    </div>

                    {/* 🔍 Search Line */}
                    <div className="relative group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find..."
                            aria-label="Search tokens"
                            className="w-full bg-black/20 text-[11px] text-white placeholder-white/20 border border-white/10 rounded-lg py-1.5 pl-3 pr-8 focus:outline-none focus:border-secondary/50 focus:bg-black/40 transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                            >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                        {!searchQuery && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" aria-hidden="true">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                    <TokenTree
                        tokens={tokens}
                        searchQuery={searchQuery}
                        selectedId={selectedTokenId}
                        onSelect={setSelectedTokenId}
                    />
                </div>
            </aside>

            {/* 🌌 Right Fragment: Workspace (Graph or Inspector) */}
            <main className="flex-1 relative bg-nebula/60 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl group">
                <AnimatePresence mode="wait">
                    {!selectedTokenId ? (
                        <motion.div
                            key="lineage"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="w-full h-full relative"
                        >
                            {/* Lineage Identity (Internal) */}
                            <div className="absolute top-0 left-0 right-0 z-10 p-4 border-b border-white/5 bg-void/20 backdrop-blur-md flex items-center justify-between pointer-events-none">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary-glow)]" />
                                    <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.1em]">Lineage Explorer</span>
                                </div>
                                <div className="text-[9px] text-text-muted font-medium uppercase tracking-widest opacity-60">
                                    Deep Trace Active
                                </div>
                            </div>

                            {/* Lineage Component */}
                            <div className="absolute inset-0 z-0 pt-12">
                                <LineageExplorer
                                    tokens={tokens}
                                    onTrace={onTraceLineage || (() => { })}
                                    lineageData={lineageData || null}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inspector"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-8 h-full overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <button
                                    onClick={() => setSelectedTokenId(null)}
                                    className="px-3 py-1.5 text-[10px] font-bold text-text-muted hover:text-primary bg-white/5 border border-white/5 hover:border-primary/30 rounded-full transition-all flex items-center gap-2 uppercase tracking-tight"
                                >
                                    <ChevronLeft size={14} />
                                    Back to Explorer
                                </button>
                                <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    Inspecting: <span className="text-white">{selectedToken?.name}</span>
                                </div>
                            </div>

                            {selectedToken && (
                                <div className="max-w-3xl mx-auto">
                                    <SmartInspector
                                        tokens={[selectedToken]}
                                        onUpdate={(id, value) => {
                                            console.log('Token update:', id, value);
                                            parent.postMessage({
                                                pluginMessage: { type: 'NOTIFY', message: `Token ${id} updated` }
                                            }, '*');
                                        }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    )
                    }
                </AnimatePresence>
            </main>
            <Omnibox />
        </div>
    );
}
