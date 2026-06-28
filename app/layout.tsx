import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RefactorGPT — Clean code, shareable cards",
  description: "Paste messy code. Get a clean refactor and a beautiful before/after card to share.",
  openGraph: {
    title: "RefactorGPT — Clean code, shareable cards",
    description: "Paste messy code. Get a clean refactor and a beautiful before/after card to share.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RefactorGPT — Clean code, shareable cards",
    description: "Paste messy code. Get a clean refactor and a beautiful before/after card to share.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
