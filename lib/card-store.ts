import type { RefactorResult } from "./refactor"

interface CardData {
  summary: string
  improvementsCount: number
  linesBefore: number
  linesAfter: number
  language: string
}

const store = new Map<string, CardData>()

export function storeCardData(result: RefactorResult, language: string): string {
  const id = crypto.randomUUID().slice(0, 8)
  store.set(id, {
    summary: result.summary,
    improvementsCount: result.improvements.length,
    linesBefore: result.original.split("\n").length,
    linesAfter: result.refactored.split("\n").length,
    language,
  })
  // Auto-cleanup after 1 hour
  setTimeout(() => store.delete(id), 60 * 60 * 1000)
  return id
}

export function getCardData(id: string): CardData | undefined {
  return store.get(id)
}
