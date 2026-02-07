import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FigmaStorageAdapter } from './FigmaStorageAdapter';
import { getSupabaseConfig } from './SupabaseConfig';

export class VibeSupabase {
    private static instance: SupabaseClient | null = null;
    private static currentConfig: { url: string; key: string } | null = null;

    /**
     * Bootstraps the Supabase connection using the secured configuration.
     * This should be called at app startup.
     */
    static async connect() {
        try {
            const config = await getSupabaseConfig();

            // Simple validation to ensure we have a real key (not the short placeholder)
            if (config.supabaseKey.length < 20) {
                console.warn("⚠️ VibeSupabase: Key looks suspicious. Did you encrypt it?");
            }

            this.initialize(config.supabaseUrl, config.supabaseKey);
        } catch (error) {
            console.error("❌ VibeSupabase: Connection Sequence Failed", error);
        }
    }

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
            console.warn("⚠️ DEPRECATION NOTICE: Direct Supabase usage is deprecated for Auth and Sync. Use VibeWorkerClient instead.");
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
