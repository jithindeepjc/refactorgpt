import { NextRequest, NextResponse } from "next/server"
import { storeCardData } from "@/lib/card-store"
import type { RefactorResult } from "@/lib/refactor"

async function parseBody(req: NextRequest): Promise<{ result?: RefactorResult; language?: string } | { error: string }> {
  try {
    const body = await req.json()
    return body
  } catch {
    return { error: "Invalid JSON body" }
  }
}

function isValidResult(result: unknown): result is RefactorResult {
  if (!result || typeof result !== "object") return false
  const r = result as Record<string, unknown>
  return (
    typeof r.original === "string" &&
    typeof r.refactored === "string" &&
    typeof r.summary === "string" &&
    Array.isArray(r.improvements)
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await parseBody(req)
    if ("error" in body) {
      return NextResponse.json({ error: body.error }, { status: 400 })
    }

    const { result, language } = body as { result: RefactorResult; language?: string }

    if (!result || !isValidResult(result)) {
      return NextResponse.json(
        { error: "Invalid result: missing required fields (original, refactored, summary, improvements)" },
        { status: 400 }
      )
    }

    const totalSize = JSON.stringify(body).length
    if (totalSize > 500_000) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }

    const id = storeCardData(result, language || "code")
    return NextResponse.json({ id })
  } catch (err) {
    console.error("Store card error:", err)
    return NextResponse.json({ error: "Failed to store card" }, { status: 500 })
  }
}
