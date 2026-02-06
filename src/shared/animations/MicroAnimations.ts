/**
 * @module MicroAnimations
 * @description Centralized animation configurations for the Vibe onboarding experience.
 * @version 1.0.0
 * 
 * This module provides production-ready Framer Motion configurations for:
 * - Input interactions (focus glow, validation feedback)
 * - Screen transitions (fade, slide, scale)
 * - Loading states (shimmer, pulse, spin)
 * - Success/error feedback (checkmark, shake, bounce)
 * 
 * All animations are optimized for 60fps and follow the Vibe design language.
 */

import type { Transition, Variants } from 'framer-motion';

// ============================================================================
// 🎨 CORE TRANSITION PRESETS
// ============================================================================

/**
 * Vibe signature easing - smooth and organic
 */
export const vibeEase: Transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8
};

/**
 * Elastic bounce for playful interactions
 */
export const elasticEase: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 20,
    mass: 0.5
};

/**
 * Quick snap for immediate feedback
 */
export const snapEase: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 35,
    mass: 0.6
};

/**
 * Smooth tween for controlled animations
 */
export const smoothEase: Transition = {
    duration: 0.3,
    ease: [0.22, 1, 0.36, 1] // Vibe cubic-bezier
};

// ============================================================================
// ✨ INPUT INTERACTION ANIMATIONS
// ============================================================================

/**
 * Focus glow animation for inputs
 * Creates a subtle pulsing glow effect on focus
 */
export const inputFocusGlow: Variants = {
    idle: {
        boxShadow: '0 0 0 0 rgba(110, 98, 229, 0)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        transition: smoothEase
    },
    focused: {
        boxShadow: [
            '0 0 0 0 rgba(110, 98, 229, 0.3)',
            '0 0 20px 2px rgba(110, 98, 229, 0.5)',
            '0 0 15px 2px rgba(110, 98, 229, 0.4)'
        ],
        borderColor: 'rgba(110, 98, 229, 0.5)',
        transition: {
            boxShadow: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse' as const,
                ease: 'easeInOut'
            },
            borderColor: smoothEase
        }
    }
};

/**
 * Label float animation (Material Design inspired)
 */
export const labelFloat: Variants = {
    resting: {
        y: 12,
        scale: 1,
        color: 'rgba(161, 161, 170, 0.7)',
        transition: vibeEase
    },
    floating: {
        y: -12,
        scale: 0.85,
        color: 'rgba(110, 98, 229, 1)',
        transition: vibeEase
    }
};

/**
 * Icon color shift on input interaction
 */
export const iconShift: Variants = {
    idle: {
        color: 'rgba(161, 161, 170, 0.5)',
        scale: 1,
        transition: smoothEase
    },
    active: {
        color: 'rgba(110, 98, 229, 1)',
        scale: 1.1,
        transition: elasticEase
    }
};

// ============================================================================
// ✅ VALIDATION FEEDBACK ANIMATIONS
// ============================================================================

/**
 * Shake animation for validation errors
 * Gentle horizontal shake to indicate error without being harsh
 */
export const shake: Variants = {
    initial: { x: 0 },
    error: {
        x: [-10, 10, -8, 8, -6, 6, -4, 4, 0],
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    }
};

/**
 * Checkmark success animation
 * Scale + opacity animation for validation success
 */
export const checkmark: Variants = {
    hidden: {
        scale: 0,
        opacity: 0,
        rotate: -45
    },
    visible: {
        scale: 1,
        opacity: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15,
            mass: 0.5
        }
    }
};

/**
 * Error icon pulse animation
 * Alert icon with attention-grabbing pulse
 */
export const errorPulse: Variants = {
    idle: {
        scale: 1,
        opacity: 1
    },
    pulse: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 0.5,
            repeat: 2,
            ease: 'easeInOut'
        }
    }
};

/**
 * Password strength meter fill animation
 */
export const strengthMeterFill = (strength: number): Variants => ({
    empty: {
        width: '0%',
        opacity: 0
    },
    filled: {
        width: `${strength}%`,
        opacity: 1,
        transition: {
            width: { ...vibeEase, duration: 0.6 },
            opacity: smoothEase
        }
    }
});

// ============================================================================
// 📄 SCREEN TRANSITION ANIMATIONS
// ============================================================================

/**
 * Fade in/out transitions for screen changes
 */
export const fadeTransition: Variants = {
    hidden: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: smoothEase
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

/**
 * Slide up entrance (ideal for modals, sheets)
 */
export const slideUp: Variants = {
    hidden: {
        y: 50,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: vibeEase
    },
    exit: {
        y: -30,
        opacity: 0,
        transition: smoothEase
    }
};

/**
 * Scale + fade for card/modal appearances
 */
export const scaleIn: Variants = {
    hidden: {
        scale: 0.9,
        opacity: 0,
        y: 20
    },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: vibeEase
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

/**
 * Crossfade transition between screens
 */
export const crossfade: Variants = {
    hidden: {
        opacity: 0,
        position: 'absolute' as const,
        width: '100%'
    },
    visible: {
        opacity: 1,
        position: 'relative' as const,
        transition: { duration: 0.4, ease: 'easeInOut' }
    },
    exit: {
        opacity: 0,
        position: 'absolute' as const,
        transition: { duration: 0.3 }
    }
};

// ============================================================================
// ⏳ LOADING STATE ANIMATIONS
// ============================================================================

/**
 * Shimmer effect for skeleton loading
 */
export const shimmer: Variants = {
    loading: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
        }
    }
};

/**
 * Pulse animation for loading states
 */
export const pulse: Variants = {
    idle: { opacity: 1 },
    pulsing: {
        opacity: [1, 0.5, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
};

/**
 * Spinner rotation (for button loading states)
 */
export const spin = {
    animate: {
        rotate: 360
    },
    transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear' as const
    }
};

// ============================================================================
// 🎉 CELEBRATION ANIMATIONS
// ============================================================================

/**
 * Bounce animation for success states
 */
export const bounce: Variants = {
    initial: { scale: 1 },
    bouncing: {
        scale: [1, 1.1, 0.95, 1.05, 1],
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    }
};

/**
 * Confetti particle animation
 */
export const confettiParticle = (delay: number): Variants => ({
    hidden: {
        y: -20,
        opacity: 0,
        rotate: 0
    },
    visible: {
        y: [0, -50, 100],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 0],
        rotate: [0, 360],
        transition: {
            duration: 2,
            delay,
            ease: 'easeOut'
        }
    }
});

/**
 * Success overlay fade in/out
 */
export const successOverlay: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        backdropFilter: 'blur(0px)'
    },
    visible: {
        opacity: 1,
        scale: 1,
        backdropFilter: 'blur(8px)',
        transition: {
            opacity: vibeEase,
            scale: elasticEase
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.3,
            delay: 2.5 // Auto-dismiss after 2.5s
        }
    }
};

// ============================================================================
// 🎨 HINT/TOOLTIP ANIMATIONS
// ============================================================================

/**
 * Floating hint tooltip (appears above input)
 */
export const floatingHint: Variants = {
    hidden: {
        y: 10,
        opacity: 0,
        scale: 0.95
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            ...elasticEase,
            delay: 0.1
        }
    },
    exit: {
        y: -5,
        opacity: 0,
        scale: 0.98,
        transition: { duration: 0.2 }
    }
};

/**
 * Stagger children animation (for list items)
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem: Variants = {
    hidden: {
        y: 20,
        opacity: 0
    },
    visible: {
        y: 0,
        opacity: 1,
        transition: vibeEase
    }
};

// ============================================================================
// 🔧 UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a custom spring transition with overrides
 */
export const customSpring = (overrides: Partial<Transition>): Transition => ({
    ...vibeEase,
    ...overrides
});

/**
 * Get color based on validation state
 */
export const getValidationColor = (state: 'idle' | 'valid' | 'invalid' | 'validating'): string => {
    switch (state) {
        case 'valid':
            return '#10B981'; // success
        case 'invalid':
            return '#F43F5E'; // error
        case 'validating':
            return '#F59E0B'; // warning
        default:
            return 'rgba(161, 161, 170, 0.5)'; // text-muted
    }
};

/**
 * Get password strength color
 */
export const getStrengthColor = (strength: number): string => {
    if (strength < 30) return '#F43F5E'; // Weak - red
    if (strength < 60) return '#F59E0B'; // Medium - yellow
    if (strength < 80) return '#14AE5C'; // Good - green
    return '#10B981'; // Strong - bright green
};
