import MobileBottomNav from "@/components/mobile-bottom-nav"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <header className="mx-auto max-w-5xl px-6 py-10 md:px-10 lg:px-16">
        <h1 className="text-3xl font-extralight tracking-tight">Our story</h1>
        <p className="mt-2 max-w-2xl text-white/75">
          We started Student Jobs to help students discover meaningful work — internships, part‑time roles, and their
          first full‑time positions — with clarity and simplicity.
        </p>
      </header>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2 md:px-10 lg:px-16">
        <Founder
          name="Sidhi Bhagat"
          role="Co‑founder"
          imgSrc="https://media.licdn.com/dms/image/v2/D4D03AQGx_68uPLD55w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1688393862973?e=1759363200&v=beta&t=Ge-cCrF9i3jBHoeqKgZmqx5Sd-9NgpR_xUVMlJcFgq8"
          bio="Aisha built products for early‑stage startups. She believes great tools feel invisible and let people focus on what matters."
          twitter="https://twitter.com"
          linkedin="https://www.linkedin.com/in/sidhibhagat/"
        />
        <Founder
          name="Vineet Singh"
          role="Co‑founder"
          imgSrc="https://media.licdn.com/dms/image/v2/D5603AQG57nJKG7TeCA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1721634344346?e=1759363200&v=beta&t=qIwB_dYQXKj4yiPMNw8P6STJrgq3XPuFsix734b5NDs"
          bio="Leo led web platforms used by thousands of students. He enjoys shipping fast, accessible experiences."
          twitter="https://twitter.com"
          linkedin="https://www.linkedin.com/in/sidhibhagat/"
        />
      </section>

      <MobileBottomNav />
    </main>
  )
}

function Founder({
  name,
  role,
  imgSrc,
  bio,
  twitter,
  linkedin,
}: {
  name: string
  role: string
  imgSrc: string
  bio: string
  twitter: string
  linkedin: string
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <img src={imgSrc || "/placeholder.svg"} alt={`${name} portrait`} className="h-48 w-full object-cover" />
      <div className="space-y-2 p-5">
        <h2 className="text-lg font-light tracking-tight">{name}</h2>
        <p className="text-sm text-white/70">{role}</p>
        <p className="text-sm text-white/80">{bio}</p>
        <div className="flex gap-3 pt-2">
          <a
            className="text-sm text-white/80 underline hover:text-white"
            href={twitter}
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <a
            className="text-sm text-white/80 underline hover:text-white"
            href={linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </article>
  )
}
