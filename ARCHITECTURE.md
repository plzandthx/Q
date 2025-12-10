# Q CSAT Architecture

## Overview

Q CSAT is a customer satisfaction tracking platform deployed as a **static frontend** on GitHub Pages with **Supabase** handling all backend functionality.

## Current Architecture (Supabase-First)

```
                    GitHub Pages                    Supabase
                    ┌──────────────┐               ┌─────────────────────┐
                    │              │               │                     │
User ───────────────► Static Site  ├───────────────►  Auth (OAuth, PWD) │
                    │  (Next.js)   │               │  PostgreSQL DB      │
                    │              │               │  RLS Policies       │
                    └──────────────┘               │  Real-time          │
                                                   └─────────────────────┘
```

### Key Components

1. **Frontend** (`/frontend`)
   - Next.js 14 with static export
   - Deployed to GitHub Pages at `/Q`
   - Uses Supabase JS client for all data operations
   - Client-side authentication via Supabase Auth

2. **Database** (Supabase)
   - PostgreSQL with Row-Level Security (RLS)
   - All tables defined in `/frontend/lib/supabase/database.types.ts`
   - RLS policies in `/supabase/rls-policies.sql`

3. **Authentication** (Supabase Auth)
   - Email/password authentication
   - Google OAuth
   - GitHub OAuth
   - Session management handled by Supabase

## Deprecated Backend (Legacy)

The following directories contain a **legacy Express.js backend** that has been superseded by the Supabase-first architecture:

### Deprecated Files (Safe to Remove)

| Directory/File | Purpose | Supabase Replacement |
|----------------|---------|---------------------|
| `/src/` | Express.js API server | Supabase direct queries |
| `/prisma/` | Prisma ORM & migrations | Supabase DB + migrations |
| `/infra/` | Docker deployment | N/A (static hosting) |
| `/tests/` | Backend tests | N/A |
| Root `package.json` | Backend dependencies | N/A |
| `tsconfig.json` (root) | Backend TypeScript config | N/A |

### Why This Changed

1. **GitHub Pages Compatibility**: GitHub Pages only serves static content
2. **Simplified Architecture**: Supabase provides auth, database, and RLS out of the box
3. **Reduced Complexity**: No need to manage separate backend infrastructure
4. **Cost Efficiency**: No server hosting costs - just Supabase (free tier available)

### What the Legacy Backend Provided

- Express.js REST API
- Prisma ORM for PostgreSQL
- Custom JWT authentication
- Redis session management
- Email service (Nodemailer)
- Rate limiting
- Webhook handlers

All of these are now handled by:
- **Supabase Auth**: Authentication and sessions
- **Supabase Database**: Direct queries with RLS
- **Supabase Edge Functions**: For any server-side logic needed (optional)
- **Supabase Realtime**: For live updates

## Keeping the Backend (Optional)

If you need the Express backend for:
- Custom webhook processing
- Complex server-side business logic
- Third-party integrations (Zendesk, GA4, etc.)

You can deploy it separately to:
- Railway
- Render
- Fly.io
- Any Docker-compatible host

The frontend will continue to work with just Supabase for basic CRUD operations.

## Environment Variables

### Frontend (Required for GitHub Pages)

Set these as GitHub Secrets:

```
NEXT_PUBLIC_SUPABASE_URL     - Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY - Your Supabase anon/public key
```

### Backend (Only if deploying separately)

See `/env.example` for full list.
