import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { type TokenEntity } from '../../core/types';

interface Node {
    id: string;
    token: TokenEntity;
    x: number;
    y: number;
}

interface Edge {
    source: string;
    target: string;
}

interface GraphEditorProps {
    tokens: TokenEntity[];
    onSelect: (id: string) => void;
}

export function GraphEditor({ tokens, onSelect }: GraphEditorProps) {
    // Initial Layout: Grid or Random positions
    const [nodes, setNodes] = useState<Node[]>(() => {
        return tokens.map((t, i) => ({
            id: t.id,
            token: t,
            x: 100 + (i % 5) * 150,
            y: 100 + Math.floor(i / 5) * 120
        }));
    });

    const edges = useMemo(() => {
        const list: Edge[] = [];
        tokens.forEach(t => {
            t.dependencies.forEach(depId => {
                list.push({ source: depId, target: t.id });
            });
        });
        return list;
    }, [tokens]);

    const handleDrag = (id: string, info: any) => {
        setNodes(curr => curr.map(n =>
            n.id === id ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y } : n
        ));
    };

    return (
        <div className="w-full h-full bg-surface-0 relative overflow-hidden cursor-grab active:cursor-grabbing select-none">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(168, 85, 247, 0.3)" />
                    </marker>
                </defs>
                {edges.map((edge, idx) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    return (
                        <line
                            key={`${edge.source}-${edge.target}-${idx}`}
                            x1={sourceNode.x + 60}
                            y1={sourceNode.y + 20}
                            x2={targetNode.x + 60}
                            y2={targetNode.y + 20}
                            stroke="rgba(168, 85, 247, 0.2)"
                            strokeWidth="1"
                            markerEnd="url(#arrowhead)"
                        />
                    );
                })}
            </svg>

            {nodes.map(node => (
                <motion.div
                    key={node.id}
                    drag
                    dragMomentum={false}
                    onDrag={(_e, info) => handleDrag(node.id, info)}
                    onClick={() => onSelect(node.id)}
                    style={{ x: node.x, y: node.y }}
                    className="absolute w-[120px] p-2 rounded-lg bg-surface-1 border border-surface-active shadow-glass backdrop-blur-sm cursor-pointer hover:border-primary/50 transition-colors z-10"
                >
                    <div className="flex items-center gap-2 mb-1">
                        {node.token.$type === 'color' && (
                            <div
                                className="w-3 h-3 rounded-full border border-white/10"
                                style={{ backgroundColor: String(node.token.$value) }}
                            />
                        )}
                        <span className="text-[10px] font-bold text-text-primary truncate">{node.token.name}</span>
                    </div>
                    <div className="text-[8px] text-text-muted truncate">
                        {String(node.token.$value)}
                    </div>
                </motion.div>
            ))}

            {/* Hint Overlay */}
            <div className="absolute bottom-4 right-4 text-[10px] text-text-muted pointer-events-none bg-surface-0/50 px-2 py-1 rounded border border-surface-active">
                Drag nodes to organize • Click to inspect
            </div>
        </div>
    );
}
