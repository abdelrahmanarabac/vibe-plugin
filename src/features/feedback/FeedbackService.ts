import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export type FeedbackType = 'feature' | 'bug' | 'general';

export interface FeedbackData {
    message: string;
    type: FeedbackType;
    username?: string;
    userId?: string;
}

export class FeedbackService {
    private static TABLE = 'plugin_feedback';

    /**
     * Sends feedback to the Supabase database.
     * @param feedback The feedback data object.
     * @returns The inserted data or throws an error.
     */
    static async sendFeedback(feedback: FeedbackData): Promise<void> {
        const client = VibeSupabase.get();
        if (!client) {
            throw new Error("Feedback Service: Supabase client not initialized.");
        }

        try {
            const { error } = await client
                .from(this.TABLE)
                .insert({
                    message: feedback.message,
                    type: feedback.type,
                    username: feedback.username,
                    user_id: feedback.userId, // Can be null for anon
                });

            if (error) {
                console.error('[FeedbackService] Submission Error:', error);
                throw new Error(error.message);
            }
        } catch (err) {
            console.error('[FeedbackService] Unexpected Error:', err);
            throw err;
        }
    }
}
