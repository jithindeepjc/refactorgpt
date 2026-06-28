import { NextRequest, NextResponse } from "next/server"
import { refactorCode } from "@/lib/refactor"

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "code is required" }, { status: 400 })
    }
    if (code.length > 10000) {
      return NextResponse.json({ error: "code too long (max 10k chars)" }, { status: 400 })
    }

    const result = await refactorCode(code, language || "plaintext")
    return NextResponse.json(result)
  } catch (err) {
    console.error("Refactor error:", err)
    const message = err instanceof Error ? err.message : "Refactoring failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
