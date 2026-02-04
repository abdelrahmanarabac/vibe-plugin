import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Loader2, PartyPopper, AlertCircle } from 'lucide-react';
import { FeedbackService, type FeedbackType } from '../FeedbackService';
import { AuthService } from '../../auth/AuthService';
import { colors } from '../../../components/ui/tokens/colors';

interface FeedbackOmniboxProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackOmnibox: React.FC<FeedbackOmniboxProps> = ({ isOpen, onClose }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState<FeedbackType>('feature');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setStatus('sending');
        try {
            const session = await AuthService.getSession();
            const user = session?.user;

            await FeedbackService.sendFeedback({
                message: message.trim(),
                type,
                userId: user?.id,
                username: user?.email // Fallback since Figma username might not be available here directly
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMessage('Failed to send feedback. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="
                            relative w-full max-w-lg overflow-hidden
                            bg-[#0A0A0A] border border-white/10
                            rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]
                        "
                        style={{
                            boxShadow: `0 0 0 1px rgba(255,255,255,0.05), 0 0 40px ${colors.primary.glow}`
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white tracking-wide">Vibe Feedback</h2>
                                    <p className="text-[10px] text-text-muted">Tell us what you think directly.</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-5 space-y-4">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-8 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                        <PartyPopper size={32} className="text-success" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Feedback Sent!</h3>
                                    <p className="text-xs text-text-muted">Thank you for helping us improve Vibe.</p>
                                </motion.div>
                            ) : (
                                <>
                                    {/* Type Selector */}
                                    <div className="flex bg-white/5 p-1 rounded-xl">
                                        {(['feature', 'bug', 'general'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setType(t)}
                                                className={`
                                                    flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all
                                                    ${type === t
                                                        ? 'bg-primary text-black shadow-lg shadow-primary/20'
                                                        : 'text-text-muted hover:text-white hover:bg-white/5'
                                                    }
                                                `}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Text Area */}
                                    <div className="relative">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={
                                                type === 'feature' ? "I wish Vibe could..." :
                                                    type === 'bug' ? "Something went wrong when..." :
                                                        "Here is what's on my mind..."
                                            }
                                            className="
                                                w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4
                                                text-sm text-white placeholder-white/20 resize-none
                                                focus:border-primary/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-primary/50
                                                transition-all
                                            "
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-error text-[10px] bg-error/10 p-2 rounded-lg"
                                        >
                                            <AlertCircle size={12} />
                                            {errorMessage}
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {status !== 'success' && (
                            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!message.trim() || status === 'sending'}
                                    className="
                                        flex items-center gap-2 px-6 py-2.5 rounded-xl
                                        bg-primary text-black font-bold text-xs uppercase tracking-wider
                                        hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:active:scale-100
                                        transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]
                                    "
                                >
                                    {status === 'sending' ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Feedback</span>
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
