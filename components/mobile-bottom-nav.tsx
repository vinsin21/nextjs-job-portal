"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
  { href: "/auth", label: "Login" },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom"
    >
      <ul className="grid grid-cols-4">
        {nav.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center justify-center py-3 text-xs transition-colors ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
