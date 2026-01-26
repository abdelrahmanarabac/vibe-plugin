import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables should be loaded from secure storage or config
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export class VibeSupabase {
    private static instance: SupabaseClient | null = null;

    static get(): SupabaseClient | null {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.warn("⚠️ VibeSupabase: Missing credentials. Running in offline mode.");
            return null;
        }

        if (!this.instance) {
            this.instance = createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return this.instance;
    }
}
