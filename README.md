# ♻️ RefactorGPT

> Paste messy code. Get clean code + a beautiful before/after card to share.

[![MIT License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](https://github.com/jithindeepjc/refactorgpt/blob/master/LICENSE)
![Tests Passing](https://img.shields.io/badge/28%20tests-passing-brightgreen?style=for-the-badge)
![Self-Host](https://img.shields.io/badge/status-self--host-6a0dad?style=for-the-badge)

---

## 🔥 The Viral Loop

```
           📱 Share on Twitter/LinkedIn
          ╱                           ╲
         ╱                             ╲
   ┌────┴──────┐                ┌───────┴──────┐
   │  Refactor  │  ──── card ──→ │  People see  │
   │   your     │  ←─ visit ─── │  before/after │
   │   code     │                │  & want same │
   └────┬───────┘                └───────┬───────┘
         ╲                             ╱
          ╲                           ╱
           └── 🔄 Everyone shares ──┘
```

**Every card shared on social media is free advertising.**  
The before/after code diff makes developers stop scrolling → they visit → they refactor → they share.

---

## ✨ What It Does

| Before | After |
|--------|-------|
| `function add(a,b){return a+b}` | `const add = (a, b) => a + b;` |
| Messy indentation, trailing spaces | Clean formatting |
| Bugs, security issues | Fixed |
| No comments / too many comments | Just right |

And then **one click** → shareable OG image card with stats:

> "Reduced 47 lines → 31 lines (34% reduction). 4 improvements made."

---

## 🚀 Quick Start

```bash
git clone https://github.com/jithindeepjc/refactorgpt.git
cd refactorgpt
bun install
cp .env.example .env.local
# Edit .env.local with your OpenRouter key

bun run dev
# → http://localhost:3000
```

No login. No signup. Paste code. Done.

Deploy to [Vercel](https://vercel.com) (free) or any Node.js host in one click.

---

## 🧪 Features

- **AI-powered refactoring** — uses `openrouter/free` model (Claude-quality, zero cost)
- **12 languages** — Python, JS, TS, Go, Rust, Java, Ruby, C++, C#, PHP, Swift, Kotlin
- **Syntax highlighting** — Shiki, github-dark theme
- **Before/after diff** — side-by-side code blocks
- **Shareable cards** — OG image with summary + stats (lines reduced, improvements count)
- **One-click copy** — share URL copied to clipboard
- **Free tier** — 5 refactors/month, no credit card
- **Pro tier** — $9/mo unlimited, private cards, no watermark, API access
- **Demo mode** — works entirely without an API key

---

### Running Tests

```bash
bun run test        # 28 tests
bun run test:watch  # Watch mode
```

---

## 📊 Test Suite

| File | Tests | Coverage |
|------|-------|----------|
| `tests/refactor.test.ts` | 11 | API success, retries, validation, demo mode |
| `tests/rate-limit.test.ts` | 8 | Monthly limits, reset, stale cleanup |
| `tests/card-store.test.ts` | 4 | Store, retrieve, expiry |
| `tests/utils.test.ts` | 5 | Prose detection, JSON parsing |

**28/28 passing** — CI-ready.

---

## 🏗️ Architecture

```
refactorgpt/
├── app/
│   ├── api/refactor/        # POST — LLM refactoring (Edge)
│   ├── api/store-card/      # POST — save card data
│   ├── api/create-checkout/ # POST — Stripe checkout
│   ├── card/[id]/           # GET — OG image (Edge)
│   └── page.tsx             # Landing page
├── components/
│   ├── code-input.tsx       # Textarea + language + upgrade
│   ├── refactor-result.tsx  # Before/after + share button
│   └── code-block.tsx       # Shiki highlighting
├── hooks/use-refactor.tsx   # API state + localStorage
├── lib/
│   ├── refactor.ts          # OpenRouter integration + retry
│   ├── rate-limit.ts        # In-memory rate limiter
│   ├── card-store.ts        # Card storage (1hr TTL)
│   └── stripe.ts            # Stripe client + plans
├── middleware.ts            # Edge rate limiter
└── tests/                   # 28 Vitest tests
```

---

## 🔒 Security

- **No login required** — anonymous by design
- **In-memory rate limiting** — no external database needed
- **Input validation** — code length capped, prose rejected, language whitelisted
- **No secrets in repo** — `.env.local` is gitignored
- **Stripe validation** — checks config before creating checkout sessions

---

## 📄 License

MIT — free to use, modify, and share.

---

---

[Report Bug](https://github.com/jithindeepjc/refactorgpt/issues) · [Feature Request](https://github.com/jithindeepjc/refactorgpt/issues)

*Built with Next.js + Shiki + Stripe + OpenRouter*
