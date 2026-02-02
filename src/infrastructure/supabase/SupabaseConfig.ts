// src/infrastructure/supabase/SupabaseConfig.ts

// ⚠️ IMPORTANT: Replace this with the output from the encryption script
const ENCRYPTED_KEY = "5a1f2b3c"; // <--- Put the long result here

// 2. نفس كلمة السر اللي استخدمتها في التشفير
const SALT = "VIBE_2026_SECURE";

// 3. الخوارزمية العكسية (The De-scrambler)
// الوظيفة دي بترجع المفتاح لأصله في الذاكرة بس
const decrypt = (salt: string, encoded: string): string => {
    const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded.match(/.{1,2}/g) || [])
        .map(hex => parseInt(hex, 16))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
};

/**
 * 🕵️ getSupabaseConfig
 * Retrieves the Supabase configuration with Just-In-Time decryption.
 * The key potentially exists in memory only for the duration of this call
 * (though SupabaseClient creates a persistent instance with it).
 */
export const getSupabaseConfig = async () => {
    const realKey = decrypt(SALT, ENCRYPTED_KEY);

    return {
        supabaseUrl: "https://sxbqcwgvoqripawwoowg.supabase.co",
        supabaseKey: realKey
    };
};
