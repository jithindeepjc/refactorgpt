import { NextRequest, NextResponse } from "next/server"
import { stripe, PRICE_PRO_MONTHLY, PRICE_TEAMS_MONTHLY, isStripeConfigured } from "@/lib/stripe"

const PRICE_MAP: Record<string, string> = {
  pro: PRICE_PRO_MONTHLY,
  teams: PRICE_TEAMS_MONTHLY,
}

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Please try again later." },
        { status: 501 }
      )
    }

    const { plan } = await req.json()
    const priceId = PRICE_MAP[plan]

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const origin = req.headers.get("origin") || "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: { plan },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    const message = err instanceof Error ? err.message : "Failed to create checkout session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
