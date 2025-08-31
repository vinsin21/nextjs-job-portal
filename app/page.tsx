import Link from "next/link";
import Hero from "@/components/ui/neural-network-hero";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import JobCard, { Job } from "@/components/job-card"; // Import Job type
import Footer from "@/components/footer";
import { getJobs } from "@/lib/api"; // Import our new API function

// This page is now an async Server Component
export default async function HomePage() {

  // Fetch the latest 3 jobs from our live API
  const apiResponse = await getJobs({ limit: "3" });
  const jobs: Job[] = apiResponse.data.jobs;

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden pb-32 md:pb-24">
      <div className="overflow-x-hidden">
        <Hero
          title="Find your next developer role."
          description="A minimal job portal for internships, junior roles, and part‑time work, powered by a live backend."
          badgeText="Student Jobs"
          badgeLabel="Live"
          ctaButtons={[
            { text: "Browse jobs", href: "/search", primary: true },
            { text: "About us", href: "/about" },
          ]}
        />
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="text-xl font-light tracking-tight">Latest jobs</h2>
          <Link
            href="/search"
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20"
          >
            Browse all jobs
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} /> // Use _id as the key
          ))}
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}