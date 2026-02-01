# 🧠 Vibe System Memory

## 📚 Lessons Learned
*   **User Constraint:** "The Vibe" is critical. Do not over-sanitize the UI. It must feel "High-Tech" and "Premium", not just "Clean".
*   **Critical Failure:** UI Responsiveness is mandatory. The plugin must handle window resizing gracefully.
*   **Protocol:** Strict adherence to `SKILL.md` (Atomic Completeness, Screaming Architecture) is required always.
*   **Test Setup:** When refacting internal logic methods (e.g., `runClassificationLogic`), always verify that corresponding unit tests are updated to match the new signature (Number of arguments, types).
*   **Color Naming Sensitivity:** For semantic color naming (CIEDE2000), a strict threshold (<15) may be too conservative for "deep" or "saturated" shades. A threshold of ~20 (weighted) provides a better balance between semantic accuracy and name coverage.
*   **Logic Unification (DRY)**: Duplicating state logic between Full Pages and Dialogs leads to "Logic Drift". Always extract token-creation logic into a module-scoped hook (`useTokenCreation`) and shared atoms (`TokenNameInput`).
*   **Screaming Architecture (Level 3)**: Organizing the code into `/modules/[name]/ui/[pages|components|dialogs]` ensures the folder structure reflects the business domain. This 5-layer depth is now the project standard.
*   **Merge Integrity**: In a fast-moving agentic workflow, `App.tsx` and `Dashboard.tsx` are high-conflict zones. Always perform a full-file read-and-sanitize if merge markers are detected.
*   **Zero 'any' Policy**: Use strict `TokenFormData` and `TokenModeValue` interfaces for all form-to-hook-to-backend data flows.
*   **Module Parity**: All new modules (e.g., `Styles`) must follow the `Tokens` blueprint: `/domain` for types/logic, `/ui/components` for atoms, `/ui/hooks` for state.

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

### Phase 5 Intelligence (The Ghost Architect)
- **Visitor Pattern V2**: Use `CompositeVisitor` + `Traverser` for all scene graph operations. Separation of traversal logic from business logic (Discovery, Stats) is mandatory for performance.
- **Design Gravity**: All scanning capabilities must implement drift detection (CIEDE2000 < 2.5 DeltaE) to bridge the gap between "Loose Styles" and "Strict Tokens".
- **Harmony Healer**: Any color mutation MUST undergo `HarmonyValidator.validateContrast` to prevent WCAG regressions in dependent layers.

*   **Activity Lifecycle (Persistence)**: Token creation is a high-frequency, repetitive task. Auto-closing views or navigating away is destructive; preserving state (Path, Type, Value) while resetting only the Name field enables high-speed sequential creation.
*   **Unified Feedback Layer**: Fragmented feedback systems (Toasts vs. Modals) increase cognitive load. Routing all lifecycle status (Loading/Success/Error) through a centralized `OmniboxManager` ensures a consistent "OS-level" feedback loop.
*   **Design Token Discipline**: Hardcoded colors (`#1A1A1A`, `white/5`) are "Logic Drift". Strict adherence to semantic tokens (`bg-surface-1`, `border-surface-2`) is mandatory for theme integrity and human-centric design.
*   **Primary Action Positioning**: Centering the "New Collection" / "Add Group" button within the Path Picker dropdown transforms it from a utility to a primary structural action, aligning with "Human-Crafted" design standards.
