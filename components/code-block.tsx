"use client"
import { useEffect, useState } from "react"

const LANG_MAP: Record<string, string> = {
  python: "python",
  javascript: "javascript",
  typescript: "typescript",
  go: "go",
  rust: "rust",
  java: "java",
  ruby: "ruby",
  "c++": "cpp",
  "c#": "csharp",
  php: "php",
  swift: "swift",
  kotlin: "kotlin",
  jsx: "jsx",
  tsx: "tsx",
}

interface CodeBlockProps {
  code: string
  label: string
  language?: string
}

export function CodeBlock({ code, label, language }: CodeBlockProps) {
  const [html, setHtml] = useState("")
  const lang = LANG_MAP[(language || "").toLowerCase()] || "plaintext"

  useEffect(() => {
    async function highlight() {
      try {
        const { codeToHtml, bundledLanguages } = await import("shiki/bundle/web")
        const hasLang = lang in bundledLanguages || lang === "plaintext"
        const result = await codeToHtml(code, {
          lang: hasLang ? lang : "plaintext",
          theme: "github-dark",
        })
        setHtml(result)
      } catch {
        // Fallback: render as plain text
        setHtml(`<pre>${escapeHtml(code)}</pre>`)
      }
    }
    highlight()
  }, [code, lang])

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
      <div
        className="rounded-lg border border-zinc-800 overflow-x-auto max-h-[400px] overflow-y-auto text-sm leading-relaxed [&_pre]:p-4 [&_pre]:!bg-zinc-900"
        dangerouslySetInnerHTML={{ __html: html || `<pre class="p-4 text-zinc-400">${escapeHtml(code)}</pre>` }}
      />
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
