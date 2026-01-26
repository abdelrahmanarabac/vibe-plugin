import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Check, Pipette } from 'lucide-react';
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
    const [format, setFormat] = useState<'HSL' | 'HEX' | 'RGB'>('HEX');
    const dragControls = useDragControls();

    // Local state for smooth interaction
    const [hsva, setHsva] = useState(() => {
        const c = colord(value);
        return c.isValid() ? c.toHsv() : { h: 250, s: 57, v: 90, a: 1 };
    });

    const { h, s, v, a } = hsva;

    // Sync from Props
    useEffect(() => {
        const incoming = colord(value);
        if (incoming.isValid()) {
            const currentHex = colord(hsva).toHex();
            if (incoming.toHex() !== currentHex) {
                setHsva(incoming.toHsv());
            }
        }
    }, [value]);

    // Internal Update Handler
    const updateColor = useCallback((updates: Partial<{ h: number; s: number; v: number; a: number }>) => {
        setHsva(prev => {
            const next = { ...prev, ...updates };
            const newColor = colord(next);
            onChange(newColor.toHex());
            return next;
        });
    }, [onChange]);

    // Saturation/Value Logic
    const svRef = useRef<HTMLDivElement>(null);
    const handleSVMouse = (e: React.MouseEvent | React.TouchEvent) => {
        if (!svRef.current) return;
        const rect = svRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));

        updateColor({ s: x * 100, v: y * 100 });
    };

    const startSVDrag = (e: React.MouseEvent | React.TouchEvent) => {
        handleSVMouse(e);
        const onMove = (evt: any) => handleSVMouse(evt);
        const onUp = () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);
    };

    // Channel Handlers
    const handleChannelChange = (mode: 'RGB' | 'HSL', channel: string, val: string) => {
        const num = parseInt(val);
        if (isNaN(num)) return;

        if (mode === 'RGB') {
            const current = colord(hsva).toRgb();
            const newRgb = { ...current, [channel]: num };
            if (colord(newRgb).isValid()) {
                setHsva(colord(newRgb).toHsv());
                onChange(colord(newRgb).toHex());
            }
        } else if (mode === 'HSL') {
            const current = colord(hsva).toHsl();
            const newHsl = { ...current, [channel]: num };
            if (colord(newHsl).isValid()) {
                setHsva(colord(newHsl).toHsv());
                onChange(colord(newHsl).toHex());
            }
        }
    };

    const handleHexChange = (val: string) => {
        if (colord(val).isValid()) {
            setHsva(colord(val).toHsv());
            onChange(colord(val).toHex());
        }
    };

    const renderInputs = () => {
        const c = colord(hsva);

        switch (format) {
            case 'HEX':
                return (
                    <div className="flex-1">
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-[11px] font-bold select-none">#</span>
                            <input
                                type="text"
                                value={c.toHex().replace('#', '').toUpperCase()}
                                onChange={(e) => handleHexChange('#' + e.target.value)}
                                className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-xl text-center text-[12px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all uppercase pl-6 shadow-inner"
                            />
                        </div>
                    </div>
                );
            case 'RGB': {
                const rgb = c.toRgb();
                return (
                    <div className="flex gap-2 flex-1">
                        {(['r', 'g', 'b'] as const).map(ch => (
                            <div key={ch} className="relative flex-1 group">
                                <label className="absolute left-0 -top-4 w-full text-center text-[9px] font-bold text-text-dim uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    {ch}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={rgb[ch]}
                                    onChange={(e) => handleChannelChange('RGB', ch, e.target.value)}
                                    className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-xl text-center text-[12px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
                                />
                            </div>
                        ))}
                    </div>
                );
            }
            case 'HSL': {
                const hsl = c.toHsl();
                return (
                    <div className="flex gap-2 flex-1">
                        {(['h', 's', 'l'] as const).map(ch => (
                            <div key={ch} className="relative flex-1 group">
                                <label className="absolute left-0 -top-4 w-full text-center text-[9px] font-bold text-text-dim uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    {ch.toUpperCase()}
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    max={ch === 'h' ? 360 : 100}
                                    value={Math.round(hsl[ch])}
                                    onChange={(e) => handleChannelChange('HSL', ch, e.target.value)}
                                    className="w-full h-10 bg-[#1A1A1A] border border-white/10 rounded-xl text-center text-[12px] font-mono text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all shadow-inner"
                                />
                            </div>
                        ))}
                    </div>
                );
            }
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Swatch */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-11 h-11 rounded-xl border border-white/10 shadow-lg transition-transform active:scale-95 group relative overflow-hidden"
                style={{ backgroundColor: colord(hsva).toHex() }}
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
                            // Start centered
                            style={{ position: 'fixed', top: '50%', left: '50%' }}
                            className="w-[510px] bg-[#0E0E0E] rounded-[28px] shadow-2xl z-[9999] flex flex-row ring-1 ring-white/10 p-1"
                        >
                            {/* LEFT: Saturation Area (Square) */}
                            <div className="shrink-0 p-1">
                                <div className="w-[220px] h-[220px] rounded-[24px] overflow-hidden relative ring-1 ring-white/10 shadow-inner group cursor-crosshair">
                                    <div
                                        ref={svRef}
                                        onMouseDown={startSVDrag}
                                        onTouchStart={startSVDrag}
                                        className="absolute inset-0 w-full h-full"
                                        style={{
                                            backgroundColor: `hsl(${h}, 100%, 50%)`,
                                            backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`
                                        }}
                                    >
                                        <div
                                            className="absolute w-5 h-5 rounded-full border-[2px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] pointer-events-none transition-transform group-active:scale-75"
                                            style={{
                                                left: `${s}%`,
                                                top: `${100 - v}%`,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Controls */}
                            <div className="flex-1 flex flex-col min-w-0 pl-1 pr-3 py-3">
                                {/* Header */}
                                <div
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="flex items-center justify-between cursor-grab active:cursor-grabbing mb-6 pl-2"
                                >
                                    <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5 select-none">
                                        <Pipette size={12} />
                                        Picker
                                    </span>
                                    <button
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={() => setIsOpen(false)}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-primary"
                                    >
                                        <Check size={16} strokeWidth={3} />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col justify-center space-y-6">
                                    {/* Sliders */}
                                    <div className="space-y-4 px-1">
                                        {/* Hue */}
                                        <div className="space-y-2">
                                            <div className="relative h-5 w-full group">
                                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden ring-1 ring-white/10 shadow-inner">
                                                    <div className="w-full h-full" style={{ background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)' }} />
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
                                                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[2px] border-white bg-white shadow-md pointer-events-none transition-transform group-hover:scale-110"
                                                    style={{ left: `${(h / 360) * 100}%`, transform: 'translate(-50%, -50%)' }}
                                                />
                                            </div>
                                        </div>

                                        {/* Alpha */}
                                        <div className="space-y-2">
                                            <div className="relative h-5 w-full group">
                                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden ring-1 ring-white/10 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAACBJREFUGFdjZEADJghmYmBgYIJiYIIRmCCIEYoBAhgYAAqUAgpUvVxyAAAAAElFTkSuQmCC')] shadow-inner">
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
                                                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[2px] border-white bg-white shadow-md pointer-events-none transition-transform group-hover:scale-110"
                                                    style={{
                                                        left: `${a * 100}%`,
                                                        transform: 'translate(-50%, -50%)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inputs Row */}
                                    <div className="flex gap-3 items-end">
                                        <div className="w-[85px] shrink-0 relative z-20">
                                            <VibeSelect
                                                value={format}
                                                onChange={setFormat}
                                                options={[
                                                    { label: 'HEX', value: 'HEX' },
                                                    { label: 'RGB', value: 'RGB' },
                                                    { label: 'HSL', value: 'HSL' },
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
