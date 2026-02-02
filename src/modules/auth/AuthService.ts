import type { Session, User, AuthError } from '@supabase/supabase-js';
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | Error | null;
}

export class AuthService {
    /**
     * persistent session retrieval backed by FigmaStorageAdapter
     */
    static async getSession(): Promise<Session | null> {
        const supabase = VibeSupabase.get();
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("[Auth] Failed to restore session:", error.message);
            return null;
        }
        return data.session;
    }

    /**
     * Checks if a username is globally unique in the public.profiles table.
     */
    static async isUsernameAvailable(username: string): Promise<boolean> {
        const supabase = VibeSupabase.get();
        if (!supabase) throw new Error("Supabase client not initialized");

        const { count, error } = await supabase
            .from('profiles')
            .select('username', { count: 'exact', head: true })
            .eq('username', username);

        if (error) {
            console.error("[Auth] Username check failed:", error);
            // Fail open or closed? Closed for security.
            throw new Error("Could not validate username availability.");
        }

        return count === 0;
    }

    /**
     * retrieves the Figma User ID from the controller via postMessage bridge.
     */
    static async getFigmaUserId(): Promise<string | null> {
        return new Promise((resolve) => {
            const handler = (event: MessageEvent) => {
                const msg = event.data.pluginMessage;
                if (msg?.type === 'FIGMA_ID_RESPONSE') {
                    window.removeEventListener('message', handler);
                    resolve(msg.payload.id);
                }
            };
            window.addEventListener('message', handler);
            parent.postMessage({ pluginMessage: { type: 'REQUEST_FIGMA_ID' } }, '*');

            setTimeout(() => {
                window.removeEventListener('message', handler);
                resolve(null);
            }, 3000);
        });
    }

    /**
     * Signs up a new user with email, password, and a unique username.
     * Enforces Anti-Farming strategy by binding to a unique Figma User ID.
     */
    static async signUp(email: string, password: string, username: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            // 1. Check Username Availability
            const available = await this.isUsernameAvailable(username);
            if (!available) {
                return {
                    user: null,
                    session: null,
                    error: new Error(`Username '${username}' is already taken.`)
                };
            }

            // 2. Anti-Farming: Verify Figma Account is not already linked
            const figmaUserId = await this.getFigmaUserId();
            if (!figmaUserId) {
                throw new Error("Security Check Failed: Unable to verify Figma Identity.");
            }

            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('figma_user_id', figmaUserId)
                .maybeSingle();

            if (existingProfile) {
                throw new Error("Anti-Farming Alert: This Figma account is already linked to another Vibe user. Multi-accounting is restricted.");
            }

            // 3. Create Auth User & Bind Figma ID in metadata for the DB Trigger
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                        figma_user_id: figmaUserId
                    },
                },
            });

            if (error) return { user: null, session: null, error };

            return { user: data.user, session: data.session, error: null };

        } catch (e: unknown) {
            console.error("[AuthService] Signup flow interrupted:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    static async signIn(email: string, password: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { user: data.user, session: data.session, error };
    }

    static async signOut(): Promise<{ error: AuthError | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    }
}
