# 🧠 Vibe System Memory

## 📚 Lessons Learned
*   **User Constraint:** "The Vibe" is critical. Do not over-sanitize the UI. It must feel "High-Tech" and "Premium", not just "Clean".
*   **Critical Failure:** UI Responsiveness is mandatory. The plugin must handle window resizing gracefully.
*   **Protocol:** Strict adherence to `SKILL.md` (Atomic Completeness, Screaming Architecture) is required always.
*   **Test Setup:** When refacting internal logic methods (e.g., `runClassificationLogic`), always verify that corresponding unit tests are updated to match the new signature (Number of arguments, types).
*   **Color Naming Sensitivity:** For semantic color naming (CIEDE2000), a strict threshold (<15) may be too conservative for "deep" or "saturated" shades. A threshold of ~20 (weighted) provides a better balance between semantic accuracy and name coverage.

## 🛠️ Global Preferences
*   **Tech Stack:** React, Vite, Zod, Gemini AI.
*   **Style:** Glassmorphism, Neon Accents, Fluid Layouts.

### AI Integration
- **Strict JSON Prompts**: Generative models love to chat. Always use `substring(start, end)` to extract JSON from `{` or `[` to `}` or `]`. Never assume the response is clean JSON.
### Phase 4 Architecture (Token OS)
- **Tailwind v4 Migration**: v4 moves from JS-based config to CSS-based `@theme`. Use `@tailwindcss/vite` for seamless build integration and `@import "tailwindcss"` in the main CSS entry.
- **Unified Shell (OOUX)**: Organizing the UI around a central "Omnibox" (Cmd+K) significantly reduces cognitive load by unifying search, navigation, and AI interaction into a single entry point.
- **View Isolation**: Keep `MainLayout` as a pure shell. Business views (Dashboard, Editor) should not carry their own headers/footers to ensure a consistent look and feel across the OS.
- **Gemini Model Naming (2026)**: User environment strictly follows 2026 identifiers (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-3-flash`). Older 1.5 or 2.0 models may trigger 404 errors.
- **Manifest Permissions**: Permissions like `clipboard-write` and `display-capture` are invalid in the Figma manifest array and must be excluded to pass validation.

