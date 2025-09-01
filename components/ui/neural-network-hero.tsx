"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

// Dynamically import the new DarkVeil component to ensure it only runs on the client
const DarkVeil = dynamic(() => import("@/components/effects/dark-veil"), { ssr: false })

gsap.registerPlugin(SplitText, useGSAP)

// ===================== HERO =====================
interface HeroProps {
  title: string
  description: string
  badgeText?: string
  badgeLabel?: string
  ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>
  microDetails?: Array<string>
}

export default function Hero({
  title,
  description,
  badgeText = "Generative Surfaces",
  badgeLabel = "New",
  ctaButtons = [
    { text: "Get started", href: "#get-started", primary: true },
    { text: "View showcase", href: "#showcase" },
  ],
  // microDetails = ["Low‑weight font", "Tight tracking", "Subtle motion"],
  microDetails = [],
}: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const headerRef = useRef<HTMLHeadingElement | null>(null)
  const paraRef = useRef<HTMLParagraphElement | null>(null)
  const ctaRef = useRef<HTMLDivElement | null>(null)
  const badgeRef = useRef<HTMLDivElement | null>(null)
  const microRef = useRef<HTMLUListElement | null>(null)
  const microItem1Ref = useRef<HTMLLIElement | null>(null)
  const microItem2Ref = useRef<HTMLLIElement | null>(null)
  const microItem3Ref = useRef<HTMLLIElement | null>(null)

  useGSAP(
    () => {
      if (!headerRef.current) return

      // @ts-ignore
      document.fonts?.ready.then(() => {
        const split = new SplitText(headerRef.current!, {
          type: "lines",
          wordsClass: "lines",
        })

        gsap.set(split.lines, {
          filter: "blur(16px)",
          yPercent: 30,
          autoAlpha: 0,
          scale: 1.06,
          transformOrigin: "50% 100%",
        })

        if (badgeRef.current) {
          gsap.set(badgeRef.current, { autoAlpha: 0, y: -8 })
        }
        if (paraRef.current) {
          gsap.set(paraRef.current, { autoAlpha: 0, y: 8 })
        }
        if (ctaRef.current) {
          gsap.set(ctaRef.current, { autoAlpha: 0, y: 8 })
        }
        const microItems = [microItem1Ref.current, microItem2Ref.current, microItem3Ref.current].filter(Boolean)
        if (microItems.length > 0) {
          gsap.set(microItems, { autoAlpha: 0, y: 6 })
        }

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        })

        if (badgeRef.current) {
          tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.0)
        }

        tl.to(
          // @ts-ignore
          split.lines,
          {
            filter: "blur(0px)",
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.15,
          },
          0.1,
        )

        if (paraRef.current) {
          tl.to(paraRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.55")
        }
        if (ctaRef.current) {
          tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.35")
        }
        if (microItems.length > 0) {
          tl.to(microItems, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.25")
        }
      })
    },
    { scope: sectionRef },
  )

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] w-full overflow-hidden">
      {/* --- NEW BACKGROUND LAYER --- */}
      <div className="pointer-events-none absolute inset-0 z-0 w-full h-full">
        <DarkVeil
          speed={2}
          hueShift={360}
          noiseIntensity={0.03}
          scanlineIntensity={0.05}
          scanlineFrequency={800}
          warpAmount={0.1}
        />
      </div>

      {/* Content sits above background */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 pb-28 pt-24 sm:gap-8 sm:pt-36 sm:px-6 md:px-10 lg:px-16">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.08em] text-white/70">{badgeLabel}</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="text-xs font-light tracking-tight text-white/80">{badgeText}</span>
        </div>

        <h1
          ref={headerRef}
          className="max-w-2xl text-left text-6xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </h1>

        <p
          ref={paraRef}
          className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-white/75 sm:text-lg"
        >
          {description}
        </p>

        <div ref={ctaRef} className="flex w-full flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
          {ctaButtons.map((button, index) => (
            <a
              key={index}
              href={button.href}
              className={`w-full text-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 sm:w-auto ${button.primary
                ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "text-white/80 hover:bg-white/5"
                }`}
            >
              {button.text}
            </a>
          ))}
        </div>

        <ul ref={microRef} className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-white/60">
          {microDetails.map((detail, index) => {
            const refMap = [microItem1Ref, microItem2Ref, microItem3Ref]
            return (
              <li key={index} ref={refMap[index]} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-white/40" /> {detail}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  )
}