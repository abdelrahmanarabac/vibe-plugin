# Palette's Journal

## 2024-05-22 - [Pattern] Missing Label Associations
**Learning:** Many custom input components (Input, VibeInput, StyleNameInput) rendered labels and inputs separately without 'htmlFor'/'id' association, breaking screen reader accessibility.
**Action:** Always use 'useId' hook in React 18+ to generate unique IDs for accessible label-input association in reusable components.
