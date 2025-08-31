import { notFound } from "next/navigation";
import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { getJobById } from "@/lib/api"; // Import our API function

// This page is now an async Server Component
export default async function JobDetail({ params }: { params: { id: string } }) {

  let job;
  try {
    // Fetch the single job using its ID from the URL
    const response = await getJobById(params.id);
    job = response.data;
  } catch (error) {
    // If the API throws an error (e.g., 404), Next.js will show the not-found page
    return notFound();
  }

  if (!job) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/search" className="text-white/80 hover:text-white" aria-label="Back">
            ← Back to search
          </Link>
          <button
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10"
            aria-label="Bookmark"
          >
            🔖 Save
          </button>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-6 md:px-10">
        <div className="mb-4 flex items-start gap-3">
          <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center">
            {job.companyLogoUrl ? (
              <img src={job.companyLogoUrl} alt={`${job.companyName} logo`} className="h-8 w-8 object-contain" />
            ) : (
              <span aria-hidden>◎</span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-light tracking-tight">{job.title}</h1>
            <p className="text-white/70">
              {job.companyName} • {job.location}
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
          {job.jobType && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{job.jobType}</span>}
          {job.salary && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{job.salary}</span>}
          {job.experienceLevel && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{job.experienceLevel}</span>}
        </div>

        <div className="my-4">
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur hover:bg-white/20"
          >
            Apply now
          </a>
        </div>

        <section className="prose prose-invert max-w-none">
          <h2 className="mt-6 text-base font-medium">Description</h2>
          <div className="text-white/80" dangerouslySetInnerHTML={{ __html: job.descriptionHtml || job.description }} />
        </section>
      </article>

      <MobileBottomNav />
    </main>
  );
}