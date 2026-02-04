import { useState, useCallback } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { FeedbackService } from '../../features/feedback/FeedbackService';
import { AuthService } from '../../features/auth/AuthService';

export interface AIViewModel {
    isProcessing: boolean;
    handleCommand: (command: string) => Promise<void>;
}

/**
 * 🎣 useAI Hook (View Logic)
 * Processes natural language commands via the Intent Engine.
 * Ensures the AI Engine instance is synchronized with the current API Key.
 */
export function useAI(_apiKey: string | null, _onNavigate?: (view: 'dashboard' | 'settings' | 'graph' | 'create-token') => void): AIViewModel {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCommand = useCallback(async (command: string) => {
        setIsProcessing(true);
        try {
            // Repurposed Omnibox: Direct Feedback Loop
            omnibox.show('🚀 Sending to Vibe Team...', { type: 'loading', duration: 0 });

            // 1. Get User Context (Best Effort)
            const session = await AuthService.getSession();
            const user = session?.user;

            // 2. Send to Supabase
            await FeedbackService.sendFeedback({
                message: command,
                type: 'general', // Defaulting to general for quick-entry
                userId: user?.id,
                username: user?.email
            });

            // 3. Success Feedback
            omnibox.show('✅ Feedback Received!', { type: 'success', duration: 3000 });

        } catch (error: unknown) {
            console.error("[useAI] Feedback failed:", error);
            const message = error instanceof Error ? error.message : String(error);
            omnibox.show(`❌ Failed to send: ${message}`, { type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    }, []);

    return {
        isProcessing,
        handleCommand
    };
}
