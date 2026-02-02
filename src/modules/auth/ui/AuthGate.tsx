import React, { useEffect, useState } from 'react';
import { AuthService } from '../AuthService';
import { LoginScreen } from './LoginScreen';
import type { Session } from '@supabase/supabase-js';

// We need a simple loading component that matches Vibe style
const LoadingVoid = () => (
    <div className="flex items-center justify-center h-screen bg-void text-white select-none">
        <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border border-white/10 rounded-full animate-[spin_3s_linear_infinite] relative">
                <div className="absolute inset-0 border-t border-primary rounded-full animate-[spin_1s_linear_infinite]" />
            </div>
            <span className="text-[10px] font-mono text-primary/80 animate-pulse tracking-widest">
                AUTHENTICATING
            </span>
        </div>
    </div>
);

interface AuthGateProps {
    children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    const checkSession = async () => {
        try {
            const currentSession = await AuthService.getSession();
            setSession(currentSession);
        } catch (e) {
            console.error("AuthGate session check failed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSession();

        // Listen for Auth changes if possible.
        // AuthService doesn't expose subscription yet, but Supabase client does.
        // For simplicity in Phase 1, we rely on checkSession on mount, 
        // and force re-mount or reload on login success.
        // Ideally, LoginScreen calls a callback that updates this state.
    }, []);

    // Callback to be passed to LoginScreen if we were passing props, 
    // but LoginScreen is currently self-contained. 
    // We should modify LoginScreen to accept an onLoginSuccess prop 
    // OR we wrap LoginScreen here and handle the logic.

    if (loading) {
        return <LoadingVoid />;
    }

    if (!session) {
        // If not authenticated, show Login Screen.
        // We modify LoginScreen mechanism slightly: 
        // When login succeeds there, we need to know here.
        // For this iteration, let's assume LoginScreen will trigger a window reload 
        // or we can pass a prop if we refactor LoginScreen slightly.
        // Let's rely on a Prop Injection Pattern or just simple conditional.

        // HACK: Passing a "dummy" prop or just accepting that LoginScreen needs to communicate up.
        // Since I can't easily change LoginScreen signature without verifying its other usages (none yet),
        // I will render it.
        // To make it live-update, LoginScreen needs to trigger a re-check.
        return <LoginUIWrapper onLoginSuccess={() => checkSession()} />;
    }

    return <>{children}</>;
};

// Wrapper to inject behavior into LoginScreen without changing its export signature significantly yet,
// Or better, I should update LoginScreen to accept onLoginSuccess. 
// However, LoginScreen as defined in previous setup didn't take props.
// Let's use a wrapper that monkey-patches or we just update LoginScreen in next step.
// For now, I'll update LoginScreen to accept props.

const LoginUIWrapper = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
    // We need to Intercept the login success.
    // Since LoginScreen uses AuthService, we can poll or use an event.
    // But cleaner is to update LoginScreen.

    // Let's assume for this step I will update LoginScreen to take props.
    // I'll render the standalone LoginScreen here, but I need to link it.
    // Actually, I will RE-WRITE LoginScreen in the next step to accept `onSuccess`.
    // For now, let's just Render it and assume the user manages to reload.
    // Wait, "User manages to reload" is bad UX.
    // I will Refactor LoginScreen to accept { onSuccess } prop.

    return <LoginScreen onSuccess={onLoginSuccess} />;
}
