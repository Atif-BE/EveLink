# EveLink User Flows & Roles

## Design Philosophy

**ESI is the source of truth.** We don't replicate what ESI already knows.

Unlike AllianceAuth (which pre-computes states/groups in a database), EveLink checks membership on-demand via ESI. We only store what ESI *can't* tell us.

---

## MVP Access Model

Dead simple. One check:

```
character.alliance_id === process.env.ALLIANCE_ID
  ? MEMBER (full access)
  : DENIED (no access)
```

**No states. No groups. No database. One env var.**

---

## MVP User Flow

```
User visits EveLink
       │
       ▼
Click "Login with Eve Online"
       │
       ▼
Eve SSO → Select character → Authorize
       │
       ▼
Callback: Extract character_id from JWT
       │
       ▼
ESI: Fetch /characters/{id}/ → get alliance_id
       │
       ▼
┌─────────────────────────────────────────┐
│ alliance_id === CONFIGURED_ALLIANCE_ID? │
├─────────────────────────────────────────┤
│ YES → Create session → Dashboard        │
│ NO  → "Not a member" error → Redirect   │
└─────────────────────────────────────────┘
```

---

## Future: Multi-Tenancy Model

When we expand beyond single alliance:

```
┌─────────────────────────────────────────────────────┐
│                    EveLink SaaS                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Tenant: TEST Alliance        Tenant: Goonswarm     │
│  ┌─────────────────────┐     ┌─────────────────────┐│
│  │ Alliance: 123456    │     │ Alliance: 789012    ││
│  │ Admins: [char_ids]  │     │ Admins: [char_ids]  ││
│  │ Settings: {...}     │     │ Settings: {...}     ││
│  └─────────────────────┘     └─────────────────────┘│
│                                                      │
└─────────────────────────────────────────────────────┘
```

This requires a database** - to store tenant configuration, not membership.

---

## Role Progression

### MVP (No Database)

| Role | How Determined |
|------|----------------|
| Member | `alliance_id` matches (from ESI) |
| Non-member | Everyone else (denied) |

### Phase 2 (With Database)

| Role | How Determined |
|------|----------------|
| Member | `alliance_id` matches |
| Admin | Stored in DB, assigned by alliance executor |
| SRP Officer | Stored in DB |
| FC | Stored in DB |

### Phase 3 (Multi-Tenant)

| Role | How Determined |
|------|----------------|
| Super Admin | Platform owner |
| Tenant Admin | Alliance executor/delegates |
| Member | In tenant's configured alliance |

---

## ESI Data We Use (MVP)

All from ESI, nothing stored:

| Data | Endpoint | Cached |
|------|----------|--------|
| Character name | `/characters/{id}/` | Session |
| Corporation | `/corporations/{id}/` | 1 hour |
| Alliance | `/alliances/{id}/` | 1 hour |
| Portrait | `images.evetech.net` | Browser |

---

## What Requires a Database (Future)

Only store what ESI can't tell us:

| Feature | Why DB Needed |
|---------|---------------|
| App-specific roles | ESI doesn't know who's an "SRP Officer" |
| Multi-character linking | ESI doesn't link alts |
| Tenant configuration | Which alliances are registered |
| SRP records | App-specific data |
| Fleet ops | App-specific data |
| Audit logs | App-specific data |

---

## Scopes

### MVP

- `publicData` only - enough for character/corp/alliance info

### Future (when needed)

| Feature | Scope |
|---------|-------|
| Corp members list | `esi-corporations.read_corporation_membership.v1` |
| Corp roles | `esi-corporations.read_titles.v1` |
| Wallet | `esi-wallet.read_character_wallet.v1` |
| Location | `esi-location.read_location.v1` |
