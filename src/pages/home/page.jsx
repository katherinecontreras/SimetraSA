/**
 * pages/home/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Página de inicio. Orquesta el loader y las secciones (hero y siguientes inline).
 *
 * Notas de diseño:
 *  - `showLoader` controla el montaje del LoadingScreen; cuando se desmonta
 *    (`loaderExited`) las animaciones de scroll/tilt del Hero se activan.
 */

import { useCallback, useRef, useState } from 'react'

import { useScrollTriggerRefresh } from '../../hooks/useScrollTriggerRefresh'
import { useSvgPathDrawOnScroll } from '../../hooks/home/useSvgPathDrawOnScroll'
import { useVisuallySolidBlack } from '../../hooks/home/useVisuallySolidBlack'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { motion } from 'framer-motion'

import { SectionTitle } from '../../components/SectionTitle'
import { useHero } from '../../hooks/home/useHero'
import { useRevealWhenVisible } from '../../hooks/useRevealWhenVisible'
import { LoadingScreen } from '../../layouts/LoadingScreen'
import { useDeviceType } from '../../utils/useDeviceType'
import { usePageLoader } from '../../utils/usePageLoader'

import Cielo from '../../assets/seccion1/Cielo.png'
import Simetra from '../../assets/seccion1/Simetra.png'
import Zanja from '../../assets/seccion1/Zanja.png'
import Camion from '../../assets/seccion1/Camion.png'

import section2Img1 from '../../assets/section2/image1.png'
import section2Img2 from '../../assets/section2/image2.png'
import section2Img3 from '../../assets/section2/image3.png'
import section2Img4 from '../../assets/section2/image4.png'
import section2Img5 from '../../assets/section2/image5.png'

import { CylinderCarousel } from '../../components/section2/CylinderCarousel'
import { NuestraHistoriaQuartileMarkers } from '../../components/section3/NuestraHistoriaQuartileMarkers'
import { NUESTRA_HISTORIA_PARTS } from '../../constants/nuestraHistoria'

/** Solo assets de `src/assets/section2/`. */
const ASI_TRABAJAMOS_IMAGES = [
  section2Img1,
  section2Img2,
  section2Img3,
  section2Img4,
  section2Img5,
]

const MotionBackdrop = motion.div

export default function HomePage() {
  const { isMobile } = useDeviceType()
  const { isLoaded } = usePageLoader([], 8_000)
  const [showLoader, setShowLoader] = useState(true)
  /** Opacidad del fondo de la sección (sigue al scroll del hero; puede bajar al volver arriba). */
  const asiTrabajamosSectionRef = useRef(null)
  const nuestraHistoriaSectionRef = useRef(null)
  const servicesBlockRef = useRef(null)
  /**
   * Capa negra distinta a `blackOverlayRef` del hero: evita que la timeline del pin
   * y el ScrollTrigger de “Así trabajamos” pisen la misma `opacity` y parpadee.
   */
  const scrollBlackOverlayRef = useRef(null)
  const historiaLinePathRef = useRef(null)
  /** Justo debajo del título: el trazo SVG empieza a revelarse al bajar por el scroll. */
  const historiaLineScrollStartRef = useRef(null)
  /** 0 = sin trazo, 1 = línea completa; sincronizado con el stroke del path (mismos hitos que los iconos). */
  const [historiaLineDrawProgress, setHistoriaLineDrawProgress] = useState(0)

  const loaderExited = !showLoader
  const servicesInView = useRevealWhenVisible(servicesBlockRef, {
    enabled: loaderExited,
    threshold: 0.25,
  })
  const asiTrabajamosInView = useRevealWhenVisible(asiTrabajamosSectionRef, {
    enabled: loaderExited,
    threshold: 0.15,
  })
  const nuestraHistoriaInView = useRevealWhenVisible(nuestraHistoriaSectionRef, {
    enabled: loaderExited,
    threshold: 0.15,
  })
  /** Cualquier intersección con el viewport (umbral 0): para el backdrop negro, antes que el de Reveal a 0.15. */
  const nuestraHistoriaInViewport = useRevealWhenVisible(nuestraHistoriaSectionRef, {
    enabled: loaderExited,
    threshold: 0,
  })

  /** true solo con scroll del hero en 0: al bajar, el Reveal de Services se revierte. */
  const [heroScrollAtStart, setHeroScrollAtStart] = useState(true)
  const onHeroScrollProgress = useCallback((progress) => {
    const atStart = progress < 0.002
    setHeroScrollAtStart((prev) => (prev === atStart ? prev : atStart))
  }, [])

  const {
    pinRef,
    simetraRef,
    simetraTiltRef,
    zanjaRef,
    blackOverlayRef,
    camionRef,
  } = useHero({
    isLoaded,
    loaderExited,
    onHeroScrollProgress,
  })

  /** Mide la capa solo animada por scroll (S2→S3), no la del pin del hero. */
  const scrollBlackOverlaySolid = useVisuallySolidBlack(scrollBlackOverlayRef, {
    enabled: loaderExited,
  })

  const nuestraHistoriaBlackBackdropOn =
    nuestraHistoriaInViewport && scrollBlackOverlaySolid

  /** Tras el loader y en cada cambio de viewport, recalcula pin/scroll para evitar cortes y solapes. */
  useScrollTriggerRefresh(loaderExited)

  const onHistorialLineDrawProgress = useCallback((p) => {
    setHistoriaLineDrawProgress(p)
  }, [])

  useSvgPathDrawOnScroll({
    pathRef: historiaLinePathRef,
    lineStartRef: historiaLineScrollStartRef,
    sectionRef: nuestraHistoriaSectionRef,
    enabled: loaderExited,
    start: 'top 88%',
    end: 'bottom bottom',
    scrub: 0.45,
    onLineDrawProgress: onHistorialLineDrawProgress,
  })

  useGSAP(
    () => {
      if (!loaderExited) return

      const el = scrollBlackOverlayRef.current
      if (!el) return

      gsap.to(el, {
        opacity: 1,
        overwrite: 'auto',
        scrollTrigger: {
          trigger: "[data-section='asi-trabajamos']",
          start: 'top bottom',
          end: 'top 10%',
          scrub: true,
          preventOverlaps: true,
          fastScrollEnd: true,
        },
      })
    },
    { dependencies: [loaderExited] },
  )

  return (
    <>
      {showLoader && (
        <LoadingScreen
          isLoaded={isLoaded}
          onExit={() => setShowLoader(false)}
        />
      )}

      <main>
        <section
          data-section="hero"
          className="relative h-dvh min-h-dvh overflow-hidden"
        >
          <div
            ref={pinRef}
            className="relative flex h-full min-h-0 min-w-0 w-full flex-col overflow-hidden"
          >
            <div className="absolute inset-0 min-h-0 min-w-0">
              <img src={Cielo} alt="" aria-hidden className="h-full w-full min-h-0 object-cover" />
            </div>
            <div className="pointer-events-none absolute inset-0 z-5 bg-black opacity-0 will-change-[opacity]" aria-hidden />
            <div ref={simetraRef} className="pointer-events-none absolute left-1/2 top-1/3 z-10 flex h-full w-4/5 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 will-change-[opacity]" style={{ perspective: '1100px' }}>
              <div ref={simetraTiltRef} className="flex h-full w-full items-center justify-center will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
                <img src={Simetra} alt="Simetra" className="h-full max-h-screen w-full object-contain transform-[translateZ(0)]"/>
              </div>
            </div>
            <div ref={zanjaRef} className={['absolute left-0 z-20 w-full will-change-transform',isMobile ? 'bottom-0 h-full' : 'bottom-[-20%]',].join(' ')}>
              <img src={Zanja} alt="fondo de zanja" aria-hidden className="relative z-1 h-full w-full object-cover"/>
            </div>
            {/*
              Capas negras a todo el alto del hero (inset-0). Si van dentro de la zanja, en tablet/laptop
              el bloque con bottom-[-20%] no llega al top y el fade parece empezar a mitad de pantalla.
            */}
            <div className="pointer-events-none absolute inset-0 z-22" aria-hidden>
              <div
                ref={blackOverlayRef}
                className="absolute inset-0 bg-black opacity-0 will-change-[opacity]"
              />
              <div
                ref={scrollBlackOverlayRef}
                className="absolute inset-0 bg-black opacity-0 will-change-[opacity]"
              />
            </div>

            {!isMobile && (
              <div ref={camionRef} className="pointer-events-none absolute left-0 top-0 z-30 flex w-full justify-center will-change-transform">
                <img src={Camion} alt="Camión" className="h-dvh max-h-dvh max-w-none object-contain"/>
              </div>
            )}

            <div className="relative z-40 flex min-h-0 w-full flex-1 flex-col justify-center items-end px-4 md:px-10">
              <div ref={servicesBlockRef} className="relative w-auto">
                <SectionTitle text="Services S.A"isLoaded={servicesInView && heroScrollAtStart} className="text-right text-2xl tracking-tight text-white md:text-4xl"/>
              </div>
            </div>
          </div>
        </section>
        <section ref={asiTrabajamosSectionRef} data-section="asi-trabajamos" className="relative isolate box-border flex min-h-screen mb-[-10vh] flex-col overflow-hidden text-white bg-transparent">
          <div className="relative z-20 flex min-h-0 w-full flex-1 flex-col items-center px-4 pt-[clamp(4rem,14vh,8rem)]">
            <SectionTitle key={asiTrabajamosInView ? 'asi-trabajamos-visible' : 'asi-trabajamos-hidden'} text="Así trabajamos" isLoaded={asiTrabajamosInView}/>
            <CylinderCarousel images={ASI_TRABAJAMOS_IMAGES} visible={loaderExited && asiTrabajamosInView}/>
          </div>
        </section>
        <section
          ref={nuestraHistoriaSectionRef}
          data-section="nuestra-historia"
          className="relative isolate flex min-h-[2000px] flex-col overflow-hidden bg-transparent text-white"
        >
          <div
            className={[
              'pointer-events-none absolute inset-0 z-1 bg-black transition-opacity duration-300 ease-out',
              nuestraHistoriaBlackBackdropOn ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            aria-hidden
          />
          <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-16 pt-[clamp(4rem,14vh,8rem)]">
            <SectionTitle text="Nuestra historia" isLoaded={nuestraHistoriaInView} />
            <div
              ref={historiaLineScrollStartRef}
              className="h-0 w-full max-w-full shrink-0"
              aria-hidden
            />
          </div>
          <div className="pointer-events-none absolute left-0 top-0 z-5 h-full w-full min-w-0 overflow-visible">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1781"
              height="2070"
              viewBox="0 0 1781 2070"
              fill="none"
              className="h-auto w-full max-w-[min(100%,1781px)]"
              preserveAspectRatio="xMinYMin meet"
              aria-hidden
            >
              <path
                ref={historiaLinePathRef}
                d="M1.30273 1.50928C1.30273 1.50928 444.347 384.968 1182.65 264.762C1388.65 231.221 1801.15 419.188 1777.31 899.14C1750.93 1430.34 1568.78 1594.18 1182.64 1514.55C110.803 1293.51 166.303 2069.01 166.303 2069.01"
                stroke="#6CBFE0"
                strokeWidth="4"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <NuestraHistoriaQuartileMarkers
                pathRef={historiaLinePathRef}
                parts={NUESTRA_HISTORIA_PARTS}
                lineColor="#6CBFE0"
                lineDrawProgress={historiaLineDrawProgress}
              />
            </svg>
          </div>
          
        </section>
      </main>
    </>
  )
}