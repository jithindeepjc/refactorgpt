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

export async function refactorCode(code: string, language: string): Promise<RefactorResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured")
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const content = JSON.parse(data.choices[0].message.content)

  return {
    original: code,
    refactored: content.refactored,
    summary: content.summary,
    improvements: content.improvements || [],
  }
}
