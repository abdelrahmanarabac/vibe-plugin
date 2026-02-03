import { useState } from 'react';
import { type TokenEntity } from '../../../../core/types';
import { Table, Eye, Code, Package, Terminal } from 'lucide-react';

import type { VariableValue } from '../../../../core/types';

interface SmartInspectorProps {
    tokens: TokenEntity[];
    onUpdate: (id: string, value: VariableValue) => void;
}

export function SmartInspector({ tokens, onUpdate }: SmartInspectorProps) {
    const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
    const [jsonContent, setJsonContent] = useState(() => JSON.stringify(tokens, null, 2));

    // Suppress unused onUpdate warning until fully implemented with diffing engine
    void onUpdate;

    const handleJsonSave = () => {
        try {
            const parsed = JSON.parse(jsonContent);
            // In a real implementation, we'd diff and apply partial updates
            console.log("Saving JSON Surgery:", parsed);
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "JSON Surgery Applied (Simulation)" } }, '*');
        } catch {
            parent.postMessage({ pluginMessage: { type: 'NOTIFY', message: "Invalid JSON Syntax" } }, '*');
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-0 font-sans">
            {/* Toolbar */}
            <div className="p-3 border-b border-surface-1 flex items-center justify-between bg-surface-1/30">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Terminal size={14} className="text-primary" />
                        Smart Inspector
                    </h2>
                    <div className="flex bg-surface-0 rounded-md p-0.5 border border-surface-active">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all ${viewMode === 'table' ? 'bg-surface-active text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            <Table size={12} /> Table View
                        </button>
                        <button
                            onClick={() => setViewMode('json')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium transition-all ${viewMode === 'json' ? 'bg-surface-active text-text-primary shadow-sm' : 'text-text-muted hover:text-text-secondary'}`}
                        >
                            <Code size={12} /> Surgical JSON
                        </button>
                    </div>
                </div>

                <div className="text-[10px] text-text-muted font-mono bg-surface-1 px-2 py-1 rounded">
                    NODES_TOTAL: {tokens.length}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {viewMode === 'table' ? (
                    <div className="h-full overflow-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="sticky top-0 bg-surface-1/80 backdrop-blur-md z-1">
                                <tr className="border-b border-surface-active">
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Token Name</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Value</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">References</th>
                                    <th className="px-4 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-active/50">
                                {tokens.map(token => (
                                    <tr key={token.id} className="hover:bg-surface-1/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded bg-surface-1 flex items-center justify-center text-[10px] text-text-muted">
                                                    <Package size={10} />
                                                </div>
                                                <span className="text-xs font-medium text-text-primary">{token.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                                                {token.$type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-[10px] text-text-secondary">
                                            <div className="flex items-center gap-2">
                                                {token.$type === 'color' && (
                                                    <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: String(token.$value) }} />
                                                )}
                                                {String(token.$value)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[10px] text-text-muted">
                                            {token.dependencies.length} Deps / {token.dependents.length} Refs
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="p-1.5 text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                                                <Eye size={12} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Request deep sync
                                                }}
                                                className="p-1 hover:bg-white/10 rounded"
                                            >
                                                {/* Placeholder for new button content */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-full flex flex-col p-4 bg-[#0d1117]">
                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            className="flex-1 bg-transparent text-success font-mono text-xs outline-none resize-none border-none leading-relaxed"
                            spellCheck={false}
                        />
                        <div className="mt-4 flex justify-end gap-2 shrink-0">
                            <button
                                onClick={handleJsonSave}
                                className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/40 rounded-md text-[10px] font-bold hover:bg-primary/30 transition-all shadow-glow-primary"
                            >
                                UPDATE_DATA_L7
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
