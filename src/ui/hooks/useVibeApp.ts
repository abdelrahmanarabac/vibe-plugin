import { useSettings, type SettingsViewModel } from './useSettings';
import { useTokens, type TokensViewModel } from './useTokens';
import { useAI, type AIViewModel } from './useAI';

export interface VibeAppViewModel {
    settings: SettingsViewModel;
    tokens: TokensViewModel;
    ai: AIViewModel;
    currentView: 'dashboard' | 'settings' | 'graph'; // could be state managed here or derived
}

/**
 * Main Aggregator ViewModel.
 * Composes domain-specific hooks into a single interface for the View.
 */
export function useVibeApp() {
    const settings = useSettings();
    const tokens = useTokens();
    const ai = useAI(settings.apiKey);

    // We can also manage global UI state here like active tabs if we want to extract that from App.tsx
    // For now, we'll keep it simple and just return the composed modules.

    return {
        settings,
        tokens,
        ai
    };
}
