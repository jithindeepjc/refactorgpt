import { NextRequest, NextResponse } from "next/server"
import { refactorCode } from "@/lib/refactor"

export const runtime = "edge"

const ALLOWED_LANGUAGES = new Set([
  "python", "javascript", "typescript", "go", "rust",
  "java", "ruby", "c++", "c#", "php", "swift", "kotlin",
  "plaintext",
])

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    const lang = (language || "plaintext").toLowerCase()
    if (!ALLOWED_LANGUAGES.has(lang)) {
      return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 })
    }

    const result = await refactorCode(code, lang === "plaintext" ? "code" : language)
    return NextResponse.json(result)
  } catch (err) {
    console.error("Refactor error:", err)
    const status = (err as any).status || 500
    const message = err instanceof Error ? err.message : "Refactoring failed"
    return NextResponse.json({ error: message }, { status })
  }
}
