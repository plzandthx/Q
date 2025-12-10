# Deployment Sanity Checklist

Follow this checklist to deploy Q CSAT to https://plzandthx.github.io/Q/

## Pre-Deployment Setup

### 1. Supabase Project Setup

- [ ] **Create a Supabase project** at [supabase.com](https://supabase.com)
- [ ] **Note your project credentials**:
  - Project URL (e.g., `https://xxxxx.supabase.co`)
  - Anon/public key (safe to expose in browser)

### 2. Database Setup in Supabase

- [ ] **Create the database tables** using Supabase SQL Editor:

  You can either:
  - Use the Supabase dashboard to create tables manually based on `/frontend/lib/supabase/database.types.ts`
  - OR run the Prisma schema against your Supabase database:
    ```bash
    # In the root directory
    DATABASE_URL="your-supabase-postgres-url" npx prisma db push
    ```

- [ ] **Enable Row-Level Security (RLS)**:
  - Go to Supabase SQL Editor
  - Run the SQL from `/supabase/rls-policies.sql`
  - This secures your data so users can only access their own organizations

### 3. Supabase Authentication Setup

- [ ] **Enable Email/Password Auth**:
  - Supabase Dashboard > Authentication > Providers
  - Enable "Email" provider

- [ ] **Enable Google OAuth** (optional):
  - Go to [Google Cloud Console](https://console.cloud.google.com)
  - Create OAuth 2.0 credentials
  - Add authorized redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
  - In Supabase: Authentication > Providers > Google
  - Add Client ID and Client Secret

- [ ] **Enable GitHub OAuth** (optional):
  - Go to [GitHub Developer Settings](https://github.com/settings/developers)
  - Create a new OAuth App
  - Authorization callback URL: `https://xxxxx.supabase.co/auth/v1/callback`
  - In Supabase: Authentication > Providers > GitHub
  - Add Client ID and Client Secret

- [ ] **Configure Auth Redirects**:
  - Supabase Dashboard > Authentication > URL Configuration
  - Add site URL: `https://plzandthx.github.io/Q`
  - Add redirect URLs:
    - `https://plzandthx.github.io/Q/app`
    - `https://plzandthx.github.io/Q/auth/verify-email/*`

### 4. GitHub Repository Setup

- [ ] **Enable GitHub Pages**:
  - Go to Repository Settings > Pages
  - Source: "GitHub Actions"

- [ ] **Add Repository Secrets**:
  - Go to Repository Settings > Secrets and variables > Actions
  - Add these secrets:
    | Secret Name | Value |
    |-------------|-------|
    | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
    | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 5. Trigger Deployment

- [ ] **Push to main branch** or manually trigger the workflow:
  - Go to Actions > "Deploy frontend to GitHub Pages"
  - Click "Run workflow"

## Post-Deployment Verification

### 6. Verify the Deployment

- [ ] **Visit the site**: https://plzandthx.github.io/Q/
- [ ] **Check the marketing pages load** (homepage, pricing, etc.)
- [ ] **Test authentication**:
  - [ ] Sign up with email/password works
  - [ ] Sign in works
  - [ ] OAuth providers work (if configured)
  - [ ] Sign out works

- [ ] **Test the dashboard** (after signing in):
  - [ ] Dashboard loads at `/Q/app`
  - [ ] User profile is displayed
  - [ ] Organization is created automatically

### 7. Test Database Operations

- [ ] **Create a test project** via the dashboard
- [ ] **Verify data appears** in Supabase Dashboard > Table Editor
- [ ] **Check RLS is working**: Users should only see their own data

## Troubleshooting

### Build Fails

1. Check GitHub Actions logs for errors
2. Verify secrets are set correctly (no trailing spaces)
3. Ensure Supabase URL starts with `https://`

### Authentication Doesn't Work

1. Verify Supabase auth providers are enabled
2. Check redirect URLs are configured in Supabase
3. Ensure the site URL matches `https://plzandthx.github.io/Q`

### 404 on Page Refresh

This is expected for static exports. The app uses client-side routing.
Users should navigate via links or start from the root URL.

### Data Not Loading

1. Check browser console for errors
2. Verify RLS policies are applied
3. Test queries in Supabase SQL Editor
4. Ensure anon key has correct permissions

## Optional: Seed Data

To add demo data for testing:

1. Go to Supabase SQL Editor
2. Insert test organizations, users, and projects
3. Or use the seed script (requires backend setup):
   ```bash
   DATABASE_URL="your-url" npm run db:seed
   ```

## Quick Reference

| Resource | URL |
|----------|-----|
| Live Site | https://plzandthx.github.io/Q/ |
| GitHub Repo | https://github.com/plzandthx/Q |
| Supabase Dashboard | https://supabase.com/dashboard |
| GitHub Actions | https://github.com/plzandthx/Q/actions |

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │     │    Supabase     │
│                 │     │                 │
│  Static Next.js │────►│  Auth           │
│  Frontend       │     │  PostgreSQL     │
│                 │     │  RLS Policies   │
└─────────────────┘     └─────────────────┘
```

The frontend is a static site that communicates directly with Supabase.
No backend server is required for basic operations.
