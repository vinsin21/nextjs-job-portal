"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Bookmark, Share2, Zap, Check, ArrowRight } from "lucide-react"

export type Job = {
  id: string
  title: string
  company: string
  location: string
  level: "Intern" | "Junior" | "Mid" | "Senior"
  type: "Full-time" | "Part-time" | "Contract" | "Internship"
  mode: "On-site" | "Remote" | "Hybrid"
  salary?: string
  iconBg?: string
  applyUrl: string
  short?: string
  description?: string
  urgent?: boolean
  fastResponse?: boolean
  salaryVariant?: "green" | "gray"
  easilyApply?: boolean
}

export default function JobCard({ job }: { job: Job }) {
  const router = useRouter()

  const goToDetails = () => router.push(`/jobs/${job.id}`)

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
    // Replace with real bookmark later
    // alert("Saved to bookmarks (demo)")
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${job.title} at ${job.company}`}
      onClick={goToDetails}
      onKeyDown={onKeyNavigate}
      className="relative w-full min-w-0 cursor-pointer rounded-3xl bg-white p-4 shadow-md ring-1 ring-black/5 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
    >
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          aria-label="Bookmark"
          onClick={onBookmark}
          className="rounded-full border border-black/10 p-1.5 text-slate-700 hover:bg-slate-100"
        >
          <Bookmark className="h-4 w-4" aria-hidden />
        </button>
        <button
          aria-label="Share"
          onClick={onShare}
          className="rounded-full border border-black/10 p-1.5 text-slate-700 hover:bg-slate-100"
        >
          <Share2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {job.urgent && (
        <div className="mb-2 inline-flex items-center rounded-full bg-pink-100 px-2.5 py-1 text-xs font-medium text-pink-700">
          Urgently hiring
        </div>
      )}

      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
        <p className="mt-0.5 text-sm text-slate-600">
          {job.company}
          <span className="mx-1.5 text-slate-400">•</span>
          {job.location}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(job.fastResponse ?? true) && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Typically responds within 1 day
          </span>
        )}

        {job.salary && (
          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${
              job.salaryVariant === "green" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
            }`}
          >
            {job.salary}
            {job.salaryVariant === "green" && <Check className="ml-0.5 h-3.5 w-3.5" aria-hidden />}
          </span>
        )}

        <span className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">{job.type}</span>
        <span className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">{job.mode}</span>
        <span className="rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700">{job.level}</span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
        <ArrowRight className="h-4 w-4 text-indigo-600" aria-hidden />
        <span>{(job.easilyApply ?? true) ? "Easily apply" : "Apply on company site"}</span>
      </div>

      <div className="mt-4">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex w-full justify-center rounded-xl bg-neutral-900 px-3 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Apply
        </a>
      </div>
    </article>
  )
}
