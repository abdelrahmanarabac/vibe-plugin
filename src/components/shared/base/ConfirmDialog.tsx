import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    isLoading = false,
    onConfirm,
    onCancel
}) => {
    // Determine colors based on variant
    const getVariantColors = () => {
        switch (variant) {
            case 'danger': return {
                icon: 'text-error',
                border: 'border-error/20',
                bg: 'bg-error/10',
                btn: 'bg-error text-white hover:bg-error/90'
            };
            case 'info': return {
                icon: 'text-primary',
                border: 'border-primary/20',
                bg: 'bg-primary/10',
                btn: 'bg-primary text-void hover:bg-primary/90'
            };
            case 'warning':
            default: return {
                icon: 'text-warning',
                border: 'border-warning/20',
                bg: 'bg-warning/10',
                btn: 'bg-warning text-void hover:bg-warning/90'
            };
        }
    };

    const colors = getVariantColors();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onCancel : undefined}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`
                            relative w-full max-w-sm overflow-hidden
                            rounded-2xl border ${colors.border}
                            bg-[#121212] shadow-2xl
                        `}
                    >
                        {/* Header Decoration */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`} />

                        <div className="p-6">
                            <div className="flex gap-4">
                                <div className={`mt-1 p-2 rounded-xl ${colors.bg} ${colors.icon}`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                                    <p className="text-xs text-text-muted leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 justify-end">
                                <button
                                    onClick={onCancel}
                                    disabled={isLoading}
                                    className="
                                        px-4 py-2 rounded-lg text-xs font-medium text-text-muted
                                        hover:bg-white/5 disabled:opacity-50 transition-colors
                                    "
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`
                                        px-4 py-2 rounded-lg text-xs font-bold
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all shadow-lg
                                        ${colors.btn}
                                    `}
                                >
                                    {isLoading ? 'Processing...' : confirmText}
                                </button>
                            </div>
                        </div>

                        {/* Close Button */}
                        {!isLoading && (
                            <button
                                onClick={onCancel}
                                className="absolute top-3 right-3 p-1 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
