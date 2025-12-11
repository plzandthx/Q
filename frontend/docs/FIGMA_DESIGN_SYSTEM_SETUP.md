# Code → Figma Design System Setup Guide

This guide walks you through converting the Q design system from code to Figma, enabling bidirectional sync with Figma MCP for future design evolution.

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CURRENT STATE                                 │
├─────────────────────────────────────────────────────────────────────┤
│  lib/design-tokens.ts  →  Components  →  /design-system page        │
│       (source)              (use)           (documentation)          │
└─────────────────────────────────────────────────────────────────────┘
                                ↓
                    [This guide converts to]
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        TARGET STATE                                  │
├─────────────────────────────────────────────────────────────────────┤
│  Figma Variables  ←→  tokens/figma-tokens.json  ←→  design-tokens.ts│
│       (design)              (sync layer)              (code)        │
│                                                                      │
│  Edit in Figma  →  Figma MCP  →  Claude Code  →  Updated App        │
└─────────────────────────────────────────────────────────────────────┘
```

## Step 1: Generate Token Files (Already Done)

The token export script has been created and run:

```bash
cd frontend
npx tsx scripts/export-tokens-to-figma.ts
```

This generates:
- `tokens/figma-tokens.json` - Tokens Studio format (for Figma import)
- `tokens/style-dictionary-tokens.json` - Style Dictionary format (alternative)

## Step 2: Install Tokens Studio for Figma

1. Open Figma Desktop or Web
2. Go to **Community** (Figma icon menu)
3. Search for **"Tokens Studio for Figma"** (formerly Figma Tokens)
4. Click **Install**

> **Why Tokens Studio?**
> - It's the de-facto standard for design tokens in Figma
> - Creates native Figma Variables (not just styles)
> - Supports the same JSON format as Style Dictionary
> - Has GitHub sync capabilities (Pro feature)
> - Free tier is sufficient for your use case

## Step 3: Create New Figma File

1. Create a new Figma file named **"Q Design System"**
2. Create the following pages:
   - **Cover** - Title card for the library
   - **Tokens** - Documentation of all tokens
   - **Colors** - Color swatches and usage
   - **Typography** - Type scale demonstration
   - **Components** - All UI components
   - **Patterns** - Common UI patterns

## Step 4: Import Tokens

1. Open **Tokens Studio** plugin (Plugins → Tokens Studio)
2. Click **"Load"** → **"From file"**
3. Navigate to `frontend/tokens/figma-tokens.json`
4. Click **"Open"**

You should now see three token sets in the sidebar:
- **global** - Primitive tokens (colors, spacing, etc.)
- **semantic** - Semantic aliases (bg.primary, text.muted, etc.)
- **component** - Component-specific tokens

## Step 5: Apply Tokens to Figma

### Create Variables (Recommended)
1. In Tokens Studio, select all token sets
2. Click the **"Variables"** button (or gear icon → "Create variables")
3. Choose **"Create all variables"**
4. This creates native Figma Variables organized in collections

### Create Styles (Optional, for older Figma features)
1. Click the **"Styles"** button
2. Select which tokens to convert to styles
3. Useful for: Text styles, Effect styles (shadows)

## Step 6: Build Components in Figma

Now build your component library using the imported variables:

### Button Component
1. Create a frame for Button
2. Apply variables:
   - Background: `semantic/interactive/primary`
   - Text: `semantic/text/onPrimary`
   - Padding: `component/button/md/paddingX`
   - Height: `component/button/md/height`
   - Border radius: `global/borderRadius/lg`
3. Create variants for: primary, secondary, outline, ghost, danger
4. Create size variants: sm, md, lg

### Input Component
1. Create a frame for Input
2. Apply variables:
   - Border: `semantic/border/default`
   - Background: `semantic/bg/default`
   - Text: `semantic/text/primary`
   - Placeholder: `semantic/text/muted`

### Card Component
1. Create a frame for Card
2. Apply variables:
   - Background: `semantic/bg/default`
   - Border: `semantic/border/default`
   - Shadow: `global/shadow/card`
   - Padding: `component/card/padding/md`
   - Border radius: `component/card/borderRadius`

> **Tip:** Reference the `/design-system` page while building components to ensure visual parity.

## Step 7: Publish as Library

1. Open your **Q Design System** file
2. Go to File → **Publish styles and components**
3. Select all components and variables
4. Click **Publish**

This makes the design system available to other Figma files.

## Step 8: Set Up Figma MCP Integration

### Option A: Using Framelink Figma MCP (Recommended)

1. Install the Framelink Figma MCP server:
   ```bash
   # Add to your Claude Code MCP config
   npx @anthropic/mcp add framelink-figma
   ```

2. Configure with your Figma token:
   ```json
   {
     "mcpServers": {
       "figma": {
         "command": "npx",
         "args": ["-y", "@anthropic/mcp-figma"],
         "env": {
           "FIGMA_ACCESS_TOKEN": "your-figma-token"
         }
       }
     }
   }
   ```

3. Get your Figma token:
   - Go to Figma → Settings → Account
   - Scroll to **Personal access tokens**
   - Generate a new token with read access

### Option B: Manual Token Sync

For bidirectional sync without MCP:

1. **Figma → Code:**
   - Export tokens from Tokens Studio (Export → JSON)
   - Run a sync script to update `design-tokens.ts`

2. **Code → Figma:**
   - Run `npx tsx scripts/export-tokens-to-figma.ts`
   - Reimport in Tokens Studio

## Step 9: Workflow for Design Changes

### Making Design Changes in Figma

1. Open **Q Design System** in Figma
2. Open **Tokens Studio** plugin
3. Edit tokens (e.g., change `primary.500` from `#14b8a6` to `#0ea5e9`)
4. Click **"Update"** to apply changes to the file
5. Export tokens: **Export** → **JSON**

### Applying Changes to Code via Claude Code

```
User: I updated the primary color in Figma to #0ea5e9.
      Please update the codebase to match.

Claude: [Uses Figma MCP to read the updated tokens]
        [Updates lib/design-tokens.ts]
        [Updates tailwind.config.ts]
        [Commits changes]
```

## Token File Structure

```
tokens/
├── figma-tokens.json        # Tokens Studio format
│   ├── global/              # Primitive tokens
│   │   ├── colors/          # Color scales
│   │   ├── fontSize/        # Type scale
│   │   ├── spacing/         # Spacing values
│   │   ├── borderRadius/    # Radii
│   │   └── shadow/          # Shadows
│   ├── semantic/            # Semantic aliases
│   │   ├── bg/              # Background colors
│   │   ├── text/            # Text colors
│   │   ├── border/          # Border colors
│   │   └── interactive/     # Interactive states
│   └── component/           # Component tokens
│       ├── button/          # Button sizes
│       ├── input/           # Input sizes
│       └── card/            # Card dimensions
│
└── style-dictionary-tokens.json  # Alternative format
```

## Keeping Things in Sync

### Automated Sync (Tokens Studio Pro)

If you upgrade to Tokens Studio Pro ($5/month):
1. Connect to GitHub repository
2. Tokens sync automatically on push
3. Changes in Figma create PRs

### Manual Sync Script

Add to `package.json`:
```json
{
  "scripts": {
    "tokens:export": "tsx scripts/export-tokens-to-figma.ts",
    "tokens:import": "tsx scripts/import-tokens-from-figma.ts"
  }
}
```

## Troubleshooting

### Tokens not showing in Figma
- Ensure JSON is valid (use a JSON validator)
- Check that token types match Tokens Studio format
- Try reloading the plugin

### Colors look different in Figma
- Figma uses sRGB by default
- Ensure color values are in hex format (#RRGGBB)

### Variables not applying to components
- Make sure you're using the correct variable collection
- Check that the variable mode matches (light/dark)

## Next Steps

1. [ ] Import tokens into Figma (Step 4)
2. [ ] Create all component variants in Figma (Step 6)
3. [ ] Publish as library (Step 7)
4. [ ] Set up Figma MCP (Step 8)
5. [ ] Test bidirectional workflow (Step 9)

---

## Resources

- [Tokens Studio Documentation](https://docs.tokens.studio/)
- [Figma Variables Guide](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
- [Figma MCP](https://github.com/anthropics/mcp-figma)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
