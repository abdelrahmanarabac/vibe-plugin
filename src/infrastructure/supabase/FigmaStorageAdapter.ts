import { storage } from '../figma/StorageProxy';

/**
 * Adapter for Supabase to use Figma's clientStorage (via StorageProxy).
 * Implements the SupportedStorage interface expected by Supabase Client.
 */
export class FigmaStorageAdapter {
    getItem(key: string): Promise<string | null> {
        return storage.getItem(key);
    }

    setItem(key: string, value: string): Promise<void> {
        return storage.setItem(key, value);
    }

    removeItem(key: string): Promise<void> {
        return storage.removeItem(key);
    }
}
