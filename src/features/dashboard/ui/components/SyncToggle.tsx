import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X } from 'lucide-react';
import { cn } from '../../../../shared/lib/classnames';
import { useSystemContext } from '../../../../ui/contexts/SystemContext';

interface SyncToggleProps {
    onClick?: () => void;
    isActive?: boolean;
    className?: string;
}

/**
 * A smart, vertical toggle-style button for triggering synchronization.
 * Now acts as the "Emergency Brake" during active sync.
 */
export const SyncToggle: React.FC<SyncToggleProps> = ({
    onClick, // Optional override
    isActive = false,
    className
}) => {
    // 🧠 Use Global System State
    const { isSyncing, syncProgress } = useSystemContext();

    const handleSyncClick = () => {
        // Allow external onClick to override if passed (for flexibility), but default to global 
        if (onClick) {
            onClick();
            return;
        }

        if (isSyncing) {
            // 🛑 Emergency Stop
            parent.postMessage({ pluginMessage: { type: 'SYNC_CANCEL' } }, '*');
        } else {
            // 🚀 Start Sync
            parent.postMessage({ pluginMessage: { type: 'SYNC_START' } }, '*');
        }
    };

    // Calculate progress percentage
    const progressPercent = syncProgress && syncProgress.total > 0
        ? (syncProgress.current / syncProgress.total) * 100
        : 0;

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>

            <div
                className={cn(
                    "group relative flex flex-col items-center justify-between py-2 w-14 h-32 rounded-full transition-all duration-300",
                    "bg-surface-2/30 border border-white/5 backdrop-blur-md cursor-pointer select-none",
                    "hover:bg-surface-2/50 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/10",
                    isSyncing ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-surface-2" :
                        isActive ? "border-primary/50 bg-surface-2 shadow-[0_0_20px_rgba(var(--primary),0.2)]" : ""
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    handleSyncClick();
                }}
            >
                {/* 🏷️ Labels (Background) */}
                <div className="absolute inset-0 flex flex-col justify-between items-center py-4 pointer-events-none">
                    <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase transition-colors duration-300",
                        isSyncing ? "text-red-400 opacity-100" :
                            isActive ? "text-primary drop-shadow-md" : "text-white/10 group-hover:text-white/30"
                    )}>
                        {isSyncing ? "STOP" : "Yes"}
                    </span>
                    <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase transition-colors duration-300",
                        !isActive && !isSyncing ? "text-white/20 group-hover:text-white/40" : "text-white/5"
                    )}>
                        {isSyncing ? "" : "No"}
                    </span>
                </div>

                {/* 🔘 The Thumb (Animated) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        layout
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg relative z-10 border border-white/5",
                            isSyncing
                                ? "bg-red-500 text-white shadow-red-500/40"
                                : isActive
                                    ? "bg-primary text-white shadow-primary/40"
                                    : "bg-surface-1 text-text-dim group-hover:text-text-primary group-hover:bg-surface-3 group-hover:shadow-xl"
                        )}
                        animate={{
                            y: isSyncing ? -36 : isActive ? -36 : 36, // Top if syncing or active
                            rotate: isSyncing ? 360 : 0,
                            scale: isActive || isSyncing ? 1.1 : 1
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
                        {isSyncing ? (
                            <X size={18} strokeWidth={3} className="opacity-100" />
                        ) : (
                            <RefreshCw size={18} strokeWidth={2} className={cn("transition-all", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")} />
                        )}
                    </motion.div>
                </div>
            </div>

            {/* 📊 External Progress Bar (When Syncing) */}
            <AnimatePresence>
                {isSyncing && syncProgress && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.9 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.9 }}
                        className="w-full max-w-[120px] flex flex-col items-center gap-1"
                    >
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                            />
                        </div>
                        <p className="text-[9px] text-white/40 font-mono tracking-tight">
                            {syncProgress.current} / {syncProgress.total}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
