/**
 * Q CSAT Motion Design System
 *
 * Defines animation patterns and motion tokens for consistent UI animations.
 * Uses framer-motion for all animations.
 *
 * Design Principles:
 * - Purposeful, subtle UI motion
 * - Never "gimmicky"
 * - Reduce cognitive load, guide attention
 * - Ease-out transitions
 * - Small travel distances
 */

import type { Variants, Transition } from 'framer-motion';

// ============================================================================
// Duration Tokens
// ============================================================================

export const duration = {
  fast: 0.15,    // 150ms - micro interactions
  normal: 0.2,   // 200ms - standard transitions
  slow: 0.25,    // 250ms - larger elements
  slower: 0.3,   // 300ms - page transitions
} as const;

// ============================================================================
// Easing Tokens
// ============================================================================

export const easing = {
  // Standard ease-out for most UI elements
  easeOut: [0, 0, 0.2, 1] as const,
  // For elements entering the screen
  easeIn: [0.4, 0, 1, 1] as const,
  // For elements that move on screen
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // Bouncy for playful interactions
  spring: [0.68, -0.55, 0.265, 1.55] as const,
} as const;

// ============================================================================
// Standard Transitions
// ============================================================================

export const transitions: Record<string, Transition> = {
  fast: {
    duration: duration.fast,
    ease: easing.easeOut,
  },
  normal: {
    duration: duration.normal,
    ease: easing.easeOut,
  },
  slow: {
    duration: duration.slow,
    ease: easing.easeOut,
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  springBouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },
} as const;

// ============================================================================
// Animation Variants
// ============================================================================

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Fade with slight scale (dialogs, modals)
export const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.fast,
  },
};

// Slide up with fade (page content, cards)
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

// Slide down (dropdowns, menus)
export const slideDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

// Slide from right (sidebars, drawers)
export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: transitions.fast,
  },
};

// Slide from left (navigation panels)
export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.slow,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: transitions.fast,
  },
};

// Toast slide in from top right
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    y: 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

// Stagger children animations
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.normal,
  },
};

// Page transition variants
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

// Tab content transition
export const tabContentVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: transitions.fast,
  },
};

// Backdrop overlay
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: duration.fast,
    },
  },
};

// ============================================================================
// Hover & Tap Animations
// ============================================================================

export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
};

export const tapScale = {
  scale: 0.98,
};

export const hoverLift = {
  y: -2,
  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  transition: transitions.fast,
};

// ============================================================================
// Skeleton/Loading Animations
// ============================================================================

export const pulseVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

export const shimmerVariants: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Creates stagger delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05): number => {
  return index * baseDelay;
};

/**
 * Creates a custom transition with optional overrides
 */
export const createTransition = (
  base: Transition = transitions.normal,
  overrides?: Partial<Transition>
): Transition => ({
  ...base,
  ...overrides,
});
