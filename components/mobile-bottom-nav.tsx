"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Info, LogIn } from "lucide-react"

const nav = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/search", label: "Search", Icon: Search },
  { href: "/about", label: "About", Icon: Info },
  { href: "/auth", label: "Login", Icon: LogIn },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden border-t border-black/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <ul className="grid grid-cols-4">
        {nav.map((item) => {
          const active = pathname === item.href
          const Icon = item.Icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center py-2.5 transition-colors ${
                  active ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
