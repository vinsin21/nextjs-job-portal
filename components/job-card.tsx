"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Bookmark, Ban, Zap, Check, Send } from "lucide-react"

// 1. Add 'sourcePlatform' to the Job type to match our backend data
export type Job = {
  _id: string;
  title: string;
  companyName: string;
  location: string;
  experienceLevel: string | null;
  jobType: string | null;
  salary: string | null;
  applyUrl: string;
  description: string;
  descriptionHtml: string | null;
  companyLogoUrl: string | null;
  sourcePlatform: string; // Added this field
  mode?: "On-site" | "Remote" | "Hybrid";
  urgent?: boolean;
  fastResponse?: boolean;
  easilyApply?: boolean;
}

// 2. Create a helper object for platform-specific styling
const platformStyles: { [key: string]: string } = {
  LinkedIn: "text-blue-300 bg-blue-500/10 ring-blue-500/20",
  Indeed: "text-indigo-300 bg-indigo-500/10 ring-indigo-500/20",
  Naukri: "text-orange-300 bg-orange-500/10 ring-orange-500/20",
  Default: "text-slate-300 bg-white/5 ring-white/10" // Fallback style
};


export default function JobCard({ job }: { job: Job }) {

  const onBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    alert("Bookmark feature coming soon!")
  }

  const onHide = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    alert("Hide job feature coming soon!")
  }

  return (
    <motion.a
      href={`/jobs/${job._id}`}
      className="block w-full min-w-0 rounded-3xl bg-neutral-900/50 p-4 text-slate-300 ring-1 ring-white/10 transition-shadow duration-300 hover:shadow-lg hover:shadow-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <article>
        <div className="flex items-start justify-between mb-3">
          <div>
            {job.urgent && (
              <div className="inline-flex items-center rounded-md bg-pink-500/10 px-2 py-1 text-xs font-medium text-pink-300 ring-1 ring-inset ring-pink-500/20">
                Urgently hiring
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 -mr-2 -mt-2">
            <button
              aria-label="Bookmark"
              onClick={onBookmark}
              className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Bookmark className="h-5 w-5" aria-hidden />
            </button>
            <button
              aria-label="Hide job"
              onClick={onHide}
              className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Ban className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-lg font-medium text-white leading-tight">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{job.companyName}</p>
          <p className="text-sm text-slate-500">{job.location}</p>
        </div>

        <div className="flex flex-col items-start gap-y-2 mb-4">
          {job.fastResponse && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-300 ring-1 ring-inset ring-blue-500/20 w-fit">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              <span>Typically responds within 1 day</span>
            </div>
          )}
          {job.salary && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20 w-fit">
              <span>{job.salary}</span>
              <Check className="h-3.5 w-3.5" aria-hidden />
            </div>
          )}
        </div>

        {/* --- 3. ADDED THE PLATFORM BADGE HERE --- */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.sourcePlatform && (
            <span className={`rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${platformStyles[job.sourcePlatform] || platformStyles.Default}`}>
              via {job.sourcePlatform}
            </span>
          )}
          {job.jobType && (
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
              {job.jobType}
            </span>
          )}
          {job.experienceLevel && (
            <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300 ring-1 ring-inset ring-white/10">
              {job.experienceLevel}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-400 font-medium">
          <Send className="h-4 w-4" aria-hidden />
          <span>{(job.easilyApply ?? true) ? "Easily apply" : "Apply on company site"}</span>
        </div>
      </article>
    </motion.a>
  )
}

