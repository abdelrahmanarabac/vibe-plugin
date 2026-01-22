import { useState, useMemo, useEffect } from 'react';
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

/**
 * 🌌 Spatial Graph Editor
 * Visualizes token relationships with draggable nodes and connecting edges.
 */
export function GraphEditor({ tokens, onSelect }: GraphEditorProps) {
    const [nodes, setNodes] = useState<Node[]>([]);

    // 🔄 Sync nodes state when tokens prop updates (Essential for async data flow)
    useEffect(() => {
        setNodes(currNodes => {
            const newNodeList: Node[] = [];

            tokens.forEach((t) => {
                const existing = currNodes.find(n => n.id === t.id);
                if (existing) {
                    // Preserve position but update token data
                    newNodeList.push({ ...existing, token: t });
                } else {
                    // New node: Initial layout (Grid)
                    newNodeList.push({
                        id: t.id,
                        token: t,
                        x: 100 + (newNodeList.length % 5) * 150,
                        y: 100 + Math.floor(newNodeList.length / 5) * 120
                    });
                }
            });

            return newNodeList;
        });
    }, [tokens]);

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
        <div className="w-full h-full bg-[#030407]/40 relative overflow-hidden cursor-grab active:cursor-grabbing select-none rounded-[32px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 240, 255, 0.2)" />
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
                            stroke="rgba(0, 240, 255, 0.15)"
                            strokeWidth="1.5"
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
                    className="absolute w-[130px] p-2.5 rounded-xl bg-[#0A0C14]/80 border border-white/10 shadow-2xl backdrop-blur-xl cursor-pointer hover:border-primary/50 transition-colors z-10"
                >
                    <div className="flex items-center gap-2 mb-1.5 overflow-hidden">
                        {node.token.$type === 'color' && (
                            <div
                                className="w-3 h-3 flex-shrink-0 rounded-full border border-white/20 shadow-inner"
                                style={{ backgroundColor: String(node.token.$value) }}
                            />
                        )}
                        <span className="text-[10px] font-bold text-white truncate font-display tracking-tight">
                            {node.token.name}
                        </span>
                    </div>
                    <div className="text-[9px] font-mono text-text-dim truncate bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5 group-hover:text-primary transition-colors">
                        {String(node.token.$value)}
                    </div>
                </motion.div>
            ))}

            {/* Hint Overlay */}
            <div className="absolute bottom-6 right-6 text-[9px] font-bold uppercase tracking-widest text-text-muted/60 pointer-events-none bg-void/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                Spatial Perspective • Drag to Navigate
            </div>
        </div>
    );
}
