import { useState, useCallback } from 'react';
import { omnibox } from '../managers/OmniboxManager';
import { IntentEngine } from '../../features/intelligence/IntentEngine';
import { AIFactory } from '../../core/services/AIFactory';

export interface AIViewModel {
    isProcessing: boolean;
    handleCommand: (command: string) => Promise<void>;
}

/**
 * 🎣 useAI Hook (View Logic)
 * Processes natural language commands via the Intent Engine.
 * Ensures the AI Engine instance is synchronized with the current API Key.
 */
export function useAI(apiKey: string | null, onNavigate?: (view: 'dashboard' | 'settings' | 'graph' | 'create-token') => void): AIViewModel {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCommand = useCallback(async (command: string) => {
        if (!apiKey) {
            omnibox.show('🔑 Please configure your API key in Settings.', {
                type: 'warning',
                duration: 5000,
                action: {
                    label: 'Settings',
                    onClick: () => onNavigate?.('settings')
                }
            });
            return;
        }

        setIsProcessing(true);
        try {
            // Pass the current apiKey to ensure factory re-initializes if the key changed
            const aiService = AIFactory.getInstance(apiKey);
            const engine = new IntentEngine(aiService);

            omnibox.show('🤖 Analyzing vibe...', { type: 'loading', duration: 0 });

            const intent = await engine.classify(command);

            // Execute Intent
            if (intent.type === 'RENAME_COLLECTION' && intent.payload) {
                parent.postMessage({
                    pluginMessage: {
                        type: 'RENAME_COLLECTION',
                        payload: intent.payload
                    }
                }, '*');
                return;
            }

            // Fallback: Default Conversational Response
            const prompt = `You are Vibe Token OS.User request: "${command}".Provide a brief, actionable response.Ensure you sound professional but high - tech.`;
            const response = await aiService.generate(prompt, { tier: 'LITE' });

            omnibox.show(`💡 ${response.substring(0, 100)}...`, { type: 'info' });

        } catch (error: unknown) {
            console.error("[useAI] Command failed:", error);

            // Extract meaningful error messages for the user
            const message = error instanceof Error ? error.message : String(error);
            const displayMsg = message.includes('403')
                ? '🔑 API Key Error (403). Check Settings.'
                : '❌ Engine Failure. Please retry.';

            omnibox.show(displayMsg, { type: 'error' });
        } finally {
            setIsProcessing(false);
        }
    }, [apiKey]);

    return {
        isProcessing,
        handleCommand
    };
}
