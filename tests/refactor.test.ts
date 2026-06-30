import { describe, it, expect, vi, beforeEach } from "vitest"
import { refactorCode } from "@/lib/refactor"

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const VALID_CODE = "function add(a, b) {\n  return a + b\n}"
const VALID_CODE_SHORT = "function f() {\n  return 1\n}"

beforeEach(() => {
  vi.clearAllMocks()
  process.env.OPENROUTER_API_KEY = "test-key-123"
})

function mockAPISuccess(overrides = {}) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({
      choices: [{
        message: {
          content: JSON.stringify({
            refactored: "function add(a: number, b: number): number {\n  return a + b\n}",
            summary: "Added type annotations",
            improvements: ["Added type hints"],
            ...overrides,
          }),
        },
      }],
    }),
  })
}

function mockAPIError(status: number) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    text: async () => "API error",
    headers: {
      get: () => null,
    },
  })
}

describe("refactorCode", () => {
  it("refactors valid code successfully", async () => {
    mockAPISuccess()
    const result = await refactorCode(VALID_CODE, "JavaScript")

    expect(result.original).toBe(VALID_CODE)
    expect(result.refactored).toContain("function add")
    expect(result.summary).toBe("Added type annotations")
    expect(result.improvements).toHaveLength(1)
  })

  it("uses demo mode when no API key configured", async () => {
    delete process.env.OPENROUTER_API_KEY
    const result = await refactorCode(VALID_CODE_SHORT, "JavaScript")
    expect(result.refactored).toContain("Demo mode")
    expect(result.improvements).toContain("Added demo mode header")
    expect(result.original).toBe(VALID_CODE_SHORT)
  })

  it("rejects empty code", async () => {
    await expect(refactorCode("", "JavaScript")).rejects.toThrow("No code provided")
  })

  it("rejects whitespace-only code", async () => {
    await expect(refactorCode("   \n  ", "JavaScript")).rejects.toThrow("No code provided")
  })

  it("rejects code over 10000 chars", async () => {
    const longCode = "a".repeat(10001)
    await expect(refactorCode(longCode, "JavaScript")).rejects.toThrow("max 10,000")
  })

  it("warns if input looks like prose not code", async () => {
    const prose = "I think the application should have a better user interface"
    await expect(refactorCode(prose, "JavaScript")).rejects.toThrow("looks like prose")
  })

  it("retries on 429 rate limit then succeeds", async () => {
    mockAPIError(429)
    mockAPISuccess()

    const result = await refactorCode(VALID_CODE_SHORT, "JavaScript")
    expect(result.refactored).toContain("function add")
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("retries on 5xx errors then succeeds", async () => {
    mockAPIError(503)
    mockAPISuccess()

    const result = await refactorCode(VALID_CODE_SHORT, "JavaScript")
    expect(result.refactored).toContain("function add")
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  it("fails after exhausting retries", async () => {
    mockAPIError(503)
    mockAPIError(503)
    mockAPIError(503)

    await expect(refactorCode(VALID_CODE_SHORT, "JavaScript")).rejects.toThrow()
    expect(mockFetch).toHaveBeenCalledTimes(3)
  }, 15000)

  it("handles timeout (AbortError) with retry", async () => {
    const abortError = new Error("The operation was aborted")
    abortError.name = "AbortError"
    mockFetch.mockRejectedValueOnce(abortError)
    mockAPISuccess()

    const result = await refactorCode(VALID_CODE_SHORT, "JavaScript")
    expect(result).toBeDefined()
    expect(mockFetch).toHaveBeenCalledTimes(2)
  }, 15000)

  it("calls the OpenRouter API with correct payload", async () => {
    mockAPISuccess()
    await refactorCode(VALID_CODE_SHORT, "JavaScript")

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[0]).toBe("https://openrouter.ai/api/v1/chat/completions")

    const body = JSON.parse(callArgs[1].body as string)
    expect(body.model).toBe("openrouter/free")
    expect(body.messages).toHaveLength(2)
    expect(body.messages[1].content).toContain("JavaScript")
  })
})
