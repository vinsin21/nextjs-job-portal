import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-[#0A0A0A]`}>
        <Suspense
          fallback={
            <div className="min-h-[50vh] w-full flex items-center justify-center text-white/70 text-sm">Loading…</div>
          }
        >
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
