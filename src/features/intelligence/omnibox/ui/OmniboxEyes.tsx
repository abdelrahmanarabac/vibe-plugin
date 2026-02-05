import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export const OmniboxEyes = ({ expression = 'neutral' }: { expression?: 'neutral' | 'happy' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            // Limit movement range (max 3px in any direction)
            const maxMove = 3;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const scale = distance > 0 ? Math.min(distance, 50) / 50 : 0; // increasing sensitivity

            const x = (dx / (distance || 1)) * maxMove * scale;
            const y = (dy / (distance || 1)) * maxMove * scale;

            setPupilPos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Blinking logic
    useEffect(() => {
        const blinkLoop = () => {
            const timeToNextBlink = Math.random() * 3000 + 2000; // 2-5s
            setTimeout(() => {
                setIsBlinking(true);
                setTimeout(() => {
                    setIsBlinking(false);
                    blinkLoop();
                }, 150);
            }, timeToNextBlink);
        };
        blinkLoop();
    }, []);

    return (
        <div ref={containerRef} className="flex gap-[2px] items-center justify-center w-full h-full">
            {/* Left Eye */}
            <Eye isBlinking={isBlinking} pupilPos={pupilPos} expression={expression} />
            {/* Right Eye */}
            <Eye isBlinking={isBlinking} pupilPos={pupilPos} expression={expression} />
        </div>
    );
};

const Eye = ({ isBlinking, pupilPos, expression }: { isBlinking: boolean; pupilPos: { x: number; y: number }, expression: 'neutral' | 'happy' }) => {
    // Memoize the random tilt so it doesn't change on every render frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const randomTilt = useMemo(() => Math.random() > 0.5 ? -10 : 10, [expression === 'happy']);

    return (
        <div className="relative w-2.5 h-3.5 rounded-full overflow-hidden shadow-sm">
            <motion.div
                initial={false}
                animate={{
                    // Squint logic:
                    height: expression === 'happy' ? '12px' : '100%',
                    borderRadius: expression === 'happy' ? '0px 0px 100% 100%' : '100%',
                    // Blink logic overrides
                    scaleY: isBlinking ? 0.1 : (expression === 'happy' ? 0.6 : 1),
                    rotate: expression === 'happy' ? randomTilt : 0, // Cheerful tilt
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-full h-full bg-white relative flex items-center justify-center ${expression === 'happy' ? 'mt-1' : ''}`}
            >
                <motion.div
                    className="w-1.5 h-1.5 bg-black rounded-full"
                    animate={{
                        x: pupilPos.x,
                        y: pupilPos.y,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
            </motion.div>
        </div>
    );
};
