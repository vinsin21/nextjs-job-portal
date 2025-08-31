"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, extend } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import * as THREE from "three"
import dynamic from "next/dynamic"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { SplitText } from "gsap/SplitText"

const Lightning = dynamic(() => import("@/components/effects/lightning"), { ssr: false })

gsap.registerPlugin(SplitText, useGSAP)

// ===================== SHADER =====================
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  #ifdef GL_ES
    precision lowp float;
  #endif
  uniform float iTime;
  uniform vec2 iResolution;
  varying vec2 vUv;
  
  vec4 buf[8];
  
  vec4 sigmoid(vec4 x) { return 1. / (1. + exp(-x)); }
  
  vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2) {
    // layer 1 *********************************************************************
    buf[6] = vec4(coordinate.x, coordinate.y, 0.3948333106474662 + in0, 0.36 + in1);
    buf[7] = vec4(0.14 + in2, sqrt(coordinate.x * coordinate.x + coordinate.y * coordinate.y), 0., 0.);

    // layer 2 ********************************************************************
    buf[0] = mat4(vec4(6.5404263, -3.6126034, 0.7590882, -1.13613), vec4(2.4582713, 3.1660357, 1.2219609, 0.06276096), vec4(-5.478085, -6.159632, 1.8701609, -4.7742867), vec4(6.039214, -5.542865, -0.90925294, 3.251348))
    * buf[6]
    + mat4(vec4(0.8473259, -5.722911, 3.975766, 1.6522468), vec4(-0.24321538, 0.5839259, -1.7661959, -5.350116), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(0.21808943, 1.1243913, -1.7969975, 5.0294676);
    
    buf[1] = mat4(vec4(-3.3522482, -6.0612736, 0.55641043, -4.4719114), vec4(0.8631464, 1.7432913, 5.643898, 1.6106541), vec4(2.4941394, -3.5012043, 1.7184316, 6.357333), vec4(3.310376, 8.209261, 1.1355612, -1.165539))
    * buf[6]
    + mat4(vec4(5.24046, -13.034365, 0.009859298, 15.870829), vec4(2.987511, 3.129433, -0.89023495, -1.6822904), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-5.9457836, -6.573602, -0.8812491, 1.5436668);

    buf[0] = sigmoid(buf[0]);
    buf[1] = sigmoid(buf[1]);

    // layer 3 ********************************************************************
    buf[2] = mat4(vec4(-15.219568, 8.095543, -2.429353, -1.9381982), vec4(-5.951362, 4.3115187, 2.6393783, 1.274315), vec4(-7.3145227, 6.7297835, 5.2473326, 5.9411426), vec4(5.0796127, 8.979051, -1.7278991, -1.158976))
    * buf[6]
    + mat4(vec4(-11.967154, -11.608155, 6.1486754, 11.237008), vec4(2.124141, -6.263192, -1.7050359, -0.7021966), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-4.17164, -3.2281182, -4.576417, -3.6401186);
    
    buf[3] = mat4(vec4(3.1832156, -13.738922, 1.879223, 3.233465), vec4(0.64300746, 12.768129, 1.9141049, 0.50990224), vec4(-0.049295485, 4.4807224, 1.4733979, 1.801449), vec4(5.0039253, 13.000481, 3.3991797, -4.5561905))
    * buf[6]
    + mat4(vec4(-0.1285731, 7.720628, -3.1425676, 4.742367), vec4(0.6393625, 3.714393, -0.8108378, -0.39174938), vec4(0.0, 0.0, 0.0, 0.0), vec4(0.0, 0.0, 0.0, 0.0))
    * buf[7]
    + vec4(-1.1811101, -21.621881, 0.7851888, 1.2329718);
    
    buf[2] = sigmoid(buf[2]);
    buf[3] = sigmoid(buf[3]);

    // layer 5 & 6 ****************************************************************
    buf[4] = mat4(vec4(5.214916, -7.183024, 2.7228765, 2.6592617), vec4(-5.601878, -25.3591, 4.067988, 0.4602802), vec4(-10.57759, 24.286327, 21.102104, 37.546658), vec4(4.3024497, -1.9625226, 2.3458803, -1.372816))
    * buf[0]
    + mat4(vec4(-17.6526, -10.507558, 2.2587414, 12.462782), vec4(6.265566, -502.75443, -12.642513, 0.9112289), vec4(-10.983244, 20.741234, -9.701768, -0.7635988), vec4(5.383626, 1.4819539, -4.1911616, -4.8444734))
    * buf[1]
    + mat4(vec4(12.785233, -16.345072, -0.39901125, 1.7955981), vec4(-30.48365, -1.8345358, 1.4542528, -1.1118771), vec4(19.872723, -7.337935, -42.941723, -98.52709), vec4(8.337645, -2.7312303, -2.2927687, -36.142323))
    * buf[2]
    + mat4(vec4(-16.298317, 3.5471997, -0.44300047, -9.444417), vec4(57.5077, -35.609753, 16.163465, -4.1534753), vec4(-0.07470326, -3.8656476, -7.0901804, 3.1523974), vec4(-12.559385, -7.077619, 1.490437, -0.8211543))
    * buf[3]
    + vec4(-7.67914, 15.927437, 1.3207729, -1.6686112);
    
    buf[5] = mat4(vec4(-1.4109162, -0.372762, -3.770383, -21.367174), vec4(-6.2103205, -9.35908, 0.92529047, 8.82561), vec4(11.460242, -22.348068, 13.625772, -18.693201), vec4(-0.3429052, -3.9905605, -2.4626114, -0.45033523))
    * buf[0]
    + mat4(vec4(7.3481627, -4.3661838, -6.3037653, -3.868115), vec4(1.5462853, 6.5488915, 1.9701879, -0.58291394), vec4(6.5858274, -2.2180402, 3.7127688, -1.3730392), vec4(-5.7973905, 10.134961, -2.3395722, -5.965605))
    * buf[1]
    + mat4(vec4(-2.5132585, -6.6685553, -1.4029363, -0.16285264), vec4(-0.37908727, 0.53738135, 4.389061, -1.3024765), vec4(-0.70647055, 2.0111287, -5.1659346, -3.728635), vec4(-13.562562, 10.487719, -0.9173751, -2.6487076))
    * buf[2]
    + mat4(vec4(-8.645013, 6.5546675, -6.3944063, -5.5933375), vec4(-0.57783127, -1.077275, 36.91025, 5.736769), vec4(14.283112, 3.7146652, 7.1452246, -4.5958776), vec4(2.7192075, 3.6021907, -4.366337, -2.3653464))
    * buf[3]
    + mat4(vec4(-0.49252132, -0.39877754, -0.91366625, 0.0), vec4(0.95609266, 0.7923952, 1.640221, 0.0), vec4(0.30616966, 0.15693925, 0.8639857, 0.0), vec4(1.1825981, 0.94504964, 2.176963, 0.0))
    * buf[4]
    + mat4(vec4(0.35446745, 0.3293795, 0.59547555, 0.0), vec4(-0.58784515, -0.48177817, -1.0614829, 0.0), vec4(2.5271258, 1.9991658, 4.6846647, 0.0), vec4(0.13042648, 0.08864098, 0.30187556, 0.0))
    * buf[5]
    + mat4(vec4(-1.7718065, -1.4033192, -3.3355875, 0.0), vec4(3.1664357, 2.638297, 5.378702, 0.0), vec4(-3.1724713, -2.6107926, -5.549295, 0.0), vec4(-2.851368, -2.249092, -5.3013067, 0.0))
    * buf[6]
    + mat4(vec4(1.5203838, 1.2212278, 2.8404984, 0.0), vec4(1.5210563, 1.2651345, 2.683903, 0.0), vec4(2.9789467, 2.4364579, 5.2347264, 0.0), vec4(2.2270417, 1.8825914, 3.8028636, 0.0))
    * buf[7]
    + vec4(-1.5468478, -3.6171484, 0.24762098, 0.0);

    buf[0] = sigmoid(buf[0]);
    return vec4(buf[0].x , buf[0].y , buf[0].z, 1.0);
  }
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0; uv.y *= -1.0;
    gl_FragColor = cppn_fn(uv, 0.1 * sin(0.3 * iTime), 0.1 * sin(0.69 * iTime), 0.1 * sin(0.44 * iTime));
  }
`

const CPPNShaderMaterial = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector2(1, 1) },
  vertexShader,
  fragmentShader,
)

extend({ CPPNShaderMaterial })

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<any>(null!)

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.iTime = state.clock.elapsedTime
    const { width, height } = state.size
    materialRef.current.iResolution.set(width, height)
  })

  return (
    <mesh ref={meshRef} position={[0, -0.75, -0.5]}>
      <planeGeometry args={[4, 4]} />
      <cPPNShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  )
}

function ShaderBackground() {
  const canvasRef = useRef<HTMLDivElement | null>(null)

  const camera = useMemo(() => ({ position: [0, 0, 1] as [number, number, number], fov: 75, near: 0.1, far: 1000 }), [])

  useGSAP(
    () => {
      if (!canvasRef.current) return

      gsap.set(canvasRef.current, {
        filter: "blur(20px)",
        scale: 1.1,
        autoAlpha: 0.7,
      })

      gsap.to(canvasRef.current, {
        filter: "blur(0px)",
        scale: 1,
        autoAlpha: 1,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.3,
      })
    },
    { scope: canvasRef },
  )

  return (
    <div ref={canvasRef} className="bg-black absolute inset-0 -z-10 w-full h-full" aria-hidden>
      <Canvas
        camera={camera}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
      >
        <ShaderPlane />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
    </div>
  )
}

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
  microDetails = ["Low‑weight font", "Tight tracking", "Subtle motion"],
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

      // ensure fonts loaded
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
      {/* Lightning background layer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Lightning hue={220} xOffset={0} speed={1.15} intensity={5.5} size={1.15} />
      </div>

      {/* Content sits above Lightning */}
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
          className="max-w-2xl text-left text-4xl font-extralight leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
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
              className={`w-full text-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-light tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 duration-300 sm:w-auto ${
                button.primary
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

declare module "@react-three/fiber" {
  interface ThreeElements {
    cPPNShaderMaterial: any
  }
}
