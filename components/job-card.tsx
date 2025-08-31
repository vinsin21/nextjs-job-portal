"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Share2 } from "lucide-react"

export type Job = {
  id: string
  title: string
  company: string
  location: string
  level: "Intern" | "Junior" | "Mid" | "Senior"
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  mode: "On-site" | "Remote" | "Hybrid"
  salary?: string
  iconBg?: string // e.g. bg-pink-300/80
  applyUrl: string
  short?: string
  description?: string
}

export default function JobCard({ job }: { job: Job }) {
  const router = useRouter()
  const iconColor = job.iconBg || "bg-white/10"

  const goToDetails = () => {
    router.push(`/jobs/${job.id}`)
  }

  const onKeyNavigate: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      goToDetails()
    }
  }

  const onShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.share?.({
        title: `${job.title} at ${job.company}`,
        text: job.short || "Check out this role",
        url: `${window.location.origin}/jobs/${job.id}`,
      })
    } catch {
      // no-op
    }
  }

  const onBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    alert("Saved to bookmarks (demo)")
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${job.title} at ${job.company}`}
      onClick={goToDetails}
      onKeyDown={onKeyNavigate}
      className="w-full min-w-0 cursor-pointer group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-xl ${iconColor} grid place-items-center`}>
          <span className="text-sm text-white/90" aria-hidden>
            ◎
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Title links to job details */}
              <h3 className="text-sm font-medium text-white group-hover:underline line-clamp-2">{job.title}</h3>
              <p className="truncate text-xs text-white/70 break-words">
                {job.company} • {job.location}
              </p>
            </div>

            {/* top-right actions: small icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                aria-label="Bookmark"
                onClick={onBookmark}
                className="rounded-full border border-white/10 p-1.5 text-white/80 hover:text-white hover:bg-white/5"
              >
                <Bookmark className="h-4 w-4" aria-hidden />
              </button>
              <button
                aria-label="Share"
                onClick={onShare}
                className="rounded-full border border-white/10 p-1.5 text-white/80 hover:text-white hover:bg-white/5"
              >
                <Share2 className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">{job.type}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">{job.mode}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/80">
              {job.level} level
            </span>
            {job.salary && <span className="text-white/80 sm:ml-auto">{job.salary}</span>}
          </div>

          {/* full-width Apply at bottom; stop propagation so card doesn't navigate */}
          <div className="mt-3">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex w-full justify-center rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white backdrop-blur hover:bg-white/20"
            >
              Apply
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
