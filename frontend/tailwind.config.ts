import type { Config } from 'tailwindcss';

/**
 * Q CSAT Tailwind Configuration - Nature Theme
 *
 * This extends Tailwind with our design tokens to create a cohesive design system.
 * All custom values align with the tokens defined in lib/design-tokens.ts
 *
 * Theme: Nature-inspired with earthy greens from Figma design system
 * Colors updated from Figma variables (not the visual mockup)
 */

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Custom color palette - Nature Theme from Figma
      colors: {
        // Primary - Nature Theme (Earthy greens/teals)
        primary: {
          50: '#E5E9E2',
          100: '#C6E8AD',
          200: '#A3CE83',
          300: '#70A449',
          400: '#568530',
          500: '#389084',
          600: '#296B62',
          700: '#264E46',
          800: '#233D28',
          900: '#0D2539',
          950: '#042F2E',
          DEFAULT: '#389084',
          foreground: '#ffffff',
        },

        // Accent - Nature Theme (Light greens)
        accent: {
          50: '#E6EBE2',
          100: '#FBFFF9',
          200: '#F8FFF3',
          300: '#F1FDE9',
          400: '#D7F2C3',
          500: '#C6E8AD',
          600: '#AED493',
          700: '#81B05F',
          800: '#618844',
          900: '#416229',
          950: '#273D16',
          DEFAULT: '#C6E8AD',
          foreground: '#273D16',
        },

        // Semantic: Success
        success: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          DEFAULT: '#22C55E',
          foreground: '#ffffff',
        },

        // Semantic: Warning
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
          foreground: '#000000',
        },

        // Semantic: Danger/Destructive
        danger: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          DEFAULT: '#EF4444',
          foreground: '#ffffff',
        },

        // Also expose as destructive for shadcn compatibility
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#ffffff',
        },

        // CSAT Score colors - Nature Theme (updated csat-4 and csat-5)
        csat: {
          1: '#EF4444', // Red - Very Dissatisfied
          2: '#F97316', // Orange - Dissatisfied
          3: '#EAB308', // Yellow - Neutral
          4: '#AED493', // Nature green - Satisfied (from Figma)
          5: '#389084', // Teal - Very Satisfied (from Figma)
        },

        // Neutral - from Figma design system
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#98A691',
          500: '#71717A',
          600: '#52525B',
          700: '#264E46',
          800: '#264E46',
          900: '#18181B',
          950: '#09090B',
        },

        // Semantic mappings for shadcn/ui compatibility
        background: '#ffffff',
        foreground: '#18181B',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#18181B',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#18181B',
        },
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A',
        },
        secondary: {
          DEFAULT: '#F4F4F5',
          foreground: '#18181B',
        },
        border: '#E4E4E7',
        input: '#E4E4E7',
        ring: '#389084',
      },

      // Custom font families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      // Custom font sizes with line heights
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },

      // Extended spacing scale
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        'sidebar': '16rem',
        'sidebar-collapsed': '4rem',
        'topbar': '4rem',
      },

      // Extended border radius
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Custom shadows - updated to Nature Theme primary color
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'primary': '0 4px 14px 0 rgb(56 144 132 / 0.3)',
        'focus': '0 0 0 3px rgb(56 144 132 / 0.3)',
      },

      // Animation durations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      // Keyframe animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-left': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'scale-in': {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'spin-slow': 'spin-slow 1s linear infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
