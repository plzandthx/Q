/**
 * Q CSAT Design System - Animation Variants
 * 
 * Framer Motion animation presets for polished, professional interactions.
 * Extracted from Figma: Q-CSAT-Design-System
 */

import { Variants, Transition } from 'framer-motion';

// ============================================================================
// DURATION TOKENS
// ============================================================================

export const duration = {
  fast: 0.15,    // 150ms
  normal: 0.2,   // 200ms
  slow: 0.25,    // 250ms
  slower: 0.3,   // 300ms
} as const;

// ============================================================================
// EASING CURVES
// ============================================================================

export const easing = {
  // Standard UI transitions
  easeOut: [0, 0, 0.2, 1] as const,
  // Elements entering
  easeIn: [0.4, 0, 1, 1] as const,
  // Elements moving
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // Playful interactions
  spring: [0.68, -0.55, 0.265, 1.55] as const,
};

// ============================================================================
// TRANSITION PRESETS
// ============================================================================

export const transitions = {
  fast: {
    duration: duration.fast,
    ease: easing.easeOut,
  } as Transition,
  
  normal: {
    duration: duration.normal,
    ease: easing.easeOut,
  } as Transition,
  
  slow: {
    duration: duration.slow,
    ease: easing.easeOut,
  } as Transition,
  
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
  
  springBouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 25,
  } as Transition,
};

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

/**
 * Simple opacity fade in/out
 */
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.normal,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * Fade with scale for dialogs and modals
 */
export const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.normal,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: duration.fast,
      ease: easing.easeIn,
    },
  },
};

/**
 * Slide up for page content and cards
 */
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

/**
 * Slide down for dropdowns and menus
 */
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

/**
 * Slide from right for sidebars and drawers
 */
export const slideRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: '100%',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Slide from left for navigation
 */
export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: '-100%',
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: '-100%',
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Staggered children animations for lists
 */
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * Stagger child item
 */
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
  exit: {
    opacity: 0,
    y: -10,
    transition: transitions.fast,
  },
};

/**
 * Page transition animations
 */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easing.easeOut,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Toast notification slide-in
 */
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    x: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: {
      duration: duration.normal,
      ease: easing.easeIn,
    },
  },
};

/**
 * Modal backdrop
 */
export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
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
      delay: 0.1,
    },
  },
};

/**
 * Collapse/expand animation
 */
export const collapseVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  visible: {
    height: 'auto',
    opacity: 1,
    overflow: 'hidden',
    transition: {
      height: {
        duration: duration.slow,
        ease: easing.easeOut,
      },
      opacity: {
        duration: duration.normal,
        delay: 0.1,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    transition: {
      height: {
        duration: duration.normal,
        ease: easing.easeIn,
      },
      opacity: {
        duration: duration.fast,
      },
    },
  },
};

/**
 * Button press animation
 */
export const buttonPressVariants: Variants = {
  rest: {
    scale: 1,
  },
  pressed: {
    scale: 0.97,
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};

/**
 * Card hover animation
 */
export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    transition: transitions.normal,
  },
};

/**
 * Skeleton loading pulse
 */
export const skeletonVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Rotate animation for loading spinners
 */
export const rotateVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// UTILITY HOOKS AND FUNCTIONS
// ============================================================================

/**
 * Get animation variants with custom duration
 */
export function getCustomDurationVariants(
  baseVariants: Variants,
  customDuration: number
): Variants {
  return Object.entries(baseVariants).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null && 'transition' in value) {
      acc[key] = {
        ...value,
        transition: {
          ...(value.transition as object),
          duration: customDuration,
        },
      };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as Variants);
}

/**
 * Combine multiple variants
 */
export function combineVariants(...variants: Variants[]): Variants {
  return variants.reduce((acc, variant) => {
    Object.keys(variant).forEach((key) => {
      if (acc[key]) {
        acc[key] = {
          ...(acc[key] as object),
          ...(variant[key] as object),
        };
      } else {
        acc[key] = variant[key];
      }
    });
    return acc;
  }, {} as Variants);
}

// Export all variants as a single object
export const variants = {
  fade: fadeVariants,
  fadeScale: fadeScaleVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  slideRight: slideRightVariants,
  slideLeft: slideLeftVariants,
  staggerContainer: staggerContainerVariants,
  staggerItem: staggerItemVariants,
  page: pageVariants,
  toast: toastVariants,
  backdrop: backdropVariants,
  collapse: collapseVariants,
  buttonPress: buttonPressVariants,
  cardHover: cardHoverVariants,
  skeleton: skeletonVariants,
  rotate: rotateVariants,
} as const;

export default variants;
