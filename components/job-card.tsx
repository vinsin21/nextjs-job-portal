"use client"

import type React from "react"
import Link from "next/link" // Import the Link component
import { Bookmark, Ban, Zap, Check, Send } from "lucide-react"

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
  mode?: "On-site" | "Remote" | "Hybrid";
  urgent?: boolean;
  fastResponse?: boolean;
  easilyApply?: boolean;
}

export default function JobCard({ job }: { job: Job }) {

  const onBookmark = (e: React.MouseEvent) => {
    // Stop the link from navigating when the button is clicked
    e.stopPropagation()
    e.preventDefault()
    alert("Bookmark feature coming soon!")
  }

  const onHide = (e: React.MouseEvent) => {
    // Stop the link from navigating when the button is clicked
    e.stopPropagation()
    e.preventDefault()
    alert("Hide job feature coming soon!")
  }

  return (
    // Wrap the entire card in a Link component for navigation, removing the need for useRouter
    <Link
      href={`/jobs/${job._id}`}
      className="block w-full min-w-0 rounded-2xl bg-white p-4 text-slate-800 ring-1 ring-gray-200/80 transition hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <article>
        {/* --- TOP SECTION: BADGE AND ACTIONS --- */}
        <div className="flex items-start justify-between mb-3">
          {/* Badges like "Urgently hiring" */}
          <div>
            {job.urgent && (
              <div className="inline-flex items-center rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-800 ring-1 ring-inset ring-pink-200">
                Urgently hiring
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 -mr-2 -mt-2">
            <button
              aria-label="Bookmark"
              onClick={onBookmark}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <Bookmark className="h-5 w-5" aria-hidden />
            </button>
            <button
              aria-label="Hide job"
              onClick={onHide}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <Ban className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* --- MAIN INFO: TITLE, COMPANY, LOCATION --- */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-gray-700">{job.companyName}</p>
          <p className="text-sm text-gray-500">{job.location}</p>
        </div>

        {/* --- HIGHLIGHT BADGES: FAST RESPONSE & SALARY --- */}
        <div className="flex flex-col gap-y-2 mb-4">
          {job.fastResponse && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200 w-fit">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              <span>Typically responds within 1 day</span>
            </div>
          )}
          {job.salary && (
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200 w-fit">
              <Check className="h-3.5 w-3.5" aria-hidden />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* --- TAGS: JOB TYPE, ETC. --- */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {job.jobType && (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-200">
              {job.jobType}
            </span>
          )}
          {job.experienceLevel && (
            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-200">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* --- APPLY SECTION --- */}
        <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
          <Send className="h-4 w-4" aria-hidden />
          <span>{(job.easilyApply ?? true) ? "Easily apply" : "Apply on company site"}</span>
        </div>
      </article>
    </Link>
  )
}

