// src/infrastructure/supabase/SupabaseConfig.ts

// 🔐 Encrypted Supabase Anon Key (XOR cipher with SALT)
const ENCRYPTED_KEY = "6c7043616b4e6a6046604340" +
    "5c7340384760407a40675b3c6a4a403f406279515f4a43" +
    "30276c7043796a3a4460466043736d514b6150644f7353" +
    "5a407a406743655360403f4067473d50674f636d3b6d3b" +
    "6b3a4f7068514b616d3a6d7f6b3a6d6740607e606a6430" +
    "7a535a403f40644f7c6b3b3d60454a437950515860466" +
    "34c3a47636271445d443c4463507a40645f3d6a4a403f4" +
    "463483d474d503d465d62704767392759447a4e7c4c7e5" +
    "95d433862675344387e435d645f62457b6f3d633c40397" +
    "b793b42785d5f4b5e583c6666";

// 2. The salt used for encryption
const SALT = "VIBE_2026_SECURE";

// 3. The De-scrambler (Reverse Algorithm)
// Restores the key to memory only when needed
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
