import React, { useState } from 'react';
import { AuthService } from '../AuthService';
import { Button } from '../../../ui/components/base/Button';
import { Input } from '../../../ui/components/base/Input';
import { VibeSupabase } from '../../../infrastructure/supabase/SupabaseClient';

interface LoginScreenProps {
    onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Config State (simplification: assume user might need to input URL/Key if not baked in,
    // but for now we assume they are configured or we provide a way to configure them here?
    // The prompt implied normal Auth flow. I will assume VibeSupabase is already initialized
    // or we might need a setup screen. 
    // BUT VibeSupabase.initialize is static. Typically this happens at app start.
    // If we want this plugin to really work, we might need settings.
    // For now, I'll focus on the Auth Form itself.)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Ensure Supabase is reachable. 
            // In a real plugin, we might need to check if settings exist.
            const supabase = VibeSupabase.get();
            if (!supabase) {
                // In a perfect world, we'd redirect to settings.
                setError("Supabase not configured. Please check plugin settings.");
                setLoading(false);
                return;
            }

            if (mode === 'SIGNUP') {
                if (!username || username.length < 3) {
                    throw new Error("Username must be at least 3 characters.");
                }
                const { error: signUpError } = await AuthService.signUp(email, password, username);
                if (signUpError) throw signUpError;
                // Success: usually auto-sign-in or email confirmation.
                // Assuming auto-sign in for dev/simple flows or check session.
                onSuccess?.();
            } else {
                const { error: signInError } = await AuthService.signIn(email, password);
                if (signInError) throw signInError;
                onSuccess?.();
            }

            // On success, AuthGate will detect the session change via some mechanism 
            // OR we rely on the component re-rendering auth state if we had real context.
            // Since we don't have a global AuthContext yet, we might need to reload or trigger a callback.
            // But wait, Supabase client handles session state. 
            // AuthGate will need to subscribe to auth state changes.

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-figma-bg text-figma-text">
            <h1 className="text-xl font-bold mb-6">Welcome to Vibe</h1>

            {/* Tabs */}
            <div className="flex bg-figma-bg-secondary rounded p-1 mb-6">
                <button
                    onClick={() => setMode('LOGIN')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${mode === 'LOGIN' ? 'bg-figma-bg shadow text-figma-text' : 'text-figma-text-secondary hover:text-figma-text'
                        }`}
                >
                    Log In
                </button>
                <button
                    onClick={() => setMode('SIGNUP')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${mode === 'SIGNUP' ? 'bg-figma-bg shadow text-figma-text' : 'text-figma-text-secondary hover:text-figma-text'
                        }`}
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
                {mode === 'SIGNUP' && (
                    <Input
                        label="Username"
                        placeholder="Choose a unique handle"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-200">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center"
                    loading={loading}
                >
                    {mode === 'LOGIN' ? 'Sign In' : 'Create Account'}
                </Button>
            </form>
        </div>
    );
};
