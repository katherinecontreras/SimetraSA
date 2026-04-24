/**
 * pages/home/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Página de inicio. Orquesta el loader y las secciones (hero y siguientes inline).
 *
 * Notas de diseño:
 *  - `showLoader` controla el montaje del LoadingScreen; cuando se desmonta
 *    (`loaderExited`) las animaciones de scroll/tilt del Hero se activan.
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

import { BounceNudge } from '../../animations/BounceIn'
import { useProyectosRecientesScrollGate } from '../../hooks/home/useProyectosRecientesScrollGate'
import { useScrollTriggerRefresh } from '../../hooks/useScrollTriggerRefresh'
import { useSvgPathDrawOnScroll } from '../../hooks/home/useSvgPathDrawOnScroll'
import { useVisuallySolidBlack } from '../../hooks/home/useVisuallySolidBlack'

import { SectionTitle } from '../../components/SectionTitle'
import { useHero } from '../../hooks/home/useHero'
import { useRevealWhenVisible } from '../../hooks/useRevealWhenVisible'
import { useHomeNavTheme } from '../../context/HomeNavThemeContext'
import { useHomeNavSectionAt } from '../../hooks/home/useHomeNavSectionAt'
import { heroNavBlendFromScrollProgress } from '../../hooks/home/useHeroScroll'
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

import logobgBlack from '../../assets/section4/logoBGBLACK.png'
import logobgWhite from '../../assets/section4/logoBGWHITE.png'

import { CylinderCarousel } from '../../components/section2/CylinderCarousel'
import { DetailsProyect } from '../../components/section4/DetailsProyect'
import { NuestraHistoriaMobileStack } from '../../components/section3/NuestraHistoriaMobileStack'
import { NuestraHistoriaQuartileLabels } from '../../components/section3/NuestraHistoriaQuartileLabels'
import { NuestraHistoriaQuartileMarkers } from '../../components/section3/NuestraHistoriaQuartileMarkers'
import { NUESTRA_HISTORIA_PARTS } from '../../constants/nuestraHistoria'
import { PROYECTOS_RECIENTES } from '../../constants/proyectosRecientes'
/** Solo assets de `src/assets/section2/`. */
const ASI_TRABAJAMOS_IMAGES = [
  section2Img1,
  section2Img2,
  section2Img3,
  section2Img4,
  section2Img5,
]

const MotionBackdrop = motion.div

/** Cortina al cerrar el detalle: evita el “corte” al quitar `hidden` de las secciones 1–3. */
const CORTINA = { off: 'off', blocking: 'blocking', fading: 'fading' }

export default function HomePage() {
  const { isMobile, isDesktop, isPhone } = useDeviceType()
  const { isLoaded } = usePageLoader([], 8_000)
  const [showLoader, setShowLoader] = useState(true)
  const { setNavLightBlend } = useHomeNavTheme()
  /** Ref al wrapper del hero: scroll spy de la barra (tema claro/oscuro). */
  const heroSectionRef = useRef(null)
  /**
   * En “proyectos recientes”: si se pulsa un título, el nav vuelve a tema oscuro
   * hasta que se salga de la sección 4.
   */
  const [proyectoRecientePresionadoId, setProyectoRecientePresionadoId] = useState(null)
  /**
   * Al volver de la vista detalle, sube y fuerza a useHeroScroll a recrear el ScrollTrigger
   * (el hero en display:none deja el pin en estado inválido → pantalla en blanco).
   */
  const [heroScrollRebuildKey, setHeroScrollRebuildKey] = useState(0)
  /** Al volver del detalle: `blocking` = pantalla bajo cortina, luego `fading` = desvanece. */
  const [cierreCortina, setCierreCortina] = useState(CORTINA.off)
  /** 0..1, transición al nav claro mientras bajas el hero (misma lógica que el overlay negro). */
  const [heroNavBlend, setHeroNavBlend] = useState(0)
  /** Opacidad del fondo de la sección (sigue al scroll del hero; puede bajar al volver arriba). */
  const asiTrabajamosSectionRef = useRef(null)
  const nuestraHistoriaSectionRef = useRef(null)
  /** Tope de scroll en el inicio de “proyectos recientes” (sección 4). */
  const proyectosRecientesSectionRef = useRef(null)
  /** Atrás: detectar cierre de detalle (antes: detalle abierto, ahora: lista). */
  const prevOcultoDetalleRef = useRef(false)
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

  const ocultoPorDetalle = Boolean(proyectoRecientePresionadoId)

  const activeHomeSection = useHomeNavSectionAt({
    heroRef: heroSectionRef,
    s2Ref: asiTrabajamosSectionRef,
    s3Ref: nuestraHistoriaSectionRef,
    s4Ref: proyectosRecientesSectionRef,
    enabled: loaderExited && !ocultoPorDetalle,
  })

  const barNavLightBlend = useMemo(() => {
    if (proyectoRecientePresionadoId) {
      return 0
    }
    if (activeHomeSection === 'asi-trabajamos' || activeHomeSection === 'nuestra-historia') {
      return 1
    }
    if (activeHomeSection === 'proyectos-recientes') {
      return 1
    }
    if (activeHomeSection === 'hero') {
      return heroNavBlend
    }
    return 0
  }, [activeHomeSection, proyectoRecientePresionadoId, heroNavBlend])

  useEffect(() => {
    setNavLightBlend(barNavLightBlend)
  }, [barNavLightBlend, setNavLightBlend])

  useEffect(() => {
    return () => setNavLightBlend(0)
  }, [setNavLightBlend])

  const proyectoSeleccionado = useMemo(
    () => PROYECTOS_RECIENTES.find((p) => p.id === proyectoRecientePresionadoId) ?? null,
    [proyectoRecientePresionadoId],
  )

  /**
   * 0 = apertura desde la lista; 1 = flecha “siguiente”; -1 = “anterior”.
   * (El deslizamiento en `DetailsProyect` móvil depende de esto.)
   */
  const [direcciónDetalleMovil, setDirecciónDetalleMovil] = useState(0)

  const handleCerrarDetalleProyecto = useCallback(() => {
    if (cierreCortina !== CORTINA.off) return
    setCierreCortina(CORTINA.blocking)
    setProyectoRecientePresionadoId(null)
    setDirecciónDetalleMovil(0)
    setHeroScrollRebuildKey((k) => k + 1)
    window.setTimeout(() => {
      setCierreCortina(CORTINA.fading)
    }, 0)
  }, [cierreCortina])

  const handleCambiarProyectoMovil = useCallback((delta) => {
    setDirecciónDetalleMovil(delta)
    setProyectoRecientePresionadoId((currentId) => {
      const idx = PROYECTOS_RECIENTES.findIndex((p) => p.id === currentId)
      if (idx < 0) return currentId
      const n = PROYECTOS_RECIENTES.length
      return PROYECTOS_RECIENTES[(idx + delta + n) % n].id
    })
  }, [])

  useEffect(() => {
    if (!isPhone || !proyectoRecientePresionadoId) return
    const el = document.getElementById(`proyecto-titulo-chip-${proyectoRecientePresionadoId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [isPhone, proyectoRecientePresionadoId])

  useLayoutEffect(() => {
    if (!ocultoPorDetalle) return
    window.scrollTo(0, 0)
  }, [ocultoPorDetalle])

  useLayoutEffect(() => {
    const wasOpen = prevOcultoDetalleRef.current
    prevOcultoDetalleRef.current = ocultoPorDetalle
    if (!wasOpen || ocultoPorDetalle) return

    const run = () => {
      ScrollTrigger.refresh()
      proyectosRecientesSectionRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'auto',
      })
      ScrollTrigger.refresh()
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        run()
        window.setTimeout(() => ScrollTrigger.refresh(), 120)
        window.setTimeout(() => ScrollTrigger.refresh(), 400)
      })
    })
  }, [ocultoPorDetalle])

  useEffect(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [ocultoPorDetalle])

  useEffect(() => {
    if (cierreCortina === CORTINA.off) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [cierreCortina])

  useEffect(() => {
    if (cierreCortina !== CORTINA.fading) return
    const t = window.setTimeout(() => {
      setCierreCortina(CORTINA.off)
    }, 800)
    return () => window.clearTimeout(t)
  }, [cierreCortina])

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
    setHeroNavBlend(heroNavBlendFromScrollProgress(progress))
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
    isNarrowViewport: isMobile,
    onHeroScrollProgress,
    heroScrollRebuildKey,
  })

  /** Mide la capa solo animada por scroll (S2→S3), no la del pin del hero. */
  const scrollBlackOverlaySolid = useVisuallySolidBlack(scrollBlackOverlayRef, {
    enabled: loaderExited,
  })

  const nuestraHistoriaBlackBackdropOn =
    nuestraHistoriaInViewport && scrollBlackOverlaySolid

  /** Trazo SVG + botones solo en PC con ventana ≥1024px (excluye tlf y tablet). */
  const showNuestraHistoriaSvg = isDesktop

  const { nudgeCount: proyectosNudgeCount } = useProyectosRecientesScrollGate({
    sectionRef: proyectosRecientesSectionRef,
    enabled: loaderExited,
  })

  /** Tras el loader y en cada cambio de viewport, recalcula pin/scroll para evitar cortes y solapes. */
  useScrollTriggerRefresh(loaderExited)

  const onHistorialLineDrawProgress = useCallback((p) => {
    setHistoriaLineDrawProgress(p)
  }, [])

  useSvgPathDrawOnScroll({
    pathRef: historiaLinePathRef,
    lineStartRef: historiaLineScrollStartRef,
    sectionRef: nuestraHistoriaSectionRef,
    enabled: loaderExited && showNuestraHistoriaSvg,
    start: 'top 90%',
    end: 'bottom bottom',
    /* ~120 ms: sigue al scroll sin el retraso de 0,45; el final va acorde al cierre de la sección. */
    scrub: 0.12,
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

      {cierreCortina !== CORTINA.off && (
        <div
          aria-hidden
          className={[
            'pointer-events-auto fixed inset-0 z-200 bg-black will-change-[opacity]',
            cierreCortina === CORTINA.blocking && 'opacity-100',
            cierreCortina === CORTINA.fading &&
              'opacity-0 transition-opacity duration-700 ease-in-out',
          ]
            .filter(Boolean)
            .join(' ')}
          onTransitionEnd={(e) => {
            if (e.propertyName !== 'opacity' || e.target !== e.currentTarget) return
            setCierreCortina((prev) => (prev === CORTINA.fading ? CORTINA.off : prev))
          }}
        />
      )}

      <main className="min-w-0">
        <section
          ref={heroSectionRef}
          data-section="hero"
          className={['relative h-dvh min-h-dvh overflow-hidden', ocultoPorDetalle && 'hidden'].filter(Boolean).join(' ')}
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
          className={[
            'relative isolate box-border flex min-h-0 flex-col overflow-hidden text-white bg-transparent max-sm:mb-0 sm:mb-[-10vh] sm:min-h-screen',
            ocultoPorDetalle && 'hidden',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="relative z-20 flex w-full min-w-0 max-w-full flex-col items-center px-3 pt-[clamp(3.5rem,12vh,8rem)] sm:min-h-0 sm:flex-1 sm:px-4 sm:pt-[clamp(4rem,14vh,8rem)] min-[1024px]:min-h-0 min-[1024px]:pb-[min(28vh,12rem)] max-sm:pb-8">
            <SectionTitle
              key={asiTrabajamosInView ? 'asi-trabajamos-visible' : 'asi-trabajamos-hidden'}
              text="Así trabajamos"
              isLoaded={asiTrabajamosInView}
            />
            <CylinderCarousel
              images={ASI_TRABAJAMOS_IMAGES}
              visible={loaderExited && asiTrabajamosInView}
              isPhone={isPhone}
            />
          </div>
        </section>
        <section
          ref={nuestraHistoriaSectionRef}
          data-section="nuestra-historia"
          className={[
            'relative isolate flex min-h-[50vh] flex-col overflow-x-clip overflow-y-visible bg-transparent text-white min-[1024px]:min-h-[min(max(min(calc(100vw*2070/1781+1rem),2100px),115vh),2800px)]',
            ocultoPorDetalle && 'hidden',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={[
              'pointer-events-none absolute inset-0 z-1 bg-black transition-opacity duration-300 ease-out',
              nuestraHistoriaBlackBackdropOn ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            aria-hidden
          />
          <div className="relative z-20 flex w-full min-w-0 flex-1 flex-col items-center px-3 pb-12 md:pt-[clamp(3.5rem,12vh,8rem)] sm:px-4 sm:pb-16 sm:pt-0">
            <SectionTitle
              text="Nuestra historia"
              isLoaded={nuestraHistoriaInView}
              className="text-center text-3xl font-bold tracking-tight text-balance md:text-5xl"
            />
            {showNuestraHistoriaSvg && (
              <div
                ref={historiaLineScrollStartRef}
                className="h-0 w-full max-w-full shrink-0"
                aria-hidden
              />
            )}
            {!showNuestraHistoriaSvg && (
              <NuestraHistoriaMobileStack
                parts={NUESTRA_HISTORIA_PARTS}
                enabled={loaderExited}
              />
            )}
          </div>
          {showNuestraHistoriaSvg && (
            <div className="pointer-events-none absolute inset-0 z-5 min-h-0 w-full min-w-0 sm:pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1781"
                height="2070"
                viewBox="0 0 1781 2070"
                fill="none"
                className="h-auto w-full min-w-0 min-[1024px]:mb-[min(7rem,10vh)] min-[1024px]:max-w-[min(100%,1781px)] overflow-visible"
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
                <NuestraHistoriaQuartileLabels
                  pathRef={historiaLinePathRef}
                  parts={NUESTRA_HISTORIA_PARTS}
                  lineDrawProgress={historiaLineDrawProgress}
                />
                <NuestraHistoriaQuartileMarkers
                  pathRef={historiaLinePathRef}
                  parts={NUESTRA_HISTORIA_PARTS}
                  lineColor="#6CBFE0"
                  lineDrawProgress={historiaLineDrawProgress}
                />
              </svg>
            </div>
          )}
        </section>
        <section
          ref={proyectosRecientesSectionRef}
          data-section="proyectos-recientes"
          className={[
            'transition-[padding,background-color] bg-black duration-500 ease-out',
            ocultoPorDetalle
              ? 'relative isolate flex h-dvh max-h-dvh min-h-0 flex-col overflow-hidden pt-0 md:pt-20'
              : 'pt-16 md:pt-62',
          ].join(' ')}
        >
          <div
            id="titulo-proyectos-recientes"
            className={[
              'w-full border-y-4 border-solid border-[#6CBFE0] md:px-32',
              ocultoPorDetalle ? 'relative z-20 shrink-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex flex-col py-4 items-center justify-center md:gap-6 sm:px-8 md:flex-row md:justify-around md:items-center">
              <h1 className={`text-center font-bold text-white uppercase ${ocultoPorDetalle ? 'text-xl' : 'text-xl md:text-5xl'}`}>
                Proyectos
              </h1>
              <div className='relative w-full'>
                <img src={logobgBlack} alt="logo" 
                className={`md:w-40 w-20 md:h-40 h-20 absolute left-1/2 ${ocultoPorDetalle
                  ? 'md:top-4/4 -top-[400px]  -translate-x-1/2 -translate-y-[400px] '
                  : 'md:top-3/4 -top-20  -translate-x-1/2 -translate-y-3/4 '}`}>
                </img>
                <img
                  src={logobgWhite}
                  alt=""
                  aria-hidden
                  className={[
                    'w-20 h-20 transition-all ease-out duration-300 absolute left-1/2 -translate-x-1/2 ml-0 -top-18 ',
                    ocultoPorDetalle && !isPhone ? 'block' : 'hidden',
                  ].join(' ')}
                />
              </div>
              <h1 className={`text-center font-bold text-white uppercase ${ocultoPorDetalle ? 'text-xl' : 'text-xl md:text-5xl'}`}>
                Recientes
              </h1>
            </div>
          </div>
          <div
            id="titulos-de-cada-pryoecto"
            className={[
              'w-full border-b-2 border-solid border-[#6CBFE0]',
              ocultoPorDetalle ? 'relative z-20 shrink-0' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className={[
                isPhone
                  ? 'scroll-proyectos-tlf box-border flex flex-row flex-nowrap items-stretch justify-start gap-3 overflow-x-auto overscroll-x-contain scroll-smooth py-4 pl-3 pr-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  : 'flex flex-col items-center gap-4 px-4 py-6 sm:px-8 md:flex-row md:justify-around md:gap-2 md:px-12 md:py-4.5 lg:px-20 xl:px-32',
              ].join(' ')}
            >
              {PROYECTOS_RECIENTES.map((proyecto, i) => {
                const activo = proyectoRecientePresionadoId === proyecto.id
                return (
                  <div
                    key={proyecto.id}
                    id={`proyecto-titulo-chip-${proyecto.id}`}
                    className={[
                      isPhone ? 'snap-center shrink-0' : '',
                      isPhone
                        ? [
                            'min-w-0 max-w-[min(78vw,18rem)] flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-transparent px-3 py-2.5',
                            'transition-all duration-300',
                            activo
                              ? 'border-[#6CBFE0] bg-[#6CBFE0]/10 text-[#6CBFE0] shadow-[0_0_20px_rgba(108,191,224,0.2)]'
                              : 'text-white/95 active:bg-white/5',
                          ].join(' ')
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <BounceNudge
                      nudgeId={proyecto.id}
                      tick={proyectosNudgeCount}
                      as={motion.h2}
                      stagger={i * 0.06}
                      onClick={() => {
                        setDirecciónDetalleMovil(0)
                        setProyectoRecientePresionadoId(proyecto.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDirecciónDetalleMovil(0)
                          setProyectoRecientePresionadoId(proyecto.id)
                        }
                      }}
                      className={[
                        isPhone
                          ? 'w-full text-center text-base font-bold uppercase leading-tight'
                          : 'cursor-pointer text-center text-xl font-bold uppercase sm:text-2xl md:text-3xl',
                        isPhone
                          ? activo
                            ? 'text-[#6CBFE0]'
                            : 'text-white/95'
                          : [
                              'cursor-pointer transition-colors duration-300',
                              activo ? 'text-[#6CBFE0]' : 'text-white hover:text-[#6CBFE0]',
                            ].join(' '),
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      tabIndex={0}
                      role="button"
                    >
                      {proyecto.title}
                    </BounceNudge>
                  </div>
                )
              })}
            </div>
          </div>
          {!ocultoPorDetalle && (
            <p className="cursor-pointer px-4 py-10 text-center text-lg font-bold text-white sm:text-2xl">
              Selecciona el Proyecto para seguir →
            </p>
          )}
          {ocultoPorDetalle && proyectoSeleccionado && (
            <div className="relative z-0 h-full min-h-0 w-full min-w-0 flex-1 overflow-y-auto">
              <DetailsProyect
                proyecto={proyectoSeleccionado}
                isPhone={isPhone}
                direcciónSlide={direcciónDetalleMovil}
                onCambiarProyecto={isPhone ? handleCambiarProyectoMovil : undefined}
                onCerrar={handleCerrarDetalleProyecto}
              />
            </div>
          )}
        </section>
      </main>
    </>
  )
}