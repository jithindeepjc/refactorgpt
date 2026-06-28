import { NextRequest, NextResponse } from "next/server"
import { storeCardData } from "@/lib/card-store"
import type { RefactorResult } from "@/lib/refactor"

export async function POST(req: NextRequest) {
  const { result, language } = await req.json() as { result: RefactorResult; language: string }
  const id = storeCardData(result, language || "code")
  return NextResponse.json({ id })
}
