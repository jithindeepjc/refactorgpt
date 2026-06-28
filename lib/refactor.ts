export interface RefactorResult {
  original: string
  refactored: string
  summary: string
  improvements: string[]
}

const SYSTEM_PROMPT = `You are a senior code reviewer. Given code, you must:
1. Refactor it for readability, performance, and best practices
2. Keep the same functionality — do NOT change behavior
3. Return your response as valid JSON with these fields:
   - "refactored": the cleaned up code
   - "summary": one-sentence summary of what you changed
   - "improvements": array of specific improvements made (list each one)

Rules:
- Do NOT add comments unless they explain non-obvious logic
- Use modern language idioms
- Fix any obvious bugs or security issues
- If the code is already clean, say so and return it as-is`

const API_URL = "https://openrouter.ai/api/v1/chat/completions"
const MAX_RETRIES = 2
const TIMEOUT_MS = 30000

interface APIError extends Error {
  status?: number
  retryable?: boolean
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(timeout)
  }
}

function parseResponse(raw: string): { refactored: string; summary: string; improvements: string[] } {
  try {
    return JSON.parse(raw)
  } catch {
    // Try extracting JSON from markdown code block
    const jsonMatch = raw.match(/```(?:json)?\s*({[\s\S]*?})\s*```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }
    // Try finding any JSON object in the response
    const objMatch = raw.match(/\{[\s\S]*"refactored"[\s\S]*"summary"[\s\S]*\}/)
    if (objMatch) {
      return JSON.parse(objMatch[0])
    }
    throw new Error("Could not parse LLM response as JSON")
  }
}

function isLikelyCode(text: string): boolean {
  const codeIndicators = [
    /=>/, /\b(function|class|def|import|export|const|let|var|if|for|while)\b/,
    /[{};()]/, /\b(int|string|bool|void|float|return)\b/,
    /==|!=|<=|>=/, /\/\/|#.*$|<!--/, /\bnull\b|\bundefined\b|\btrue\b|\bfalse\b/
  ]
  const matches = codeIndicators.filter(p => p.test(text)).length
  return matches >= 3 || text.includes("\n")
}

export async function refactorCode(code: string, language: string): Promise<RefactorResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw Object.assign(new Error("OPENROUTER_API_KEY not configured — set it in .env.local"), { status: 500 })
  }

  if (!code || typeof code !== "string" || code.trim().length === 0) {
    throw Object.assign(new Error("No code provided"), { status: 400 })
  }

  if (code.length > 10000) {
    throw Object.assign(new Error("Code too long — max 10,000 characters"), { status: 400 })
  }

  if (!isLikelyCode(code)) {
    throw Object.assign(
      new Error("This looks like prose, not code. Paste code you'd like refactored."),
      { status: 400 }
    )
  }

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://refactor.sh",
          "X-Title": "RefactorGPT",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Refactor this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
          ],
          response_format: { type: "json_object" },
        }),
      }, TIMEOUT_MS)

      if (res.status === 429 && attempt < MAX_RETRIES) {
        const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10)
        await new Promise(r => setTimeout(r, retryAfter * 1000 * (attempt + 1)))
        continue
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "unknown error")
        const err = Object.assign(new Error(`API error (${res.status}): ${text.slice(0, 200)}`), {
          status: res.status,
          retryable: res.status >= 500,
        }) as APIError
        if (err.retryable && attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 2000 * (attempt + 1)))
          continue
        }
        throw err
      }

      const data = await res.json()
      const parsed = parseResponse(data.choices[0].message.content)

      return {
        original: code,
        refactored: parsed.refactored,
        summary: parsed.summary,
        improvements: parsed.improvements || [],
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        lastError = Object.assign(new Error("Request timed out after 30s — try shorter code"), { status: 504 })
      } else if (err instanceof Error) {
        lastError = err
      } else {
        lastError = new Error("Unknown error")
      }
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      }
    }
  }

  throw lastError || new Error("Refactoring failed after retries")
}
