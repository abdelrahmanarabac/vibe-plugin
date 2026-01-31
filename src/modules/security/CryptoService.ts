/**
 * Encryption utility for securing API keys in figma.clientStorage
 * Uses Web Crypto API (AES-GCM) with device fingerprint as passphrase
 * 
 * SECURITY MODEL:
 * - Key Derivation: PBKDF2 from device fingerprint (navigator.userAgent + screen resolution)
 * - Algorithm: AES-GCM (256-bit)
 * - Salt: Random per encryption (stored with ciphertext)
 * - IV: Random per encryption (stored with ciphertext)
 * - Storage: figma.clientStorage (via StorageProxy)
 */

import { storage } from './StorageProxy';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

/**
 * Safe access to Web Crypto API
 */
function getCrypto(): Crypto {
    const c = window.crypto;
    if (!c || !c.subtle) {
        throw new Error("Secure Context Required: Web Crypto API is unavailable. Ensure you are running locally or on HTTPS.");
    }
    return c;
}

/**
 * Generates a device fingerprint to use as encryption passphrase
 */
function getDeviceFingerprint(): string {
    // Combine multiple device characteristics
    const ua = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${ua}|${screen}|${tz}`;
}

/**
 * Derives a cryptographic key from the device fingerprint
 */
async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
    const fingerprint = getDeviceFingerprint();
    const enc = new TextEncoder();
    const crypto = getCrypto();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(fingerprint),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt.buffer as ArrayBuffer,
            iterations: ITERATIONS,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: ALGORITHM, length: KEY_LENGTH },
        false,
        ['encrypt', 'decrypt']
    );
}

/**
 * Encrypts a string (API key) and returns base64-encoded ciphertext
 * Format: base64(salt + iv + ciphertext)
 */
export async function encryptAPIKey(plaintext: string): Promise<string> {
    const crypto = getCrypto();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(salt);

    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
        {
            name: ALGORITHM,
            iv: iv
        },
        key,
        enc.encode(plaintext)
    );

    // Concatenate: salt (16) + iv (12) + ciphertext (variable)
    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a base64-encoded ciphertext back to plaintext
 */
export async function decryptAPIKey(cipherBase64: string): Promise<string> {
    // Legacy Fallback: If it looks like a plain key, return it
    if (cipherBase64.startsWith("AIza")) {
        console.warn("Detected legacy API key. Consider rotating.");
        return cipherBase64;
    }

    try {
        const crypto = getCrypto();

        // Decode from base64
        const combined = Uint8Array.from(atob(cipherBase64), c => c.charCodeAt(0));

        // Extract components
        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const ciphertext = combined.slice(28);

        const key = await deriveKey(salt);

        const decrypted = await crypto.subtle.decrypt(
            {
                name: ALGORITHM,
                iv: iv
            },
            key,
            ciphertext
        );

        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        // If decryption fails, it might be a malformed legacy key or device mismatch.
        // If it starts with AIza *after* base64 decode? Unlikely.
        // We throw here, properly.
        throw new Error('Failed to decrypt API key. Device fingerprint may have changed.');
    }
}

/**
 * Securely stores an API key in figma.clientStorage (encrypted)
 */
export async function saveAPIKey(key: string): Promise<void> {
    const encrypted = await encryptAPIKey(key);
    await storage.setItem('VIBE_API_KEY_ENCRYPTED', encrypted);
}

/**
 * Retrieves and decrypts an API key from figma.clientStorage
 */
export async function loadAPIKey(): Promise<string | null> {
    const encrypted = await storage.getItem('VIBE_API_KEY_ENCRYPTED');
    if (!encrypted) return null;

    try {
        return await decryptAPIKey(encrypted);
    } catch (error) {
        console.error('Failed to load API key:', error);
        return null; // Force re-login
    }
}
