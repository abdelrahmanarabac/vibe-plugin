import { AnimatePresence, motion } from 'framer-motion';
import { useSystem } from '../../../ui/contexts/SystemContext';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function SystemMessageBar() {
    const { message, clear } = useSystem();

    if (!message) return null;

    const icons = {
        info: <Info className="w-4 h-4" />,
        success: <CheckCircle2 className="w-4 h-4" />,
        warning: <AlertCircle className="w-4 h-4" />,
        error: <XCircle className="w-4 h-4" />
    };

    const styles = {
        info: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        error: 'bg-red-500/10 text-red-400 border-red-500/20'
    };

    return (
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none z-[9999]">
            <AnimatePresence mode="wait">
                <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className={clsx(
                        "pointer-events-auto flex items-center gap-3 px-4 py-2.5 rounded-full border backdrop-blur-md shadow-lg select-none cursor-pointer",
                        styles[message.type]
                    )}
                    onClick={clear}
                >
                    <span className="opacity-80">
                        {icons[message.type]}
                    </span>
                    <span className="text-xs font-medium tracking-wide">
                        {message.text}
                    </span>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
