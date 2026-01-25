/**
 * ═══════════════════════════════════════════════════════════════════════
 * VIBE MASTER SEEDER
 * ═══════════════════════════════════════════════════════════════════════
 * Uploads ALL Colors (System + Tailwind Extended) to Supabase.
 * 
 * PRE-REQUISITE:
 * You must have the 'vibe_colors' table with 'family' and 'shade' columns.
 * Run 'supabase/migrations/master_colors.sql' in SQL Editor first if unsure.
 * 
 * Usage:
 * export VITE_SUPABASE_URL="your_url"
 * export VITE_SUPABASE_ANON_KEY="your_key"
 * node scripts/seed_master.js
 */

const { createClient } = require('@supabase/supabase-js');

async function seed() {
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("❌ Error: Missing Environment Variables.");
        console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
        process.exit(1);
    }

    const supabase = createClient(url, key);
    console.log("⚡ Connecting to Supabase...");

    const masterColors = [
        // 1. System Defaults
        { hex: '#ffffff', name: 'white', family: 'base', shade: 0, dataset_source: 'system' },
        { hex: '#000000', name: 'black', family: 'base', shade: 1000, dataset_source: 'system' },
        { hex: '#6E62E5', name: 'brand-primary', family: 'brand', shade: 500, dataset_source: 'system' },

        // 2. Tailwind Yellow
        { hex: '#fefce8', name: 'yellow-50', family: 'yellow', shade: 50, dataset_source: 'tailwind' },
        { hex: '#fef9c3', name: 'yellow-100', family: 'yellow', shade: 100, dataset_source: 'tailwind' },
        { hex: '#fef08a', name: 'yellow-200', family: 'yellow', shade: 200, dataset_source: 'tailwind' },
        { hex: '#fde047', name: 'yellow-300', family: 'yellow', shade: 300, dataset_source: 'tailwind' },
        { hex: '#facc15', name: 'yellow-400', family: 'yellow', shade: 400, dataset_source: 'tailwind' },
        { hex: '#eab308', name: 'yellow-500', family: 'yellow', shade: 500, dataset_source: 'tailwind' },
        { hex: '#ca8a04', name: 'yellow-600', family: 'yellow', shade: 600, dataset_source: 'tailwind' },
        { hex: '#a16207', name: 'yellow-700', family: 'yellow', shade: 700, dataset_source: 'tailwind' },
        { hex: '#854d0e', name: 'yellow-800', family: 'yellow', shade: 800, dataset_source: 'tailwind' },
        { hex: '#713f12', name: 'yellow-900', family: 'yellow', shade: 900, dataset_source: 'tailwind' },
        { hex: '#422006', name: 'yellow-950', family: 'yellow', shade: 950, dataset_source: 'tailwind' },

        // 3. Tailwind Amber
        { hex: '#fffbeb', name: 'amber-50', family: 'amber', shade: 50, dataset_source: 'tailwind' },
        { hex: '#fef3c7', name: 'amber-100', family: 'amber', shade: 100, dataset_source: 'tailwind' },
        { hex: '#fde68a', name: 'amber-200', family: 'amber', shade: 200, dataset_source: 'tailwind' },
        { hex: '#fcd34d', name: 'amber-300', family: 'amber', shade: 300, dataset_source: 'tailwind' },
        { hex: '#fbbf24', name: 'amber-400', family: 'amber', shade: 400, dataset_source: 'tailwind' },
        { hex: '#f59e0b', name: 'amber-500', family: 'amber', shade: 500, dataset_source: 'tailwind' },
        { hex: '#d97706', name: 'amber-600', family: 'amber', shade: 600, dataset_source: 'tailwind' },
        { hex: '#b45309', name: 'amber-700', family: 'amber', shade: 700, dataset_source: 'tailwind' },
        { hex: '#92400e', name: 'amber-800', family: 'amber', shade: 800, dataset_source: 'tailwind' },
        { hex: '#78350f', name: 'amber-900', family: 'amber', shade: 900, dataset_source: 'tailwind' },
        { hex: '#451a03', name: 'amber-950', family: 'amber', shade: 950, dataset_source: 'tailwind' },

        // 4. Tailwind Orange
        { hex: '#fff7ed', name: 'orange-50', family: 'orange', shade: 50, dataset_source: 'tailwind' },
        { hex: '#ffedd5', name: 'orange-100', family: 'orange', shade: 100, dataset_source: 'tailwind' },
        { hex: '#fed7aa', name: 'orange-200', family: 'orange', shade: 200, dataset_source: 'tailwind' },
        { hex: '#fdba74', name: 'orange-300', family: 'orange', shade: 300, dataset_source: 'tailwind' },
        { hex: '#fb923c', name: 'orange-400', family: 'orange', shade: 400, dataset_source: 'tailwind' },
        { hex: '#f97316', name: 'orange-500', family: 'orange', shade: 500, dataset_source: 'tailwind' },
        { hex: '#ea580c', name: 'orange-600', family: 'orange', shade: 600, dataset_source: 'tailwind' },
        { hex: '#c2410c', name: 'orange-700', family: 'orange', shade: 700, dataset_source: 'tailwind' },
        { hex: '#9a3412', name: 'orange-800', family: 'orange', shade: 800, dataset_source: 'tailwind' },
        { hex: '#7c2d12', name: 'orange-900', family: 'orange', shade: 900, dataset_source: 'tailwind' },
        { hex: '#431407', name: 'orange-950', family: 'orange', shade: 950, dataset_source: 'tailwind' },

        // 5. Tailwind Lime
        { hex: '#f7fee7', name: 'lime-50', family: 'lime', shade: 50, dataset_source: 'tailwind' },
        { hex: '#ecfccb', name: 'lime-100', family: 'lime', shade: 100, dataset_source: 'tailwind' },
        { hex: '#d9f99d', name: 'lime-200', family: 'lime', shade: 200, dataset_source: 'tailwind' },
        { hex: '#bef264', name: 'lime-300', family: 'lime', shade: 300, dataset_source: 'tailwind' },
        { hex: '#a3e635', name: 'lime-400', family: 'lime', shade: 400, dataset_source: 'tailwind' },
        { hex: '#84cc16', name: 'lime-500', family: 'lime', shade: 500, dataset_source: 'tailwind' },
        { hex: '#65a30d', name: 'lime-600', family: 'lime', shade: 600, dataset_source: 'tailwind' },
        { hex: '#4d7c0f', name: 'lime-700', family: 'lime', shade: 700, dataset_source: 'tailwind' },
        { hex: '#3f6212', name: 'lime-800', family: 'lime', shade: 800, dataset_source: 'tailwind' },
        { hex: '#365314', name: 'lime-900', family: 'lime', shade: 900, dataset_source: 'tailwind' },
        { hex: '#1a2e05', name: 'lime-950', family: 'lime', shade: 950, dataset_source: 'tailwind' },

        // 6. Tailwind Emerald
        { hex: '#ecfdf5', name: 'emerald-50', family: 'emerald', shade: 50, dataset_source: 'tailwind' },
        { hex: '#d1fae5', name: 'emerald-100', family: 'emerald', shade: 100, dataset_source: 'tailwind' },
        { hex: '#a7f3d0', name: 'emerald-200', family: 'emerald', shade: 200, dataset_source: 'tailwind' },
        { hex: '#6ee7b7', name: 'emerald-300', family: 'emerald', shade: 300, dataset_source: 'tailwind' },
        { hex: '#34d399', name: 'emerald-400', family: 'emerald', shade: 400, dataset_source: 'tailwind' },
        { hex: '#10b981', name: 'emerald-500', family: 'emerald', shade: 500, dataset_source: 'tailwind' },
        { hex: '#059669', name: 'emerald-600', family: 'emerald', shade: 600, dataset_source: 'tailwind' },
        { hex: '#047857', name: 'emerald-700', family: 'emerald', shade: 700, dataset_source: 'tailwind' },
        { hex: '#065f46', name: 'emerald-800', family: 'emerald', shade: 800, dataset_source: 'tailwind' },
        { hex: '#064e3b', name: 'emerald-900', family: 'emerald', shade: 900, dataset_source: 'tailwind' },
        { hex: '#022c22', name: 'emerald-950', family: 'emerald', shade: 950, dataset_source: 'tailwind' },

        // 7. Tailwind Teal
        { hex: '#f0fdfa', name: 'teal-50', family: 'teal', shade: 50, dataset_source: 'tailwind' },
        { hex: '#ccfbf1', name: 'teal-100', family: 'teal', shade: 100, dataset_source: 'tailwind' },
        { hex: '#99f6e4', name: 'teal-200', family: 'teal', shade: 200, dataset_source: 'tailwind' },
        { hex: '#5eead4', name: 'teal-300', family: 'teal', shade: 300, dataset_source: 'tailwind' },
        { hex: '#2dd4bf', name: 'teal-400', family: 'teal', shade: 400, dataset_source: 'tailwind' },
        { hex: '#14b8a6', name: 'teal-500', family: 'teal', shade: 500, dataset_source: 'tailwind' },
        { hex: '#0d9488', name: 'teal-600', family: 'teal', shade: 600, dataset_source: 'tailwind' },
        { hex: '#0f766e', name: 'teal-700', family: 'teal', shade: 700, dataset_source: 'tailwind' },
        { hex: '#115e59', name: 'teal-800', family: 'teal', shade: 800, dataset_source: 'tailwind' },
        { hex: '#134e4a', name: 'teal-900', family: 'teal', shade: 900, dataset_source: 'tailwind' },
        { hex: '#042f2e', name: 'teal-950', family: 'teal', shade: 950, dataset_source: 'tailwind' },

        // 8. Tailwind Cyan
        { hex: '#ecfeff', name: 'cyan-50', family: 'cyan', shade: 50, dataset_source: 'tailwind' },
        { hex: '#cffafe', name: 'cyan-100', family: 'cyan', shade: 100, dataset_source: 'tailwind' },
        { hex: '#a5f3fc', name: 'cyan-200', family: 'cyan', shade: 200, dataset_source: 'tailwind' },
        { hex: '#67e8f9', name: 'cyan-300', family: 'cyan', shade: 300, dataset_source: 'tailwind' },
        { hex: '#22d3ee', name: 'cyan-400', family: 'cyan', shade: 400, dataset_source: 'tailwind' },
        { hex: '#06b6d4', name: 'cyan-500', family: 'cyan', shade: 500, dataset_source: 'tailwind' },
        { hex: '#0891b2', name: 'cyan-600', family: 'cyan', shade: 600, dataset_source: 'tailwind' },
        { hex: '#0e7490', name: 'cyan-700', family: 'cyan', shade: 700, dataset_source: 'tailwind' },
        { hex: '#155e75', name: 'cyan-800', family: 'cyan', shade: 800, dataset_source: 'tailwind' },
        { hex: '#164e63', name: 'cyan-900', family: 'cyan', shade: 900, dataset_source: 'tailwind' },
        { hex: '#083344', name: 'cyan-950', family: 'cyan', shade: 950, dataset_source: 'tailwind' },

        // 9. Tailwind Sky
        { hex: '#f0f9ff', name: 'sky-50', family: 'sky', shade: 50, dataset_source: 'tailwind' },
        { hex: '#e0f2fe', name: 'sky-100', family: 'sky', shade: 100, dataset_source: 'tailwind' },
        { hex: '#bae6fd', name: 'sky-200', family: 'sky', shade: 200, dataset_source: 'tailwind' },
        { hex: '#7dd3fc', name: 'sky-300', family: 'sky', shade: 300, dataset_source: 'tailwind' },
        { hex: '#38bdf8', name: 'sky-400', family: 'sky', shade: 400, dataset_source: 'tailwind' },
        { hex: '#0ea5e9', name: 'sky-500', family: 'sky', shade: 500, dataset_source: 'tailwind' },
        { hex: '#0284c7', name: 'sky-600', family: 'sky', shade: 600, dataset_source: 'tailwind' },
        { hex: '#0369a1', name: 'sky-700', family: 'sky', shade: 700, dataset_source: 'tailwind' },
        { hex: '#075985', name: 'sky-800', family: 'sky', shade: 800, dataset_source: 'tailwind' },
        { hex: '#0c4a6e', name: 'sky-900', family: 'sky', shade: 900, dataset_source: 'tailwind' },
        { hex: '#082f49', name: 'sky-950', family: 'sky', shade: 950, dataset_source: 'tailwind' },

        // 10. Tailwind Indigo
        { hex: '#eef2ff', name: 'indigo-50', family: 'indigo', shade: 50, dataset_source: 'tailwind' },
        { hex: '#e0e7ff', name: 'indigo-100', family: 'indigo', shade: 100, dataset_source: 'tailwind' },
        { hex: '#c7d2fe', name: 'indigo-200', family: 'indigo', shade: 200, dataset_source: 'tailwind' },
        { hex: '#a5b4fc', name: 'indigo-300', family: 'indigo', shade: 300, dataset_source: 'tailwind' },
        { hex: '#818cf8', name: 'indigo-400', family: 'indigo', shade: 400, dataset_source: 'tailwind' },
        { hex: '#6366f1', name: 'indigo-500', family: 'indigo', shade: 500, dataset_source: 'tailwind' },
        { hex: '#4f46e5', name: 'indigo-600', family: 'indigo', shade: 600, dataset_source: 'tailwind' },
        { hex: '#4338ca', name: 'indigo-700', family: 'indigo', shade: 700, dataset_source: 'tailwind' },
        { hex: '#3730a3', name: 'indigo-800', family: 'indigo', shade: 800, dataset_source: 'tailwind' },
        { hex: '#312e81', name: 'indigo-900', family: 'indigo', shade: 900, dataset_source: 'tailwind' },
        { hex: '#1e1b4b', name: 'indigo-950', family: 'indigo', shade: 950, dataset_source: 'tailwind' },

        // 11. Tailwind Violet
        { hex: '#f5f3ff', name: 'violet-50', family: 'violet', shade: 50, dataset_source: 'tailwind' },
        { hex: '#ede9fe', name: 'violet-100', family: 'violet', shade: 100, dataset_source: 'tailwind' },
        { hex: '#ddd6fe', name: 'violet-200', family: 'violet', shade: 200, dataset_source: 'tailwind' },
        { hex: '#c4b5fd', name: 'violet-300', family: 'violet', shade: 300, dataset_source: 'tailwind' },
        { hex: '#a78bfa', name: 'violet-400', family: 'violet', shade: 400, dataset_source: 'tailwind' },
        { hex: '#8b5cf6', name: 'violet-500', family: 'violet', shade: 500, dataset_source: 'tailwind' },
        { hex: '#7c3aed', name: 'violet-600', family: 'violet', shade: 600, dataset_source: 'tailwind' },
        { hex: '#6d28d9', name: 'violet-700', family: 'violet', shade: 700, dataset_source: 'tailwind' },
        { hex: '#5b21b6', name: 'violet-800', family: 'violet', shade: 800, dataset_source: 'tailwind' },
        { hex: '#4c1d95', name: 'violet-900', family: 'violet', shade: 900, dataset_source: 'tailwind' },
        { hex: '#2e1065', name: 'violet-950', family: 'violet', shade: 950, dataset_source: 'tailwind' },

        // 12. Tailwind Fuchsia
        { hex: '#fdf4ff', name: 'fuchsia-50', family: 'fuchsia', shade: 50, dataset_source: 'tailwind' },
        { hex: '#fae8ff', name: 'fuchsia-100', family: 'fuchsia', shade: 100, dataset_source: 'tailwind' },
        { hex: '#f5d0fe', name: 'fuchsia-200', family: 'fuchsia', shade: 200, dataset_source: 'tailwind' },
        { hex: '#f0abfc', name: 'fuchsia-300', family: 'fuchsia', shade: 300, dataset_source: 'tailwind' },
        { hex: '#e879f9', name: 'fuchsia-400', family: 'fuchsia', shade: 400, dataset_source: 'tailwind' },
        { hex: '#d946ef', name: 'fuchsia-500', family: 'fuchsia', shade: 500, dataset_source: 'tailwind' },
        { hex: '#c026d3', name: 'fuchsia-600', family: 'fuchsia', shade: 600, dataset_source: 'tailwind' },
        { hex: '#a21caf', name: 'fuchsia-700', family: 'fuchsia', shade: 700, dataset_source: 'tailwind' },
        { hex: '#86198f', name: 'fuchsia-800', family: 'fuchsia', shade: 800, dataset_source: 'tailwind' },
        { hex: '#701a75', name: 'fuchsia-900', family: 'fuchsia', shade: 900, dataset_source: 'tailwind' },
        { hex: '#4a044e', name: 'fuchsia-950', family: 'fuchsia', shade: 950, dataset_source: 'tailwind' },

        // 13. Tailwind Rose
        { hex: '#fff1f2', name: 'rose-50', family: 'rose', shade: 50, dataset_source: 'tailwind' },
        { hex: '#ffe4e6', name: 'rose-100', family: 'rose', shade: 100, dataset_source: 'tailwind' },
        { hex: '#fecdd3', name: 'rose-200', family: 'rose', shade: 200, dataset_source: 'tailwind' },
        { hex: '#fda4af', name: 'rose-300', family: 'rose', shade: 300, dataset_source: 'tailwind' },
        { hex: '#fb7185', name: 'rose-400', family: 'rose', shade: 400, dataset_source: 'tailwind' },
        { hex: '#f43f5e', name: 'rose-500', family: 'rose', shade: 500, dataset_source: 'tailwind' },
        { hex: '#e11d48', name: 'rose-600', family: 'rose', shade: 600, dataset_source: 'tailwind' },
        { hex: '#be123c', name: 'rose-700', family: 'rose', shade: 700, dataset_source: 'tailwind' },
        { hex: '#9f1239', name: 'rose-800', family: 'rose', shade: 800, dataset_source: 'tailwind' },
        { hex: '#881337', name: 'rose-900', family: 'rose', shade: 900, dataset_source: 'tailwind' },
        { hex: '#4c0519', name: 'rose-950', family: 'rose', shade: 950, dataset_source: 'tailwind' },

        // 14. Tailwind Neutral
        { hex: '#fafafa', name: 'neutral-50', family: 'neutral', shade: 50, dataset_source: 'tailwind' },
        { hex: '#f5f5f5', name: 'neutral-100', family: 'neutral', shade: 100, dataset_source: 'tailwind' },
        { hex: '#e5e5e5', name: 'neutral-200', family: 'neutral', shade: 200, dataset_source: 'tailwind' },
        { hex: '#d4d4d4', name: 'neutral-300', family: 'neutral', shade: 300, dataset_source: 'tailwind' },
        { hex: '#a3a3a3', name: 'neutral-400', family: 'neutral', shade: 400, dataset_source: 'tailwind' },
        { hex: '#737373', name: 'neutral-500', family: 'neutral', shade: 500, dataset_source: 'tailwind' },
        { hex: '#525252', name: 'neutral-600', family: 'neutral', shade: 600, dataset_source: 'tailwind' },
        { hex: '#404040', name: 'neutral-700', family: 'neutral', shade: 700, dataset_source: 'tailwind' },
        { hex: '#262626', name: 'neutral-800', family: 'neutral', shade: 800, dataset_source: 'tailwind' },
        { hex: '#171717', name: 'neutral-900', family: 'neutral', shade: 900, dataset_source: 'tailwind' },
        { hex: '#0a0a0a', name: 'neutral-950', family: 'neutral', shade: 950, dataset_source: 'tailwind' },

        // 15. Tailwind Stone
        { hex: '#fafaf9', name: 'stone-50', family: 'stone', shade: 50, dataset_source: 'tailwind' },
        { hex: '#f5f5f4', name: 'stone-100', family: 'stone', shade: 100, dataset_source: 'tailwind' },
        { hex: '#e7e5e4', name: 'stone-200', family: 'stone', shade: 200, dataset_source: 'tailwind' },
        { hex: '#d6d3d1', name: 'stone-300', family: 'stone', shade: 300, dataset_source: 'tailwind' },
        { hex: '#a8a29e', name: 'stone-400', family: 'stone', shade: 400, dataset_source: 'tailwind' },
        { hex: '#78716c', name: 'stone-500', family: 'stone', shade: 500, dataset_source: 'tailwind' },
        { hex: '#57534e', name: 'stone-600', family: 'stone', shade: 600, dataset_source: 'tailwind' },
        { hex: '#44403c', name: 'stone-700', family: 'stone', shade: 700, dataset_source: 'tailwind' },
        { hex: '#292524', name: 'stone-800', family: 'stone', shade: 800, dataset_source: 'tailwind' },
        { hex: '#1c1917', name: 'stone-900', family: 'stone', shade: 900, dataset_source: 'tailwind' },
        { hex: '#0c0a09', name: 'stone-950', family: 'stone', shade: 950, dataset_source: 'tailwind' }
    ];

    console.log(`📦 Master Seeder: Preparing to upsert ${masterColors.length} colors...`);

    const { error } = await supabase
        .from('vibe_colors')
        .upsert(masterColors, { onConflict: 'hex' });

    if (error) {
        console.error("❌ Master Seeding Failed:", error.message);
        console.log("👉 Tip: Did you create the 'vibe_colors' table with 'family' and 'shade' columns? Use master_colors.sql");
    } else {
        console.log("✅ Master Seeding Complete! Database is perfectly synced.");
    }
}

seed();
