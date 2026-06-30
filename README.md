<div align="center">
  <br/>
  <h1>♻️ RefactorGPT</h1>
  <p><strong>Paste messy code. Get clean code + a beautiful before/after card to share.</strong></p>

  <p>
    <a href="https://refactor.sh" target="_blank">
      <img src="https://img.shields.io/badge/try%20it-free-blue?style=for-the-badge" alt="Try it free"/>
    </a>
    <a href="https://github.com/jithindeepjc/refactorgpt/blob/master/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License"/>
    </a>
    <img src="https://img.shields.io/badge/28%20tests-passing-brightgreen?style=for-the-badge" alt="Tests Passing"/>
  </p>

  <br/>
</div>

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

## 🚀 Try It Now

**[→ refactor.sh](https://refactor.sh)** — No login. No signup. Paste code. Done.

5 free refactors per month. Upgrade to Pro ($9/mo) for unlimited.

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

## 📦 Local Setup

```bash
git clone https://github.com/jithindeepjc/refactorgpt.git
cd refactorgpt
bun install

# Get a free API key at https://openrouter.ai/keys
cp .env.example .env.local
# Edit .env.local with your key

bun run dev
# → http://localhost:3000
```

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

<div align="center">
  <p>
    <a href="https://refactor.sh"><strong>refactor.sh</strong></a> ·
    <a href="https://github.com/jithindeepjc/refactorgpt/issues">Report Bug</a> ·
    <a href="https://github.com/jithindeepjc/refactorgpt/issues">Feature Request</a>
  </p>
  <p>
    <sub>Built with Next.js + Shiki + Stripe + OpenRouter · Deployed on Vercel</sub>
  </p>
  <br/>
</div>
