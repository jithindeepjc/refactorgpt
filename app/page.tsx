import { CodeInput } from "@/components/code-input"
import { RefactorResult } from "@/components/refactor-result"
import { RefactorProvider } from "@/hooks/use-refactor"

export default function Home() {
  return (
    <RefactorProvider>
      <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
              RefactorGPT
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              Paste messy code. Get a clean refactor and a beautiful{" "}
              <span className="text-zinc-300">before/after</span> card to share.
            </p>
          </div>

          <CodeInput />
          <RefactorResult />
        </div>
      </main>
    </RefactorProvider>
  )
}
