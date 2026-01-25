/**
 * ═══════════════════════════════════════════════════════════════════════
 * VIBE SEEDER: TAILWIND MISSING COLORS
 * ═══════════════════════════════════════════════════════════════════════
 * Usage:
 * export VITE_SUPABASE_URL="your_url"
 * export VITE_SUPABASE_ANON_KEY="your_key"
 * node scripts/seed_tailwind.js
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

    const colors = [
        // Yellow
        { name: 'yellow-50', hex: '#fefce8', family: 'yellow', shade: 50 },
        { name: 'yellow-100', hex: '#fef9c3', family: 'yellow', shade: 100 },
        { name: 'yellow-200', hex: '#fef08a', family: 'yellow', shade: 200 },
        { name: 'yellow-300', hex: '#fde047', family: 'yellow', shade: 300 },
        { name: 'yellow-400', hex: '#facc15', family: 'yellow', shade: 400 },
        { name: 'yellow-500', hex: '#eab308', family: 'yellow', shade: 500 },
        { name: 'yellow-600', hex: '#ca8a04', family: 'yellow', shade: 600 },
        { name: 'yellow-700', hex: '#a16207', family: 'yellow', shade: 700 },
        { name: 'yellow-800', hex: '#854d0e', family: 'yellow', shade: 800 },
        { name: 'yellow-900', hex: '#713f12', family: 'yellow', shade: 900 },
        { name: 'yellow-950', hex: '#422006', family: 'yellow', shade: 950 },

        // Amber
        { name: 'amber-50', hex: '#fffbeb', family: 'amber', shade: 50 },
        { name: 'amber-100', hex: '#fef3c7', family: 'amber', shade: 100 },
        { name: 'amber-200', hex: '#fde68a', family: 'amber', shade: 200 },
        { name: 'amber-300', hex: '#fcd34d', family: 'amber', shade: 300 },
        { name: 'amber-400', hex: '#fbbf24', family: 'amber', shade: 400 },
        { name: 'amber-500', hex: '#f59e0b', family: 'amber', shade: 500 },
        { name: 'amber-600', hex: '#d97706', family: 'amber', shade: 600 },
        { name: 'amber-700', hex: '#b45309', family: 'amber', shade: 700 },
        { name: 'amber-800', hex: '#92400e', family: 'amber', shade: 800 },
        { name: 'amber-900', hex: '#78350f', family: 'amber', shade: 900 },
        { name: 'amber-950', hex: '#451a03', family: 'amber', shade: 950 },

        // Orange
        { name: 'orange-50', hex: '#fff7ed', family: 'orange', shade: 50 },
        { name: 'orange-100', hex: '#ffedd5', family: 'orange', shade: 100 },
        { name: 'orange-200', hex: '#fed7aa', family: 'orange', shade: 200 },
        { name: 'orange-300', hex: '#fdba74', family: 'orange', shade: 300 },
        { name: 'orange-400', hex: '#fb923c', family: 'orange', shade: 400 },
        { name: 'orange-500', hex: '#f97316', family: 'orange', shade: 500 },
        { name: 'orange-600', hex: '#ea580c', family: 'orange', shade: 600 },
        { name: 'orange-700', hex: '#c2410c', family: 'orange', shade: 700 },
        { name: 'orange-800', hex: '#9a3412', family: 'orange', shade: 800 },
        { name: 'orange-900', hex: '#7c2d12', family: 'orange', shade: 900 },
        { name: 'orange-950', hex: '#431407', family: 'orange', shade: 950 },

        // Lime
        { name: 'lime-50', hex: '#f7fee7', family: 'lime', shade: 50 },
        { name: 'lime-100', hex: '#ecfccb', family: 'lime', shade: 100 },
        { name: 'lime-200', hex: '#d9f99d', family: 'lime', shade: 200 },
        { name: 'lime-300', hex: '#bef264', family: 'lime', shade: 300 },
        { name: 'lime-400', hex: '#a3e635', family: 'lime', shade: 400 },
        { name: 'lime-500', hex: '#84cc16', family: 'lime', shade: 500 },
        { name: 'lime-600', hex: '#65a30d', family: 'lime', shade: 600 },
        { name: 'lime-700', hex: '#4d7c0f', family: 'lime', shade: 700 },
        { name: 'lime-800', hex: '#3f6212', family: 'lime', shade: 800 },
        { name: 'lime-900', hex: '#365314', family: 'lime', shade: 900 },
        { name: 'lime-950', hex: '#1a2e05', family: 'lime', shade: 950 },

        // Emerald
        { name: 'emerald-50', hex: '#ecfdf5', family: 'emerald', shade: 50 },
        { name: 'emerald-100', hex: '#d1fae5', family: 'emerald', shade: 100 },
        { name: 'emerald-200', hex: '#a7f3d0', family: 'emerald', shade: 200 },
        { name: 'emerald-300', hex: '#6ee7b7', family: 'emerald', shade: 300 },
        { name: 'emerald-400', hex: '#34d399', family: 'emerald', shade: 400 },
        { name: 'emerald-500', hex: '#10b981', family: 'emerald', shade: 500 },
        { name: 'emerald-600', hex: '#059669', family: 'emerald', shade: 600 },
        { name: 'emerald-700', hex: '#047857', family: 'emerald', shade: 700 },
        { name: 'emerald-800', hex: '#065f46', family: 'emerald', shade: 800 },
        { name: 'emerald-900', hex: '#064e3b', family: 'emerald', shade: 900 },
        { name: 'emerald-950', hex: '#022c22', family: 'emerald', shade: 950 },

        // Teal
        { name: 'teal-50', hex: '#f0fdfa', family: 'teal', shade: 50 },
        { name: 'teal-100', hex: '#ccfbf1', family: 'teal', shade: 100 },
        { name: 'teal-200', hex: '#99f6e4', family: 'teal', shade: 200 },
        { name: 'teal-300', hex: '#5eead4', family: 'teal', shade: 300 },
        { name: 'teal-400', hex: '#2dd4bf', family: 'teal', shade: 400 },
        { name: 'teal-500', hex: '#14b8a6', family: 'teal', shade: 500 },
        { name: 'teal-600', hex: '#0d9488', family: 'teal', shade: 600 },
        { name: 'teal-700', hex: '#0f766e', family: 'teal', shade: 700 },
        { name: 'teal-800', hex: '#115e59', family: 'teal', shade: 800 },
        { name: 'teal-900', hex: '#134e4a', family: 'teal', shade: 900 },
        { name: 'teal-950', hex: '#042f2e', family: 'teal', shade: 950 },

        // Cyan
        { name: 'cyan-50', hex: '#ecfeff', family: 'cyan', shade: 50 },
        { name: 'cyan-100', hex: '#cffafe', family: 'cyan', shade: 100 },
        { name: 'cyan-200', hex: '#a5f3fc', family: 'cyan', shade: 200 },
        { name: 'cyan-300', hex: '#67e8f9', family: 'cyan', shade: 300 },
        { name: 'cyan-400', hex: '#22d3ee', family: 'cyan', shade: 400 },
        { name: 'cyan-500', hex: '#06b6d4', family: 'cyan', shade: 500 },
        { name: 'cyan-600', hex: '#0891b2', family: 'cyan', shade: 600 },
        { name: 'cyan-700', hex: '#0e7490', family: 'cyan', shade: 700 },
        { name: 'cyan-800', hex: '#155e75', family: 'cyan', shade: 800 },
        { name: 'cyan-900', hex: '#164e63', family: 'cyan', shade: 900 },
        { name: 'cyan-950', hex: '#083344', family: 'cyan', shade: 950 },

        // Sky
        { name: 'sky-50', hex: '#f0f9ff', family: 'sky', shade: 50 },
        { name: 'sky-100', hex: '#e0f2fe', family: 'sky', shade: 100 },
        { name: 'sky-200', hex: '#bae6fd', family: 'sky', shade: 200 },
        { name: 'sky-300', hex: '#7dd3fc', family: 'sky', shade: 300 },
        { name: 'sky-400', hex: '#38bdf8', family: 'sky', shade: 400 },
        { name: 'sky-500', hex: '#0ea5e9', family: 'sky', shade: 500 },
        { name: 'sky-600', hex: '#0284c7', family: 'sky', shade: 600 },
        { name: 'sky-700', hex: '#0369a1', family: 'sky', shade: 700 },
        { name: 'sky-800', hex: '#075985', family: 'sky', shade: 800 },
        { name: 'sky-900', hex: '#0c4a6e', family: 'sky', shade: 900 },
        { name: 'sky-950', hex: '#082f49', family: 'sky', shade: 950 },

        // Indigo
        { name: 'indigo-50', hex: '#eef2ff', family: 'indigo', shade: 50 },
        { name: 'indigo-100', hex: '#e0e7ff', family: 'indigo', shade: 100 },
        { name: 'indigo-200', hex: '#c7d2fe', family: 'indigo', shade: 200 },
        { name: 'indigo-300', hex: '#a5b4fc', family: 'indigo', shade: 300 },
        { name: 'indigo-400', hex: '#818cf8', family: 'indigo', shade: 400 },
        { name: 'indigo-500', hex: '#6366f1', family: 'indigo', shade: 500 },
        { name: 'indigo-600', hex: '#4f46e5', family: 'indigo', shade: 600 },
        { name: 'indigo-700', hex: '#4338ca', family: 'indigo', shade: 700 },
        { name: 'indigo-800', hex: '#3730a3', family: 'indigo', shade: 800 },
        { name: 'indigo-900', hex: '#312e81', family: 'indigo', shade: 900 },
        { name: 'indigo-950', hex: '#1e1b4b', family: 'indigo', shade: 950 },

        // Violet
        { name: 'violet-50', hex: '#f5f3ff', family: 'violet', shade: 50 },
        { name: 'violet-100', hex: '#ede9fe', family: 'violet', shade: 100 },
        { name: 'violet-200', hex: '#ddd6fe', family: 'violet', shade: 200 },
        { name: 'violet-300', hex: '#c4b5fd', family: 'violet', shade: 300 },
        { name: 'violet-400', hex: '#a78bfa', family: 'violet', shade: 400 },
        { name: 'violet-500', hex: '#8b5cf6', family: 'violet', shade: 500 },
        { name: 'violet-600', hex: '#7c3aed', family: 'violet', shade: 600 },
        { name: 'violet-700', hex: '#6d28d9', family: 'violet', shade: 700 },
        { name: 'violet-800', hex: '#5b21b6', family: 'violet', shade: 800 },
        { name: 'violet-900', hex: '#4c1d95', family: 'violet', shade: 900 },
        { name: 'violet-950', hex: '#2e1065', family: 'violet', shade: 950 },

        // Fuchsia
        { name: 'fuchsia-50', hex: '#fdf4ff', family: 'fuchsia', shade: 50 },
        { name: 'fuchsia-100', hex: '#fae8ff', family: 'fuchsia', shade: 100 },
        { name: 'fuchsia-200', hex: '#f5d0fe', family: 'fuchsia', shade: 200 },
        { name: 'fuchsia-300', hex: '#f0abfc', family: 'fuchsia', shade: 300 },
        { name: 'fuchsia-400', hex: '#e879f9', family: 'fuchsia', shade: 400 },
        { name: 'fuchsia-500', hex: '#d946ef', family: 'fuchsia', shade: 500 },
        { name: 'fuchsia-600', hex: '#c026d3', family: 'fuchsia', shade: 600 },
        { name: 'fuchsia-700', hex: '#a21caf', family: 'fuchsia', shade: 700 },
        { name: 'fuchsia-800', hex: '#86198f', family: 'fuchsia', shade: 800 },
        { name: 'fuchsia-900', hex: '#701a75', family: 'fuchsia', shade: 900 },
        { name: 'fuchsia-950', hex: '#4a044e', family: 'fuchsia', shade: 950 },

        // Rose
        { name: 'rose-50', hex: '#fff1f2', family: 'rose', shade: 50 },
        { name: 'rose-100', hex: '#ffe4e6', family: 'rose', shade: 100 },
        { name: 'rose-200', hex: '#fecdd3', family: 'rose', shade: 200 },
        { name: 'rose-300', hex: '#fda4af', family: 'rose', shade: 300 },
        { name: 'rose-400', hex: '#fb7185', family: 'rose', shade: 400 },
        { name: 'rose-500', hex: '#f43f5e', family: 'rose', shade: 500 },
        { name: 'rose-600', hex: '#e11d48', family: 'rose', shade: 600 },
        { name: 'rose-700', hex: '#be123c', family: 'rose', shade: 700 },
        { name: 'rose-800', hex: '#9f1239', family: 'rose', shade: 800 },
        { name: 'rose-900', hex: '#881337', family: 'rose', shade: 900 },
        { name: 'rose-950', hex: '#4c0519', family: 'rose', shade: 950 },

        // Neutral
        { name: 'neutral-50', hex: '#fafafa', family: 'neutral', shade: 50 },
        { name: 'neutral-100', hex: '#f5f5f5', family: 'neutral', shade: 100 },
        { name: 'neutral-200', hex: '#e5e5e5', family: 'neutral', shade: 200 },
        { name: 'neutral-300', hex: '#d4d4d4', family: 'neutral', shade: 300 },
        { name: 'neutral-400', hex: '#a3a3a3', family: 'neutral', shade: 400 },
        { name: 'neutral-500', hex: '#737373', family: 'neutral', shade: 500 },
        { name: 'neutral-600', hex: '#525252', family: 'neutral', shade: 600 },
        { name: 'neutral-700', hex: '#404040', family: 'neutral', shade: 700 },
        { name: 'neutral-800', hex: '#262626', family: 'neutral', shade: 800 },
        { name: 'neutral-900', hex: '#171717', family: 'neutral', shade: 900 },
        { name: 'neutral-950', hex: '#0a0a0a', family: 'neutral', shade: 950 },

        // Stone
        { name: 'stone-50', hex: '#fafaf9', family: 'stone', shade: 50 },
        { name: 'stone-100', hex: '#f5f5f4', family: 'stone', shade: 100 },
        { name: 'stone-200', hex: '#e7e5e4', family: 'stone', shade: 200 },
        { name: 'stone-300', hex: '#d6d3d1', family: 'stone', shade: 300 },
        { name: 'stone-400', hex: '#a8a29e', family: 'stone', shade: 400 },
        { name: 'stone-500', hex: '#78716c', family: 'stone', shade: 500 },
        { name: 'stone-600', hex: '#57534e', family: 'stone', shade: 600 },
        { name: 'stone-700', hex: '#44403c', family: 'stone', shade: 700 },
        { name: 'stone-800', hex: '#292524', family: 'stone', shade: 800 },
        { name: 'stone-900', hex: '#1c1917', family: 'stone', shade: 900 },
        { name: 'stone-950', hex: '#0c0a09', family: 'stone', shade: 950 }
    ];

    console.log(`📦 Seeding ${colors.length} missing colors...`);

    const { error } = await supabase
        .from('tailwind_colors')
        .upsert(colors, { onConflict: 'name' });

    if (error) {
        console.error("❌ Seeding Failed:", error.message);
    } else {
        console.log("✅ Seeding Complete! 132 Colors Added.");
    }
}

seed();
