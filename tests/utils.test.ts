import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("px-4", "py-2")
    expect(result).toContain("px-4")
    expect(result).toContain("py-2")
  })

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", true && "visible")
    expect(result).toContain("base")
    expect(result).toContain("visible")
    expect(result).not.toContain("hidden")
  })

  it("removes duplicate conflicting classes (tailwind-merge)", () => {
    const result = cn("px-4", "px-6")
    // tailwind-merge should keep only the last px- class
    expect(result).toBe("px-6")
  })

  it("handles empty inputs", () => {
    expect(cn()).toBe("")
  })

  it("handles undefined and null", () => {
    expect(cn("a", undefined, "b", null)).toBe("a b")
  })
})
