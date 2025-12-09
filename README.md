# Q CSAT Dashboard

Enterprise-ready, multi-tenant SaaS platform for customer satisfaction tracking and feedback management.

## Overview

Q CSAT Dashboard enables organizations to:
- Create **Projects** representing products or businesses
- Define **Personas** for user segmentation
- Map **Moments That Matter** representing key customer experiences
- Collect CSAT scores via embeddable widgets
- Ingest feedback from external sources (Zendesk, App Store, Play Store, GA4)
- Push actionable insights to work management tools (Jira, Asana, Monday, etc.)

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Argon2 password hashing, JWT tokens, secure sessions
- **API Style**: REST with Zod validation
- **Multi-tenancy**: Organization-scoped with RLS-ready design

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Q

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# At minimum, set:
# - DATABASE_URL
# - JWT_SECRET (32+ characters)
# - SESSION_SECRET (32+ characters)

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database (optional, for demo data)
npm run db:seed

# Start development server
npm run dev
```

The API will be available at `http://localhost:3001`.

### Demo Credentials

After seeding, you can login with:
- **Email**: demo@example.com
- **Password**: Demo1234!

## Project Structure

```
/
├── src/
│   ├── config/           # Configuration management
│   ├── lib/              # Core utilities (prisma, crypto, jwt, errors, logger)
│   ├── middleware/       # Express middleware (auth, error handling, rate limiting)
│   ├── routes/           # API route handlers
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Business logic layer
│   └── index.ts          # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── setup.ts          # Test configuration
└── infra/
    └── docker-compose.yml
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout current session |
| POST | `/api/auth/logout-all` | Logout all sessions |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/change-password` | Change password (auth required) |

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | List user's organizations |
| POST | `/api/organizations` | Create organization |
| GET | `/api/organizations/:orgId` | Get organization |
| PATCH | `/api/organizations/:orgId` | Update organization |
| DELETE | `/api/organizations/:orgId` | Delete organization |
| GET | `/api/organizations/:orgId/members` | List members |
| POST | `/api/organizations/:orgId/members` | Invite member |
| PATCH | `/api/organizations/:orgId/members/:memberId` | Update member role |
| DELETE | `/api/organizations/:orgId/members/:memberId` | Remove member |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations/:orgId/projects` | List projects |
| POST | `/api/organizations/:orgId/projects` | Create project |
| GET | `/api/organizations/:orgId/projects/:projectId` | Get project |
| PATCH | `/api/organizations/:orgId/projects/:projectId` | Update project |
| DELETE | `/api/organizations/:orgId/projects/:projectId` | Delete project |

### Personas & Moments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `.../:projectId/personas` | List personas |
| POST | `.../:projectId/personas` | Create persona |
| PATCH | `.../:projectId/personas/:personaId` | Update persona |
| DELETE | `.../:projectId/personas/:personaId` | Delete persona |
| GET | `.../:projectId/moments` | List moments |
| POST | `.../:projectId/moments` | Create moment |
| PUT | `.../:projectId/moments/reorder` | Reorder moments |
| PATCH | `.../:projectId/moments/:momentId` | Update moment |
| DELETE | `.../:projectId/moments/:momentId` | Delete moment |

### CSAT Widgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `.../:projectId/widgets` | List widgets |
| POST | `.../:projectId/widgets` | Create widget |
| GET | `.../:projectId/widgets/:widgetId` | Get widget |
| PATCH | `.../:projectId/widgets/:widgetId` | Update widget |
| DELETE | `.../:projectId/widgets/:widgetId` | Delete widget |

### CSAT Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `.../:projectId/csat/overview` | Get CSAT overview |
| GET | `.../:projectId/csat/moments` | Get CSAT by moment |
| GET | `.../:projectId/csat/responses` | List responses |

### Public Endpoints (Unauthenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/widget/:publicKey` | Get widget config |
| POST | `/api/public/csat/:publicKey/submit` | Submit CSAT response |

### Integrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/integrations/catalog` | List integration types |
| GET | `.../:orgId/integrations` | List integrations |
| POST | `.../:orgId/integrations` | Create integration |
| PUT | `.../integrations/:integrationId/connection` | Configure connection |
| DELETE | `.../integrations/:integrationId/connection` | Disconnect |

### Webhooks

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks/zendesk/:integrationId` | Zendesk webhook |
| POST | `/api/webhooks/app-store/:integrationId` | App Store webhook |
| POST | `/api/webhooks/play-store/:integrationId` | Play Store webhook |

## Security

### Authentication
- Passwords hashed with Argon2id
- JWT access tokens (7-day expiry by default)
- Refresh tokens for token renewal
- Secure HttpOnly cookies

### Multi-Tenancy
- All data scoped by `organizationId`
- Queries always filtered by organization
- RLS-ready database design

### RBAC
- **OWNER**: Full access, billing, transfer ownership
- **ADMIN**: Manage integrations, settings, members
- **MEMBER**: Create/edit projects, widgets
- **VIEWER**: Read-only access

### Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- API: 100 requests per minute
- Widget submissions: 10 per minute per IP

## Development

```bash
# Run development server with hot reload
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Database
npm run db:studio      # Open Prisma Studio
npm run db:generate    # Generate client
npm run db:migrate     # Run migrations
npm run db:push        # Push schema changes
npm run db:seed        # Seed database
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret (32+ chars) |
| `SESSION_SECRET` | Yes | Session secret (32+ chars) |
| `REDIS_URL` | No | Redis connection string |
| `ENCRYPTION_KEY` | No | Key for encrypting tokens (32+ chars) |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/staging/production) |

See `.env.example` for all available options.

## Deployment

### Docker

```bash
# Build image
docker build -t q-csat .

# Run with docker-compose
cd infra
docker-compose up -d
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure secure secrets (JWT, encryption keys)
- [ ] Set up PostgreSQL with connection pooling
- [ ] Configure Redis for caching/sessions
- [ ] Enable HTTPS via reverse proxy
- [ ] Set up monitoring/alerting
- [ ] Configure backup strategy

## License

Proprietary - All rights reserved.
