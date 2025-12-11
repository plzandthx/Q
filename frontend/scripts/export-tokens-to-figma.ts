/**
 * Export Design Tokens to Tokens Studio (Figma) Format
 *
 * This script converts our TypeScript design tokens to the Tokens Studio JSON format,
 * which can be imported directly into Figma via the Tokens Studio plugin.
 *
 * Usage: npx tsx scripts/export-tokens-to-figma.ts
 * Output: tokens/figma-tokens.json
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  components,
  theme,
} from '../lib/design-tokens';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tokens Studio format types
interface TokenValue {
  value: string | number;
  type: string;
  description?: string;
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup;
}

interface TokensStudioFormat {
  [setName: string]: TokenGroup;
}

// Helper to convert rem to pixels for Figma (Figma uses pixels)
function remToPx(rem: string): string {
  if (rem === '0') return '0';
  const match = rem.match(/^([\d.]+)rem$/);
  if (match) {
    return `${parseFloat(match[1]) * 16}`;
  }
  return rem;
}

// Helper to create a color token
function colorToken(value: string, description?: string): TokenValue {
  return {
    value,
    type: 'color',
    ...(description && { description }),
  };
}

// Helper to create a dimension token
function dimensionToken(value: string, description?: string): TokenValue {
  return {
    value: remToPx(value),
    type: 'dimension',
    ...(description && { description }),
  };
}

// Helper to create a font size token
function fontSizeToken(value: string): TokenValue {
  return {
    value: remToPx(value),
    type: 'fontSizes',
  };
}

// Helper to create a line height token
function lineHeightToken(value: string): TokenValue {
  return {
    value: remToPx(value),
    type: 'lineHeights',
  };
}

// Helper to create a font weight token
function fontWeightToken(value: string): TokenValue {
  return {
    value,
    type: 'fontWeights',
  };
}

// Helper to create a font family token
function fontFamilyToken(value: string[]): TokenValue {
  return {
    value: value.join(', '),
    type: 'fontFamilies',
  };
}

// Helper to create a border radius token
function borderRadiusToken(value: string): TokenValue {
  return {
    value: remToPx(value),
    type: 'borderRadius',
  };
}

// Helper to create a shadow token
function shadowToken(value: string): TokenValue {
  return {
    value,
    type: 'boxShadow',
  };
}

// Helper to create a duration token
function durationToken(value: string): TokenValue {
  return {
    value,
    type: 'duration',
  };
}

// Convert color scales to token format
function convertColorScale(scale: Record<string | number, string>, prefix: string): TokenGroup {
  const tokens: TokenGroup = {};
  for (const [shade, value] of Object.entries(scale)) {
    tokens[shade] = colorToken(value, `${prefix} ${shade}`);
  }
  return tokens;
}

// Build the complete token structure
function buildTokens(): TokensStudioFormat {
  const tokens: TokensStudioFormat = {
    // Global tokens (primitives)
    global: {
      // Colors
      colors: {
        primary: convertColorScale(colors.primary, 'Primary'),
        accent: convertColorScale(colors.accent, 'Accent'),
        neutral: convertColorScale(colors.neutral, 'Neutral'),
        success: convertColorScale(colors.success, 'Success'),
        warning: convertColorScale(colors.warning, 'Warning'),
        danger: convertColorScale(colors.danger, 'Danger'),
        csat: {
          '1': colorToken(colors.csat[1], 'CSAT Score 1 - Very Dissatisfied'),
          '2': colorToken(colors.csat[2], 'CSAT Score 2 - Dissatisfied'),
          '3': colorToken(colors.csat[3], 'CSAT Score 3 - Neutral'),
          '4': colorToken(colors.csat[4], 'CSAT Score 4 - Satisfied'),
          '5': colorToken(colors.csat[5], 'CSAT Score 5 - Very Satisfied'),
        },
      },

      // Typography
      fontFamily: {
        sans: fontFamilyToken(typography.fontFamily.sans),
        mono: fontFamilyToken(typography.fontFamily.mono),
      },

      fontSize: {
        xs: fontSizeToken('0.75rem'),
        sm: fontSizeToken('0.875rem'),
        base: fontSizeToken('1rem'),
        lg: fontSizeToken('1.125rem'),
        xl: fontSizeToken('1.25rem'),
        '2xl': fontSizeToken('1.5rem'),
        '3xl': fontSizeToken('1.875rem'),
        '4xl': fontSizeToken('2.25rem'),
        '5xl': fontSizeToken('3rem'),
      },

      lineHeight: {
        xs: lineHeightToken('1rem'),
        sm: lineHeightToken('1.25rem'),
        base: lineHeightToken('1.5rem'),
        lg: lineHeightToken('1.75rem'),
        xl: lineHeightToken('1.75rem'),
        '2xl': lineHeightToken('2rem'),
        '3xl': lineHeightToken('2.25rem'),
        '4xl': lineHeightToken('2.5rem'),
        '5xl': lineHeightToken('3rem'),
      },

      fontWeight: {
        normal: fontWeightToken(typography.fontWeight.normal),
        medium: fontWeightToken(typography.fontWeight.medium),
        semibold: fontWeightToken(typography.fontWeight.semibold),
        bold: fontWeightToken(typography.fontWeight.bold),
      },

      letterSpacing: {
        tighter: { value: '-0.02em', type: 'letterSpacing' },
        tight: { value: '-0.01em', type: 'letterSpacing' },
        normal: { value: '0', type: 'letterSpacing' },
      },

      // Spacing
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([key, value]) => [
          key.toString().replace('.', '_'),
          dimensionToken(value, `Spacing ${key}`),
        ])
      ),

      // Border Radius
      borderRadius: Object.fromEntries(
        Object.entries(borderRadius).map(([key, value]) => [
          key,
          borderRadiusToken(value),
        ])
      ),

      // Shadows
      shadow: {
        none: shadowToken('none'),
        sm: shadowToken(shadows.sm),
        md: shadowToken(shadows.md),
        lg: shadowToken(shadows.lg),
        xl: shadowToken(shadows.xl),
        '2xl': shadowToken(shadows['2xl']),
        inner: shadowToken(shadows.inner),
        card: shadowToken(shadows.card),
        cardHover: shadowToken(shadows.cardHover),
        primary: shadowToken(shadows.primary),
      },

      // Transitions
      duration: {
        fast: durationToken(transitions.duration.fast),
        normal: durationToken(transitions.duration.normal),
        slow: durationToken(transitions.duration.slow),
      },

      // Z-Index
      zIndex: Object.fromEntries(
        Object.entries(zIndex).map(([key, value]) => [
          key,
          { value: value.toString(), type: 'other' },
        ])
      ),

      // Breakpoints
      breakpoint: Object.fromEntries(
        Object.entries(breakpoints).map(([key, value]) => [
          key,
          { value: value.replace('px', ''), type: 'dimension' },
        ])
      ),
    },

    // Semantic tokens (aliases that reference global tokens)
    semantic: {
      // Background colors
      bg: {
        default: { value: '{colors.neutral.0}', type: 'color' },
        subtle: { value: '{colors.neutral.50}', type: 'color' },
        muted: { value: '{colors.neutral.100}', type: 'color' },
        emphasized: { value: '{colors.neutral.200}', type: 'color' },
        inverse: { value: '{colors.neutral.900}', type: 'color' },
        primary: { value: '{colors.primary.500}', type: 'color' },
        accent: { value: '{colors.accent.500}', type: 'color' },
        success: { value: '{colors.success.500}', type: 'color' },
        warning: { value: '{colors.warning.500}', type: 'color' },
        danger: { value: '{colors.danger.500}', type: 'color' },
      },

      // Text colors
      text: {
        primary: { value: '{colors.neutral.900}', type: 'color' },
        secondary: { value: '{colors.neutral.600}', type: 'color' },
        muted: { value: '{colors.neutral.500}', type: 'color' },
        disabled: { value: '{colors.neutral.400}', type: 'color' },
        inverse: { value: '{colors.neutral.0}', type: 'color' },
        link: { value: '{colors.primary.600}', type: 'color' },
        linkHover: { value: '{colors.primary.700}', type: 'color' },
        onPrimary: { value: '{colors.neutral.0}', type: 'color' },
        success: { value: '{colors.success.700}', type: 'color' },
        warning: { value: '{colors.warning.700}', type: 'color' },
        danger: { value: '{colors.danger.700}', type: 'color' },
      },

      // Border colors
      border: {
        default: { value: '{colors.neutral.200}', type: 'color' },
        subtle: { value: '{colors.neutral.100}', type: 'color' },
        emphasized: { value: '{colors.neutral.300}', type: 'color' },
        focus: { value: '{colors.primary.500}', type: 'color' },
        error: { value: '{colors.danger.500}', type: 'color' },
      },

      // Interactive states
      interactive: {
        primary: { value: '{colors.primary.500}', type: 'color' },
        primaryHover: { value: '{colors.primary.600}', type: 'color' },
        primaryActive: { value: '{colors.primary.700}', type: 'color' },
        secondary: { value: '{colors.neutral.100}', type: 'color' },
        secondaryHover: { value: '{colors.neutral.200}', type: 'color' },
        secondaryActive: { value: '{colors.neutral.300}', type: 'color' },
      },
    },

    // Component-specific tokens
    component: {
      button: {
        sm: {
          height: dimensionToken(components.button.sm.height),
          paddingX: dimensionToken(components.button.sm.paddingX),
          fontSize: fontSizeToken(components.button.sm.fontSize),
        },
        md: {
          height: dimensionToken(components.button.md.height),
          paddingX: dimensionToken(components.button.md.paddingX),
          fontSize: fontSizeToken(components.button.md.fontSize),
        },
        lg: {
          height: dimensionToken(components.button.lg.height),
          paddingX: dimensionToken(components.button.lg.paddingX),
          fontSize: fontSizeToken(components.button.lg.fontSize),
        },
      },

      input: {
        sm: {
          height: dimensionToken(components.input.sm.height),
          paddingX: dimensionToken(components.input.sm.paddingX),
          fontSize: fontSizeToken(components.input.sm.fontSize),
        },
        md: {
          height: dimensionToken(components.input.md.height),
          paddingX: dimensionToken(components.input.md.paddingX),
          fontSize: fontSizeToken(components.input.md.fontSize),
        },
        lg: {
          height: dimensionToken(components.input.lg.height),
          paddingX: dimensionToken(components.input.lg.paddingX),
          fontSize: fontSizeToken(components.input.lg.fontSize),
        },
      },

      card: {
        padding: {
          sm: dimensionToken(components.card.padding.sm),
          md: dimensionToken(components.card.padding.md),
          lg: dimensionToken(components.card.padding.lg),
        },
        borderRadius: borderRadiusToken(components.card.borderRadius),
      },

      sidebar: {
        width: dimensionToken(components.sidebar.width),
        collapsedWidth: dimensionToken(components.sidebar.collapsedWidth),
      },

      topbar: {
        height: dimensionToken(components.topbar.height),
      },
    },
  };

  return tokens;
}

// Also create a Style Dictionary compatible format
function buildStyleDictionaryFormat(): object {
  return {
    color: {
      primary: Object.fromEntries(
        Object.entries(colors.primary).map(([k, v]) => [k, { value: v }])
      ),
      accent: Object.fromEntries(
        Object.entries(colors.accent).map(([k, v]) => [k, { value: v }])
      ),
      neutral: Object.fromEntries(
        Object.entries(colors.neutral).map(([k, v]) => [k, { value: v }])
      ),
      success: Object.fromEntries(
        Object.entries(colors.success).map(([k, v]) => [k, { value: v }])
      ),
      warning: Object.fromEntries(
        Object.entries(colors.warning).map(([k, v]) => [k, { value: v }])
      ),
      danger: Object.fromEntries(
        Object.entries(colors.danger).map(([k, v]) => [k, { value: v }])
      ),
      csat: Object.fromEntries(
        Object.entries(colors.csat).map(([k, v]) => [k, { value: v }])
      ),
    },
    spacing: Object.fromEntries(
      Object.entries(spacing).map(([k, v]) => [k.toString().replace('.', '_'), { value: v }])
    ),
    borderRadius: Object.fromEntries(
      Object.entries(borderRadius).map(([k, v]) => [k, { value: v }])
    ),
    shadow: Object.fromEntries(
      Object.entries(shadows).map(([k, v]) => [k, { value: v }])
    ),
  };
}

// Main execution
function main() {
  const tokensDir = path.join(__dirname, '..', 'tokens');

  // Create tokens directory if it doesn't exist
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { recursive: true });
  }

  // Export Tokens Studio format
  const tokensStudioTokens = buildTokens();
  const tokensStudioPath = path.join(tokensDir, 'figma-tokens.json');
  fs.writeFileSync(
    tokensStudioPath,
    JSON.stringify(tokensStudioTokens, null, 2)
  );
  console.log(`✓ Exported Tokens Studio format to: ${tokensStudioPath}`);

  // Export Style Dictionary format (alternative)
  const styleDictionaryTokens = buildStyleDictionaryFormat();
  const styleDictionaryPath = path.join(tokensDir, 'style-dictionary-tokens.json');
  fs.writeFileSync(
    styleDictionaryPath,
    JSON.stringify(styleDictionaryTokens, null, 2)
  );
  console.log(`✓ Exported Style Dictionary format to: ${styleDictionaryPath}`);

  // Create a summary
  console.log('\n📊 Token Summary:');
  console.log(`   - Color scales: 7 (primary, accent, neutral, success, warning, danger, csat)`);
  console.log(`   - Font sizes: 9`);
  console.log(`   - Spacing values: ${Object.keys(spacing).length}`);
  console.log(`   - Border radius values: ${Object.keys(borderRadius).length}`);
  console.log(`   - Shadow styles: ${Object.keys(shadows).length}`);
  console.log(`   - Component token groups: 5 (button, input, card, sidebar, topbar)`);

  console.log('\n📝 Next Steps:');
  console.log('   1. Install "Tokens Studio for Figma" plugin in Figma');
  console.log('   2. Open the plugin and click "Load" → "File"');
  console.log('   3. Select the figma-tokens.json file');
  console.log('   4. Click "Create styles" to generate Figma styles');
  console.log('   5. Click "Create variables" to generate Figma variables');
}

main();
