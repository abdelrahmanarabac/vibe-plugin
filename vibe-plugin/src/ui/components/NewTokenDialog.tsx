import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Palette } from 'lucide-react';

interface NewTokenDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; type: string; value: string }) => void;
}

export function NewTokenDialog({ isOpen, onClose, onSubmit }: NewTokenDialogProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('color');
    const [value, setValue] = useState('#A855F7');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && value.trim()) {
            onSubmit({ name, type, value });
            setName('');
            setValue(type === 'color' ? '#A855F7' : '16');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#1E1E1E] border border-white/10 rounded-xl p-6 w-96 shadow-2xl"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Palette size={20} className="text-[#A855F7]" />
                        Create New Token
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-white/40 mb-1.5">Token Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., primary-500"
                            className="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] outline-none"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-white/40 mb-1.5">Token Type</label>
                        <select
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setValue(e.target.value === 'color' ? '#A855F7' : '16');
                            }}
                            className="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] outline-none"
                        >
                            <option value="color">Color</option>
                            <option value="number">Number</option>
                            <option value="string">String</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs text-white/40 mb-1.5">Value</label>
                        {type === 'color' ? (
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-12 h-10 bg-transparent border border-white/10 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="flex-1 bg-[#2C2C2C] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] outline-none"
                                />
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={type === 'number' ? '16' : 'Token value'}
                                className="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] outline-none"
                            />
                        )}
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-[#A855F7] hover:bg-[#9333EA] text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-[#A855F7]/20"
                        >
                            Create Token
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
