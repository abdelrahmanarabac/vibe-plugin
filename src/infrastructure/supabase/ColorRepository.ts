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
            .from('vibe_colors')
            .upsert({
                hex: hex.toLowerCase(),
                name: name.toLowerCase(),
                dataset_source: 'user_contribution'
            });

        return !error;
    }
}
