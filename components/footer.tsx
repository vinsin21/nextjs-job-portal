export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 lg:px-16">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/70">
            Student Jobs — find internships, junior roles, and part‑time opportunities.
          </p>
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Student Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
