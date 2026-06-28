import { describe, it, expect, beforeEach } from "vitest"
import { checkRateLimit, getRemaining } from "@/lib/rate-limit"

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Clear the internal store by calling checkRateLimit on a new key each test
  })

  it("allows first request for a new key", () => {
    const result = checkRateLimit("test:user-1")
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it("decrements remaining on each request", () => {
    const key = "test:user-2"
    expect(checkRateLimit(key).remaining).toBe(4)
    expect(checkRateLimit(key).remaining).toBe(3)
    expect(checkRateLimit(key).remaining).toBe(2)
  })

  it("blocks after 5 requests", () => {
    const key = "test:user-3"
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key)
    }
    const result = checkRateLimit(key)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it("allows different keys independently", () => {
    const keyA = "test:user-a"
    const keyB = "test:user-b"
    for (let i = 0; i < 5; i++) {
      checkRateLimit(keyA)
    }
    expect(checkRateLimit(keyA).allowed).toBe(false)
    const resultB = checkRateLimit(keyB)
    expect(resultB.allowed).toBe(true)
    expect(resultB.remaining).toBe(4)
  })

  it("includes a resetTime in the future", () => {
    const result = checkRateLimit("test:reset-time")
    expect(result.resetTime).toBeGreaterThan(Date.now())
  })
})

describe("getRemaining", () => {
  it("returns FREE_LIMIT for unknown keys", () => {
    expect(getRemaining("unknown:key")).toBe(5)
  })

  it("returns correct remaining after some requests", () => {
    const key = "test:remaining-1"
    checkRateLimit(key)
    checkRateLimit(key)
    expect(getRemaining(key)).toBe(3)
  })

  it("returns 0 when exhausted", () => {
    const key = "test:remaining-2"
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key)
    }
    expect(getRemaining(key)).toBe(0)
  })
})
