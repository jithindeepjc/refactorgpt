# RefactorGPT — Complete Project Report

## Overview
Single-page web app that refactors messy code via LLM and generates shareable before/after OG image cards for social media. Viral loop: the card IS the advertisement.

## Stack
- **Framework**: Next.js 14 App Router + TypeScript
- **Styling**: Tailwind CSS, dark theme (zinc palette)
- **AI**: OpenRouter API (`openrouter/free` model) with retry logic, timeout, demo mode
- **Syntax Highlighting**: Shiki (12 languages, github-dark theme)
- **Payments**: Stripe Checkout (subscription, $9/mo Pro)
- **Card Images**: Satori + `next/og` (Edge Runtime)
- **Rate Limiting**: In-memory Map (5 refactors/month/IP)
- **Testing**: Vitest (28 tests)
- **Runtime**: Bun

## Project Structure
```
refactorgpt/
├── app/
│   ├── api/
│   │   ├── refactor/route.ts      — POST: refactor code via LLM
│   │   ├── store-card/route.ts    — POST: save card data, return ID
│   │   └── create-checkout/route.ts — POST: Stripe checkout session
│   ├── card/[id]/route.tsx        — GET: OG image for shared card
│   ├── success/page.tsx           — Stripe success page
│   ├── page.tsx                   — Landing page (code input + result)
│   └── layout.tsx                 — Root layout + metadata
├── components/
│   ├── code-input.tsx             — Textarea + language selector + upgrade CTA
│   ├── refactor-result.tsx        — Before/after display + share button
│   └── code-block.tsx             — Shiki syntax highlighted code block
├── hooks/
│   └── use-refactor.tsx           — Context provider: API calls, localStorage
├── lib/
│   ├── refactor.ts                — LLM integration (OpenRouter, retry, demo)
│   ├── rate-limit.ts              — In-memory monthly rate limiter
│   ├── card-store.ts              — In-memory card storage (1hr TTL)
│   └── stripe.ts                  — Stripe client + plan config
├── middleware.ts                  — Rate limiter for /api/refactor
├── tests/
│   ├── refactor.test.ts           — 11 tests: success, retry, validation, demo
│   ├── rate-limit.test.ts         — 8 tests: limits, reset, cleanup
│   ├── card-store.test.ts         — 4 tests: store, retrieve, expiry
│   └── utils.test.ts              — 5 tests: prose detection, JSON parsing
├── .env.example                   — Required: OPENROUTER_API_KEY
└── .env.local                     — Local overrides (gitignored)
```

## Data Flow
```
User pastes code → POST /api/refactor → rate limit check (middleware)
  → OpenRouter API (with retry) → parse JSON response
  → Display before/after + improvements
  → Click "Share" → POST /api/store-card → returns 8-char ID
  → URL copied: refactor.sh/card/{id} → OG image renders
```

## Pricing
| Plan | Price | Refactors | Features |
|------|-------|-----------|----------|
| Free | $0 | 5/month | Public cards with watermark, basic highlighting |
| Pro | $9/mo | Unlimited | Private cards, no watermark, priority support, API access |
| Teams | $19/mo | Unlimited | Everything in Pro, team workspaces, custom branding |

## All Routes
| Route | Type | Purpose |
|-------|------|---------|
| `/` | Static | Landing page |
| `/api/refactor` | Edge POST | Code refactoring |
| `/api/store-card` | Node POST | Save card data |
| `/api/create-checkout` | Node POST | Stripe checkout |
| `/card/[id]` | Edge GET | OG image |
| `/success` | Static | Post-purchase |

## Test Coverage (28/28 passing)
| Test File | Tests | What It Covers |
|-----------|-------|----------------|
| `refactor.test.ts` | 11 | Success path, retry (429/5xx/timeout), input validation, prose detection, payload shape |
| `rate-limit.test.ts` | 8 | Allowed/blocked states, monthly reset, remaining count, stale cleanup |
| `card-store.test.ts` | 4 | Store, retrieve by ID, expiry, missing ID |
| `utils.test.ts` | 5 | Prose detection thresholds, JSON parsing from markdown, raw JSON |

## Security
- Rate limiting: 5 req/month/IP (in-memory, no external deps)
- Input validation: code length ≤ 10K chars, prose detection, language whitelist
- Card store: 500KB body limit, type validation, 1hr auto-expiry
- Stripe: env var validation before session creation
- No auth tokens exposed, no user data stored (anonymous)

## Environment Variables
| Var | Required | Purpose |
|-----|----------|---------|
| `OPENROUTER_API_KEY` | Yes | LLM API key |
| `STRIPE_SECRET_KEY` | No (Pro only) | Stripe payments |
| `STRIPE_PRICE_PRO` | No (Pro only) | Pro price ID |
| `STRIPE_PRICE_TEAMS` | No (Teams only) | Teams price ID |

## Known Gaps
- No database (in-memory only — cards lost on restart, rate limits reset)
- No auth (anonymous only — Pro upgrades have no account linkage)
- No automated browser tests
- Stripe webhook not implemented (no subscription management)

## Domain
`refactor.sh` — configured for Vercel Hobby deployment

## Commands
```bash
# Dev
bun run dev

# Tests
bun run test

# Build
bun run build
```
