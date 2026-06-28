import { NextRequest, NextResponse } from "next/server"
import { refactorCode } from "@/lib/refactor"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    const result = await refactorCode(code, language || "plaintext")
    return NextResponse.json(result)
  } catch (err) {
    console.error("Refactor error:", err)
    const status = (err as any).status || 500
    const message = err instanceof Error ? err.message : "Refactoring failed"
    return NextResponse.json({ error: message }, { status })
  }
}
