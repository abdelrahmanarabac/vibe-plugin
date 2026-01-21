import { useState } from 'react';
import { TokenEditor } from './components/TokenEditor';
import { ScaleGeneratorUI } from './components/ScaleGeneratorUI';
import { TokenTree } from './components/TokenTree';
import { GraphEditor } from './components/GraphEditor';
import { type TokenEntity } from '../core/types';

interface EditorViewProps {
    tokens: TokenEntity[];
    searchFocus?: string;
}

export function EditorView({ tokens = [], searchFocus }: EditorViewProps) {
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    const filteredTokens = searchFocus
        ? tokens.filter(t => t.name.toLowerCase().includes(searchFocus.toLowerCase()))
        : tokens;

    return (
        <div className="flex w-full h-full overflow-hidden">
            {/* Left Panel: Token Tree */}
            <aside className="w-[280px] border-r border-surface-1 bg-surface-0 flex flex-col shrink-0">
                <div className="p-3 border-b border-surface-1 flex justify-between items-center bg-surface-1/50">
                    <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Collections</span>
                    <button className="text-text-muted hover:text-text-primary transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <TokenTree
                        tokens={filteredTokens}
                        selectedId={selectedTokenId}
                        onSelect={setSelectedTokenId}
                    />
                </div>
            </aside>

            {/* Right Panel: Workspace / Editor */}
            <main className="flex-1 relative bg-surface-0 overflow-hidden">
                {!selectedTokenId ? (
                    <div className="w-full h-full relative">
                        {/* Background Graph Editor */}
                        <div className="absolute inset-0 z-0">
                            <GraphEditor tokens={tokens} onSelect={setSelectedTokenId} />
                        </div>

                        {/* Quick Tools Overlay */}
                        <div className="absolute top-4 left-4 z-10 p-4 max-w-sm bg-surface-1/80 backdrop-blur-md rounded-xl border border-surface-active shadow-glass pointer-events-auto">
                            <h3 className="text-xs font-bold text-text-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Smart Scale Generator
                            </h3>
                            <ScaleGeneratorUI />
                        </div>
                    </div>
                ) : (
                    <div className="p-8 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <button
                                onClick={() => setSelectedTokenId(null)}
                                className="text-[10px] text-text-muted hover:text-primary transition-colors flex items-center gap-1"
                            >
                                ← Back to Graph
                            </button>
                        </div>
                        <TokenEditor tokenId={selectedTokenId} />
                    </div>
                )}
            </main>
        </div>
    );
}
