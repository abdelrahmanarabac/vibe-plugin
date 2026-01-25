import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { colord } from 'colord';

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

const PRESETS = [
    // ⚡ Electric Accents
    { name: 'Primary', hex: '#6E62E5' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Cyan', hex: '#CFFAFE' },

    // 🚦 Signals
    { name: 'Success', hex: '#10B981' },
    { name: 'Warning', hex: '#F59E0B' },
    { name: 'Error', hex: '#F43F5E' },
    { name: 'Info', hex: '#0EA5E9' },

    // 🌑 Void Scale
    { name: 'Void', hex: '#050505' },
    { name: 'Surface', hex: '#18181B' },
    { name: 'Elevated', hex: '#27272A' },
    { name: 'Text', hex: '#E5E5E5' },

    // 🌈 Rainbow (Standard)
    { name: 'Red', hex: '#EF4444' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Blue', hex: '#3B82F6' },
];

export function VibeColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isLight = colord(value).isLight();

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 active:scale-95 transition-transform overflow-hidden relative group"
                style={{ backgroundColor: value }}
            >
                <div className={`absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 opacity-50`} />
                <div className={`absolute inset-0 ring-1 ring-inset ring-black/10`} />
                <ChevronDown
                    size={14}
                    className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: isLight ? 'black' : 'white', opacity: 0.7 }}
                />
            </button>

            {/* Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="absolute top-14 left-0 z-50 w-64 p-3 rounded-2xl bg-[#0C0C0C] border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
                    >
                        {/* Grid */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 pl-1">Vibe Palette</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {PRESETS.map((color) => (
                                        <button
                                            key={color.hex}
                                            type="button"
                                            onClick={() => { onChange(color.hex); setIsOpen(false); }}
                                            className="w-full aspect-square rounded-lg relative group transition-transform hover:scale-105 active:scale-95"
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {/* Selection Indicator */}
                                            {value.toLowerCase() === color.hex.toLowerCase() && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Check size={12} color={colord(color.hex).isLight() ? 'black' : 'white'} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Native Fallback for Spectrum */}
                            <div className="pt-2 border-t border-white/5">
                                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 cursor-pointer opacity-0"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                                    </div>
                                    <span className="text-xs text-white/50 group-hover:text-white transition-colors">Custom Spectrum</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
