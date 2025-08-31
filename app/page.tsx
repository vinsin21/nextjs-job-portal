import Link from "next/link"
import Hero from "@/components/ui/neural-network-hero"
import MobileBottomNav from "@/components/mobile-bottom-nav"
import JobCard from "@/components/job-card"
import { jobs } from "@/lib/jobs"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden pb-32 md:pb-24">
      <div className="overflow-x-hidden">
        <Hero
          title="Find student-friendly jobs."
          description="A minimal job portal for internships, junior roles, and part‑time work. Built with the same crisp, elegant hero — consistent typography and subtle motion."
          badgeText="Student Jobs"
          badgeLabel="Beta"
          ctaButtons={[
            { text: "Browse jobs", href: "/search", primary: true },
            { text: "About us", href: "/about" },
          ]}
          microDetails={["Low‑weight font", "Tight tracking", "Subtle motion"]}
        />
      </div>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:px-10 lg:px-16">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <h2 className="text-xl font-light tracking-tight">Promoted jobs</h2>
          <Link
            href="/search"
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/20"
          >
            Browse jobs
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <Footer />

      <MobileBottomNav />
    </main>
  )
}
