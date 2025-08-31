"use client"

import { useEffect, useState } from "react"
import JobCard, { Job } from "@/components/job-card"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import Link from "next/link"
import { getJobs } from "@/lib/api"

type Filters = {
  search: string
  location: string
  experienceLevel: string
  jobType: string
}

// A simple debounce hook to prevent API calls on every keystroke
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    location: "",
    experienceLevel: "",
    jobType: "",
  })

  const debouncedFilters = useDebounce(filters, 500);

  // This effect runs when the filters change. It resets the jobs list and fetches page 1.
  useEffect(() => {
    async function fetchInitialJobs() {
      setIsLoading(true);
      setCurrentPage(1);
      const activeFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([, value]) => value !== '')
      );
      try {
        const response = await getJobs({ ...activeFilters, page: '1' });
        setJobs(response.data.jobs);
        setTotalJobs(response.data.totalJobs);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs([]);
        setTotalJobs(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialJobs();
  }, [debouncedFilters]);

  // This function now handles loading the next page of jobs
  const handleLoadMore = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== '')
    );
    try {
      const response = await getJobs({ ...activeFilters, page: String(nextPage) });

      // Use a Map to ensure jobs are unique by their _id, preventing duplicate key errors
      setJobs(prevJobs => {
        const allJobs = [...prevJobs, ...response.data.jobs];
        const uniqueJobsMap = new Map(allJobs.map(job => [job._id, job]));
        return Array.from(uniqueJobsMap.values());
      });

      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more jobs:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32 md:pb-24 overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-light tracking-tight">Search jobs</h1>
            <Link href="/" className="text-white/70 hover:text-white text-sm">
              Home
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <input
              aria-label="Search"
              placeholder="Job title or keyword"
              value={filters.search}
              onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
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
              aria-label="Experience Level"
              value={filters.experienceLevel}
              onChange={(e) => setFilters((s) => ({ ...s, experienceLevel: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Any experience</option>
              <option value="Entry level">Entry level</option>
              <option value="Mid-Senior level">Mid-Senior level</option>
              <option value="Associate">Associate</option>
            </select>
            <select
              aria-label="Job Type"
              value={filters.jobType}
              onChange={(e) => setFilters((s) => ({ ...s, jobType: e.target.value }))}
              className="min-w-0 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Any type</option>
              <option value="Full-time">Full-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-10 lg:px-16">
        <h2 className="mb-3 text-base font-light tracking-tight">
          {isLoading ? "Loading jobs..." : `${totalJobs} jobs available`}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-48 w-full animate-pulse rounded-3xl bg-white/10" />
            ))
          ) : (
            jobs.map((j) => <JobCard key={j._id} job={j} />)
          )}
        </div>

        <div className="mt-8 flex justify-center">
          {!isLoading && currentPage < totalPages && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </section>

      <MobileBottomNav />
    </main>
  )
}

