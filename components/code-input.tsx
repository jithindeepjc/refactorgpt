"use client"
import { useState } from "react"
import { useRefactor } from "@/hooks/use-refactor"

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Go", "Rust",
  "Java", "Ruby", "C++", "C#", "PHP", "Swift", "Kotlin",
]

export function CodeInput() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("Python")
  const { refactor, loading, remaining } = useRefactor()
  const limitReached = remaining <= 0
  const canRefactor = code.trim().length > 0 && !loading && !limitReached

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-zinc-400">Paste your code</label>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${remaining > 0 ? "text-zinc-500" : "text-amber-500"}`}>
            {remaining} / 5 free refactors left
          </span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder='def add(a, b):\n    return a + b\n\nprint(add(1, 2))'
        className="min-h-[280px] w-full rounded-lg border border-zinc-800 bg-zinc-900 p-4 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
      />
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-zinc-600">{code.length} / 10000 chars</span>
        <button
          onClick={() => refactor(code, language)}
          disabled={!canRefactor}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "✨ Refactoring..." : limitReached ? "Refactor ✨" : "Refactor ✨"}
        </button>
      </div>
      {limitReached && (
        <div className="mt-3 rounded-lg border border-amber-800/30 bg-amber-950/20 p-3 text-center">
          <p className="text-xs text-amber-400">
            Free limit reached — 5 refactors per month. Upgrade to Pro for unlimited.
          </p>
        </div>
      )}
    </div>
  )
}
