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
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  const [asiTrabajamosBackdropVisible, setAsiTrabajamosBackdropVisible] =
    useState(false)
  const asiTrabajamosSectionRef = useRef(null)
  const nuestraHistoriaSectionRef = useRef(null)
  const servicesBlockRef = useRef(null)

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

  const onAsiTrabajamosRevealChange = useCallback((visible) => {
    setAsiTrabajamosBackdropVisible(visible)
  }, [])

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
    onAsiTrabajamosRevealChange,
    onHeroScrollProgress,
  })

  useGSAP(
    () => {
      if (!loaderExited) return
      const el = asiTrabajamosSectionRef.current
      if (!el) return
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => setAsiTrabajamosBackdropVisible(true),
      })
      return () => st.kill()
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
          className="relative h-screen min-h-screen overflow-hidden"
        >
          <div
            ref={pinRef}
            className="relative flex h-full min-h-0 w-full flex-col overflow-hidden"
          >
            <div className="absolute inset-0">
              <img src={Cielo} alt="" aria-hidden className="h-full w-full object-cover" />
            </div>

            <div
              ref={simetraRef}
              className="pointer-events-none absolute left-1/2 top-1/3 z-10 flex h-full w-4/5
                         -translate-x-1/2 -translate-y-1/2 items-center justify-center
                         opacity-0 will-change-[opacity]"
              style={{ perspective: '1100px' }}
            >
              <div
                ref={simetraTiltRef}
                className="flex h-full w-full items-center justify-center will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={Simetra}
                  alt="Simetra"
                  className="h-full max-h-screen w-full object-contain [transform:translateZ(0)]"
                />
              </div>
            </div>

            <div
              ref={zanjaRef}
              className={[
                'absolute left-0 z-20 w-full will-change-transform',
                isMobile ? 'bottom-0 h-full' : 'bottom-[-20%]',
              ].join(' ')}
            >
              <img
                src={Zanja}
                alt=""
                aria-hidden
                className="relative z-[1] h-full w-full object-cover"
              />
              <div
                ref={blackOverlayRef}
                className="pointer-events-none absolute inset-0 z-[15] bg-black opacity-0 will-change-[opacity]"
                aria-hidden
              />
            </div>

            {!isMobile && (
              <div
                ref={camionRef}
                className="pointer-events-none absolute left-0 top-0 z-30 flex w-full justify-center will-change-transform"
              >
                <img
                  src={Camion}
                  alt="Camión"
                  className="h-screen max-w-none object-contain"
                />
              </div>
            )}

            <div
              className="relative z-40 flex min-h-0 w-full flex-1 flex-col justify-center
                         items-end px-4 md:px-10"
            >
              <div ref={servicesBlockRef} className="relative w-auto">
                <SectionTitle
                  text="Services S.A"
                  isLoaded={servicesInView && heroScrollAtStart}
                  className="text-right text-2xl tracking-tight text-white md:text-4xl"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          ref={asiTrabajamosSectionRef}
          data-section="asi-trabajamos"
          className="relative isolate box-border flex min-h-screen flex-col overflow-hidden text-white"
        >
          <MotionBackdrop
            className="pointer-events-none absolute inset-0 z-0 bg-black"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: asiTrabajamosBackdropVisible ? 1 : 0 }}
            transition={{ duration: 0.1}}
          />
          <div
            className="relative z-20 flex min-h-0 w-full flex-1 flex-col items-center px-4 pt-[clamp(4rem,14vh,8rem)]"
          >
            <SectionTitle
              key={asiTrabajamosInView ? 'asi-trabajamos-visible' : 'asi-trabajamos-hidden'}
              text="Así trabajamos"
              isLoaded={asiTrabajamosInView}
            />
            <CylinderCarousel
              images={ASI_TRABAJAMOS_IMAGES}
              visible={loaderExited && asiTrabajamosInView}
            />
          </div>
        </section>

        <section
          ref={nuestraHistoriaSectionRef}
          data-section="nuestra-historia"
          className="relative isolate flex min-h-screen flex-col text-white bg-black"
        >

          <div
            className="absolute inset-0 top-[-30%] z-10 flex w-full flex-1 flex-col items-center px-4
                       pb-16 pt-[clamp(4rem,14vh,8rem)]"
          >
            <SectionTitle
              text="Nuestra historia"
              isLoaded={nuestraHistoriaInView}
            />
          </div>
        </section>
      </main>
    </>
  )
}