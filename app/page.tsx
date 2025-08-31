import Link from "next/link";
import Hero from "@/components/ui/neural-network-hero";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import JobCard, { Job } from "@/components/job-card";
import Footer from "@/components/footer";
import { getJobs } from "@/lib/api";

// This page is an async Server Component
export default async function HomePage() {

  // Fetch the latest 3 jobs from our live API
  let jobs: Job[] = [];
  try {
    const apiResponse = await getJobs({ limit: "3" });
    jobs = apiResponse.data.jobs;
  } catch (error) {
    console.error("Failed to fetch jobs for homepage:", error);
    // In case the API fails, we'll just show an empty list.
  }

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
        <div className="mb-6">
          <h2 className="text-xl font-light tracking-tight text-center sm:text-left">Latest jobs</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {/* --- NEW BUTTON SECTION --- */}
        {/* This div centers the button on larger screens */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/search"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-center text-sm font-light tracking-tight text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-auto"
          >
            Browse all jobs
          </Link>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}

