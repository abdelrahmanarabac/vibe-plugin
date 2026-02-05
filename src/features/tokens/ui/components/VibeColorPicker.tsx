import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Check, Pipette } from 'lucide-react';
import { VibeSelect } from '../../../../components/shared/base/VibeSelect';
import {
    hexToRgb,
    rgbToHsv,
    hsvToRgb,
    toHex6
} from '../../../../shared/lib/colors';

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

/**
 * 🎨 VibeColorPicker (Elite Edition)
 * Integrates robust HSV logic with an immersive glassmorphic interface.
 * Refactored for cleaner layout: No Alpha, Full-width inputs, Bottom format selector.
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
                    // Check if update is needed to avoid loop
                    if (hsv.s !== newHsv.s || hsv.v !== newHsv.v) {
                        // eslint-disable-next-line react-hooks/set-state-in-effect
                        setHsv(prev => ({ ...newHsv, h: prev.h }));
                    }
                } else {
                    // Check equal
                    if (hsv.h !== newHsv.h || hsv.s !== newHsv.s || hsv.v !== newHsv.v) {
                        setHsv(newHsv);
                    }
                }
            }
        } catch (e) {
            console.error("[VibeColorPicker] Sync failed:", e);
        }
    }, [value, isDragging, hsv]);

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

        // ⚡ Performance: RAF Loop for smooth 60fps tracking
        requestAnimationFrame(() => {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            updateFromPosition(clientX, clientY);
        });
    }, [isDragging, updateFromPosition]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleMouseMove, { passive: false });
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
                    <div className="w-full">
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-lg font-bold select-none group-focus-within/input:text-primary/70 transition-colors">#</span>
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
                                placeholder="000000"
                                maxLength={6}
                                className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl text-left text-lg font-mono font-bold text-white/90 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200 uppercase pl-9 tracking-[0.15em] hover:border-white/20 hover:bg-[#121212]"
                            />
                        </div>
                    </div>
                );
            case 'RGB':
                return (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {(['r', 'g', 'b'] as const).map((ch) => (
                            <div key={ch} className="relative group/input">
                                <label className="absolute left-0 -top-2.5 text-[9px] font-bold text-white/30 uppercase tracking-wider group-focus-within/input:text-primary transition-colors">{ch}</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={rgb[ch]}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        const clamped = Math.max(0, Math.min(255, val));
                                        const newRgb = { ...rgb, [ch]: clamped };
                                        const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b);
                                        setHsv(newHsv);
                                        onChange(toHex6(newRgb));
                                    }}
                                    className="w-full h-12 bg-[#0A0A0A] border border-white/10 rounded-xl text-center text-base font-mono font-bold text-white/90 outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all duration-200 hover:border-white/20 hover:bg-[#121212] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
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
                            dragMomentum={true}
                            initial={{ opacity: 0, scale: 0.96, y: '-45%', x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.96, y: '-45%', x: '-50%' }}
                            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                            style={{ position: 'fixed', top: '50%', left: '50%' }}
                            className="w-[520px] bg-[#1A1A1A] rounded-[24px] shadow-2xl z-[9999] flex flex-row ring-1 ring-white/15 p-4 gap-5"
                        >
                            {/* Saturation Area */}
                            <div className="shrink-0">
                                <div
                                    ref={boxRef}
                                    onMouseDown={handleMouseDown}
                                    onTouchStart={handleMouseDown}
                                    className="w-[240px] h-[240px] rounded-[20px] overflow-hidden relative ring-1 ring-white/20 shadow-lg group cursor-crosshair"
                                    style={{
                                        backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                        backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`
                                    }}
                                >
                                    <div
                                        className="absolute w-6 h-6 rounded-full border-[3px] border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.3),0_4px_12px_rgba(0,0,0,0.4)] pointer-events-none will-change-transform"
                                        style={{
                                            left: `${hsv.s}%`,
                                            top: `${100 - hsv.v}%`,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: value,
                                            boxShadow: `0 0 0 1.5px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.3)`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Controls Column */}
                            <div className="flex-1 flex flex-col h-[240px]">
                                {/* Header */}
                                <div
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="flex items-center justify-between cursor-grab active:cursor-grabbing mb-4"
                                >
                                    <span className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.1em] flex items-center gap-1.5">
                                        <Pipette size={11} strokeWidth={2.5} />
                                        PICKER
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-2 px-3 h-7 hover:bg-white/10 rounded-lg transition-all duration-200 text-primary hover:scale-105 active:scale-95"
                                    >
                                        <Check size={14} strokeWidth={3} />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider">Done</span>
                                    </button>
                                </div>

                                {/* Main Controls */}
                                <div className="flex-1 flex flex-col gap-5">
                                    {/* Hue Slider */}
                                    <div>
                                        <div className="relative h-3 w-full rounded-full ring-1 ring-white/20 shadow-lg"
                                            style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="360"
                                                value={hsv.h}
                                                onChange={handleHueChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div
                                                className="absolute top-1/2 w-5 h-5 rounded-full border-[3px] border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.4),0_4px_16px_rgba(0,0,0,0.5)] pointer-events-none transition-all duration-100 z-20"
                                                style={{
                                                    left: `${(hsv.h / 360) * 100}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                                    boxShadow: '0 0 0 1.5px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.25)'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Inputs Area */}
                                    <div className="flex items-center justify-center pt-2">
                                        {renderInputs()}
                                    </div>

                                    {/* Format Selector (Bottom Anchored) */}
                                    <div className="mt-auto">
                                        <div className="w-full">
                                            <VibeSelect
                                                value={format}
                                                onChange={setFormat}
                                                options={[
                                                    { label: 'HEX', value: 'HEX' },
                                                    { label: 'RGB', value: 'RGB' }
                                                ]}
                                                size="sm"
                                                className="w-full bg-[#0A0A0A] border-white/10 hover:border-white/20"
                                            />
                                        </div>
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
