import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

interface CollectionContextMenuProps {
    x: number;
    y: number;
    onRename: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export const CollectionContextMenu = ({ x, y, onRename, onDelete, onClose }: CollectionContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Prevent menu from going off-screen (basic bounds check)
    const style = {
        top: Math.min(y, window.innerHeight - 100),
        left: Math.min(x, window.innerWidth - 160),
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="fixed z-[9999] min-w-[140px] bg-surface-1 border border-surface-2 rounded-xl shadow-2xl flex flex-col p-1 overflow-hidden"
                style={style}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => {
                        onRename();
                        onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-text-primary hover:bg-surface-2 rounded-lg transition-colors w-full text-left"
                >
                    <Edit2 size={12} className="text-primary" />
                    Rename
                </button>
                <div className="h-px bg-surface-2 my-1 mx-1" />
                <button
                    onClick={() => {
                        onDelete();
                        onClose();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/10 rounded-lg transition-colors w-full text-left"
                >
                    <Trash2 size={12} />
                    Delete
                </button>
            </motion.div>
        </AnimatePresence>
    );
};
