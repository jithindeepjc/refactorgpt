export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-white mb-3">You&apos;re now a Pro!</h1>
        <p className="text-zinc-400 mb-8">
          Unlimited refactors, private cards, no watermark. Your account has been activated.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Start refactoring
        </a>
      </div>
    </main>
  )
}
