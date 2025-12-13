/**
 * Q CSAT Design System - Design Tokens
 * 
 * Extracted from Figma: Q-CSAT-Design-System
 * https://www.figma.com/design/OGUpJgkxJw4ppNADSYS8cV/Q-CSAT-Design-System
 * 
 * A confident but calm color palette designed for product analytics interfaces.
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

/**
 * Primary Colors (Teal)
 * Used for CTAs, primary actions, and brand identity.
 */
export const primary = {
  50: '#f0fdfa',
  100: '#ccfbf1',
  200: '#99f6e4',
  300: '#5eead4',
  400: '#2dd4bf',
  500: '#14b8a6',
  600: '#0d9488',
  700: '#0f766e',
  800: '#115e59',
  900: '#134e4a',
  950: '#042f2e',
} as const;

/**
 * Accent Colors (Blue)
 * Used for highlights, trends, and positive indicators.
 */
export const accent = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
} as const;

/**
 * Neutral Colors (Gray)
 * Used for text, backgrounds, and borders.
 */
export const neutral = {
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
} as const;

/**
 * Success Colors (Green)
 * Used for positive states, confirmations, and success messages.
 */
export const success = {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',
  300: '#86efac',
  400: '#4ade80',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',
  900: '#14532d',
} as const;

/**
 * Warning Colors (Amber)
 * Used for warnings, cautions, and attention-required states.
 */
export const warning = {
  50: '#fffbeb',
  100: '#fef3c7',
  200: '#fde68a',
  300: '#fcd34d',
  400: '#fbbf24',
  500: '#f59e0b',
  600: '#d97706',
  700: '#b45309',
  800: '#92400e',
  900: '#78350f',
} as const;

/**
 * Danger Colors (Red)
 * Used for errors, destructive actions, and critical alerts.
 */
export const danger = {
  50: '#fef2f2',
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
} as const;

/**
 * CSAT Score Colors
 * Semantic colors for 1-5 CSAT ratings.
 */
export const csatScoreColors = {
  1: '#ef4444', // Very Dissatisfied - Red
  2: '#f97316', // Dissatisfied - Orange
  3: '#eab308', // Neutral - Yellow
  4: '#84cc16', // Satisfied - Lime
  5: '#22c55e', // Very Satisfied - Green
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

/**
 * Font Families
 */
export const fontFamily = {
  sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
} as const;

/**
 * Font Sizes
 */
export const fontSize = {
  xs: '0.75rem',     // 12px - Caption
  sm: '0.875rem',    // 14px - Small Text
  base: '1rem',      // 16px - Body Text
  lg: '1.125rem',    // 18px - Large Text
  xl: '1.25rem',     // 20px - Heading 4
  '2xl': '1.5rem',   // 24px - Heading 3
  '3xl': '1.875rem', // 30px - Heading 2
  '4xl': '2.25rem',  // 36px - Heading 1
  '5xl': '3rem',     // 48px - Display
} as const;

/**
 * Font Weights
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/**
 * Line Heights
 */
export const lineHeight = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.625',
} as const;

// ============================================================================
// SPACING TOKENS
// ============================================================================

/**
 * Spacing Scale (4px grid system)
 */
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

/**
 * Layout Tokens
 */
export const layout = {
  sidebar: '16rem',          // 256px
  sidebarCollapsed: '4rem',  // 64px
  topbar: '4rem',            // 64px
} as const;

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  primary: `0 4px 14px 0 ${primary[500]}40`,
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// MOTION TOKENS
// ============================================================================

/**
 * Duration Tokens
 */
export const duration = {
  fast: '150ms',
  normal: '200ms',
  slow: '250ms',
  slower: '300ms',
} as const;

/**
 * Easing Curves
 */
export const easing = {
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.68, -0.55, 0.265, 1.55],
} as const;

// ============================================================================
// Z-INDEX SCALE
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
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get CSAT score text color class
 */
export function getCsatScoreColor(score: number): string {
  const colorMap: Record<number, string> = {
    1: 'text-red-500',
    2: 'text-orange-500',
    3: 'text-yellow-500',
    4: 'text-lime-500',
    5: 'text-green-500',
  };
  return colorMap[score] || 'text-neutral-500';
}

/**
 * Get CSAT score background color class
 */
export function getCsatScoreBgColor(score: number): string {
  const colorMap: Record<number, string> = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-lime-500',
    5: 'bg-green-500',
  };
  return colorMap[score] || 'bg-neutral-500';
}

/**
 * Get CSAT score hex color
 */
export function getCsatScoreHexColor(score: number): string {
  return csatScoreColors[score as keyof typeof csatScoreColors] || neutral[500];
}

// Export all tokens as a single object
export const tokens = {
  colors: {
    primary,
    accent,
    neutral,
    success,
    warning,
    danger,
    csat: csatScoreColors,
  },
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  },
  spacing,
  layout,
  borderRadius,
  shadows,
  motion: {
    duration,
    easing,
  },
  zIndex,
  breakpoints,
} as const;

export default tokens;
