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
     * Signs up a new user with email, password, and a unique username.
     * Enforces username uniqueness before attempting auth creation.
     */
    static async signUp(email: string, password: string, username: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            // 1. Pre-flight Unique Check
            const available = await this.isUsernameAvailable(username);
            if (!available) {
                return {
                    user: null,
                    session: null,
                    error: new Error(`Username '${username}' is already taken.`)
                };
            }

            // 2. Create Auth User
            // We pass username in metadata so the Trigger can pick it up
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    },
                },
            });

            if (error) return { user: null, session: null, error };

            return { user: data.user, session: data.session, error: null };

        } catch (e: unknown) {
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
