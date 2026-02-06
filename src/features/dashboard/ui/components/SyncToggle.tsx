import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../../../shared/lib/classnames';

interface SyncToggleProps {
    onClick?: () => void;
    isSyncing?: boolean;
    isActive?: boolean;
    className?: string;
}

/**
 * 🎚️ SyncToggle
 * A smart, vertical toggle-style button for triggering synchronization.
 * 
 * Behavior:
 * - Idle (No): Thumb at bottom, surface color.
 * - Active (Yes): Thumb at top, primary color.
 * - Syncing: Thumb spins (does not dictate position).
 */
export const SyncToggle: React.FC<SyncToggleProps> = ({
    onClick,
    isSyncing = false,
    isActive = false,
    className
}) => {
    return (
        <div
            className={cn(
                "group relative flex flex-col items-center justify-between py-2 w-14 h-32 rounded-full transition-all duration-300",
                "bg-surface-2/30 border border-white/5 backdrop-blur-md cursor-pointer",
                "hover:bg-surface-2/50 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/10",
                isActive ? "border-primary/50 bg-surface-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]" : "",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                // 🛑 Allow interaction during sync to enable Cancellation
                onClick?.();
            }}
        >
            {/* 🏷️ Labels (Background) */}
            <div className="absolute inset-0 flex flex-col justify-between items-center py-4 pointer-events-none select-none">
                <span className={cn(
                    "text-[10px] font-bold tracking-widest uppercase transition-colors duration-300",
                    isActive ? "text-primary drop-shadow-md" : "text-white/10 group-hover:text-white/30"
                )}>
                    Yes
                </span>
                <span className={cn(
                    "text-[10px] font-bold tracking-widest uppercase transition-colors duration-300",
                    !isActive ? "text-white/20 group-hover:text-white/40" : "text-white/5"
                )}>
                    No
                </span>
            </div>

            {/* 🔘 The Thumb (Animated) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    layout
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative z-10 border border-white/5",
                        isActive
                            ? "bg-primary text-white shadow-primary/40"
                            : "bg-surface-1 text-text-dim group-hover:text-text-primary group-hover:bg-surface-3 group-hover:shadow-xl"
                    )}
                    animate={{
                        y: isActive ? -36 : 36, // Position based on Active state
                        rotate: isSyncing ? 360 : 0, // Spin based on Syncing state
                        scale: isActive ? 1.1 : 1
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        rotate: {
                            repeat: isSyncing ? Infinity : 0,
                            duration: 1.5,
                            ease: "linear"
                        }
                    }}
                >
                    <RefreshCw size={18} strokeWidth={isSyncing ? 2.5 : 2} className={cn("transition-all", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")} />
                </motion.div>
            </div>

        </div>
    );
};
