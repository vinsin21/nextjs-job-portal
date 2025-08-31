import { notFound } from "next/navigation";
import Link from "next/link";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { getJobById } from "@/lib/api";
import { Briefcase, DollarSign, GraduationCap, Clock } from "lucide-react";

// --- HELPER FUNCTION TO PARSE THE DESCRIPTION ---
interface ParsedSection {
  title: string;
  content: string;
}

const parseDescription = (description: string): ParsedSection[] | null => {
  const headings = [
    "Description", "Summary", "Responsibilities", "Key Responsibilities",
    "Qualifications", "Minimum Qualifications", "Preferred Qualifications",
    "What you will do", "What you bring", "Skills", "Requirements"
  ];
  const regex = new RegExp(`^(${headings.join('|')}):?$`, 'im');
  const lines = description.split('\n').filter(line => line.trim() !== '');

  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  for (const line of lines) {
    const match = line.trim().match(regex);
    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: match[1].trim().replace(/:$/, ''), content: '' };
    } else if (currentSection) {
      currentSection.content += line.trim().replace(/^\* /, '• ') + '<br />';
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }
  return sections.length > 1 ? sections : null;
};

// --- Define props interface for better type safety ---
interface JobDetailProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetail({ params }: JobDetailProps) {
  // Await the params object first
  const { id } = await params;

  let job;
  try {
    const response = await getJobById(id);
    job = response.data;
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return notFound();
  }

  if (!job) {
    return notFound();
  }

  const parsedSections = parseDescription(job.description);

  const DetailItem = ({ icon: Icon, text }: { icon: React.ElementType, text: string | null }) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-400 flex-shrink-0" />
        <span className="text-slate-300">{text}</span>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white pb-32 md:pb-24">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/search" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors" aria-label="Back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            <span className="hidden sm:inline">Back to search</span>
          </Link>
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-light text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Apply Now
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <article className="space-y-6">

          <section className="rounded-2xl bg-neutral-900/50 p-6 ring-1 ring-white/10">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/10 grid place-items-center flex-shrink-0">
                {job.companyLogoUrl ? (
                  <img src={job.companyLogoUrl} alt={`${job.companyName} logo`} className="h-10 w-10 object-contain" />
                ) : (
                  <Briefcase className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{job.title}</h1>
                <p className="mt-1 text-slate-400">
                  {job.companyName} • {job.location}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-neutral-900/50 p-6 ring-1 ring-white/10">
            <h2 className="text-lg font-semibold text-white">Job Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem icon={DollarSign} text={job.salary} />
              <DetailItem icon={Clock} text={job.jobType} />
              <DetailItem icon={GraduationCap} text={job.experienceLevel} />
            </div>
          </section>

          {parsedSections ? (
            parsedSections.map((section, index) => (
              <section key={index} className="rounded-2xl bg-neutral-900/50 p-6 ring-1 ring-white/10">
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                <div
                  className="prose prose-invert max-w-none mt-4 text-slate-300 prose-p:my-2 prose-ul:my-2 prose-headings:text-white"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))
          ) : (
            <section className="rounded-2xl bg-neutral-900/50 p-6 ring-1 ring-white/10">
              <h2 className="text-lg font-semibold text-white">Full Job Description</h2>
              <div
                className="prose prose-invert max-w-none mt-4 text-slate-300 prose-p:my-2 prose-ul:my-2 prose-headings:text-white"
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml || job.description.replace(/\n/g, '<br />') }}
              />
            </section>
          )}

        </article>
      </div>

      <MobileBottomNav />
    </main>
  );
}