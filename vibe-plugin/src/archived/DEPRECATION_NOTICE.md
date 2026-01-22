# ⚠️ DEPRECATED LOGIC

This directory contains code related to direct Layer/Frame manipulation capabilities (AutoLayout, Type Generation, Perception Engine).

**Reason:**  
The Vibe Plugin has pivoted to become a **Pure Token Management System**. As of 2026-01-22, we no longer directly manipulate the Figma canvas layers.

**Contents:**
- `features/layout/*`: Legacy Auto Layout generators.
- `features/typography/*`: Legacy Type Style generators.
- `modules/intelligence/PerceptionEngine.ts`: The old scanning engine for layers.
- `modules/construction/*`: Component builders and style resolvers.

**Restoration:**  
If we decide to re-enable "Construction Mode" in the future, restore these files to their original paths.

**Context:**  
See `TOKEN_REFACTOR_PLAN.md` for the full migration strategy.
