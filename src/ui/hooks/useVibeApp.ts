import { useSettings, type SettingsViewModel } from '../../modules/settings/hooks/useSettings';
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
    const settings = useSettings();
    const tokens = useTokens();
    const styles = useStyles();
    const ai = useAI(settings.settings.apiKey);

    return {
        settings,
        tokens,
        styles,
        ai
    };
}
