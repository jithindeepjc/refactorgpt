"use client"
import { useRefactor } from "@/hooks/use-refactor"

function CodeBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Copy
        </button>
      </div>
      <pre className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 overflow-x-auto text-sm leading-relaxed max-h-[400px] overflow-y-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function RefactorResult() {
  const { result, language, error, reset } = useRefactor()

  if (error) {
    return (
      <div className="mt-6 rounded-lg border border-red-800/30 bg-red-950/20 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-lg border border-emerald-800/30 bg-emerald-950/20 p-4">
        <p className="text-sm text-emerald-400">{result.summary}</p>
      </div>

      {result.improvements.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Improvements made</h3>
          <ul className="space-y-1">
            {result.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <CodeBlock code={result.original} label="Before" />
        <div className="hidden md:flex items-center text-zinc-600 text-lg justify-center">→</div>
        <CodeBlock code={result.refactored} label="After" />
      </div>

      <div className="text-center pt-4 border-t border-zinc-800">
        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/store-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ result, language }),
              })
              const data = await res.json()
              const url = `${window.location.origin}/card/${data.id}`
              await navigator.clipboard.writeText(url)
            } catch {
              // fallback
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-2.5 text-sm text-white hover:bg-zinc-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Copy shareable card URL
        </button>
        <p className="mt-2 text-xs text-zinc-600">
          Share on Twitter, LinkedIn, or Slack — the preview shows the before/after card
        </p>
        <div className="mt-4">
          <button
            onClick={reset}
            className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ← Refactor more code
          </button>
        </div>
      </div>
    </div>
  )
}
