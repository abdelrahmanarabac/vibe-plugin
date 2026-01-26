import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Layers, Paintbrush } from 'lucide-react';
import { VibeSelect } from './inputs/VibeSelect';

interface NewStyleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: any }) => void;
}

type StyleType = 'typography' | 'effect' | 'grid';

export function NewStyleDialog({ isOpen, onClose, onSubmit }: NewStyleDialogProps) {
    // Core State
    const [name, setName] = useState('');
    const [type, setType] = useState<StyleType>('typography');
    const [description, setDescription] = useState('');

    const handleTypeChange = (newType: string) => {
        setType(newType as StyleType);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({
                name,
                type,
                value: description // Passing description/value if needed by the backend
            });
            // Reset
            setName('');
            setDescription('');
            setType('typography');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-[#080808] border border-white/5 rounded-2xl w-[440px] shadow-2xl"
            >
                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display tracking-tight">
                        <div className="p-1 rounded-md bg-secondary/10 text-secondary">
                            <Layers size={14} />
                        </div>
                        Create Style
                    </h3>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* 2. Style Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider flex items-center justify-between h-4">
                            Style Name
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. H1 / Bold"
                                className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all placeholder:text-white/20 font-mono"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* 3. Classification */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">Type</label>
                        <div className="">
                            <VibeSelect
                                value={type}
                                onChange={(val) => handleTypeChange(val)}
                                options={[
                                    { label: 'Typography', value: 'typography' },
                                    { label: 'Effect', value: 'effect' },
                                    { label: 'Layout Grid', value: 'grid' },
                                ]}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* 4. Description / Value Input (Optional context) */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-text-dim uppercase tracking-wider h-4 flex items-center">
                            Description / Value
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 outline-none transition-all resize-none h-[80px]"
                            placeholder="Optional description or initial value..."
                        />
                    </div>

                    {/* 5. Footer Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-3 rounded-xl bg-white hover:bg-gray-200 text-xs font-bold text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
                        >
                            <Paintbrush size={14} />
                            Create Style
                        </button>
                    </div>

                </form>
            </motion.div>
        </div >
    );
}
