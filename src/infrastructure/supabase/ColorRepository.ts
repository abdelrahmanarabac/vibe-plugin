import { VibeSupabase } from './SupabaseClient';

export interface RemoteColor {
    id: number;
    hex: string;
    name: string;
    dataset_source: string;
    created_at: string;
}

export class ColorRepository {
    /**
     * Finds exact or nearest color from the cloud database
     * (Uses Postgres extensions if available, or simple matching)
     */
    static async findColor(hex: string): Promise<RemoteColor | null> {
        const client = VibeSupabase.get();
        if (!client) return null;

        const { data, error } = await client
            .from('vibe_colors')
            .select('*')
            .eq('hex', hex.toLowerCase())
            .single();

        if (error) {
            // Optional: Implement fuzzy search here if pg_vector is enabled
            return null;
        }

        return data as RemoteColor;
    }

    static async submitColor(hex: string, name: string): Promise<boolean> {
        const client = VibeSupabase.get();
        if (!client) return false;

        const { error } = await client
            .from('vibe_colors_lab') // Updated to new table
            .upsert({
                hex: hex.toLowerCase(),
                name: name.toLowerCase(),
                dataset_source: 'user_contribution'
                // trigger will handle lab_l/a/b autocalc
            });

        return !error;
    }

    /**
     * Fetches ALL colors for client-side caching/analysis (from new LAB table)
     */
    static async fetchAll(): Promise<RemoteColor[]> {
        const client = VibeSupabase.get();
        if (!client) return [];

        const { data, error } = await client
            .from('vibe_colors_lab') // Updated to new table
            .select('*');

        if (error) {
            console.error("Vibe DB Error:", error);
            return [];
        }
        return data as RemoteColor[];
    }

    /**
     * Server-Side Nearest Match (Uses Database Delta E Logic)
     * Extremely fast for on-demand queries.
     */
    static async findClosestRemote(hex: string, limit = 5): Promise<any[]> {
        const client = VibeSupabase.get();
        if (!client) return [];

        const { data, error } = await client
            .rpc('find_closest_color', {
                input_hex: hex,
                limit_count: limit
            });

        if (error) {
            console.error("RPC Error:", error);
            return [];
        }
        return data; // Returns { name, hex, delta_e, confidence, ... }
    }
}
