# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev          # Start development server
bun build        # Production build
bun lint         # Run ESLint
bun db:generate  # Generate Drizzle migrations
bun db:migrate   # Run migrations
bun db:push      # Push schema changes directly (dev only)
```

## Environment Variables

Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - iron-session encryption key
- `EVE_CLIENT_ID` - EVE SSO application client ID
- `EVE_CLIENT_SECRET` - EVE SSO application secret
- `EVE_CALLBACK_URL` - OAuth callback URL (e.g., `http://localhost:3000/api/auth/callback`)
- `EVE_CONTACT_EMAIL` - Contact email for ESI User-Agent header
- `ALLIANCE_ID` (optional) - Restrict access to specific alliance

## Architecture

### Authentication Flow

1. User clicks login → `GET /api/auth/login` generates state and redirects to EVE SSO
2. EVE redirects back → `GET /api/auth/callback` exchanges code for tokens
3. JWT verified via EVE's JWKS endpoint, character info fetched from ESI
4. Session stored in encrypted iron-session cookie
5. Optional alliance restriction checked via `ALLIANCE_ID` env var

### Data Model

**Users** have many **Characters**. A user is created on first login and can link additional EVE characters (alts) to their account. Each character stores its own OAuth tokens for ESI access.

- `users` - UUID-identified accounts with optional primary character
- `characters` - EVE characters (keyed by EVE character ID) with tokens and cached ESI data

### Token Management

`lib/tokens.ts:getValidAccessToken()` handles automatic token refresh. Check expiry with 60s buffer, refresh if needed, update DB, return valid token.

### ESI Integration

`lib/esi.ts` provides typed wrappers for EVE Swagger Interface:
- Public endpoints: character info, corporation, alliance, races, bloodlines
- Authenticated endpoints: wallet balance (requires valid access token)
- `getAggregateWealth()` aggregates wallet across all linked characters

### Key Directories

- `app/(dashboard)/` - Protected dashboard routes (session check in layout)
- `app/(auth)/` - Login page
- `app/api/auth/` - Auth endpoints (login, callback, logout, add-character, switch-character)
- `lib/` - Core utilities (session, eve-sso, esi, tokens)
- `db/` - Drizzle schema and queries
- `types/` - TypeScript types for ESI responses, session, DB models
- `components/eve/` - EVE-specific UI (character cards, badges)
- `components/dashboard/` - Dashboard panels and cards
- `components/backgrounds/` - Visual effects (starfield, nebula, scanlines)

## Coding Style

- Always use arrow functions, never `function` declarations
- Use `type` over `interface`
- Never write comments
