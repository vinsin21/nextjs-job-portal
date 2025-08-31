"use client"

import { useMemo, useState } from "react"
import JobCard from "@/components/job-card"
import { jobs as seed } from "@/lib/jobs"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import Link from "next/link"

type Filters = {
  q: string
  location: string
  level: string
  mode: string
}

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    location: "",
    level: "",
    mode: "",
  })

  const jobs = useMemo(() => {
    return seed.filter((j) => {
      const matchesQ =
        !filters.q || [j.title, j.company, j.location].join(" ").toLowerCase().includes(filters.q.toLowerCase())
      const matchesLoc = !filters.location || j.location.toLowerCase().includes(filters.location.toLowerCase())
      const matchesLevel = !filters.level || j.level.toLowerCase() === filters.level.toLowerCase()
      const matchesMode = !filters.mode || j.mode.toLowerCase() === filters.mode.toLowerCase()
      return matchesQ && matchesLoc && matchesLevel && matchesMode
    })
  }, [filters])

  return (
    <main className="min-h-screen bg-black text-white pb-32 md:pb-24 overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-light tracking-tight">Edit search</h1>
            <Link href="/" className="text-white/70 hover:text-white text-sm">
              Home
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              aria-label="Search"
              placeholder="Enter job title or keyword"
              value={filters.q}
              onChange={(e) => setFilters((s) => ({ ...s, q: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <input
              aria-label="Location"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters((s) => ({ ...s, location: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <select
              aria-label="Level"
              value={filters.level}
              onChange={(e) => setFilters((s) => ({ ...s, level: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Any level</option>
              <option>Intern</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
            <select
              aria-label="Work mode"
              value={filters.mode}
              onChange={(e) => setFilters((s) => ({ ...s, mode: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Any mode</option>
              <option>On-site</option>
              <option>Remote</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10 lg:px-16">
        <h2 className="mb-3 text-base font-light tracking-tight">{jobs.length} jobs available</h2>

        <div className="mb-4">
          <h3 className="mb-2 text-sm font-light tracking-tight">Promoted jobs</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.slice(0, 1).map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-light tracking-tight">Recently added</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}
