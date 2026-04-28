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
import { DraftingCompass, Settings, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AppearFrom } from '../../animations/AppearFrom'
import { BounceNudge } from '../../animations/BounceIn'
import { FadeInAndOut } from '../../animations/FadeInAndOut'
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
import { ServicioDiamondCard } from '../../components/section5/ServicioDiamondCard'
import { VacanteCard } from '../../components/section5/VacanteCard'
import { VacantesTransitionShapes } from '../../components/section5/VacantesTransitionShapes'
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

const VACANTES = [
  {
    title: 'Operario de obra civil',
    area: 'Ejecución en campo',
    location: 'Buenos Aires',
    type: 'Tiempo completo',
    mode: 'Presencial',
    salary: 'A convenir',
    description:
      'Para tareas de apoyo en zanjeo, tendido y mantenimiento de infraestructura urbana.',
    requirements: ['Experiencia en obra', 'Disponibilidad horaria', 'Trabajo en equipo'],
  },
  {
    title: 'Técnico en redes',
    area: 'Infraestructura',
    location: 'Zona norte',
    type: 'Tiempo completo',
    mode: 'Mixto',
    salary: 'A convenir',
    description:
      'Buscamos perfil técnico para relevamientos, soporte de cuadrillas y control de avances.',
    requirements: ['Lectura de planos', 'Manejo de herramientas', 'Registro de avances'],
  },
  {
    title: 'Coordinador de proyectos',
    area: 'Planificación',
    location: 'CABA / AMBA',
    type: 'Full time',
    mode: 'Híbrido',
    salary: 'A definir',
    description:
      'Rol orientado a coordinar equipos, organizar cronogramas y acompañar la entrega de proyectos.',
    requirements: ['Gestión de equipos', 'Comunicación clara', 'Seguimiento de KPIs'],
  },
]

const NUESTROS_SERVICIOS = [
  {
    title: 'Dirección de Proyectos',
    Icon: DraftingCompass,
    description:
      'Los clientes cada vez más exigentes con el nivel de calidad de sus proveedores, requieren con frecuencia para sus instalaciones un interlocutor que coordine y dirija todo el proceso. Esta coordinación debe ser llevada a cabo por técnicos con demostrada experiencia en la gestión de proyectos en todas sus fases.',
  },
  {
    title: 'Asesoría técnica',
    Icon: Wrench,
    description:
      'La experiencia adquirida por nuestros Profesionales, Supervisores y Encargados de Producción y Servicio, con la creación de vínculos de asistencia con empresas consultoras de distintas especialidades, permiten a SIMETRA SERVICE S.A ofrecer a sus clientes una amplia y flexible gama de servicios de ingeniería.',
  },
  {
    title: 'Montajes mecánicos y eléctricos',
    Icon: Settings,
    description:
      'Desarrollo de proyectos mecánicos y/o eléctricos de instalaciones y procesos industriales, tales como plantas de tratamiento, plantas de inyección e instalaciones de campo',
  },
]

const MotionBackdrop = motion.div

/** Cortina al cerrar el detalle: evita el “corte” al quitar `hidden` de las secciones 1–3. */
const CORTINA = { off: 'off', blocking: 'blocking', fading: 'fading' }

export default function HomePage() {
  const { isMobile, isDesktop, isPhone } = useDeviceType()
  const { isLoaded } = usePageLoader([], 8_000)
  const [showLoader, setShowLoader] = useState(true)
  const { setNavLightBlend, setNavBackdropBlend, setNavReloadHomeOnClick } = useHomeNavTheme()
  /** Ref al wrapper del hero: scroll spy de la barra (tema claro/oscuro). */
  const heroSectionRef = useRef(null)
  /**
   * En “proyectos recientes”: si se pulsa un título, el nav vuelve a tema oscuro
   * hasta que se salga de la sección 4.
   */
  const [proyectoRecientePresionadoId, setProyectoRecientePresionadoId] = useState(null)
  const [detalleMediaVisible, setDetalleMediaVisible] = useState(false)
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
  const vacantesSectionRef = useRef(null)
  const nuestrosServiciosSectionRef = useRef(null)
  const detalleProyectoScrollRef = useRef(null)
  const detalleTouchStartYRef = useRef(null)
  const volverSubirNudgeLastRef = useRef(0)
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
  const [detalleCubiertoPorVacantes, setDetalleCubiertoPorVacantes] = useState(false)

  const activeHomeSection = useHomeNavSectionAt({
    heroRef: heroSectionRef,
    s2Ref: asiTrabajamosSectionRef,
    s3Ref: nuestraHistoriaSectionRef,
    s4Ref: proyectosRecientesSectionRef,
    s5Ref: vacantesSectionRef,
    enabled: loaderExited,
  })

  const barNavLightBlend = useMemo(() => {
    if (activeHomeSection === 'vacantes') {
      return 0
    }
    if (proyectoRecientePresionadoId) {
      return 1
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
    setNavBackdropBlend(ocultoPorDetalle && activeHomeSection !== 'vacantes' && !isPhone ? 1 : 0)
  }, [activeHomeSection, isPhone, ocultoPorDetalle, setNavBackdropBlend])

  useEffect(() => {
    setNavReloadHomeOnClick(ocultoPorDetalle)
  }, [ocultoPorDetalle, setNavReloadHomeOnClick])

  useEffect(() => {
    return () => {
      setNavLightBlend(0)
      setNavBackdropBlend(0)
      setNavReloadHomeOnClick(false)
    }
  }, [setNavBackdropBlend, setNavLightBlend, setNavReloadHomeOnClick])

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
    setDetalleMediaVisible(false)
    setDirecciónDetalleMovil(0)
    setHeroScrollRebuildKey((k) => k + 1)
    window.setTimeout(() => {
      setCierreCortina(CORTINA.fading)
    }, 0)
  }, [cierreCortina])

  const activarVolverDesdeScroll = useCallback(() => {
    const now = performance.now()
    if (now - volverSubirNudgeLastRef.current < 260) return
    volverSubirNudgeLastRef.current = now
    window.setTimeout(handleCerrarDetalleProyecto, 120)
  }, [handleCerrarDetalleProyecto])

  const handleDetalleProyectoWheel = useCallback((event) => {
    if (event.deltaY < 0) {
      activarVolverDesdeScroll()
    }
  }, [activarVolverDesdeScroll])

  const handleDetalleProyectoTouchStart = useCallback((event) => {
    detalleTouchStartYRef.current = event.touches[0]?.clientY ?? null
  }, [])

  const handleDetalleProyectoTouchEnd = useCallback((event) => {
    const startY = detalleTouchStartYRef.current
    detalleTouchStartYRef.current = null
    const endY = event.changedTouches[0]?.clientY
    if (startY == null || endY == null) return
    if (endY - startY > 48) {
      activarVolverDesdeScroll()
    }
  }, [activarVolverDesdeScroll])

  const handleCambiarProyectoMovil = useCallback((delta) => {
    setDirecciónDetalleMovil(delta)
    setDetalleMediaVisible(false)
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

  useEffect(() => {
    let frame = null

    const update = () => {
      if (frame != null) return
      frame = requestAnimationFrame(() => {
        frame = null
        const top = vacantesSectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
        const cubierto = ocultoPorDetalle && top <= 1
        setDetalleCubiertoPorVacantes((prev) => (prev === cubierto ? prev : cubierto))
      })
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      if (frame != null) {
        cancelAnimationFrame(frame)
      }
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
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
  const vacantesInView = useRevealWhenVisible(vacantesSectionRef, {
    enabled: loaderExited,
    threshold: 0.12,
  })
  const nuestrosServiciosInView = useRevealWhenVisible(nuestrosServiciosSectionRef, {
    enabled: loaderExited,
    threshold: 0.12,
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
              ? [
                  'relative isolate flex min-h-0 flex-col pt-0 md:pt-20',
                  isPhone && detalleMediaVisible
                    ? 'h-auto max-h-none overflow-visible'
                    : 'h-dvh max-h-dvh overflow-hidden',
                ].join(' ')
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
            {ocultoPorDetalle && !isPhone ? (
              <img
                src={logobgWhite}
                alt=""
                aria-hidden
                className="pointer-events-none absolute top-2 left-1/2 z-11000 h-20 w-20 -translate-x-1/2 drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
              />
            ) : null}
            <div
              className={[
                'flex flex-col py-4 items-center md:flex-row md:items-center',
                ocultoPorDetalle
                  ? 'justify-start gap-2 px-4 md:justify-start md:gap-2'
                  : 'justify-center sm:px-8 md:justify-around md:gap-6',
              ].join(' ')}
            >
              <h1 className={`text-center font-bold text-white uppercase ${ocultoPorDetalle ? 'text-xl' : 'text-xl md:text-5xl'}`}>
                Proyectos
              </h1>
              <div className={ocultoPorDetalle ? 'hidden' : 'relative w-full'}>
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
                    'w-20 h-20 transition-all ease-out duration-300 left-1/2 -translate-x-1/2 ml-0 drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]',
                    'hidden',
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
                        setDetalleMediaVisible(false)
                        setProyectoRecientePresionadoId(proyecto.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setDirecciónDetalleMovil(0)
                          setDetalleMediaVisible(false)
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
          {ocultoPorDetalle && !detalleCubiertoPorVacantes && (
            <div className="relative z-30 h-0">
              <AppearFrom
                from="left"
                id="volver-media-proyecto"
                visible={detalleMediaVisible}
                className="pointer-events-none absolute top-0 left-0 w-full overflow-visible"
                motionClassName="pointer-events-auto"
              >
                <FadeInAndOut visible={detalleMediaVisible} variant="opacity" duration={0.25} delay={0}>
                  <button
                    type="button"
                    onClick={() => setDetalleMediaVisible(false)}
                    className="bg-black/85 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#6CBFE0] shadow-lg transition hover:bg-black hover:text-white"
                  >
                    Volver
                  </button>
                </FadeInAndOut>
              </AppearFrom>
            </div>
          )}
          {!ocultoPorDetalle && (
            <p className="cursor-pointer px-4 py-10 text-center text-lg font-bold text-white sm:text-2xl">
              Selecciona el Proyecto para ver el detalle →
            </p>
          )}
          {ocultoPorDetalle && proyectoSeleccionado && !detalleCubiertoPorVacantes && (
            <div
              ref={detalleProyectoScrollRef}
              onWheel={handleDetalleProyectoWheel}
              onTouchStart={handleDetalleProyectoTouchStart}
              onTouchEnd={handleDetalleProyectoTouchEnd}
              className={[
                'relative z-0 min-h-0 w-full min-w-0',
                isPhone && detalleMediaVisible
                  ? 'h-auto flex-none overflow-visible'
                  : 'h-full flex-1 overflow-y-auto',
              ].join(' ')}
            >
              <DetailsProyect
                proyecto={proyectoSeleccionado}
                isPhone={isPhone}
                onVerMedia={() => setDetalleMediaVisible(true)}
                mediaVisible={detalleMediaVisible}
                direcciónSlide={direcciónDetalleMovil}
                onCambiarProyecto={isPhone ? handleCambiarProyectoMovil : undefined}
                onCerrar={handleCerrarDetalleProyecto}
              />
            </div>
          )}
        </section>
        <section
          ref={vacantesSectionRef}
          data-section="vacantes"
          className="relative z-10000 isolate overflow-visible rounded-t-4xl bg-white text-black"
        >
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#6CBFE0]/25 blur-3xl" />
            <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-black/8 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#6CBFE0]/14 to-transparent" />
          </div>
          <VacantesTransitionShapes
            enabled={loaderExited}
            vacantesSectionRef={vacantesSectionRef}
            serviciosSectionRef={nuestrosServiciosSectionRef}
          />

          <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-20 sm:px-6 md:px-10 md:py-28">
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="rounded-full border border-[#6CBFE0]/60 bg-[#6CBFE0]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#217a9f]">
                Sumate al equipo
              </span>
              <SectionTitle
                text="Vacantes"
                isLoaded={vacantesInView}
                className="text-center text-4xl font-bold uppercase tracking-tight text-black md:text-6xl"
              />
              <p className="max-w-2xl text-center text-xl leading-relaxed text-black/70 md:text-2xl">
                Estamos armando nuevos equipos para próximos proyectos. Estas búsquedas son
                ficticias por ahora, pero muestran el formato que tendrá la sección.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
              {VACANTES.map((vacante, index) => (
                <VacanteCard
                  key={vacante.title}
                  vacante={vacante}
                  index={index}
                  visible={vacantesInView}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-5 rounded-3xl border border-black/10 bg-black px-6 py-7 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] md:px-10">
              <p className="text-xl leading-relaxed md:text-2xl">
                ¿No ves una vacante para vos? Pronto vamos a sumar más búsquedas para obra,
                logística y administración.
              </p>
              <Link
                to="/postulacion"
                className="inline-flex items-center justify-center rounded-full border border-[#6CBFE0] bg-[#6CBFE0] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-black transition duration-300 hover:bg-transparent hover:text-[#6CBFE0]"
              >
                Ver todos los puestos
              </Link>
            </div>
          </div>
        </section>
        <section
          ref={nuestrosServiciosSectionRef}
          data-section="nuestros-servicios"
          className="relative z-10001 isolate min-h-dvh overflow-hidden bg-transparent text-black"
        >
          <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col items-center px-4 py-24 sm:px-6 md:px-10 md:py-32">
            <div className="relative z-50 rounded-full px-6 py-3">
              <SectionTitle
                text="Nuestros servicios"
                isLoaded={nuestrosServiciosInView}
                className="text-center text-4xl font-bold uppercase tracking-tight text-black md:text-6xl"
              />
            </div>

            <div className="relative mt-12 flex min-h-288 w-full flex-col items-center gap-24 md:mt-10 md:min-h-216 md:block">
              {NUESTROS_SERVICIOS.map((servicio, index) => (
                <ServicioDiamondCard
                  key={servicio.title}
                  servicio={servicio}
                  index={index}
                  visible={nuestrosServiciosInView}
                  autoRevealOnView={isPhone}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}