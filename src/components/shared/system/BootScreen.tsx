import React from 'react';

export const BootScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-void text-white select-none cursor-wait">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border border-white/10 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 border-t border-primary rounded-full animate-[spin_2s_linear_infinite]" />
                    <div className="absolute inset-4 bg-primary/20 blur-xl rounded-full animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-[0.3em] text-white/50 uppercase">
                        VIBE // SYNC_ENGINE
                    </span>
                    <span className="text-[10px] font-mono text-primary/80 animate-pulse">
                        ESTABLISHING CONNECTION...
                    </span>
                </div>
            </div>
        </div>
    );
};
