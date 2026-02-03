export const colors = {
    // Core Surfaces
    void: 'var(--color-void)',
    nebula: 'var(--color-nebula)',
    surface: {
        0: 'var(--color-surface-0)',
        1: 'var(--color-surface-1)',
        2: 'var(--color-surface-2)',
        3: 'var(--color-surface-3)',
    },

    // Accents
    primary: {
        DEFAULT: 'var(--color-primary)',
        hover: 'var(--color-primary-hover)',
        glow: 'var(--color-primary-glow)',
    },
    secondary: {
        DEFAULT: 'var(--color-secondary)',
        glow: 'var(--color-secondary-glow)',
    },
    accent: {
        purple: 'var(--color-accent-purple)',
        pink: 'var(--color-accent-pink)',
    },

    // Signals
    success: {
        DEFAULT: 'var(--color-success)',
        bg: 'var(--color-success-bg)',
    },
    warning: {
        DEFAULT: 'var(--color-warning)',
        bg: 'var(--color-warning-bg)',
    },
    error: {
        DEFAULT: 'var(--color-error)',
        bg: 'var(--color-error-bg)',
    },
    info: {
        DEFAULT: 'var(--color-info)',
        bg: 'var(--color-info-bg)',
    },

    // Typography
    text: {
        bright: 'var(--color-text-bright)',
        primary: 'var(--color-text-primary)',
        dim: 'var(--color-text-dim)',
        muted: 'var(--color-text-muted)',
    },

    // Figma Native (for fallback/integration)
    figma: {
        bg: {
            primary: 'var(--figma-bg-primary)',
            secondary: 'var(--figma-bg-secondary)',
            tertiary: 'var(--figma-bg-tertiary)',
            hover: 'var(--figma-bg-hover)',
        },
        text: {
            primary: 'var(--figma-text-primary)',
            secondary: 'var(--figma-text-secondary)',
        },
        border: 'var(--figma-border)',
    }
} as const;

export type ColorToken = typeof colors;
