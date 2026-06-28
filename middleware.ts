import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/api/refactor" && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
    const result = checkRateLimit(`refactor:${ip}`)

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: `Free limit reached (${getMonthName()} — 5 refactors/month). Upgrade to Pro for unlimited.`,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetTime),
            "Retry-After": String(Math.ceil((result.resetTime - Date.now()) / 1000)),
          },
        }
      )
    }

    const res = NextResponse.next()
    res.headers.set("X-RateLimit-Remaining", String(result.remaining))
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/refactor",
}

function getMonthName(): string {
  return new Date().toLocaleString("default", { month: "long" })
}
