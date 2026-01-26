import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Check, Pipette } from 'lucide-react';
import { VibeSelect } from '../../../../ui/components/base/VibeSelect';
import {
    hexToRgb,
    rgbToHsv,
    hsvToRgb,
    toHex6
} from '../../../../shared/utils/ColorUtils';

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

/**
 * 🎨 VibeColorPicker (Elite Edition)
 * Integrates robust HSV logic with an immersive glassmorphic interface.
 */
export function VibeColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState<'HSL' | 'HEX' | 'RGB'>('HEX');
    const dragControls = useDragControls();

    // Internal HSV State
    const [hsv, setHsv] = useState({ h: 0, s: 100, v: 100 });
    const [isDragging, setIsDragging] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    // 🔄 Sync: When the external color changes, update internal HSV
    useEffect(() => {
        if (isDragging) return;

        try {
            const rgb = hexToRgb(value);
            if (rgb) {
                const newHsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                // Preserve Hue when Saturation or Value are zero to prevent spinner jumping back to red
                if (newHsv.s === 0 || newHsv.v === 0) {
                    setHsv(prev => ({ ...newHsv, h: prev.h }));
                } else {
                    setHsv(newHsv);
                }
            }
        } catch (e) {
            console.error("[VibeColorPicker] Sync failed:", e);
        }
    }, [value, isDragging]);

    // 🧮 Logic: Update color based on coordinate interaction
    const updateFromPosition = useCallback((clientX: number, clientY: number) => {
        if (!boxRef.current) return;

        const rect = boxRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

        const s = (x / rect.width) * 100;
        const v = 100 - (y / rect.height) * 100;

        const nextHsv = { ...hsv, s, v };
        setHsv(nextHsv);

        const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
        onChange(toHex6(rgb));
    }, [hsv, onChange]);

    // 🖱️ Event Handling
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        updateFromPosition(clientX, clientY);
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        updateFromPosition(clientX, clientY);
    }, [isDragging, updateFromPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const h = parseInt(e.target.value);
        const nextHsv = { ...hsv, h };
        setHsv(nextHsv);
        const rgb = hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v);
        onChange(toHex6(rgb));
    };

    const renderInputs = () => {
        const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const hex = toHex6(rgb);

        switch (format) {
            case 'HEX':
                return (
                    <div className="flex-1">
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-[11px] font-bold">#</span>
                            <input
                                type="text"
                                value={hex.replace('#', '')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 6) {
                                        const c = hexToRgb('#' + val);
                                        if (c) {
                                            const next = rgbToHsv(c.r, c.g, c.b);
                                            setHsv(next);
                                            onChange(toHex6(c));
                                        }
                                    }
                                }}
                                className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-xl text-center text-[12px] font-mono text-white outline-none focus:border-primary/50 transition-all uppercase pl-6"
                            />
                        </div>
                    </div>
                );
            case 'RGB':
                return (
                    <div className="flex gap-2 flex-1">
                        {(['r', 'g', 'b'] as const).map(ch => (
                            <input
                                key={ch}
                                type="number"
                                value={rgb[ch]}
                                readOnly
                                className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-xl text-center text-[12px] font-mono text-text-dim opacity-70 outline-none"
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative">
            {/* Trigger Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-11 h-11 rounded-xl border border-white/10 shadow-lg transition-transform active:scale-95 group relative overflow-hidden"
                style={{ backgroundColor: value }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                        />

                        <motion.div
                            drag
                            dragListener={false}
                            dragControls={dragControls}
                            dragMomentum={false}
                            initial={{ opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.95, y: '-45%', x: '-50%' }}
                            style={{ position: 'fixed', top: '50%', left: '50%' }}
                            className="w-[510px] bg-[#0E0E0E] rounded-[28px] shadow-2xl z-[9999] flex flex-row ring-1 ring-white/10 p-1"
                        >
                            {/* Saturation Area */}
                            <div className="shrink-0 p-1">
                                <div
                                    ref={boxRef}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleMouseDown}
                                    className="w-[220px] h-[220px] rounded-[24px] overflow-hidden relative ring-1 ring-white/10 shadow-inner group cursor-crosshair"
                                    style={{
                                        backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                        backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`
                                    }}
                                >
                                    <div
                                        className="absolute w-5 h-5 rounded-full border-[2px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none transition-transform"
                                        style={{
                                            left: `${hsv.s}%`,
                                            top: `${100 - hsv.v}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: value
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex-1 flex flex-col min-w-0 pl-1 pr-3 py-3">
                                <div
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="flex items-center justify-between cursor-grab active:cursor-grabbing mb-6 pl-2"
                                >
                                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                        <Pipette size={12} />
                                        Picker
                                    </span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-primary"
                                    >
                                        <Check size={16} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="px-1">
                                        <div className="relative h-3 w-full rounded-full ring-1 ring-white/10 border border-gray-900"
                                            style={{ background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)' }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={hsv.h}
                                                onChange={handleHueChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[2px] border-white bg-white shadow-md pointer-events-none"
                                                style={{ left: `${(hsv.h / 360) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-end">
                                        <div className="w-[85px] shrink-0">
                                            <VibeSelect
                                                value={format}
                                                onChange={setFormat}
                                                options={[
                                                    { label: 'HEX', value: 'HEX' },
                                                    { label: 'RGB', value: 'RGB' }
                                                ]}
                                                className="h-10 px-0 text-xs"
                                            />
                                        </div>
                                        {renderInputs()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

