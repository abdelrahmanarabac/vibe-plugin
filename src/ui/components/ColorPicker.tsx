import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pipette } from 'lucide-react';
import { VibeSelect } from './inputs/VibeSelect';
import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import a11yPlugin from 'colord/plugins/a11y';

extend([namesPlugin, a11yPlugin]);

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

export function VibeColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [format, setFormat] = useState<'HSL' | 'HEX' | 'RGB'>('HSL');

    // Local state for smooth interaction and to avoid hex-conversion loss
    // We initialize from prop, but separate them to avoid jitter
    const [hsva, setHsva] = useState(() => {
        const c = colord(value);
        return c.isValid() ? c.toHsv() : { h: 250, s: 57, v: 90, a: 1 };
    });

    // Extract for render usage
    const { h, s, v, a } = hsva;

    // Sync from Props (External Change) -> Local State
    // We only update if the incoming value resolves to a DIFFERENT color than our current local state
    // This prevents the "lossy" loop where Hex -> HSV -> Hex changes slightly and moves sliders
    useEffect(() => {
        const incoming = colord(value);
        if (incoming.isValid()) {
            const incomingHsv = incoming.toHsv();
            // Check delta to avoid loop updates (allow small float diffs)
            const currentHex = colord(hsva).toHex();
            if (incoming.toHex() !== currentHex) {
                setHsva(incomingHsv);
            }
        }
    }, [value, hsva]);

    // Helper to close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Internal Update Handler
    const updateColor = useCallback((updates: Partial<{ h: number; s: number; v: number; a: number }>) => {
        setHsva(prev => {
            const next = { ...prev, ...updates };
            // Emit upwards
            const newColor = colord(next);
            onChange(newColor.toHex());
            return next;
        });
    }, [onChange]);

    // Saturation/Value Area Logic
    const svRef = useRef<HTMLDivElement>(null);
    const handleSVMouse = (e: React.MouseEvent | React.TouchEvent) => {
        if (!svRef.current) return;
        const rect = svRef.current.getBoundingClientRect();

        // Use page coordinates for better reliability during scroll/modal positions
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));

        updateColor({ s: x * 100, v: y * 100 });
    };

    const startSVDrag = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default to stop scrolling on touch
        // e.preventDefault(); 
        handleSVMouse(e);

        const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
            handleSVMouse(moveEvent as any);
        };
        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('touchmove', onMouseMove);
            window.removeEventListener('touchend', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('touchmove', onMouseMove);
        window.addEventListener('touchend', onMouseUp);
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-12 h-12 rounded-xl border border-white/10 shadow-lg transition-transform active:scale-95 group relative overflow-hidden"
                style={{ backgroundColor: colord(hsva).toHex() }}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Global Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        />

                        {/* Centered Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-[#0E0E0E] border border-white/10 rounded-[24px] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] z-[9999] overflow-visible flex flex-col"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02] rounded-t-[24px]">
                                <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Pipette size={12} className="text-white/20" />
                                    Solid Fill
                                </span>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                                    <X size={14} />
                                </button>
                            </div>

                            {/* Saturation/Value Area */}
                            <div className="p-1">
                                <div
                                    ref={svRef}
                                    onMouseDown={startSVDrag}
                                    onTouchStart={startSVDrag}
                                    className="relative w-full aspect-square cursor-crosshair select-none rounded-[20px] overflow-hidden"
                                    style={{
                                        backgroundColor: `hsl(${h}, 100%, 50%)`,
                                        backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`
                                    }}
                                >
                                    <motion.div
                                        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] pointer-events-none"
                                        style={{
                                            left: `${s}%`,
                                            top: `${100 - v}%`, // Inverted Logic: 100% Value is TOP (0%), 0% Value is BOTTOM (100%)
                                            x: '-50%',
                                            y: '-50%',
                                            backgroundColor: colord(hsva).toHex()
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Controls Area */}
                            <div className="p-4 space-y-5">
                                <div className="space-y-4">
                                    {/* Hue Slider */}
                                    <div className="relative h-4 w-full group">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden border border-white/5 mx-2">
                                            <div className="w-full h-full" style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }} />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="360"
                                            value={h}
                                            onChange={(e) => updateColor({ h: parseInt(e.target.value) })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-white shadow-md pointer-events-none transition-transform group-active:scale-110"
                                            style={{
                                                left: `calc(${(h / 360) * 100}% - 4px)`, // Just basic % since track is full width essentially
                                                marginLeft: '4px',
                                                backgroundColor: `hsl(${h}, 100%, 50%)`
                                            }}
                                        />
                                    </div>

                                    {/* Alpha Slider */}
                                    <div className="relative h-4 w-full group">
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full overflow-hidden border border-white/5 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACBJREFUGFdjZEADJghmYmBgYIJiYIIRmCCIEYoBAhgYAAqUAgpUvVxyAAAAAElFTkSuQmCC')] mx-2">
                                            <div className="w-full h-full" style={{ background: `linear-gradient(to right, transparent, hsl(${h}, 100%, 50%))` }} />
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={a}
                                            onChange={(e) => updateColor({ a: parseFloat(e.target.value) })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-white shadow-md pointer-events-none transition-transform group-active:scale-110"
                                            style={{
                                                left: `calc(${a * 100}% - 4px)`,
                                                marginLeft: '4px',
                                                backgroundColor: colord(hsva).toHex()
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Inputs Row */}
                                <div className="flex gap-3">
                                    <div className="w-[88px] h-[40px]">
                                        <VibeSelect
                                            value={format}
                                            onChange={setFormat}
                                            options={[
                                                { label: 'HSL', value: 'HSL' },
                                                { label: 'HEX', value: 'HEX' },
                                                { label: 'RGB', value: 'RGB' },
                                            ]}
                                            className="h-full"
                                        />
                                    </div>

                                    <div className="flex-1 flex gap-2">
                                        {format === 'HSL' ? (
                                            <>
                                                {[Math.round(h), Math.round(s), Math.round(v), Math.round(a * 100)].map((val, i) => (
                                                    <div key={i} className="flex-1 min-w-0 h-[40px]">
                                                        <input
                                                            type="text"
                                                            value={i === 3 ? `${val}%` : val}
                                                            readOnly
                                                            className="w-full h-full bg-[#1A1A1A] border border-white/5 rounded-xl text-center text-[13px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                                        />
                                                    </div>
                                                ))}
                                            </>
                                        ) : format === 'HEX' ? (
                                            <input
                                                type="text"
                                                value={colord(hsva).toHex().toUpperCase()}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (colord(val).isValid()) {
                                                        onChange(val); // Update parent
                                                        // Local state will update via useEffect
                                                    }
                                                }}
                                                className="w-full h-[40px] bg-[#1A1A1A] border border-white/5 rounded-xl px-3 text-center text-[13px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all uppercase"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={colord(hsva).toRgbString()}
                                                readOnly
                                                className="w-full h-[40px] bg-[#1A1A1A] border border-white/5 rounded-xl px-3 text-center text-[13px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                                            />
                                        )}
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
