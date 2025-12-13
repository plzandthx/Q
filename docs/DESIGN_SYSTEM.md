# Q CSAT Design System Update

This package contains design system updates extracted from the Figma design file:
**[Q-CSAT-Design-System](https://www.figma.com/design/OGUpJgkxJw4ppNADSYS8cV/Q-CSAT-Design-System?node-id=18-310)**

## 📁 Files Included

```
design-system-update/
├── src/
│   ├── styles/
│   │   ├── design-tokens.ts    # TypeScript design tokens
│   │   ├── globals.css         # CSS variables & utility classes
│   │   └── motion.ts           # Framer Motion animation variants
│   └── lib/
│       └── utils.ts            # Utility functions
├── tailwind.config.ts          # Tailwind CSS configuration
└── README.md                   # This file
```

## 🎨 Design System Overview

### Colors

| Category | Description | Primary Use |
|----------|-------------|-------------|
| **Primary (Teal)** | Brand identity color | CTAs, primary actions, brand elements |
| **Accent (Blue)** | Highlight color | Links, trends, positive indicators |
| **Neutral (Gray)** | UI foundation | Text, backgrounds, borders |
| **Success (Green)** | Positive states | Confirmations, success messages |
| **Warning (Amber)** | Caution states | Warnings, attention-required |
| **Danger (Red)** | Critical states | Errors, destructive actions |
| **CSAT Score** | Rating colors | 1-5 CSAT ratings |

### CSAT Score Colors

| Score | Label | Color | Hex |
|-------|-------|-------|-----|
| 1 | Very Dissatisfied | Red | `#ef4444` |
| 2 | Dissatisfied | Orange | `#f97316` |
| 3 | Neutral | Yellow | `#eab308` |
| 4 | Satisfied | Lime | `#84cc16` |
| 5 | Very Satisfied | Green | `#22c55e` |

### Typography

- **Sans Font:** Inter (UI text)
- **Mono Font:** JetBrains Mono (code)

### Type Scale

| Token | Size | Use Case |
|-------|------|----------|
| `text-display` | 48px | Hero sections |
| `text-h1` | 36px | Page titles |
| `text-h2` | 30px | Section headings |
| `text-h3` | 24px | Card titles |
| `text-h4` | 20px | Subsections |
| `text-body` | 16px | Body text |
| `text-body-sm` | 14px | Small body |
| `text-caption` | 12px | Captions, labels |

### Spacing

Based on a 4px grid system. Layout tokens:
- `sidebar`: 256px
- `sidebar-collapsed`: 64px
- `topbar`: 64px

### Motion

| Duration | Value | Use Case |
|----------|-------|----------|
| `fast` | 150ms | Micro-interactions |
| `normal` | 200ms | Standard transitions |
| `slow` | 250ms | Complex animations |
| `slower` | 300ms | Page transitions |

## 🚀 Installation

### 1. Copy Files

Copy the following files to your project:

```bash
# Design tokens
cp src/styles/design-tokens.ts your-project/src/styles/
cp src/styles/globals.css your-project/src/styles/
cp src/styles/motion.ts your-project/src/styles/

# Utilities
cp src/lib/utils.ts your-project/src/lib/

# Tailwind config (merge with existing or replace)
cp tailwind.config.ts your-project/
```

### 2. Install Dependencies

```bash
npm install clsx tailwind-merge framer-motion
# or
yarn add clsx tailwind-merge framer-motion
# or
pnpm add clsx tailwind-merge framer-motion
```

### 3. Import Global CSS

In your main layout or app file:

```tsx
import '@/styles/globals.css';
```

### 4. Configure Fonts

Add Inter and JetBrains Mono fonts. With Next.js:

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

## 📚 Usage Examples

### Using Design Tokens

```tsx
import { primary, accent, csatScoreColors } from '@/styles/design-tokens';

// Access color values
const primaryColor = primary[500]; // '#14b8a6'
const csatColor = csatScoreColors[5]; // '#22c55e'
```

### Using Utility Functions

```tsx
import { 
  cn, 
  formatPercent, 
  getCsatScoreColor,
  formatDate 
} from '@/lib/utils';

// Merge Tailwind classes
<div className={cn('p-4', isActive && 'bg-primary-500', className)} />

// Format percentage
formatPercent(0.125); // '12.5%'

// Get CSAT color class
getCsatScoreColor(5); // 'text-green-500'

// Format date
formatDate(new Date(), 'relative'); // '2 hours ago'
```

### Using Motion Variants

```tsx
import { motion } from 'framer-motion';
import { fadeScaleVariants, slideUpVariants } from '@/styles/motion';

// Modal animation
<motion.div
  variants={fadeScaleVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Modal content
</motion.div>

// Page content animation
<motion.main
  variants={slideUpVariants}
  initial="hidden"
  animate="visible"
>
  Page content
</motion.main>
```

### Using CSS Utility Classes

```tsx
// Container utilities
<div className="container-page">...</div>
<div className="container-narrow">...</div>

// Card utilities
<div className="card-elevated">...</div>
<div className="card-elevated-hover">...</div>
<div className="card-interactive">...</div>

// Typography utilities
<h1 className="text-h1">...</h1>
<p className="text-body">...</p>
<span className="text-muted">...</span>

// CSAT badges
<span className="csat-badge-5">5</span>

// Gradients
<div className="bg-gradient-primary">...</div>
<div className="bg-gradient-hero">...</div>
```

## 🔧 Tailwind Configuration

The `tailwind.config.ts` includes all design tokens. Key sections:

- **colors**: Full color palette with semantic naming
- **fontFamily**: Inter and JetBrains Mono
- **fontSize**: Custom text scale with line-heights
- **spacing**: Layout-specific spacing tokens
- **boxShadow**: Shadow scale including card shadows
- **zIndex**: Layer management scale
- **animation**: Keyframe animations

## 🎬 Animation Variants

Available Framer Motion variants:

| Variant | Use Case |
|---------|----------|
| `fadeVariants` | Simple opacity fade |
| `fadeScaleVariants` | Dialogs, modals |
| `slideUpVariants` | Page content, cards |
| `slideDownVariants` | Dropdowns, menus |
| `slideRightVariants` | Sidebars, drawers |
| `slideLeftVariants` | Navigation panels |
| `staggerContainerVariants` | List containers |
| `staggerItemVariants` | List items |
| `pageVariants` | Page transitions |
| `toastVariants` | Notifications |
| `backdropVariants` | Modal overlays |
| `collapseVariants` | Accordion content |
| `cardHoverVariants` | Interactive cards |
| `buttonPressVariants` | Button feedback |

## 📝 CSS Variables

All design tokens are available as CSS variables in `:root`:

```css
/* Colors */
var(--primary-500)
var(--accent-500)
var(--neutral-500)
var(--success-500)
var(--warning-500)
var(--danger-500)
var(--csat-1) through var(--csat-5)

/* Typography */
var(--font-sans)
var(--font-mono)

/* Spacing */
var(--spacing-sidebar)
var(--spacing-sidebar-collapsed)
var(--spacing-topbar)

/* Shadows */
var(--shadow-card)
var(--shadow-card-hover)
var(--shadow-primary)

/* Motion */
var(--duration-fast)
var(--duration-normal)
var(--ease-out)
var(--ease-spring)

/* Border Radius */
var(--radius-sm)
var(--radius-md)
var(--radius-lg)
```

## 🌙 Dark Mode

The design system includes dark mode support. Enable with:

```html
<html class="dark">
```

Or toggle programmatically:

```ts
document.documentElement.classList.toggle('dark');
```

## 📋 Checklist for Integration

- [ ] Copy design token files
- [ ] Install dependencies (clsx, tailwind-merge, framer-motion)
- [ ] Merge/replace Tailwind config
- [ ] Import globals.css
- [ ] Configure fonts (Inter, JetBrains Mono)
- [ ] Update existing components to use new tokens
- [ ] Test dark mode
- [ ] Verify CSAT score colors

## 🔗 Source

- **Figma File**: [Q-CSAT-Design-System](https://www.figma.com/design/OGUpJgkxJw4ppNADSYS8cV/Q-CSAT-Design-System?node-id=18-310)
- **Generated**: December 2024

---

**Note**: This design system is built with Tailwind CSS, Radix UI compatibility, and Framer Motion for animations.
