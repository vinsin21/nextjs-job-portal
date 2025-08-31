import Hero from "@/components/ui/neural-network-hero"

export default function DemoOne() {
  return (
    <div className="w-screen h-screen flex flex-col relative bg-white">
      <Hero
        title="Where algorithms become art."
        description="A minimal hero with a neural canvas — crisp, elegant, and quietly expressive. Built with React, Three.js, and a custom CPPN shader."
        badgeText="Generative Surfaces"
        badgeLabel="New"
        ctaButtons={[
          { text: "Get started", href: "/search", primary: true },
          { text: "View showcase", href: "/about" },
        ]}
        microDetails={["Low‑weight font", "Tight tracking", "Subtle motion"]}
      />
    </div>
  )
}
