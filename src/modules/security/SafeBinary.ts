/**
 * 🛡️ PREFECT: BINARY SAFETY MODULE
 * Standardizes all binary encoding/decoding to prevent stack overflows and unicode vulnerabilities.
 * Replaces unsafe `btoa`, `atob`, and `String.fromCharCode` patterns.
 */

// Mapping for Base64url safe encoding if needed, but standard Base64 is usually fine for storage.
// We use standard Base64 for compatibility with most systems, but implement it via Uint8Array.

export const SafeBinary = {
    /**
     * Converts a Uint8Array to a Base64 string without using String.fromCharCode spread (stack unsafe).
     * Uses a chunked approach or native FileReader/Buffer APIs where available, 
     * but strictly polyfilled for the browser environment to be deterministic.
     */
    toBase64(bytes: Uint8Array): string {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        // In a browser environment, btoa on single byte chars is safe from unicode issues,
        // provided the input constitutes valid byte sequences.
        // However, we want to avoid `btoa` if we want to be "Paranoid".
        // Actually, the prompt says "Remove all unsafe patterns using btoa".
        // Use a custom implementation or a vetted library pattern.
        
        return customToBase64(bytes);
    },

    /**
     * Decodes a Base64 string to Uint8Array safely.
     */
    fromBase64(base64: string): Uint8Array {
        return customFromBase64(base64);
    },

    /**
     * Converts a string to Uint8Array using UTF-8 encoding (TextEncoder).
     * NEVER use simple loop or charCodeAt for non-ASCII.
     */
    fromString(str: string): Uint8Array {
        return new TextEncoder().encode(str);
    },

    /**
     * Converts Uint8Array to string using UTF-8 decoding (TextDecoder).
     */
    toString(bytes: Uint8Array): string {
        return new TextDecoder().decode(bytes);
    }
};

// --- PRIVATE IMPLEMENTATION (No `window.btoa` reliance) ---

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

function customToBase64(bytes: Uint8Array): string {
    let base64 = '';
    const len = bytes.length;
    
    for (let i = 0; i < len; i += 3) {
        const b1 = bytes[i];
        const b2 = i + 1 < len ? bytes[i + 1] : 0;
        const b3 = i + 2 < len ? bytes[i + 2] : 0;

        const triple = (b1 << 16) | (b2 << 8) | b3;

        base64 += chars[(triple >> 18) & 0x3F] +
                  chars[(triple >> 12) & 0x3F] +
                  (i + 1 < len ? chars[(triple >> 6) & 0x3F] : '=') +
                  (i + 2 < len ? chars[triple & 0x3F] : '=');
    }
    return base64;
}

function customFromBase64(base64: string): Uint8Array {
    const len = base64.length;
    let bufferLength = len * 0.75;
    if (base64[len - 1] === '=') bufferLength--;
    if (base64[len - 2] === '=') bufferLength--;

    const bytes = new Uint8Array(bufferLength);
    let p = 0;

    for (let i = 0; i < len; i += 4) {
        const encoded1 = lookup[base64.charCodeAt(i)];
        const encoded2 = lookup[base64.charCodeAt(i + 1)];
        const encoded3 = lookup[base64.charCodeAt(i + 2)];
        const encoded4 = lookup[base64.charCodeAt(i + 3)];

        const triple = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

        bytes[p++] = (triple >> 16) & 0xFF;
        if (i + 1 < len && base64[i + 2] !== '=') bytes[p++] = (triple >> 8) & 0xFF;
        if (i + 2 < len && base64[i + 3] !== '=') bytes[p++] = triple & 0xFF;
    }
    return bytes;
}
