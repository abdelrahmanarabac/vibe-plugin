import { useState, useEffect } from 'react';
import { useSettings, type SettingsViewModel } from '../../features/settings/hooks/useSettings';
import { useTokens, type TokensViewModel } from './useTokens';
import { useAI, type AIViewModel } from './useAI';
import { useStyles, type StylesViewModel } from './useStyles';

export interface VibeAppViewModel {
    settings: SettingsViewModel;
    tokens: TokensViewModel;
    styles: StylesViewModel;
    ai: AIViewModel;
    currentView: 'dashboard' | 'settings' | 'graph';
}

/**
 * Main Aggregator ViewModel.
 * Composes domain-specific hooks into a single interface for the View.
 */
export function useVibeApp() {
    // Shared State for Navigation (Hoisted)
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'graph' | 'create-token'>('dashboard');

    const settings = useSettings();
    const tokens = useTokens();
    const styles = useStyles();
    const ai = useAI(null, setActiveTab); // API Key handled internally by useAI or via Vault

    // ⚡ Diagnostics: Connectivity Check
    const [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        let pongReceived = false;
        const start = Date.now();

        const handleMessage = (event: MessageEvent) => {
            const { type } = event.data.pluginMessage || {};
            if (type === 'PONG') {
                pongReceived = true;
                setIsConnected(true);
                // Optional: omnibox.show('System connected.', { type: 'success', duration: 1000 });
                console.log(`[VibeApp] Connected in ${Date.now() - start}ms`);
            }
        };

        window.addEventListener('message', handleMessage);

        // Send Ping
        parent.postMessage({ pluginMessage: { type: 'PING' } }, '*');

        // Watchdog
        const timer = setTimeout(() => {
            if (!pongReceived) {
                console.error('[VibeApp] Connection Timeout. Controller not responding.');
                // We rely on the Omnibox manager (imported globally in other files) or just log it for now.
                // Since this hook runs early, omnibox might not be mounted.
                // We'll just set state for now.
            }
        }, 2000);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timer);
        };
    }, []);

    return {
        settings,
        tokens,
        styles,
        ai,
        activeTab,
        setActiveTab,
        isConnected
    };
}
