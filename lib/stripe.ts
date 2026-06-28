import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")

export const PRICE_PRO_MONTHLY = process.env.STRIPE_PRICE_PRO || "price_pro_monthly"
export const PRICE_TEAMS_MONTHLY = process.env.STRIPE_PRICE_TEAMS || "price_teams_monthly"

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    refactors: 5,
    features: ["5 refactors/month", "Public cards with watermark", "Basic syntax highlighting"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 900,
    refactors: -1,
    features: ["Unlimited refactors", "Private cards, no watermark", "Priority support", "API access"],
    priceId: PRICE_PRO_MONTHLY,
  },
  {
    id: "teams",
    name: "Teams",
    price: 1900,
    refactors: -1,
    features: ["Everything in Pro", "Team workspaces", "Shared card history", "Custom branding"],
    priceId: PRICE_TEAMS_MONTHLY,
  },
]
