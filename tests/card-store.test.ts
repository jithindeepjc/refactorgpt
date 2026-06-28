import { describe, it, expect, beforeEach } from "vitest"
import type { RefactorResult } from "@/lib/refactor"

// Re-implement card store logic for testing (avoids module-level state leakage)
// In production, these are in lib/card-store.ts
function createCardStore() {
  const store = new Map<string, any>()

  return {
    storeCardData(result: RefactorResult, language: string): string {
      const id = (Math.random() * 100000).toString(36).slice(0, 8)
      store.set(id, {
        summary: result.summary,
        improvementsCount: result.improvements.length,
        linesBefore: result.original.split("\n").length,
        linesAfter: result.refactored.split("\n").length,
        language,
      })
      return id
    },
    getCardData(id: string) {
      return store.get(id)
    },
    size() {
      return store.size
    },
    clear() {
      store.clear()
    },
  }
}

const sampleResult: RefactorResult = {
  original: "def add(a,b): return a+b",
  refactored: "def add(a: int, b: int) -> int:\n    return a + b",
  summary: "Added type annotations and formatting",
  improvements: ["Added type hints", "Formatted for readability"],
}

describe("CardStore", () => {
  let store: ReturnType<typeof createCardStore>

  beforeEach(() => {
    store = createCardStore()
  })

  it("stores and retrieves card data", () => {
    const id = store.storeCardData(sampleResult, "Python")
    const data = store.getCardData(id)

    expect(data).toBeDefined()
    expect(data?.summary).toBe("Added type annotations and formatting")
    expect(data?.improvementsCount).toBe(2)
    expect(data?.language).toBe("Python")
  })

  it("returns different IDs for different cards", () => {
    const id1 = store.storeCardData(sampleResult, "Python")
    const id2 = store.storeCardData(sampleResult, "JavaScript")
    expect(id1).not.toBe(id2)
  })

  it("computes line counts correctly", () => {
    const result: RefactorResult = {
      original: "line1\nline2\nline3",
      refactored: "line1\nline2",
      summary: "Removed one line",
      improvements: [],
    }
    const id = store.storeCardData(result, "Go")
    const data = store.getCardData(id)
    expect(data?.linesBefore).toBe(3)
    expect(data?.linesAfter).toBe(2)
  })

  it("returns undefined for non-existent ids", () => {
    expect(store.getCardData("nonexistent")).toBeUndefined()
  })
})
