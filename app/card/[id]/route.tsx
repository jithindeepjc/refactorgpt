import { ImageResponse } from "next/og"
import { getCardData } from "@/lib/card-store"

export const runtime = "edge"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = getCardData(params.id)
  if (!data) {
    return new Response(
      `<html><body style="background:#09090b;color:#e4e4e7;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui,sans-serif;margin:0">
        <div style="text-align:center">
          <h1 style="font-size:24px;margin-bottom:8px">Card not found</h1>
          <p style="color:#a1a1aa;margin-bottom:24px">This card has expired or doesn't exist.</p>
          <a href="/" style="color:#3b82f6;text-decoration:none;font-size:14px">Back to RefactorGPT</a>
        </div>
      </body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          padding: 48,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>
            RefactorGPT
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              background: "#27272a",
              padding: "8px 20px",
              borderRadius: 12,
            }}
          >
            {data.language}
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              color: "#e4e4e7",
              lineHeight: 1.4,
              marginBottom: 32,
              padding: "20px 24px",
              background: "rgba(34, 197, 94, 0.08)",
              borderRadius: 12,
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}
          >
            {data.summary}
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 24 }}>
            <StatBox label="Improvements" value={String(data.improvementsCount)} color="#3b82f6" />
            <StatBox label="Lines before" value={String(data.linesBefore)} color="#ef4444" />
            <StatBox label="Lines after" value={String(data.linesAfter)} color="#22c55e" />
            {data.linesBefore > 0 && (
              <StatBox
                label="Reduction"
                value={`${Math.round((1 - data.linesAfter / data.linesBefore) * 100)}%`}
                color="#a855f7"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "center",
            fontSize: 16,
            color: "#52525b",
          }}
        >
          refactor.sh — Paste messy code. Get a clean refactor. Share the card.
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 24px",
        background: "#18181b",
        borderRadius: 12,
        border: `1px solid #27272a`,
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 16, color: "#a1a1aa" }}>{label}</div>
    </div>
  )
}
