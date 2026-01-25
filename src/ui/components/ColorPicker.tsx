import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Hash, Zap } from 'lucide-react';
import { colord } from 'colord';
import { ColorPalette } from '../../features/color/ColorPalette';

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

const PRESETS = [
    // ⚡ Electric Accents
    { name: 'Primary', hex: '#6E62E5' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Cyan', hex: '#00E5FF' },

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
];

export function VibeColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate the full scale for the currently selected color
    const currentScale = ColorPalette.generateScale(value);

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
    const activeGlow = colord(value).alpha(isLight ? 0.15 : 0.3).toRgbString();

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger Swatch: Premium Glassmorphic Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 bg-[#0A0A0A] border border-white/5 hover:border-white/10 active:scale-95 transition-all duration-300"
            >
                {/* Dynamic Neon Glow */}
                <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: activeGlow }}
                />

                {/* Main Color Swatch */}
                <div
                    className="relative w-full h-full rounded-[10px] flex items-center justify-center overflow-hidden border border-black/20 shadow-inner"
                    style={{ backgroundColor: value }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                    <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)' }}
                    />
                </div>
            </button>

            {/* Popover: Ultra-Modern Glassmorphic Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(10px)' }}
                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                        className="absolute top-16 left-1/2 -translate-x-1/2 z-[100] w-72 p-1 rounded-[24px] bg-[#080808]/90 border border-white/10 shadow-[0_30px_90px_-20px_rgba(0,0,0,1)] backdrop-blur-3xl"
                    >
                        {/* 1. Header with Neon Accent */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Zap size={10} className="text-primary animate-pulse" />
                                Color Engine v2
                            </span>
                            <div className="flex gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-primary/40" />
                                <div className="w-1 h-1 rounded-full bg-primary/20" />
                                <div className="w-1 h-1 rounded-full bg-primary/10" />
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* 2. Atomic Scale (50-950) */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5">
                                        <Sparkles size={8} />
                                        Spectral Distro
                                    </h4>
                                    <span className="text-[8px] font-mono text-white/10">PRO-SCALE</span>
                                </div>
                                <div className="flex gap-1 h-10">
                                    {Object.entries(currentScale).map(([stop, hex]) => (
                                        <button
                                            key={stop}
                                            type="button"
                                            onClick={() => onChange(hex)}
                                            className={`flex-1 rounded-lg border border-white/5 transition-all hover:scale-110 hover:z-10 relative overflow-hidden ${value.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-primary/60 ring-offset-2 ring-offset-[#080808]' : 'opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: hex }}
                                            title={`${stop}: ${hex}`}
                                        >
                                            {value.toLowerCase() === hex.toLowerCase() && (
                                                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Preset Matrix */}
                            <div className="space-y-3">
                                <h4 className="text-[9px] font-bold text-white/20 uppercase tracking-widest pl-1">Vibe Matrix</h4>
                                <div className="grid grid-cols-4 gap-2">
                                    {PRESETS.map((color) => (
                                        <button
                                            key={color.hex}
                                            type="button"
                                            onClick={() => onChange(color.hex)}
                                            className="group relative w-full aspect-square rounded-[18px] bg-[#111111] border border-white/5 flex items-center justify-center transition-all hover:border-white/20 hover:bg-[#181818] overflow-hidden"
                                        >
                                            <div
                                                className="w-1/2 h-1/2 rounded-full shadow-lg transition-all duration-300 group-hover:scale-125 blur-[1px] group-hover:blur-0"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            {value.toLowerCase() === color.hex.toLowerCase() && (
                                                <>
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="absolute inset-0 rounded-[18px] border-2 border-primary/50 pointer-events-none"
                                                    />
                                                    <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                                                </>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Manual Precision Control */}
                            <div className="pt-2 border-t border-white/5">
                                <label className="group relative flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 cursor-pointer transition-all active:scale-[0.98]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/5 flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                                            <Hash size={12} className="text-white/30 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-wider">Manual Hook</span>
                                            <span className="text-[11px] font-mono text-white/40 group-hover:text-white/80 uppercase">{value}</span>
                                        </div>
                                    </div>
                                    <div className="relative w-8 h-8 rounded-full border border-white/10 overflow-hidden shadow-xl">
                                        <input
                                            type="color"
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 opacity-20" />
                                        <div
                                            className="absolute inset-1 rounded-full border border-white/10 shadow-inner"
                                            style={{ backgroundColor: value }}
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Visual Floor Decor */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-30" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
