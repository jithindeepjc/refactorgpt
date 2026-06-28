"use client"
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { RefactorResult } from "@/lib/refactor"

const FREE_LIMIT = 5
const STORAGE_KEY = "refactorgpt-remaining"

interface RefactorContextValue {
  result: RefactorResult | null
  language: string
  loading: boolean
  error: string | null
  remaining: number
  refactor: (code: string, language: string) => Promise<void>
  reset: () => void
}

const RefactorContext = createContext<RefactorContextValue | null>(null)

function getStoredRemaining(): number {
  if (typeof window === "undefined") return FREE_LIMIT
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return FREE_LIMIT
  try {
    const { remaining, month } = JSON.parse(raw)
    const currentMonth = new Date().toISOString().slice(0, 7)
    if (month !== currentMonth) return FREE_LIMIT
    return remaining
  } catch {
    return FREE_LIMIT
  }
}

function setStoredRemaining(remaining: number) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    remaining,
    month: new Date().toISOString().slice(0, 7),
  }))
}

export function RefactorProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<RefactorResult | null>(null)
  const [language, setLanguage] = useState("Python")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remaining, setRemaining] = useState(FREE_LIMIT)

  useEffect(() => {
    setRemaining(getStoredRemaining())
  }, [])

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

      const remainingHeader = res.headers.get("X-RateLimit-Remaining")
      if (remainingHeader !== null) {
        const r = parseInt(remainingHeader, 10)
        setRemaining(r)
        setStoredRemaining(r)
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(data.error || `Request failed (${res.status})`)
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
    <RefactorContext.Provider value={{ result, language, loading, error, remaining, refactor, reset }}>
      {children}
    </RefactorContext.Provider>
  )
}

export function useRefactor() {
  const ctx = useContext(RefactorContext)
  if (!ctx) throw new Error("useRefactor must be used within RefactorProvider")
  return ctx
}
