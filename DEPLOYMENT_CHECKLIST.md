# Deployment Sanity Checklist

Complete guide to deploy Q CSAT to https://plzandthx.github.io/Q/

---

## Part 1: Supabase Project Setup

### Step 1.1: Create a Supabase Account and Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (GitHub login recommended)
3. Click "New Project"
4. Fill in:
   - **Organization**: Select or create one
   - **Project name**: `q-csat` (or your preferred name)
   - **Database password**: Generate a strong password and **save it securely**
   - **Region**: Choose the closest to your users
5. Click "Create new project" and wait 2-3 minutes for provisioning

### Step 1.2: Get Your API Credentials

Once your project is ready:

1. In the Supabase dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** under "Project Settings"
3. Copy and save these values:
   - **Project URL**: `https://xxxxxxxx.supabase.co` (you'll need this)
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (safe for browser)
   - **service_role key**: Keep this secret! (only for server-side, not needed for this deployment)

---

## Part 2: Database Setup

### Step 2.1: Create Database Tables

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste this SQL to create all required tables:

```sql
-- =============================================================================
-- Q CSAT DATABASE SCHEMA
-- Run this in Supabase SQL Editor to create all tables
-- =============================================================================

-- Create custom types/enums
CREATE TYPE auth_provider AS ENUM ('PASSWORD', 'GOOGLE', 'SSO_FUTURE');
CREATE TYPE org_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
CREATE TYPE project_status AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE widget_type AS ENUM ('MODAL_CAPTURE', 'TOAST', 'INLINE_EMBED');
CREATE TYPE integration_direction AS ENUM ('INBOUND', 'OUTBOUND', 'BOTH');
CREATE TYPE subscription_status AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE billing_interval AS ENUM ('MONTHLY', 'ANNUAL');
CREATE TYPE recommendation_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE recommendation_status AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE', 'ARCHIVED');
CREATE TYPE recommendation_source AS ENUM ('RULE', 'MANUAL', 'AI_FUTURE');
CREATE TYPE alert_severity AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  auth_provider auth_provider DEFAULT 'PASSWORD',
  email_verified BOOLEAN DEFAULT FALSE,
  mfa_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Organization memberships (links users to organizations)
CREATE TABLE org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role org_role DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Plans table (subscription tiers)
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  monthly_price_cents INTEGER NOT NULL,
  annual_price_cents INTEGER NOT NULL,
  projects_limit INTEGER NOT NULL,
  users_limit INTEGER NOT NULL,
  integrations_limit INTEGER NOT NULL,
  widgets_limit INTEGER NOT NULL,
  responses_per_month INTEGER NOT NULL,
  features_json JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status subscription_status DEFAULT 'TRIALING',
  billing_interval billing_interval DEFAULT 'MONTHLY',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'ACTIVE',
  icon_url TEXT,
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Personas table
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Moments table (customer journey touchpoints)
CREATE TABLE moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  icon_emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- CSAT Widgets table
CREATE TABLE csat_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type widget_type NOT NULL,
  name TEXT NOT NULL,
  public_key TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  config_json JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- CSAT Responses table
CREATE TABLE csat_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  moment_id UUID REFERENCES moments(id),
  persona_id UUID REFERENCES personas(id),
  widget_id UUID REFERENCES csat_widgets(id),
  integration_id UUID,
  inbound_event_id UUID,
  external_reference TEXT,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  metadata_json JSONB DEFAULT '{}',
  respondent_identifier_hash TEXT,
  source_type TEXT DEFAULT 'widget',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CSAT Aggregates table (pre-computed analytics)
CREATE TABLE csat_aggregates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  moment_id UUID REFERENCES moments(id),
  persona_id UUID REFERENCES personas(id),
  time_bucket TIMESTAMPTZ NOT NULL,
  granularity TEXT DEFAULT 'daily',
  responses_count INTEGER NOT NULL,
  avg_score DECIMAL(3,2) NOT NULL,
  min_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  p50_score DECIMAL(3,2) NOT NULL,
  p90_score DECIMAL(3,2) NOT NULL,
  promoters INTEGER DEFAULT 0,
  passives INTEGER DEFAULT 0,
  detractors INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  direction integration_direction NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  moment_id UUID REFERENCES moments(id),
  persona_id UUID REFERENCES personas(id),
  generated_by_user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority recommendation_priority DEFAULT 'MEDIUM',
  status recommendation_status DEFAULT 'OPEN',
  source recommendation_source DEFAULT 'MANUAL',
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  moment_id UUID REFERENCES moments(id),
  type TEXT NOT NULL,
  severity alert_severity DEFAULT 'INFO',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create indexes for common queries
CREATE INDEX idx_org_memberships_user ON org_memberships(user_id);
CREATE INDEX idx_org_memberships_org ON org_memberships(organization_id);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_personas_project ON personas(project_id);
CREATE INDEX idx_moments_project ON moments(project_id);
CREATE INDEX idx_csat_widgets_project ON csat_widgets(project_id);
CREATE INDEX idx_csat_widgets_public_key ON csat_widgets(public_key);
CREATE INDEX idx_csat_responses_project ON csat_responses(project_id);
CREATE INDEX idx_csat_responses_created ON csat_responses(created_at);
CREATE INDEX idx_integrations_org ON integrations(organization_id);
CREATE INDEX idx_recommendations_project ON recommendations(project_id);
CREATE INDEX idx_alerts_project ON alerts(project_id);
```

4. Click **Run** (or press Ctrl/Cmd + Enter)
5. Verify you see "Success. No rows returned" (tables created successfully)

### Step 2.2: Enable Row-Level Security (RLS)

1. Still in SQL Editor, click **New query**
2. Copy and paste the RLS policies from `/supabase/rls-policies.sql` (the full file)
3. Click **Run**
4. Verify success

**Alternative**: You can run both SQL files sequentially - first the schema, then the RLS policies.

### Step 2.3: Insert Default Plan Data (Optional)

Run this SQL to add a free plan:

```sql
INSERT INTO plans (name, slug, description, monthly_price_cents, annual_price_cents,
                   projects_limit, users_limit, integrations_limit, widgets_limit,
                   responses_per_month, is_active, sort_order)
VALUES
  ('Free', 'free', 'Get started for free', 0, 0, 1, 1, 0, 1, 100, true, 0),
  ('Growth', 'growth', 'For growing teams', 2900, 29000, 5, 5, 3, 10, 5000, true, 1),
  ('Scale', 'scale', 'For large organizations', 9900, 99000, -1, -1, -1, -1, -1, true, 2);
```

---

## Part 3: Supabase Authentication Setup

### Step 3.1: Enable Email/Password Authentication

1. In Supabase dashboard, click **Authentication** in the left sidebar
2. Click **Providers** tab
3. Find **Email** and ensure it's **enabled** (should be by default)
4. **Recommended settings**:
   - ✅ Enable email confirmations (optional for testing, recommended for production)
   - ✅ Secure email change (recommended)

### Step 3.2: Configure Site URL and Redirect URLs

1. In Authentication section, click **URL Configuration**
2. Set **Site URL**: `https://plzandthx.github.io/Q`
3. Under **Redirect URLs**, click "Add URL" and add:
   - `https://plzandthx.github.io/Q/auth/callback` **(REQUIRED for OAuth)**
   - `https://plzandthx.github.io/Q/app`
   - `https://plzandthx.github.io/Q/auth/sign-in`
   - `https://plzandthx.github.io/Q/auth/sign-up`
   - `http://localhost:3000/**` (for local development)

**IMPORTANT**: The `/Q/auth/callback` URL is required for OAuth (Google, GitHub) to work properly. Without it, OAuth sign-in will fail with an "invalid redirect" error.

### Step 3.3: Enable Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add these **Authorized redirect URIs**:
   - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
   - (Replace YOUR-PROJECT-REF with your actual Supabase project reference)
7. Copy the **Client ID** and **Client Secret**
8. Back in Supabase: **Authentication** → **Providers** → **Google**
9. Toggle **Enable**
10. Paste your Client ID and Client Secret
11. Click **Save**

### Step 3.4: Enable GitHub OAuth (Optional)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: Q CSAT
   - **Homepage URL**: `https://plzandthx.github.io/Q`
   - **Authorization callback URL**: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy **Client ID**, then click **Generate a new client secret** and copy it
6. Back in Supabase: **Authentication** → **Providers** → **GitHub**
7. Toggle **Enable**
8. Paste your Client ID and Client Secret
9. Click **Save**

### Step 3.5: Create Auth Trigger for User Profile (Optional but Recommended)

This automatically creates a user profile when someone signs up:

1. Go to **SQL Editor** → **New query**
2. Run:

```sql
-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, auth_provider, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN NEW.raw_app_meta_data->>'provider' = 'google' THEN 'GOOGLE'::auth_provider
      WHEN NEW.raw_app_meta_data->>'provider' = 'github' THEN 'GOOGLE'::auth_provider
      ELSE 'PASSWORD'::auth_provider
    END,
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Part 4: GitHub Repository Setup

### Step 4.1: Enable GitHub Pages

1. Go to your repository: `https://github.com/plzandthx/Q`
2. Click **Settings** tab
3. In left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"

### Step 4.2: Add Repository Secrets

1. Still in Settings, click **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these two secrets:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (e.g., `https://xxxxxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key (the long `eyJ...` string) |

**Important**:
- No quotes around the values
- No trailing spaces
- The URL must include `https://`

---

## Part 5: Deploy

### Step 5.1: Trigger Deployment

**Option A: Merge PR to main**
- Merge your PR to the `main` branch
- GitHub Actions will automatically build and deploy

**Option B: Manual Trigger**
1. Go to your repository → **Actions** tab
2. Click "Deploy frontend to GitHub Pages" workflow
3. Click **Run workflow** → **Run workflow** (green button)

### Step 5.2: Monitor Deployment

1. Watch the Actions tab for the workflow progress
2. Build typically takes 2-3 minutes
3. Once complete, the deploy step will show the URL

---

## Part 6: Post-Deployment Verification

### Step 6.1: Test the Site

1. Visit: https://plzandthx.github.io/Q/
2. Verify:
   - [ ] Homepage loads correctly
   - [ ] Navigation works (Pricing, About, etc.)
   - [ ] No console errors related to Supabase

### Step 6.2: Test Authentication

1. Click "Sign Up" or navigate to `/Q/auth/sign-up`
2. Create a test account:
   - [ ] Email/password signup works
   - [ ] Receive confirmation email (if enabled)
   - [ ] Can sign in after verification
3. Test OAuth (if configured):
   - [ ] Google sign-in works
   - [ ] GitHub sign-in works

### Step 6.3: Test Dashboard

1. After signing in, navigate to `/Q/app`
2. Verify:
   - [ ] Dashboard loads
   - [ ] User profile shows
   - [ ] Can create a new organization
   - [ ] Can create a new project

### Step 6.4: Verify Database

1. Go to Supabase Dashboard → **Table Editor**
2. Check that data appears in:
   - [ ] `users` table (after signup)
   - [ ] `organizations` table (after org creation)
   - [ ] `org_memberships` table (linking user to org)
   - [ ] `projects` table (after project creation)

---

## Troubleshooting

### Build Fails in GitHub Actions

**Error: "supabaseUrl is required"**
- Verify secrets are set correctly in GitHub
- Check no typos in secret names
- Ensure URL starts with `https://`

**Error: TypeScript/ESLint errors**
- Check the build log for specific file/line numbers
- These need to be fixed in code before deployment

### Authentication Issues

**Sign-in button spins forever / OAuth hangs**
- Verify `https://plzandthx.github.io/Q/auth/callback` is added to Supabase redirect URLs
- Check browser console for errors
- Verify GitHub secrets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Redeploy after adding secrets (they're embedded at build time)

**"Invalid redirect URL"**
- Add the exact URL to Supabase → Authentication → URL Configuration
- Make sure to include `/Q/auth/callback` for OAuth to work
- Include both with and without trailing slash

**OAuth not working**
- Verify callback URL in Google/GitHub matches your Supabase project ref
- Check Client ID and Secret are correct in Supabase
- Ensure `/Q/auth/callback` is in Supabase's allowed redirect URLs

**"User not found in database"**
- Ensure the auth trigger (Step 3.5) was created
- Or manually insert user into `users` table

### 404 on Page Refresh

This is expected for static exports with client-side routing. Users should:
- Navigate via links within the app
- Start from the root URL and navigate from there

### Data Not Loading

1. Open browser DevTools → Console
2. Look for Supabase errors
3. Common issues:
   - RLS policies blocking access (check policy conditions)
   - User not in organization (check `org_memberships`)
   - Missing foreign key relationships

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Live Site | https://plzandthx.github.io/Q/ |
| GitHub Repo | https://github.com/plzandthx/Q |
| GitHub Actions | https://github.com/plzandthx/Q/actions |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## Architecture Overview

```
┌─────────────────────────┐     ┌──────────────────────────┐
│     GitHub Pages        │     │        Supabase          │
│                         │     │                          │
│  ┌──────────────────┐   │     │  ┌──────────────────┐   │
│  │  Static Next.js  │   │     │  │   PostgreSQL     │   │
│  │    Frontend      │───┼────►│  │   Database       │   │
│  └──────────────────┘   │     │  └──────────────────┘   │
│                         │     │                          │
│  - HTML/CSS/JS          │     │  ┌──────────────────┐   │
│  - Client-side routing  │     │  │   Auth Service   │   │
│  - Supabase JS client   │     │  │   (Email, OAuth) │   │
│                         │     │  └──────────────────┘   │
│                         │     │                          │
│                         │     │  ┌──────────────────┐   │
│                         │     │  │   RLS Policies   │   │
│                         │     │  │   (Security)     │   │
│                         │     │  └──────────────────┘   │
└─────────────────────────┘     └──────────────────────────┘
```

The frontend is completely static and communicates directly with Supabase APIs.
No backend server is required.
