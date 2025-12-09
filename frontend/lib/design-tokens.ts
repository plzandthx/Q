/**
 * Q CSAT Design Tokens
 *
 * This file defines the foundational design tokens for the Q CSAT Dashboard.
 * All colors, typography, spacing, and other visual properties should derive from these tokens.
 *
 * Design Philosophy:
 * - Clean, product-analytics SaaS aesthetic
 * - Confident but calm palette (primary teal/blue, neutral grays)
 * - Minimal with ample whitespace
 * - Accessible and responsive
 */

// ============================================================================
// Color Palette
// ============================================================================

export const colors = {
  // Primary - Teal/Blue for CTAs and primary actions
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main primary
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },

  // Accent - For highlights, trends, positive indicators
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main accent
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Neutral - Grays for text, backgrounds, borders
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main danger
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // CSAT Score Colors (1-5 scale)
  csat: {
    1: '#ef4444', // Very Dissatisfied - Red
    2: '#f97316', // Dissatisfied - Orange
    3: '#eab308', // Neutral - Yellow
    4: '#84cc16', // Satisfied - Lime
    5: '#22c55e', // Very Satisfied - Green
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },

  // Font Sizes (with line heights)
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1' }],         // 48px
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Heading Presets
  headings: {
    display: {
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
    h1: {
      fontSize: '2.25rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: '600',
      lineHeight: '1.25',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.4',
    },
  },

  // Text Presets
  text: {
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    bodySmall: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.4',
    },
    muted: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.4',
      color: colors.neutral[500],
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.3',
      color: colors.neutral[500],
    },
  },
} as const;

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// Shadows
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Colored shadows for cards and elevated elements
  primary: '0 4px 14px 0 rgb(20 184 166 / 0.3)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// Transitions & Animations
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  timing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// Breakpoints
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// Z-Index Scale
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================================================
// Component-Specific Tokens
// ============================================================================

export const components = {
  // Button sizes
  button: {
    sm: {
      height: '2rem',       // 32px
      paddingX: '0.75rem',  // 12px
      fontSize: '0.875rem', // 14px
    },
    md: {
      height: '2.5rem',     // 40px
      paddingX: '1rem',     // 16px
      fontSize: '0.875rem', // 14px
    },
    lg: {
      height: '3rem',       // 48px
      paddingX: '1.5rem',   // 24px
      fontSize: '1rem',     // 16px
    },
  },

  // Input sizes
  input: {
    sm: {
      height: '2rem',
      paddingX: '0.5rem',
      fontSize: '0.875rem',
    },
    md: {
      height: '2.5rem',
      paddingX: '0.75rem',
      fontSize: '0.875rem',
    },
    lg: {
      height: '3rem',
      paddingX: '1rem',
      fontSize: '1rem',
    },
  },

  // Card variants
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: '0.75rem', // xl
  },

  // Sidebar dimensions
  sidebar: {
    width: '16rem',         // 256px
    collapsedWidth: '4rem', // 64px
  },

  // Topbar dimensions
  topbar: {
    height: '4rem',  // 64px
  },
} as const;

// ============================================================================
// Semantic Theme Aliases
// ============================================================================

export const theme = {
  // Background colors
  bg: {
    default: colors.neutral[0],
    subtle: colors.neutral[50],
    muted: colors.neutral[100],
    emphasized: colors.neutral[200],
    inverse: colors.neutral[900],
  },

  // Text colors
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[500],
    disabled: colors.neutral[400],
    inverse: colors.neutral[0],
    link: colors.primary[600],
    linkHover: colors.primary[700],
  },

  // Border colors
  border: {
    default: colors.neutral[200],
    subtle: colors.neutral[100],
    emphasized: colors.neutral[300],
    focus: colors.primary[500],
    error: colors.danger[500],
  },

  // Interactive states
  interactive: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    secondary: colors.neutral[100],
    secondaryHover: colors.neutral[200],
    secondaryActive: colors.neutral[300],
  },
} as const;

// Type exports for TypeScript consumers
export type ColorScale = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Theme = typeof theme;
