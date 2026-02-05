import { useState, useMemo, useEffect } from 'react';
import { useTokens } from '../../../../ui/hooks/useTokens';
import { Search, ChevronRight, Layers, Activity } from 'lucide-react';
import type { TokenEntity } from '../../../../core/types';

/**
 * 🪙 TokensView
 * The dedicated section for managing and exploring Design Tokens.
 * Replaces the previously planned "Activity Graph".
 * Zero Graph Terminology. Pure List/Tree Explorer.
 */
export function TokensView({ onBack: _ }: { onBack?: () => void }) {
    const { tokens, scanUsage } = useTokens();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

    // 🌊 Lazy Load Usage Data on Enter
    useEffect(() => {
        scanUsage();
    }, []);

    // 🔍 Filter Logic
    const filteredTokens = useMemo(() => {
        if (!searchQuery) return tokens;
        const q = searchQuery.toLowerCase();
        return tokens.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.path.join('/').toLowerCase().includes(q)
        );
    }, [tokens, searchQuery]);

    const selectedToken = useMemo(() =>
        tokens.find(t => t.id === selectedTokenId) || null
        , [tokens, selectedTokenId]);

    return (
        <div className="flex h-full w-full bg-void text-text-primary">

            {/* 👈 Left Panel: Token List (Explorer) */}
            <div className="w-80 flex flex-col border-r border-white/5 bg-surface-1/50">
                {/* Search Header */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tokens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-0 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                </div>

                {/* Token List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {filteredTokens.length === 0 ? (
                        <div className="p-8 text-center text-xs text-text-dim">
                            No tokens found.
                        </div>
                    ) : (
                        filteredTokens.map(token => (
                            <button
                                key={token.id}
                                onClick={() => setSelectedTokenId(token.id)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all
                                    ${selectedTokenId === token.id
                                        ? 'bg-primary/10 border border-primary/20 shadow-sm'
                                        : 'hover:bg-white/5 border border-transparent'}
                                `}
                            >
                                {/* Color Swatch / Icon */}
                                <div className="w-6 h-6 rounded flex-shrink-0 border border-white/10 flex items-center justify-center bg-surface-0 overflow-hidden">
                                    {token.$type === 'color' ? (
                                        <div className="w-full h-full" style={{ backgroundColor: String(token.$value) }} />
                                    ) : (
                                        <Layers size={12} className="text-text-dim" />
                                    )}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className={`text-xs font-semibold truncate ${selectedTokenId === token.id ? 'text-primary' : 'text-text-primary'}`}>
                                        {token.name}
                                    </div>
                                    <div className="text-[10px] text-text-dim truncate font-mono opacity-70">
                                        {String(token.$value)}
                                    </div>
                                </div>

                                {selectedTokenId === token.id && (
                                    <ChevronRight size={14} className="text-primary" />
                                )}
                            </button>
                        ))
                    )}
                </div>

                {/* Footer Stats */}
                <div className="p-3 border-t border-white/5 text-[10px] text-text-dim flex justify-between">
                    <span>{filteredTokens.length} Tokens</span>
                    <span>All Collections</span>
                </div>
            </div>

            {/* 👉 Right Panel: Token Details */}
            <div className="flex-1 overflow-y-auto bg-void relative">
                {selectedToken ? (
                    <TokenDetailPanel token={selectedToken} allTokens={tokens} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted opacity-50">
                        <Layers size={48} strokeWidth={1} className="mb-4" />
                        <p className="text-sm">Select a token to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * 📄 TokenDetailPanel
 * Displays deep information about a token without "Graph" interactions.
 * Inlined to reduce file count as per "Zero Bloat" policy.
 */
function TokenDetailPanel({ token, allTokens }: { token: TokenEntity; allTokens: TokenEntity[] }) {
    // 🧮 Simple Calculation for Usage (No Graph Library)
    const usedBy = useMemo(() => {
        return allTokens.filter(t => t.dependencies?.includes(token.id));
    }, [token, allTokens]);

    const dependsOn = useMemo(() => {
        if (!token.dependencies) return [];
        return allTokens.filter(t => token.dependencies.includes(t.id));
    }, [token, allTokens]);

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-8">

            {/* Header */}
            <header className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                            {token.$type}
                        </span>
                        <span className="text-xs text-text-dim font-mono">
                            {token.path.join(' / ')}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{token.name}</h1>
                    <p className="text-text-dim text-sm max-w-xl">
                        {token.$description || "No description provided."}
                    </p>
                </div>
            </header>

            {/* Value Display */}
            <section className="vibe-card p-6 rounded-2xl bg-surface-1 border border-white/5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Value</h3>
                <div className="flex items-center gap-6">
                    {token.$type === 'color' && (
                        <div className="w-24 h-24 rounded-2xl border border-white/10 shadow-lg" style={{ backgroundColor: String(token.$value) }} />
                    )}
                    <div className="space-y-2">
                        <div className="text-3xl font-mono font-medium text-white select-all">
                            {String(token.$value)}
                        </div>
                        <div className="text-xs text-text-dim">
                            Resolved Value
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Hero Card */}
            <StatCard
                icon={<Activity size={20} className="text-blue-400" />}
                label="Total Impact"
                // 🔥 UPDATED: Using totalRawUsage as per user request
                value={`~${token.usage?.totalRawUsage || 0}`}
                subValue="Times used in file"
                delay={0}
                hero
            />

            {/* usage details: 2 Columns - Design & Graph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 🎨 Column 1: Design Usage (Components & Styles) */}
                <div className="space-y-6">
                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Components"
                        count={token.usage?.usedInComponents.length || 0}
                        items={token.usage?.usedInComponents.map(c => ({ id: c.id, name: c.name, icon: <Layers size={12} /> }))}
                        emptyLabel="No components using this token"
                        delay={0.1}
                    />

                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Styles"
                        count={token.usage?.usedInStyles.length || 0}
                        items={token.usage?.usedInStyles.map(s => ({ id: s.id, name: s.name, icon: <div className="w-2 h-2 rounded-full bg-primary" /> }))}
                        emptyLabel="No styles bound to this token"
                        delay={0.2}
                    />
                </div>

                {/* 🕸️ Column 2: Token Graph (Dependencies) */}
                <div className="space-y-6">
                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Referenced By"
                        count={usedBy.length}
                        items={usedBy.map(t => ({
                            id: t.id,
                            name: t.name,
                            icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.$type === 'color' ? String(t.$value) : 'var(--text-muted)' }} />
                        }))}
                        emptyLabel="No other tokens refer to this"
                        delay={0.3}
                    />

                    <ListCard
                        // ❌ UPDATED: Removed Icon
                        icon={null}
                        label="Uses Tokens"
                        count={dependsOn.length}
                        items={dependsOn.map(t => ({
                            id: t.id,
                            name: t.name,
                            icon: <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.$type === 'color' ? String(t.$value) : 'var(--text-muted)' }} />
                        }))}
                        emptyLabel="This token uses no other tokens"
                        delay={0.4}
                    />
                </div>
            </div>

        </div>
    );
}

/**
 * 📊 StatCard (Hero Variant)
 */
function StatCard({
    icon,
    label,
    value,
    subValue,
    delay = 0,
    hero = false
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    subValue: string;
    delay?: number;
    hero?: boolean;
}) {
    return (
        <div
            className={`group relative p-6 rounded-2xl bg-surface-1 border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 ${hero ? 'bg-gradient-to-r from-surface-1 to-surface-2' : ''}`}
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{label}</span>
                        {icon}
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                        {value}
                    </div>
                    <div className="text-xs text-text-dim mt-1">{subValue}</div>
                </div>
                {/* Visual Decoration for Hero */}
                {hero && <Activity size={48} className="text-white/5 stroke-1" />}
            </div>
        </div>
    );
}

/**
 * 📜 ListCard
 * Combines a statistic header with a scrollable list of items.
 * "Referenced By Tokens (1) in the card that shows the number"
 */
function ListCard({
    icon,
    label,
    count,
    items = [],
    emptyLabel,
    delay = 0
}: {
    icon: React.ReactNode | null; // Allow null for headerless look
    label: string;
    count: number;
    items?: { id: string; name: string; icon?: React.ReactNode }[];
    emptyLabel: string;
    delay?: number;
}) {
    return (
        <div
            className="group flex flex-col h-[240px] p-5 rounded-2xl bg-surface-1 border border-white/5 overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                    {/* Conditionally render icon box if icon exists */}
                    {icon && (
                        <div className="p-2 rounded-lg bg-surface-0 border border-white/5 text-text-dim group-hover:text-white transition-colors">
                            {icon}
                        </div>
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted group-hover:text-text-primary transition-colors">
                        {label}
                    </span>
                </div>
                <div className="text-2xl font-bold text-white">
                    {count}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                {items.length > 0 ? (
                    <div className="space-y-1">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-0/50 hover:bg-surface-0 border border-transparent hover:border-white/5 transition-all cursor-default">
                                <div className="text-text-dim flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-xs text-text-primary truncate select-text">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-center p-4">
                        <p className="text-[10px] text-text-dim italic opacity-50">{emptyLabel}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
