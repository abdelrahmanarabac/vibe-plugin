/**
 * @module AuthService
 * @description Authentication service for Vibe Plugin using Supabase.
 * @version 2.1.0 - OTP-based password recovery flow.
 */
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | Error | null;
}

export class AuthService {
    /**
     * Persistent session retrieval backed by FigmaStorageAdapter.
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
            throw new Error("Could not validate username availability.");
        }

        return count === 0;
    }

    /**
     * Signs up a new user with email, password, and a unique username.
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

            // 2. Create Auth User with username in metadata for the DB Trigger
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
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
        // 🔒 SECURE PROXY: Route through Worker
        const { VibeWorkerClient } = await import('../../infrastructure/network/VibeWorkerClient');

        const { data, error } = await VibeWorkerClient.signIn(email, password);

        if (error || !data) {
            const errorObj = typeof error === 'string' ? new Error(error) : new Error('Login failed');
            return { user: null, session: null, error: errorObj };
        }

        // Assuming Worker returns { user, session } in data
        return { user: data.user, session: data.session, error: null };
    }

    static async signOut(): Promise<{ error: AuthError | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    }

    // ==========================================================================
    // == OTP-BASED PASSWORD RECOVERY ==
    // ==========================================================================

    /**
     * Sends an OTP code to the user's email for password recovery.
     * Uses `resetPasswordForEmail` to trigger the standard recovery flow.
     * NOTE: Requires Supabase Email Template "Reset Password" to use {{ .Token }} instead of link.
     * @param email The user's email address.
     */
    static async sendRecoveryOtp(email: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        try {
            // Use resetPasswordForEmail effectively requests a recovery token.
            // By default, this sends a Magic Link. The User MUST configure the template
            // to send a code, or Supabase must be configured to send instructions.
            const { error } = await supabase.auth.resetPasswordForEmail(email);

            if (error) {
                console.error("[AuthService] Password Reset Request Failed:", error.message);
                return { error };
            }

            return { error: null };
        } catch (e) {
            console.error("[AuthService] Password Reset Exception:", e);
            return { error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Verifies the OTP code sent to the user's email.
     * Uses type 'recovery' which corresponds to `resetPasswordForEmail` flow.
     * @param email The user's email address.
     * @param token The 6-digit OTP code.
     */
    static async verifyRecoveryOtp(email: string, token: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery', // corrected from 'email' to 'recovery' for password reset
            });

            if (error) {
                console.error("[AuthService] OTP Verification Failed:", error.message);
                return { user: null, session: null, error };
            }

            return { user: data.user, session: data.session, error: null };
        } catch (e) {
            console.error("[AuthService] OTP Verify Exception:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Updates the user's password.
     * Requires an active session (e.g., after OTP verification).
     * @param newPassword The new password.
     */
    static async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        return { error };
    }
}
