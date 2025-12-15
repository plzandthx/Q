# Q CSAT Front-End Asset Architecture

This document defines the asset organization, naming conventions, and best practices for the Q CSAT application. Follow these guidelines to maintain a scalable, consistent, and performant asset system.

## Table of Contents

1. [Folder Structure](#folder-structure)
2. [Naming Conventions](#naming-conventions)
3. [Iconography Best Practices](#iconography-best-practices)
4. [Brand & Theme Organization](#brand--theme-organization)
5. [Performance & Build Best Practices](#performance--build-best-practices)
6. [Developer Ergonomics](#developer-ergonomics)
7. [Example Folder Tree](#example-folder-tree)
8. [Rules of the Road Checklist](#rules-of-the-road-checklist)

---

## Folder Structure

### Recommended Structure

```
frontend/
├── public/                          # Static assets (served as-is, no processing)
│   └── assets/
│       ├── logos/                   # Brand logos (all variants)
│       ├── icons/                   # Static icon files (favicons, app icons)
│       ├── images/                  # UI and marketing images
│       ├── illustrations/           # Illustrations and decorative graphics
│       └── videos/                  # Video content
│
├── components/
│   └── ui/
│       └── logo.tsx                 # Logo component (inline SVG for theming)
│
└── styles/
    └── globals.css                  # Design tokens and CSS variables
```

### Where Assets Live: Rule of Thumb

| Location | Use When | Examples |
|----------|----------|----------|
| `public/assets/` | Static files that don't need bundling, need direct URL access, or are referenced in CSS/HTML | Logos, favicons, OG images, videos |
| `components/ui/` | SVGs that need dynamic theming, interactivity, or are tightly coupled to components | Logo component, animated icons |
| Direct imports | Assets that benefit from bundler optimization (hashing, tree-shaking) | Small inline SVGs, optimized images |

**Do this:**
- Place brand assets in `public/assets/logos/`
- Use the `<Logo />` component for inline SVG flexibility
- Reference static assets via `/assets/...` paths

**Not that:**
- Don't scatter assets across component folders
- Don't duplicate assets for different sizes (use CSS/responsive techniques)
- Don't commit unoptimized images

---

## Naming Conventions

### General Rules

- **Casing:** `kebab-case` for all asset files
- **Pluralization:** Folder names are plural (`logos/`, `icons/`), file names are singular concepts
- **Descriptive:** Name describes what it is, not where it's used

### Pattern: `{product}-{asset-type}-{variant}-{modifier}.{ext}`

| Asset Type | Pattern | Examples |
|------------|---------|----------|
| **Logos** | `{product}-logo-{color}.svg` | `q-csat-logo-primary.svg`, `q-csat-logo-white.svg`, `q-csat-logo-black.svg` |
| **Icons** | `icon-{name}.svg` | `icon-dashboard.svg`, `icon-settings.svg`, `icon-arrow-right.svg` |
| **UI Images** | `{context}-{description}.{ext}` | `hero-dashboard-preview.webp`, `feature-analytics.png` |
| **Marketing** | `{campaign}-{description}.{ext}` | `launch-announcement-banner.webp`, `testimonial-acme-corp.jpg` |
| **Illustrations** | `illustration-{description}.svg` | `illustration-empty-state.svg`, `illustration-onboarding.svg` |
| **Backgrounds** | `bg-{description}.{ext}` | `bg-gradient-nature.svg`, `bg-pattern-dots.png` |
| **Screenshots** | `screenshot-{feature}-{variant}.png` | `screenshot-dashboard-light.png`, `screenshot-widget-dark.png` |
| **Videos** | `video-{description}.{ext}` | `video-product-demo.mp4`, `video-feature-tour.webm` |

### When to Include Modifiers

| Modifier | When to Use | Example |
|----------|-------------|---------|
| Size/density | Only for raster images at specific sizes | `og-image-1200x630.png` |
| Theme | When asset differs by theme | `logo-dark.svg`, `logo-light.svg` |
| State | For interactive states | `icon-checkbox-checked.svg` |

---

## Iconography Best Practices

### Icon Strategy for Q CSAT

We use **Lucide React** as our primary icon library. This approach:
- Provides consistent, well-designed icons
- Supports tree-shaking (only imports what's used)
- Offers TypeScript support and React integration

### When to Use Each Approach

| Approach | Use Case | Example |
|----------|----------|---------|
| **Lucide React** (default) | Standard UI icons | Navigation, actions, status indicators |
| **Inline SVG Component** | Brand assets, icons needing dynamic color | Logo, custom branded icons |
| **Static SVG in public/** | Favicons, social/OG images | `favicon.ico`, `og-image.png` |

### SVG Guidelines

```svg
<!-- Good: Clean, optimized SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>
```

**Do this:**
- Use `currentColor` for strokes/fills that should inherit color
- Include `viewBox` for proper scaling
- Use consistent stroke widths (2px for Lucide compatibility)
- Optimize SVGs with SVGO before committing

**Not that:**
- Don't embed fonts in SVGs
- Don't use inline styles when attributes work
- Don't leave editor metadata (Figma/Illustrator cruft)

### SVG Optimization Checklist

1. Remove unnecessary groups and layers
2. Clean up decimal precision (2-3 decimal places max)
3. Remove hidden elements
4. Convert shapes to paths when simpler
5. Use SVGO or similar tool

---

## Brand & Theme Organization

### Logo Variants

| Variant | File | Use Case |
|---------|------|----------|
| Primary | `q-csat-logo-primary.svg` | Default, light backgrounds |
| White | `q-csat-logo-white.svg` | Dark backgrounds, overlays |
| Black | `q-csat-logo-black.svg` | Maximum contrast, print |

### Using the Logo Component

```tsx
import { Logo } from '@/components/ui/logo';

// Primary logo with wordmark
<Logo variant="primary" size="md" showWordmark />

// White logo for dark backgrounds
<Logo variant="white" size="lg" />

// Inherit color from parent (advanced)
<Logo variant="currentColor" size="sm" />
```

### Available Sizes

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 20x18 | Compact UI, breadcrumbs |
| `sm` | 24x22 | Collapsed sidebar, mobile |
| `md` | 32x29 | Default, headers, navigation |
| `lg` | 40x36 | Hero sections, feature callouts |
| `xl` | 56x50 | Landing pages, marketing |

### Theme Colors Reference

The logo uses colors from our Nature Theme design system:

```css
--primary-500: #389084;  /* Primary teal - default logo color */
--primary-700: #264E46;  /* Darker variant */
--accent-500: #C6E8AD;   /* Nature green accent */
```

---

## Performance & Build Best Practices

### Image Format Recommendations

| Format | Use Case | Notes |
|--------|----------|-------|
| **SVG** | Logos, icons, illustrations | Scalable, small file size, themeable |
| **WebP** | Photos, complex images | 25-35% smaller than JPEG, wide support |
| **PNG** | Screenshots, images needing transparency | Use only when WebP won't work |
| **AVIF** | Future-proofing (optional) | Best compression, growing support |
| **JPEG** | Legacy fallback only | Avoid for new assets |

### Responsive Images Strategy

For marketing/content images, use Next.js Image component:

```tsx
import Image from 'next/image';

<Image
  src="/assets/images/hero-dashboard.webp"
  alt="Dashboard preview"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority  // For above-the-fold images
/>
```

### Caching & Performance

**Do this:**
- Use Next.js Image for automatic optimization
- Set appropriate `priority` for LCP images
- Use `sizes` attribute to prevent layout shift
- Leverage browser caching (assets in `public/` get long cache headers)

**Not that:**
- Don't create multiple size variants manually
- Don't inline large base64 images
- Don't skip `alt` attributes

### Avoiding Asset Bloat

1. Run images through optimization before commit (Squoosh, ImageOptim)
2. Keep logos under 5KB each
3. Keep illustrations under 50KB
4. Videos should be hosted externally (or lazy-loaded)
5. Consider CI checks for asset size limits

---

## Developer Ergonomics

### Importing Assets

**For Logo (recommended):**
```tsx
import { Logo, LogoImage } from '@/components/ui/logo';

// Inline SVG with theming support
<Logo variant="primary" size="md" showWordmark />

// Image-based (for simpler use cases)
<LogoImage variant="primary" size="md" />
```

**For Static Assets:**
```tsx
import Image from 'next/image';

// Reference from public folder
<Image src="/assets/images/feature-preview.webp" alt="..." width={600} height={400} />
```

**For Lucide Icons:**
```tsx
import { Settings, ChevronRight, LayoutDashboard } from 'lucide-react';

<Settings className="h-5 w-5" />
```

### Barrel Exports (When to Use)

**Do use barrel exports for:**
- Component libraries (`components/ui/index.ts`)
- Icon collections if creating custom set

**Don't use barrel exports for:**
- Static assets in `public/`
- Large icon libraries (hurts tree-shaking)

### Lightweight Linting Checks

Add to your CI pipeline:

```bash
# Check for unoptimized images (>500KB)
find public/assets -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" \) -size +500k

# Check for SVGs with embedded fonts
grep -r "font-family" public/assets/**.svg

# Verify all images have reasonable dimensions
# (Custom script based on your needs)
```

---

## Example Folder Tree

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── og-image.png                          # Default Open Graph image
│   └── assets/
│       ├── logos/
│       │   ├── q-csat-logo-primary.svg       # Primary brand color (#389084)
│       │   ├── q-csat-logo-white.svg         # For dark backgrounds
│       │   └── q-csat-logo-black.svg         # Maximum contrast
│       │
│       ├── icons/
│       │   ├── icon-feedback.svg             # Custom branded icons
│       │   ├── icon-survey.svg
│       │   ├── icon-analytics.svg
│       │   ├── icon-integration.svg
│       │   └── icon-notification.svg
│       │
│       ├── images/
│       │   ├── hero-dashboard-preview.webp   # Marketing hero image
│       │   ├── feature-widget-builder.webp   # Feature showcase
│       │   └── testimonial-avatar-jane.jpg   # Testimonial photos
│       │
│       ├── illustrations/
│       │   └── illustration-empty-state.svg  # Empty state graphics
│       │
│       └── videos/
│           └── video-product-demo.mp4        # Product demo video
│
├── components/
│   └── ui/
│       └── logo.tsx                          # Inline SVG Logo component
│
└── styles/
    └── globals.css                           # Design tokens
```

---

## Rules of the Road Checklist

```markdown
# Q CSAT Asset Guidelines - Quick Reference

## File Organization
- [ ] All static assets live in `public/assets/` (not scattered in components)
- [ ] Assets are organized by type: `logos/`, `icons/`, `images/`, `illustrations/`, `videos/`
- [ ] No asset duplication - single source of truth for each asset

## Naming
- [ ] Use `kebab-case` for all file names
- [ ] Follow pattern: `{context}-{description}-{variant}.{ext}`
- [ ] Logo files: `q-csat-logo-{color}.svg`
- [ ] No spaces, underscores, or camelCase in file names

## Logos
- [ ] Use `<Logo />` component for inline SVG (supports theming)
- [ ] Use `<LogoImage />` or direct path for static needs
- [ ] Primary variant for light backgrounds, white for dark

## Icons
- [ ] Use Lucide React for standard UI icons
- [ ] Custom icons go in `public/assets/icons/`
- [ ] SVGs use `currentColor` for inherited coloring

## Optimization
- [ ] SVGs are optimized (SVGO) before commit
- [ ] Raster images are WebP format (PNG only when needed)
- [ ] No image larger than 500KB without approval
- [ ] All images have descriptive `alt` text

## Code
- [ ] Use Next.js `<Image />` for optimized loading
- [ ] Set `priority` on above-the-fold images
- [ ] Import from `@/components/ui/logo` for Logo component
- [ ] Import icons individually from Lucide (tree-shaking)

## Review
- [ ] New assets reviewed for brand consistency
- [ ] No embedded fonts or editor metadata in SVGs
- [ ] Asset additions documented if introducing new patterns
```

---

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Lucide Icons](https://lucide.dev/)
- [SVGO - SVG Optimizer](https://github.com/svg/svgo)
- [Squoosh - Image Compression](https://squoosh.app/)

---

*Last updated: December 2024*
