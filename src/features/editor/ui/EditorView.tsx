import { useState, useEffect } from 'react';
import { omnibox } from '../../../ui/managers/OmniboxManager';
import { TokenTree } from '../../tokens/ui/components/TokenTree';
import { LineageExplorer } from '../../intelligence/ui/components/LineageExplorer';
import { type TokenEntity } from '../../../core/types';
import { Search } from 'lucide-react';



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

    // ⚡ INTERACTION UPGRADE: Clicking Sidebar -> Traces Lineage
    const handleTokenSelect = (id: string) => {
        setSelectedTokenId(id);
        if (onTraceLineage) {
            onTraceLineage(id);
        }
    };

    return (
        <div className="flex w-full h-full overflow-hidden bg-void/50 p-3 gap-3">
            {/* 🌲 Left Fragment: Sidebar (Token Tree) */}
            <aside className="w-[300px] bg-surface-1/50 backdrop-blur-3xl border border-white/5 rounded-xl flex flex-col shrink-0 overflow-hidden shadow-sm transition-all duration-500 hover:border-white/10">
                {/* Collections Identity & Search */}
                <div className="p-3 border-b border-white/5 flex flex-col gap-3 bg-surface-0/10">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-text-primary">Collections</span>
                        <div className="bg-surface-2 px-1.5 py-0.5 rounded text-[10px] text-text-muted font-mono">{tokens.length}</div>
                    </div>

                    {/* 🔍 Search Line - High Contrast Fix */}
                    <div className="relative group">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find a token..."
                            aria-label="Search tokens"
                            className="w-full bg-surface-1 text-xs text-text-primary placeholder:text-text-dim border border-white/10 rounded-lg py-2 pl-8 pr-8 focus:outline-none focus:border-primary/50 focus:bg-surface-2 transition-all font-medium shadow-inner"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-dim hover:text-white transition-colors"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-1 custom-scrollbar">
                    <TokenTree
                        tokens={tokens}
                        searchQuery={searchQuery}
                        selectedId={selectedTokenId}
                        onSelect={handleTokenSelect}
                    />
                </div>
            </aside>

            {/* 🌌 Right Fragment: Workspace (Lineage Explorer) */}
            <main className="flex-1 relative bg-surface-0/50 backdrop-blur-xl border border-white/5 rounded-xl overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 border-b border-white/5 flex items-center justify-between pointer-events-none bg-gradient-to-b from-surface-0/80 to-transparent">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-sm" />
                        <span className="text-xs font-medium text-text-primary">Lineage Explorer</span>
                    </div>
                    {lineageData?.target && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-text-muted">Target:</span>
                            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                                {lineageData.target.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Lineage Component */}
                <div className="absolute inset-0 z-0 pt-10">
                    <LineageExplorer
                        tokens={tokens}
                        onTrace={(id) => {
                            setSelectedTokenId(id);
                            if (onTraceLineage) onTraceLineage(id);
                        }}
                        lineageData={lineageData || null}
                    />
                </div>
            </main>
        </div>
    );
}
