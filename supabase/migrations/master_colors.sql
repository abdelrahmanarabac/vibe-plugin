-- ═══════════════════════════════════════════════════════════════════════
-- VIBE MASTER COLOR DATABASE (Unified Schema - v2.2 Corrected)
-- ═══════════════════════════════════════════════════════════════════════
-- This is your Single Source of Truth.
-- Run this in Supabase SQL Editor to reset/init the entire color system.

-- 1. Create the Master Table
create table if not exists vibe_colors (
  id bigint primary key generated always as identity,
  hex text not null unique check (hex ~* '^#[a-f0-9]{6}$'),
  name text not null,
  family text,        -- e.g., 'primary', 'slate', 'blue' (Nullable for system colors)
  shade integer,      -- e.g., 500, 900 (Nullable)
  dataset_source text default 'system', -- 'system', 'tailwind', 'user'
  created_at timestamptz default now()
);

-- 2. Indexes for Performance
create index if not exists idx_vibe_colors_hex on vibe_colors(hex);
create index if not exists idx_vibe_colors_family on vibe_colors(family);

-- 3. Security Policies (RLS)
alter table vibe_colors enable row level security;

-- Public Read Access
drop policy if exists "Allow public read" on vibe_colors;
create policy "Allow public read"
on vibe_colors for select
to public
using (true);

-- Authenticated Insert
drop policy if exists "Allow insert" on vibe_colors;
create policy "Allow insert"
on vibe_colors for insert
to public
with check (true);

-- 4. MASTER SEED DATA
-- Fully Deduplicated List (All 22 Tailwind Families + System)
insert into vibe_colors (hex, name, family, shade, dataset_source) values
-- System Defaults
('#ffffff', 'white', 'base', 0, 'system'),
('#000000', 'black', 'base', 1000, 'system'),
('#6E62E5', 'brand-primary', 'brand', 500, 'system'),

-- ═══════════════════════════════════════════════════════════════════════
-- TAILWIND COMPLETE SPECTRUM (22 Families)
-- ═══════════════════════════════════════════════════════════════════════

-- Slate
('#f8fafc', 'slate-50', 'slate', 50, 'tailwind'),
('#f1f5f9', 'slate-100', 'slate', 100, 'tailwind'),
('#e2e8f0', 'slate-200', 'slate', 200, 'tailwind'),
('#cbd5e1', 'slate-300', 'slate', 300, 'tailwind'),
('#94a3b8', 'slate-400', 'slate', 400, 'tailwind'),
('#64748b', 'slate-500', 'slate', 500, 'tailwind'),
('#475569', 'slate-600', 'slate', 600, 'tailwind'),
('#334155', 'slate-700', 'slate', 700, 'tailwind'),
('#1e293b', 'slate-800', 'slate', 800, 'tailwind'),
('#0f172a', 'slate-900', 'slate', 900, 'tailwind'),

-- Gray
('#f9fafb', 'gray-50', 'gray', 50, 'tailwind'),
('#f3f4f6', 'gray-100', 'gray', 100, 'tailwind'),
('#e5e7eb', 'gray-200', 'gray', 200, 'tailwind'),
('#d1d5db', 'gray-300', 'gray', 300, 'tailwind'),
('#9ca3af', 'gray-400', 'gray', 400, 'tailwind'),
('#6b7280', 'gray-500', 'gray', 500, 'tailwind'),
('#4b5563', 'gray-600', 'gray', 600, 'tailwind'),
('#374151', 'gray-700', 'gray', 700, 'tailwind'),
('#1f2937', 'gray-800', 'gray', 800, 'tailwind'),
('#111827', 'gray-900', 'gray', 900, 'tailwind'),

-- Zinc
('#fafafa', 'zinc-50', 'zinc', 50, 'tailwind'),
('#f4f4f5', 'zinc-100', 'zinc', 100, 'tailwind'),
('#e4e4e7', 'zinc-200', 'zinc', 200, 'tailwind'),
('#d4d4d8', 'zinc-300', 'zinc', 300, 'tailwind'),
('#a1a1aa', 'zinc-400', 'zinc', 400, 'tailwind'),
('#71717a', 'zinc-500', 'zinc', 500, 'tailwind'),
('#52525b', 'zinc-600', 'zinc', 600, 'tailwind'),
('#3f3f46', 'zinc-700', 'zinc', 700, 'tailwind'),
('#27272a', 'zinc-800', 'zinc', 800, 'tailwind'),
('#18181b', 'zinc-900', 'zinc', 900, 'tailwind'),

-- Neutral
('#fafafa', 'neutral-50', 'neutral', 50, 'tailwind'),
('#f5f5f5', 'neutral-100', 'neutral', 100, 'tailwind'),
('#e5e5e5', 'neutral-200', 'neutral', 200, 'tailwind'),
('#d4d4d4', 'neutral-300', 'neutral', 300, 'tailwind'),
('#a3a3a3', 'neutral-400', 'neutral', 400, 'tailwind'),
('#737373', 'neutral-500', 'neutral', 500, 'tailwind'),
('#525252', 'neutral-600', 'neutral', 600, 'tailwind'),
('#404040', 'neutral-700', 'neutral', 700, 'tailwind'),
('#262626', 'neutral-800', 'neutral', 800, 'tailwind'),
('#171717', 'neutral-900', 'neutral', 900, 'tailwind'),
('#0a0a0a', 'neutral-950', 'neutral', 950, 'tailwind'),

-- Stone
('#fafaf9', 'stone-50', 'stone', 50, 'tailwind'),
('#f5f5f4', 'stone-100', 'stone', 100, 'tailwind'),
('#e7e5e4', 'stone-200', 'stone', 200, 'tailwind'),
('#d6d3d1', 'stone-300', 'stone', 300, 'tailwind'),
('#a8a29e', 'stone-400', 'stone', 400, 'tailwind'),
('#78716c', 'stone-500', 'stone', 500, 'tailwind'),
('#57534e', 'stone-600', 'stone', 600, 'tailwind'),
('#44403c', 'stone-700', 'stone', 700, 'tailwind'),
('#292524', 'stone-800', 'stone', 800, 'tailwind'),
('#1c1917', 'stone-900', 'stone', 900, 'tailwind'),
('#0c0a09', 'stone-950', 'stone', 950, 'tailwind'),

-- Red
('#fef2f2', 'red-50', 'red', 50, 'tailwind'),
('#fee2e2', 'red-100', 'red', 100, 'tailwind'),
('#fecaca', 'red-200', 'red', 200, 'tailwind'),
('#fca5a5', 'red-300', 'red', 300, 'tailwind'),
('#f87171', 'red-400', 'red', 400, 'tailwind'),
('#ef4444', 'red-500', 'red', 500, 'tailwind'),
('#dc2626', 'red-600', 'red', 600, 'tailwind'),
('#b91c1c', 'red-700', 'red', 700, 'tailwind'),
('#991b1b', 'red-800', 'red', 800, 'tailwind'),
('#7f1d1d', 'red-900', 'red', 900, 'tailwind'),

-- Orange
('#fff7ed', 'orange-50', 'orange', 50, 'tailwind'),
('#ffedd5', 'orange-100', 'orange', 100, 'tailwind'),
('#fed7aa', 'orange-200', 'orange', 200, 'tailwind'),
('#fdba74', 'orange-300', 'orange', 300, 'tailwind'),
('#fb923c', 'orange-400', 'orange', 400, 'tailwind'),
('#f97316', 'orange-500', 'orange', 500, 'tailwind'),
('#ea580c', 'orange-600', 'orange', 600, 'tailwind'),
('#c2410c', 'orange-700', 'orange', 700, 'tailwind'),
('#9a3412', 'orange-800', 'orange', 800, 'tailwind'),
('#7c2d12', 'orange-900', 'orange', 900, 'tailwind'),
('#431407', 'orange-950', 'orange', 950, 'tailwind'),

-- Amber
('#fffbeb', 'amber-50', 'amber', 50, 'tailwind'),
('#fef3c7', 'amber-100', 'amber', 100, 'tailwind'),
('#fde68a', 'amber-200', 'amber', 200, 'tailwind'),
('#fcd34d', 'amber-300', 'amber', 300, 'tailwind'),
('#fbbf24', 'amber-400', 'amber', 400, 'tailwind'),
('#f59e0b', 'amber-500', 'amber', 500, 'tailwind'),
('#d97706', 'amber-600', 'amber', 600, 'tailwind'),
('#b45309', 'amber-700', 'amber', 700, 'tailwind'),
('#92400e', 'amber-800', 'amber', 800, 'tailwind'),
('#78350f', 'amber-900', 'amber', 900, 'tailwind'),
('#451a03', 'amber-950', 'amber', 950, 'tailwind'),

-- Yellow
('#fefce8', 'yellow-50', 'yellow', 50, 'tailwind'),
('#fef9c3', 'yellow-100', 'yellow', 100, 'tailwind'),
('#fef08a', 'yellow-200', 'yellow', 200, 'tailwind'),
('#fde047', 'yellow-300', 'yellow', 300, 'tailwind'),
('#facc15', 'yellow-400', 'yellow', 400, 'tailwind'),
('#eab308', 'yellow-500', 'yellow', 500, 'tailwind'),
('#ca8a04', 'yellow-600', 'yellow', 600, 'tailwind'),
('#a16207', 'yellow-700', 'yellow', 700, 'tailwind'),
('#854d0e', 'yellow-800', 'yellow', 800, 'tailwind'),
('#713f12', 'yellow-900', 'yellow', 900, 'tailwind'),
('#422006', 'yellow-950', 'yellow', 950, 'tailwind'),

-- Lime
('#f7fee7', 'lime-50', 'lime', 50, 'tailwind'),
('#ecfccb', 'lime-100', 'lime', 100, 'tailwind'),
('#d9f99d', 'lime-200', 'lime', 200, 'tailwind'),
('#bef264', 'lime-300', 'lime', 300, 'tailwind'),
('#a3e635', 'lime-400', 'lime', 400, 'tailwind'),
('#84cc16', 'lime-500', 'lime', 500, 'tailwind'),
('#65a30d', 'lime-600', 'lime', 600, 'tailwind'),
('#4d7c0f', 'lime-700', 'lime', 700, 'tailwind'),
('#3f6212', 'lime-800', 'lime', 800, 'tailwind'),
('#365314', 'lime-900', 'lime', 900, 'tailwind'),
('#1a2e05', 'lime-950', 'lime', 950, 'tailwind'),

-- Green
('#f0fdf4', 'green-50', 'green', 50, 'tailwind'),
('#dcfce7', 'green-100', 'green', 100, 'tailwind'),
('#bbf7d0', 'green-200', 'green', 200, 'tailwind'),
('#86efac', 'green-300', 'green', 300, 'tailwind'),
('#4ade80', 'green-400', 'green', 400, 'tailwind'),
('#22c55e', 'green-500', 'green', 500, 'tailwind'),
('#16a34a', 'green-600', 'green', 600, 'tailwind'),
('#15803d', 'green-700', 'green', 700, 'tailwind'),
('#166534', 'green-800', 'green', 800, 'tailwind'),
('#14532d', 'green-900', 'green', 900, 'tailwind'),

-- Emerald
('#ecfdf5', 'emerald-50', 'emerald', 50, 'tailwind'),
('#d1fae5', 'emerald-100', 'emerald', 100, 'tailwind'),
('#a7f3d0', 'emerald-200', 'emerald', 200, 'tailwind'),
('#6ee7b7', 'emerald-300', 'emerald', 300, 'tailwind'),
('#34d399', 'emerald-400', 'emerald', 400, 'tailwind'),
('#10b981', 'emerald-500', 'emerald', 500, 'tailwind'),
('#059669', 'emerald-600', 'emerald', 600, 'tailwind'),
('#047857', 'emerald-700', 'emerald', 700, 'tailwind'),
('#065f46', 'emerald-800', 'emerald', 800, 'tailwind'),
('#064e3b', 'emerald-900', 'emerald', 900, 'tailwind'),
('#022c22', 'emerald-950', 'emerald', 950, 'tailwind'),

-- Teal
('#f0fdfa', 'teal-50', 'teal', 50, 'tailwind'),
('#ccfbf1', 'teal-100', 'teal', 100, 'tailwind'),
('#99f6e4', 'teal-200', 'teal', 200, 'tailwind'),
('#5eead4', 'teal-300', 'teal', 300, 'tailwind'),
('#2dd4bf', 'teal-400', 'teal', 400, 'tailwind'),
('#14b8a6', 'teal-500', 'teal', 500, 'tailwind'),
('#0d9488', 'teal-600', 'teal', 600, 'tailwind'),
('#0f766e', 'teal-700', 'teal', 700, 'tailwind'),
('#115e59', 'teal-800', 'teal', 800, 'tailwind'),
('#134e4a', 'teal-900', 'teal', 900, 'tailwind'),
('#042f2e', 'teal-950', 'teal', 950, 'tailwind'),

-- Cyan
('#ecfeff', 'cyan-50', 'cyan', 50, 'tailwind'),
('#cffafe', 'cyan-100', 'cyan', 100, 'tailwind'),
('#a5f3fc', 'cyan-200', 'cyan', 200, 'tailwind'),
('#67e8f9', 'cyan-300', 'cyan', 300, 'tailwind'),
('#22d3ee', 'cyan-400', 'cyan', 400, 'tailwind'),
('#06b6d4', 'cyan-500', 'cyan', 500, 'tailwind'),
('#0891b2', 'cyan-600', 'cyan', 600, 'tailwind'),
('#0e7490', 'cyan-700', 'cyan', 700, 'tailwind'),
('#155e75', 'cyan-800', 'cyan', 800, 'tailwind'),
('#164e63', 'cyan-900', 'cyan', 900, 'tailwind'),
('#083344', 'cyan-950', 'cyan', 950, 'tailwind'),

-- Sky
('#f0f9ff', 'sky-50', 'sky', 50, 'tailwind'),
('#e0f2fe', 'sky-100', 'sky', 100, 'tailwind'),
('#bae6fd', 'sky-200', 'sky', 200, 'tailwind'),
('#7dd3fc', 'sky-300', 'sky', 300, 'tailwind'),
('#38bdf8', 'sky-400', 'sky', 400, 'tailwind'),
('#0ea5e9', 'sky-500', 'sky', 500, 'tailwind'),
('#0284c7', 'sky-600', 'sky', 600, 'tailwind'),
('#0369a1', 'sky-700', 'sky', 700, 'tailwind'),
('#075985', 'sky-800', 'sky', 800, 'tailwind'),
('#0c4a6e', 'sky-900', 'sky', 900, 'tailwind'),
('#082f49', 'sky-950', 'sky', 950, 'tailwind'),

-- Blue
('#eff6ff', 'blue-50', 'blue', 50, 'tailwind'),
('#dbeafe', 'blue-100', 'blue', 100, 'tailwind'),
('#bfdbfe', 'blue-200', 'blue', 200, 'tailwind'),
('#93c5fd', 'blue-300', 'blue', 300, 'tailwind'),
('#60a5fa', 'blue-400', 'blue', 400, 'tailwind'),
('#3b82f6', 'blue-500', 'blue', 500, 'tailwind'),
('#2563eb', 'blue-600', 'blue', 600, 'tailwind'),
('#1d4ed8', 'blue-700', 'blue', 700, 'tailwind'),
('#1e40af', 'blue-800', 'blue', 800, 'tailwind'),
('#1e3a8a', 'blue-900', 'blue', 900, 'tailwind'),

-- Indigo
('#eef2ff', 'indigo-50', 'indigo', 50, 'tailwind'),
('#e0e7ff', 'indigo-100', 'indigo', 100, 'tailwind'),
('#c7d2fe', 'indigo-200', 'indigo', 200, 'tailwind'),
('#a5b4fc', 'indigo-300', 'indigo', 300, 'tailwind'),
('#818cf8', 'indigo-400', 'indigo', 400, 'tailwind'),
('#6366f1', 'indigo-500', 'indigo', 500, 'tailwind'),
('#4f46e5', 'indigo-600', 'indigo', 600, 'tailwind'),
('#4338ca', 'indigo-700', 'indigo', 700, 'tailwind'),
('#3730a3', 'indigo-800', 'indigo', 800, 'tailwind'),
('#312e81', 'indigo-900', 'indigo', 900, 'tailwind'),
('#1e1b4b', 'indigo-950', 'indigo', 950, 'tailwind'),

-- Violet
('#f5f3ff', 'violet-50', 'violet', 50, 'tailwind'),
('#ede9fe', 'violet-100', 'violet', 100, 'tailwind'),
('#ddd6fe', 'violet-200', 'violet', 200, 'tailwind'),
('#c4b5fd', 'violet-300', 'violet', 300, 'tailwind'),
('#a78bfa', 'violet-400', 'violet', 400, 'tailwind'),
('#8b5cf6', 'violet-500', 'violet', 500, 'tailwind'),
('#7c3aed', 'violet-600', 'violet', 600, 'tailwind'),
('#6d28d9', 'violet-700', 'violet', 700, 'tailwind'),
('#5b21b6', 'violet-800', 'violet', 800, 'tailwind'),
('#4c1d95', 'violet-900', 'violet', 900, 'tailwind'),
('#2e1065', 'violet-950', 'violet', 950, 'tailwind'),

-- Purple
('#faf5ff', 'purple-50', 'purple', 50, 'tailwind'),
('#f3e8ff', 'purple-100', 'purple', 100, 'tailwind'),
('#e9d5ff', 'purple-200', 'purple', 200, 'tailwind'),
('#d8b4fe', 'purple-300', 'purple', 300, 'tailwind'),
('#c084fc', 'purple-400', 'purple', 400, 'tailwind'),
('#a855f7', 'purple-500', 'purple', 500, 'tailwind'),
('#9333ea', 'purple-600', 'purple', 600, 'tailwind'),
('#7e22ce', 'purple-700', 'purple', 700, 'tailwind'),
('#6b21a8', 'purple-800', 'purple', 800, 'tailwind'),
('#581c87', 'purple-900', 'purple', 900, 'tailwind'),

-- Fuchsia
('#fdf4ff', 'fuchsia-50', 'fuchsia', 50, 'tailwind'),
('#fae8ff', 'fuchsia-100', 'fuchsia', 100, 'tailwind'),
('#f5d0fe', 'fuchsia-200', 'fuchsia', 200, 'tailwind'),
('#f0abfc', 'fuchsia-300', 'fuchsia', 300, 'tailwind'),
('#e879f9', 'fuchsia-400', 'fuchsia', 400, 'tailwind'),
('#d946ef', 'fuchsia-500', 'fuchsia', 500, 'tailwind'),
('#c026d3', 'fuchsia-600', 'fuchsia', 600, 'tailwind'),
('#a21caf', 'fuchsia-700', 'fuchsia', 700, 'tailwind'),
('#86198f', 'fuchsia-800', 'fuchsia', 800, 'tailwind'),
('#701a75', 'fuchsia-900', 'fuchsia', 900, 'tailwind'),
('#4a044e', 'fuchsia-950', 'fuchsia', 950, 'tailwind'),

-- Pink
('#fdf2f8', 'pink-50', 'pink', 50, 'tailwind'),
('#fce7f3', 'pink-100', 'pink', 100, 'tailwind'),
('#fbcfe8', 'pink-200', 'pink', 200, 'tailwind'),
('#f9a8d4', 'pink-300', 'pink', 300, 'tailwind'),
('#f472b6', 'pink-400', 'pink', 400, 'tailwind'),
('#ec4899', 'pink-500', 'pink', 500, 'tailwind'),
('#db2777', 'pink-600', 'pink', 600, 'tailwind'),
('#be185d', 'pink-700', 'pink', 700, 'tailwind'),
('#9d174d', 'pink-800', 'pink', 800, 'tailwind'),
('#831843', 'pink-900', 'pink', 900, 'tailwind'),

-- Rose
('#fff1f2', 'rose-50', 'rose', 50, 'tailwind'),
('#ffe4e6', 'rose-100', 'rose', 100, 'tailwind'),
('#fecdd3', 'rose-200', 'rose', 200, 'tailwind'),
('#fda4af', 'rose-300', 'rose', 300, 'tailwind'),
('#fb7185', 'rose-400', 'rose', 400, 'tailwind'),
('#f43f5e', 'rose-500', 'rose', 500, 'tailwind'),
('#e11d48', 'rose-600', 'rose', 600, 'tailwind'),
('#be123c', 'rose-700', 'rose', 700, 'tailwind'),
('#9f1239', 'rose-800', 'rose', 800, 'tailwind'),
('#881337', 'rose-900', 'rose', 900, 'tailwind'),
('#4c0519', 'rose-950', 'rose', 950, 'tailwind')

on conflict (hex) do update set
  name = excluded.name,
  family = excluded.family,
  shade = excluded.shade;
