import { useState } from 'react';
import { TokenTree } from './components/TokenTree';
import { LineageExplorer } from './components/LineageExplorer';
import { SmartInspector } from './components/SmartInspector';
import { type TokenEntity } from '../core/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

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
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    const filteredTokens = searchFocus
        ? tokens.filter(t => t.name.toLowerCase().includes(searchFocus.toLowerCase()))
        : tokens;

    const selectedToken = selectedTokenId
        ? tokens.find(t => t.id === selectedTokenId)
        : null;

    return (
        <div className="flex w-full h-full overflow-hidden bg-void/20 p-2 gap-2">
            {/* 🌲 Left Fragment: Sidebar (Token Tree) */}
            <aside className="w-[280px] bg-nebula/40 backdrop-blur-3xl border border-white/10 rounded-[28px] flex flex-col shrink-0 overflow-hidden transition-all duration-500 shadow-2xl mr-1">
                {/* Collections Identity */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary-glow)]" />
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.1em]">Collections</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                    <TokenTree
                        tokens={filteredTokens}
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
        </div>
    );
}
