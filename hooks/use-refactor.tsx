"use client"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { RefactorResult } from "@/lib/refactor"

interface RefactorContextValue {
  result: RefactorResult | null
  language: string
  loading: boolean
  error: string | null
  refactor: (code: string, language: string) => Promise<void>
  reset: () => void
}

const RefactorContext = createContext<RefactorContextValue | null>(null)

export function RefactorProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<RefactorResult | null>(null)
  const [language, setLanguage] = useState("Python")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refactor = useCallback(async (code: string, lang: string) => {
    setLoading(true)
    setError(null)
    setLanguage(lang)
    try {
      const res = await fetch("/api/refactor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: lang }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Refactoring failed")
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return (
    <RefactorContext.Provider value={{ result, language, loading, error, refactor, reset }}>
      {children}
    </RefactorContext.Provider>
  )
}

export function useRefactor() {
  const ctx = useContext(RefactorContext)
  if (!ctx) throw new Error("useRefactor must be used within RefactorProvider")
  return ctx
}
