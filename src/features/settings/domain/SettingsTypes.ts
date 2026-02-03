/**
 * @module SettingsTypes
 * @description Type definitions for the Vibe Plugin Settings.
 * @version 2.0.0 - Stripped down after redesign.
 */

export type ModelTier = 'AUTO' | 'LITE' | 'SMART';

export interface VibeSettings {
    /** Gemini API Key for AI-powered features. Encrypted at rest. */
    apiKey: string | null;
    /** The AI model tier to use for generation. */
    modelTier: ModelTier;
}

export const DEFAULT_SETTINGS: VibeSettings = {
    apiKey: null,
    modelTier: 'AUTO',
};
