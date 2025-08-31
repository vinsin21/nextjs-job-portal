"use client"

import { useState } from "react"
import MobileBottomNav from "@/components/mobile-bottom-nav"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <section className="mx-auto max-w-md px-6 pt-16">
        <div className="mb-6">
          <h1 className="text-3xl font-extralight tracking-tight">{mode === "login" ? "Login" : "Create account"}</h1>
          <p className="mt-2 text-white/75">Access saved searches and bookmarks. No password required in this demo.</p>
        </div>

        <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm ${mode === "login" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`rounded-full px-4 py-2 text-sm ${mode === "signup" ? "bg-white/10 text-white" : "text-white/70 hover:text-white"}`}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          )}
          <button
            type="submit"
            className="w-full rounded-2xl border border-white/10 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            {mode === "login" ? "Continue" : "Create account"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-white/60">
          By continuing you agree to our terms and privacy policy.
        </p>
      </section>

      <MobileBottomNav />
    </main>
  )
}
