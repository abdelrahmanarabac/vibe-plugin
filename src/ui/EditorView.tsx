import { useState } from 'react';
import { TokenTree } from './components/TokenTree';
import { GraphEditor } from './components/GraphEditor';
import { SmartInspector } from './components/SmartInspector';
import { type TokenEntity } from '../core/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus } from 'lucide-react';

interface EditorViewProps {
    tokens: TokenEntity[];
    searchFocus?: string;
}

/**
 * 🏷️ Elite Tokens Fragment
 * A dual-identity view with a persistent sidebar and a spatial graph/inspector workspace.
 */
export function EditorView({ tokens = [], searchFocus }: EditorViewProps) {
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
            <aside className="w-[280px] bg-[#0A0C14]/40 backdrop-blur-3xl border border-white/10 rounded-[28px] flex flex-col shrink-0 overflow-hidden transition-all duration-500 shadow-2xl">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_var(--secondary-glow)]" />
                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.1em]">Collections</span>
                    </div>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-text-muted hover:text-white hover:border-white/20 hover:bg-white/10 transition-all">
                        <Plus size={14} />
                    </button>
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
            <main className="flex-1 relative bg-[#0A0C14]/60 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl group">
                <AnimatePresence mode="wait">
                    {!selectedTokenId ? (
                        <motion.div
                            key="graph"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="w-full h-full relative"
                        >
                            {/* Spatial Graph Editor */}
                            <div className="absolute inset-0 z-0">
                                <GraphEditor tokens={tokens} onSelect={setSelectedTokenId} />
                            </div>

                            {/* Floating Identity Badge */}
                            <div className="absolute top-6 left-6 z-10 p-5 max-w-sm bg-void/40 backdrop-blur-2xl rounded-[24px] border border-white/5 shadow-glass group-hover:border-primary/20 transition-all duration-300">
                                <h3 className="text-[10px] font-extrabold text-text-dim mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
                                    Spatial Graph
                                </h3>
                                <p className="text-[11px] text-text-muted leading-relaxed">
                                    Observe relationships and inheritance. Click nodes to inspect.
                                </p>
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
                                    Exit Workspace
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
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
