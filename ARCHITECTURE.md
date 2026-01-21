# EveLink Architecture

## Vision

A modern Eve Online alliance management platform. Better than AllianceAuth:

- **Next.js** instead of Django
- **ESI as source of truth** instead of database replication
- **Beautiful UI** instead of Bootstrap templates
- **TypeScript** instead of Python

## Design Principle

> Only store what ESI can't tell us.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         EveLink                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Next.js    │    │   Eve SSO    │    │   ESI API    │      │
│  │   Frontend   │◄──►│   OAuth2     │◄──►│   Client     │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                    API Layer                         │       │
│  │              (Next.js API Routes)                    │       │
│  └─────────────────────────────────────────────────────┘       │
│                           │                                      │
│                           ▼                                      │
│  ┌─────────────────────────────────────────────────────┐       │
│  │                   Data Layer                         │       │
│  │         (Database + Session Storage)                 │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      External Services        │
              ├───────────────────────────────┤
              │  • Eve SSO (OAuth2)           │
              │  • ESI API (Game Data)        │
              │  • Eve Image Server           │
              └───────────────────────────────┘
```

---

## MVP Scope

**What we're building first:**

1. Eve SSO login
2. Alliance membership check
3. Character info display (name, portrait, corp, alliance)
4. Dashboard for members only

**What we're NOT building yet:**

- Multi-character linking
- Role management (SRP Officer, FC, etc.)
- External service integration (Discord, Mumble)
- Any database

---

## Core Components

### 1. Authentication Layer

- **Eve SSO OAuth2** - Only auth method
- **Session** - Encrypted cookie (iron-session)
- **Membership Check** - `alliance_id === ALLIANCE_ID` env var

### 2. ESI Integration

- **Character Data** - Name, portrait, corporation, alliance
- Fetched on-demand, cached in session/memory
- No database replication

### 3. Frontend

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State**: React Server Components + minimal client state

### 4. Data Layer

- **Sessions**: Encrypted cookies (iron-session)
- **ESI Cache**: In-memory or session-based
- **No Database** for MVP

**Database triggers (future):**

- Multi-character linking
- App-specific roles (SRP Officer, FC)
- Tenant configuration (multi-alliance)
- App data (SRP records, fleet ops)

---

## External Services

### Eve SSO

| Endpoint | URL |
|----------|-----|
| Authorization | `https://login.eveonline.com/v2/oauth/authorize/` |
| Token | `https://login.eveonline.com/v2/oauth/token` |
| JWKS | `https://login.eveonline.com/oauth/jwks` |

### ESI API

| Endpoint | URL |
|----------|-----|
| Base URL | `https://esi.evetech.net/latest` |
| Character | `/characters/{id}/` |
| Corporation | `/corporations/{id}/` |
| Alliance | `/alliances/{id}/` |
| Images | `https://images.evetech.net` |

---

## Directory Structure

```
EveLink/
├── app/
│   ├── (auth)/              # Auth-related pages
│   │   └── login/
│   ├── (dashboard)/         # Protected pages
│   │   ├── layout.tsx       # Dashboard shell
│   │   ├── page.tsx         # Dashboard home
│   │   └── character/
│   ├── api/
│   │   └── auth/
│   │       ├── login/       # Initiate OAuth
│   │       ├── callback/    # OAuth callback
│   │       ├── logout/      # Clear session
│   │       └── me/          # Current user
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn primitives
│   └── eve/                 # Eve-specific components
│       ├── login-button.tsx
│       ├── character-card.tsx
│       └── character-portrait.tsx
├── lib/
│   ├── eve/
│   │   ├── sso.ts           # OAuth2 helpers
│   │   ├── esi.ts           # ESI API client
│   │   └── types.ts         # Eve data types
│   ├── session.ts           # iron-session config
│   └── utils.ts             # Shared utilities
├── middleware.ts            # Auth protection
└── .env.local               # Secrets
```

---

## Authentication Flow

```
┌────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│ User   │     │ EveLink │     │ Eve SSO  │     │ ESI API │
└───┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
    │               │               │                │
    │ Click Login   │               │                │
    ├──────────────►│               │                │
    │               │               │                │
    │               │ Redirect      │                │
    │◄──────────────┤──────────────►│                │
    │               │               │                │
    │         Login & Authorize     │                │
    ├──────────────────────────────►│                │
    │               │               │                │
    │               │◄──────────────┤                │
    │               │  code + state │                │
    │               │               │                │
    │               │ Exchange code │                │
    │               ├──────────────►│                │
    │               │◄──────────────┤                │
    │               │ access_token  │                │
    │               │               │                │
    │               │ Get character │                │
    │               ├───────────────────────────────►│
    │               │◄───────────────────────────────┤
    │               │ character data│                │
    │               │               │                │
    │◄──────────────┤               │                │
    │ Set session   │               │                │
    │ Redirect to   │               │                │
    │ dashboard     │               │                │
    │               │               │                │
```

---

## Security Considerations

- **CSRF Protection**: Random state parameter in OAuth flow
- **Token Storage**: Encrypted in httpOnly cookies (iron-session)
- **Secret Management**: Environment variables only
- **JWT Verification**: Validate signature against Eve JWKS
- **Token Refresh**: Auto-refresh before expiry

---

## Future Modules

| Module | Description | Priority |
|--------|-------------|----------|
| Multi-character | Link multiple characters to one account | High |
| Corporation Services | Corp member management, roles | High |
| Alliance Services | Alliance-wide features | Medium |
| SRP (Ship Replacement) | Track losses, manage payouts | Medium |
| Fleet Operations | Fleet tracking, participation | Medium |
| Structure Management | Citadel fuel, timers | Low |
| Market Tools | Price checks, trade tools | Low |

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Auth | Custom Eve SSO OAuth2 |
| Sessions | iron-session (encrypted cookies) |
| JWT | jose |
| Package Manager | Bun |

**No database, no Redis, no external state storage.** Everything lives in the session cookie or comes from ESI.

---

## Environment Variables (MVP)

```bash
# Eve SSO (from developers.eveonline.com)
EVE_CLIENT_ID=your_client_id
EVE_CLIENT_SECRET=your_client_secret
EVE_CALLBACK_URL=http://localhost:3000/api/auth/callback

# Alliance restriction
ALLIANCE_ID=123456789  # Your alliance's ID from ESI

# Session encryption
SESSION_SECRET=random_32_character_string
```
