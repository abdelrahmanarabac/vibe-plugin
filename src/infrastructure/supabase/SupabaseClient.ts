import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FigmaStorageAdapter } from './FigmaStorageAdapter';

export class VibeSupabase {
    private static instance: SupabaseClient | null = null;
    private static currentConfig: { url: string; key: string } | null = null;

    static initialize(url: string, key: string) {
        // Idempotency check to prevent unnecessary re-creation
        if (this.currentConfig?.url === url && this.currentConfig?.key === key && this.instance) {
            return;
        }

        try {
            this.instance = createClient(url, key, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: false,
                    storage: new FigmaStorageAdapter(),
                },
            });
            this.currentConfig = { url, key };
            console.log("✅ VibeSupabase: Connection Initialized.");
        } catch (e) {
            console.error("❌ VibeSupabase: Initialization Failed", e);
            this.instance = null;
        }
    }

    static get(): SupabaseClient | null {
        if (!this.instance) {
            console.warn("⚠️ VibeSupabase: Client not initialized. Check Settings.");
            return null;
        }
        return this.instance;
    }
}
