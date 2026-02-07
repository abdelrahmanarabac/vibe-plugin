/**
 * @module AuthService
 * @description Authentication service for Vibe Plugin using Supabase.
 * @version 3.0.0 - Passwordless OTP Architecture
 * 
 * Flow Architecture:
 * 
 * SIGNUP:
 *   1. sendSignupOtp(email) → signInWithOtp({ email, shouldCreateUser: true })
 *   2. verifySignupOtp(email, token) → verifyOtp({ type: 'email' })
 *   3. completeSignup(password, username) → updateUser()
 * 
 * LOGIN:
 *   - signIn(email, password) → standard password login
 * 
 * PASSWORD RESET:
 *   1. sendRecoveryOtp(email) → resetPasswordForEmail()
 *   2. verifyRecoveryOtp(email, token) → verifyOtp({ type: 'recovery' })
 *   3. updatePassword(newPassword) → updateUser()
 */
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';

export interface AuthResult {
    user: User | null;
    session: Session | null;
    error: AuthError | Error | null;
}

export interface OtpResult {
    success: boolean;
    error: Error | null;
}

export class AuthService {
    // ==========================================================================
    // SESSION MANAGEMENT
    // ==========================================================================

    /**
     * Retrieves the current session from Supabase.
     */
    static async getSession(): Promise<Session | null> {
        const supabase = VibeSupabase.get();
        if (!supabase) throw new Error("Supabase client not initialized");

        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("[AuthService] Failed to restore session:", error.message);
            return null;
        }
        return data.session;
    }

    /**
     * Gets the current authenticated user.
     */
    static async getCurrentUser(): Promise<User | null> {
        const supabase = VibeSupabase.get();
        if (!supabase) return null;

        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }

    // ==========================================================================
    // SIGNUP FLOW (OTP-First)
    // ==========================================================================

    /**
     * Step 1: Send signup OTP to email.
     * Uses signInWithOtp which automatically creates the user if they don't exist.
     * @param email The user's email address
     */
    static async sendSignupOtp(email: string): Promise<OtpResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { success: false, error: new Error("Supabase disconnected") };

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    // Create new user if doesn't exist
                    shouldCreateUser: true,
                    // No redirect needed - we're using OTP code flow
                    emailRedirectTo: undefined,
                }
            });

            if (error) {
                console.error("[AuthService] Signup OTP Send Failed:", error.message);
                return { success: false, error };
            }

            console.log("[AuthService] Signup OTP sent to:", email);
            return { success: true, error: null };

        } catch (e) {
            console.error("[AuthService] Signup OTP Exception:", e);
            return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Step 2: Verify signup OTP code.
     * @param email The user's email address
     * @param token The 6-digit OTP code
     */
    static async verifySignupOtp(email: string, token: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email', // Type 'email' for signInWithOtp flow
            });

            if (error) {
                console.error("[AuthService] Signup OTP Verify Failed:", error.message);
                return { user: null, session: null, error };
            }

            console.log("[AuthService] Signup OTP verified for:", email);
            return { user: data.user, session: data.session, error: null };

        } catch (e) {
            console.error("[AuthService] Signup OTP Verify Exception:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Step 3: Complete signup by setting password and username.
     * Must be called after successful OTP verification (user has active session).
     * @param password The user's chosen password
     * @param username The user's chosen username
     */
    static async completeSignup(password: string, username: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        try {
            // Check username availability first
            const available = await this.isUsernameAvailable(username);
            if (!available) {
                return { error: new Error(`Username '${username}' is already taken.`) };
            }

            // Update user with password and metadata
            const { error } = await supabase.auth.updateUser({
                password,
                data: {
                    username,
                }
            });

            if (error) {
                console.error("[AuthService] Complete Signup Failed:", error.message);
                return { error };
            }

            console.log("[AuthService] Signup completed with username:", username);
            return { error: null };

        } catch (e) {
            console.error("[AuthService] Complete Signup Exception:", e);
            return { error: e instanceof Error ? e : new Error(String(e)) };
        }
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
            console.error("[AuthService] Username check failed:", error);
            throw new Error("Could not validate username availability.");
        }

        return count === 0;
    }

    // ==========================================================================
    // LOGIN FLOW (Password-based)
    // ==========================================================================

    /**
     * Standard password-based login.
     * Uses Supabase directly for reliability (no worker dependency).
     * @param email The user's email address
     * @param password The user's password
     */
    static async signIn(email: string, password: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error("[AuthService] Sign in failed:", error.message);
                return { user: null, session: null, error };
            }

            console.log("[AuthService] Sign in successful for:", email);
            return { user: data.user, session: data.session, error: null };

        } catch (e) {
            console.error("[AuthService] Sign in exception:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Signs out the current user.
     */
    static async signOut(): Promise<{ error: AuthError | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: null };

        const { error } = await supabase.auth.signOut();
        return { error };
    }

    // ==========================================================================
    // PASSWORD RECOVERY FLOW (OTP-based)
    // ==========================================================================

    /**
     * Step 1: Send recovery OTP to email.
     * @param email The user's email address
     */
    static async sendRecoveryOtp(email: string): Promise<OtpResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { success: false, error: new Error("Supabase disconnected") };

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: undefined // Disable redirect, using OTP code flow
            });

            if (error) {
                // Security check: prevent reset for unverified emails
                const errorMsg = error.message.toLowerCase();
                if (errorMsg.includes('not confirmed') ||
                    errorMsg.includes('verify') ||
                    errorMsg.includes('unverified')) {
                    return {
                        success: false,
                        error: new Error("Please verify your email address first before resetting password.")
                    };
                }
                console.error("[AuthService] Recovery OTP Send Failed:", error.message);
                return { success: false, error };
            }

            console.log("[AuthService] Recovery OTP sent to:", email);
            return { success: true, error: null };

        } catch (e) {
            console.error("[AuthService] Recovery OTP Exception:", e);
            return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Step 2: Verify recovery OTP code.
     * @param email The user's email address
     * @param token The 6-digit OTP code
     */
    static async verifyRecoveryOtp(email: string, token: string): Promise<AuthResult> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { user: null, session: null, error: new Error("Supabase disconnected") };

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery', // Type 'recovery' for resetPasswordForEmail flow
            });

            if (error) {
                console.error("[AuthService] Recovery OTP Verify Failed:", error.message);
                return { user: null, session: null, error };
            }

            console.log("[AuthService] Recovery OTP verified for:", email);
            return { user: data.user, session: data.session, error: null };

        } catch (e) {
            console.error("[AuthService] Recovery OTP Verify Exception:", e);
            return { user: null, session: null, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }

    /**
     * Step 3: Update password after recovery OTP verification.
     * Requires active session from verifyRecoveryOtp.
     * @param newPassword The new password
     */
    static async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
        const supabase = VibeSupabase.get();
        if (!supabase) return { error: new Error("Supabase disconnected") };

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error("[AuthService] Password Update Failed:", error.message);
            return { error };
        }

        console.log("[AuthService] Password updated successfully");
        return { error: null };
    }
}
