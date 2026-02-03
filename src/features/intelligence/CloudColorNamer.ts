import { VibeSupabase } from '../../infrastructure/supabase/SupabaseClient';
import { ColorScience } from './ColorScience';

export interface ClosestColor {
    match_name: string;
    match_hex: string;
    distance: number;
}

/**
 * ☁️ CloudColorNamer (L7 standard)
 * Orchestrates hybrid color search: SQL spatial pruning + JS precision refinement.
 */
export class CloudColorNamer {
    /**
     * Finds the most accurate human-readable name for a given Hex color.
     * Path: Local Input -> DB Search (Euclidean) -> Local Refinement (CIEDE2000)
     */
    static async findColor(hex: string): Promise<string> {
        const client = VibeSupabase.get();
        if (!client) return "Unknown (Offline)";

        const lab = ColorScience.hexToLab(hex);

        // 1. Database Search (SQL Pruning)
        // We fetch the top 10 candidates using fast spatial Euclidean distance
        const { data: candidates, error } = await client.rpc('find_closest_color', {
            input_l: lab.L,
            input_a: lab.a,
            input_b: lab.b,
            match_limit: 10
        });

        if (error) {
            console.error(`[CloudColorNamer] DB Pruning Failure: ${error.message}`);
            return "Unknown Color";
        }

        if (!candidates || (candidates as ClosestColor[]).length === 0) {
            return "Unknown Color";
        }

        // 2. Local Refinement (CIEDE2000 Precision)
        // Apply the gold-standard algorithm to the top candidates
        const results = (candidates as ClosestColor[]).map(candidate => {
            const candidateLab = ColorScience.hexToLab(candidate.match_hex);
            return {
                name: candidate.match_name,
                precisionDistance: ColorScience.deltaE2000(lab, candidateLab)
            };
        });

        // 3. Return the absolute best match
        results.sort((a, b) => a.precisionDistance - b.precisionDistance);
        return results[0].name;
    }
}
