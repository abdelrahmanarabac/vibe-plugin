import { motion, AnimatePresence } from 'framer-motion';
import { useOmnibox } from '../../hooks/useOmnibox';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Omnibox = () => {
    const { message } = useOmnibox();

    if (!message) return null;

    const variants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.98, transition: { duration: 0.15 } }
    };

    // Semantic Styles Mapping
    const getStyles = (type: string) => {
        switch (type) {
            case 'error':
                return 'bg-red-50/90 text-red-700 border-red-100 shadow-red-900/5';
            case 'success':
                return 'bg-emerald-50/90 text-emerald-700 border-emerald-100 shadow-emerald-900/5';
            case 'warning':
                return 'bg-amber-50/90 text-amber-700 border-amber-100 shadow-amber-900/5';
            case 'loading':
                return 'bg-white/90 text-slate-700 border-slate-100 shadow-slate-900/5';
            default: // info
                return 'bg-white/90 text-slate-700 border-slate-200 shadow-slate-900/5';
        }
    };

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-[9999]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={message.id}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className={twMerge(
                        "pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-lg min-w-[300px] max-w-md",
                        getStyles(message.type)
                    )}
                >
                    {/* Icon Indicator */}
                    <div className={clsx(
                        "w-2 h-2 rounded-full shrink-0",
                        message.type === 'error' ? "bg-red-500" :
                            message.type === 'success' ? "bg-emerald-500" :
                                message.type === 'warning' ? "bg-amber-500" :
                                    "bg-slate-400"
                    )} />

                    <span className="text-sm font-medium flex-1 text-center font-sans tracking-tight">
                        {message.message}
                    </span>

                    {message.action && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                message.action?.onClick();
                            }}
                            className="ml-2 text-xs font-semibold underline decoration-2 underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
                        >
                            {message.action.label}
                        </button>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
