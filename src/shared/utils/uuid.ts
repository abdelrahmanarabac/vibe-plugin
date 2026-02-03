/**
 * Generates a UUID (Universally Unique Identifier) v4.
 * Uses crypto.randomUUID if available, otherwise falls back to a robust math-based implementation.
 * unique enough for UI keys and temporary IDs.
 */
export function generateUUID(): string {
    // 1. Try native crypto API (modern browsers / Node)
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        try {
            return crypto.randomUUID();
        } catch (e) {
            // Fallback if it fails for some reason
        }
    }

    // 2. Fallback: RFC4122 version 4 compatible solution
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
