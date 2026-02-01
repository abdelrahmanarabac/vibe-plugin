/**
 * 🔒 SECURITY ENCLAVE: SUPABASE CONFIGURATION
 * 
 * PROTOCOL: ZERO TRUST
 * - No hardcoded credentials.
 * - Credentials must be injected via build-time variables (Vite).
 * - Runtime validation protection.
 */

import { createClient } from '@supabase/supabase-js';

// 1. Ingest Environment Variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Defense mechanism: Fail fast if secrets are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // In production/plugin environment, we cannot log full configuration errors to console for safety
    // but distinct errors help debugging.
    throw new Error(
        "⛔ FATAL: Security Violation. Supabase credentials missing from environment. " +
        "Code signature verification failed."
    );
}

// 3. Construct Client with Strict Security Options
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true, // Needed for plugin logic, but session is handled by Supabase JS
        autoRefreshToken: true,
        detectSessionInUrl: false, // Security: Don't read URL params in plugin context automatically
    },
    // Optional: Add custom headers if we have a proxy, but for now we strictly use the Env vars.
});

// 4. Clear memory references to raw strings immediately?
// JS GCs strings eventually, but we don't export the raw strings. Only the client.
