// Simple in-memory rate limiter — no external dependencies
// Tracks usage per IP with monthly window, auto-cleanup of stale entries

const MONTH_MS = 30 * 24 * 60 * 60 * 1000
const FREE_LIMIT = 5

interface RateEntry {
  count: number
  monthStart: number
}

const store = new Map<string, RateEntry>()

// Cleanup stale entries every 15 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now - entry.monthStart > MONTH_MS) {
      store.delete(key)
    }
  }
}, 15 * 60 * 1000).unref()

function getMonthStart(): number {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime()
}

export function checkRateLimit(key: string): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const monthStart = getMonthStart()
  const entry = store.get(key)

  if (!entry || now - entry.monthStart > MONTH_MS) {
    store.set(key, { count: 1, monthStart })
    return { allowed: true, remaining: FREE_LIMIT - 1, resetTime: monthStart + MONTH_MS }
  }

  if (entry.count >= FREE_LIMIT) {
    return { allowed: false, remaining: 0, resetTime: monthStart + MONTH_MS }
  }

  entry.count++
  return { allowed: true, remaining: FREE_LIMIT - entry.count, resetTime: monthStart + MONTH_MS }
}

export function getRemaining(key: string): number {
  const now = Date.now()
  const monthStart = getMonthStart()
  const entry = store.get(key)
  if (!entry || now - entry.monthStart > MONTH_MS) return FREE_LIMIT
  return Math.max(0, FREE_LIMIT - entry.count)
}
