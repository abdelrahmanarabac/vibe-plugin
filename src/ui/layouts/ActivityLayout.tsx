import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ActivityLayoutProps {
    children: ReactNode;
}

export const ActivityLayout = ({ children }: ActivityLayoutProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="vibe-activity h-full w-full bg-nebula text-text-primary overflow-hidden"
        >
            {children}
        </motion.div>
    );
};
