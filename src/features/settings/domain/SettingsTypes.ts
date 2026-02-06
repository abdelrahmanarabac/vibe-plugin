/**
 * @module SettingsTypes
 * @description Type definitions for the Vibe Plugin Settings.
 * @version 2.1.0 - Cleaned up for V2 Architecture.
 */

import { uiSyncManager } from '../../../ui/services/UISyncManager';
import type { TokenChunk, SyncState } from '../../../ui/services/UISyncManager';

export interface VibeSettings {
    // Add future settings here (e.g. theme preference, notifications)
    // For now, it might be empty or used for legacy compatibility if we want to avoid breaking too much,
    // but the requirement is to remove logic.
    // Let's keep it defined but empty-ish to allow future expansion without breaking `useSettings`.
    _version?: number;
}

export const DEFAULT_SETTINGS: VibeSettings = {
    _version: 2,
};

// Re-exporting if needed for legacy compatibility, but ideally we should point directly to service
export { uiSyncManager };
export type { TokenChunk, SyncState };

