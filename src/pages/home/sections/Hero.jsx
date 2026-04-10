import Simetra from '../../../assets/seccion1/Simetra.png'
import Zanja from '../../../assets/seccion1/Zanja.png'
import Cielo from '../../../assets/seccion1/Cielo.png'
import Camion3d from '../../../assets/seccion1/Camion3d.png'

import { useRef } from 'react'
import { Reveal } from '../../../animations/Reveal.jsx'

/** Grados máximos de inclinación (ratón y giroscopio) */
const TILT_MAX_DEG = 14
/** Sensibilidad del giroscopio (beta/gamma relativos al primer frame) */
const ORIENT_SENS = 0.22
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Capas: 1 Cielo → 2 Simetra (fija en el pin al hacer scroll) → 3 Zanja pegada al bottom,
 * crece en altura (scaleY 1→2) y el recorte va de abajo arriba → 4 Camión escala y sube.
 * Entrada tras carga: Simetra fade-in; Zanja desde abajo; Camión desde arriba.
 */
export default function Hero({ isLoaded, loaderExited = true, isMobile }) {
  const pinRef = useRef(null)
  const simetraRef = useRef(null)
  const simetraTiltRef = useRef(null)
  const zanjaRef = useRef(null)
  const camionRef = useRef(null)

  /** Intro del hero (solo depende de isLoaded; sin ScrollTrigger aquí para no chocar con el loader) */
  useGSAP(
    () => {
      if (!isLoaded) return

      const simetra = simetraRef.current
      const zanja = zanjaRef.current
      const camion = camionRef.current
      const pin = pinRef.current
      if (!simetra || !zanja || !camion || !pin) return

      const intro = gsap.timeline()

      intro.fromTo(
        simetra,
        { opacity: 0 },
        { opacity: 1, duration: 0.85, ease: 'power2.out' },
      )
      intro.fromTo(
        zanja,
        { scaleY: 0.55, transformOrigin: '50% 100%' },
        {
          scaleY: 1,
          transformOrigin: '50% 100%',
          duration: 0.72,
          ease: 'power2.out',
        },
        0.08,
      )
      intro.fromTo(
        camion,
        { y: '-28vh' },
        { y: 0, duration: 0.85, ease: 'power2.out' },
        0.06,
      )

      return () => {
        intro.kill()
      }
    },
    { dependencies: [isLoaded] },
  )

  /**
   * Scroll + pin: solo cuando el LoadingScreen ya se desmontó.
   * Evita ScrollTrigger.refresh() y el pin en el mismo frame que desaparece el overlay fijo (cortes de movimiento).
   */
  useGSAP(
    () => {
      if (!isLoaded || !loaderExited) return

      const pin = pinRef.current
      const zanja = zanjaRef.current
      const camion = camionRef.current
      if (!pin || !zanja || !camion) return

      let scrollTl = null
      let delayed = null

      const setupScroll = () => {
        ScrollTrigger.refresh()
        scrollTl = gsap
          .timeline({
            scrollTrigger: {
              trigger: pin,
              start: 'top top',
              end: '+=280%',
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(
            zanja,
            {
              scaleY: 2,
              transformOrigin: '50% 100%',
              ease: 'none',
            },
            0,
          )
          .to(
            camion,
            {
              scale: 0,
              y: '-125vh',
              transformOrigin: '50% 40%',
              ease: 'none',
            },
            0,
          )
      }

      delayed = gsap.delayedCall(0.05, setupScroll)

      return () => {
        delayed?.kill()
        if (scrollTl) {
          scrollTl.scrollTrigger?.kill()
          scrollTl.kill()
        }
      }
    },
    { dependencies: [isLoaded, loaderExited] },
  )

  /**
   * Inclinación 3D: escritorio → puntero; móvil/tablet → DeviceOrientation (giro del dispositivo).
   * Debe incluir `loaderExited` en deps: si solo está `isLoaded`, al pasar a loaderExited el efecto no se re-ejecuta y el tilt nunca se engancha.
   */
  useGSAP(
    () => {
      if (!isLoaded || !loaderExited) return

      const pin = pinRef.current
      const tilt = simetraTiltRef.current
      if (!pin || !tilt) return

      gsap.set(tilt, {
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
      })

      const setRotX = gsap.quickTo(tilt, 'rotationX', {
        duration: 0.55,
        ease: 'power2.out',
      })
      const setRotY = gsap.quickTo(tilt, 'rotationY', {
        duration: 0.55,
        ease: 'power2.out',
      })

      const prefersMouse = window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      ).matches

      let baseBeta = null
      let baseGamma = null
      let detachOrientation = null

      const resetTilt = () => {
        setRotX(0)
        setRotY(0)
      }

      const onOrientation = (e) => {
        if (e.beta == null || e.gamma == null) return
        if (baseBeta === null) {
          baseBeta = e.beta
          baseGamma = e.gamma
        }
        const dBeta = e.beta - baseBeta
        const dGamma = e.gamma - baseGamma
        setRotX(
          gsap.utils.clamp(
            -TILT_MAX_DEG,
            TILT_MAX_DEG,
            -dBeta * ORIENT_SENS,
          ),
        )
        setRotY(
          gsap.utils.clamp(
            -TILT_MAX_DEG,
            TILT_MAX_DEG,
            dGamma * ORIENT_SENS,
          ),
        )
      }

      const attachOrientation = () => {
        if (detachOrientation) return
        window.addEventListener('deviceorientation', onOrientation, true)
        detachOrientation = () => {
          window.removeEventListener('deviceorientation', onOrientation, true)
          detachOrientation = null
          baseBeta = null
          baseGamma = null
        }
      }

      const requestOrientationIfNeeded = async () => {
        try {
          if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
            const state = await DeviceOrientationEvent.requestPermission()
            if (state !== 'granted') return
          }
          attachOrientation()
        } catch {
          /* permiso denegado o no disponible */
        }
      }

      if (prefersMouse) {
        const onMove = (e) => {
          const r = pin.getBoundingClientRect()
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
          setRotX(-ny * TILT_MAX_DEG)
          setRotY(nx * TILT_MAX_DEG)
        }

        pin.addEventListener('pointermove', onMove)
        pin.addEventListener('pointerleave', resetTilt)

        return () => {
          pin.removeEventListener('pointermove', onMove)
          pin.removeEventListener('pointerleave', resetTilt)
          gsap.set(tilt, { rotationX: 0, rotationY: 0 })
        }
      }

      /* Móvil / táctil: sin API de permiso (p. ej. Android) se puede enganchar ya */
      if (typeof DeviceOrientationEvent?.requestPermission !== 'function') {
        attachOrientation()
      }

      const onFirstTouch = () => {
        void requestOrientationIfNeeded()
      }
      pin.addEventListener('touchstart', onFirstTouch, {
        passive: true,
        once: true,
      })

      return () => {
        pin.removeEventListener('touchstart', onFirstTouch)
        detachOrientation?.()
        gsap.set(tilt, { rotationX: 0, rotationY: 0 })
      }
    },
    { dependencies: [isLoaded, loaderExited] },
  )

  return (
    <section data-section="hero" className="relative overflow-hidden">
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={Cielo} alt="Cielo" className="h-full w-full object-cover" />
        </div>

        <div
          ref={simetraRef}
          className="pointer-events-none absolute left-1/2 z-10 flex top-1/3 h-screen w-4/5 -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 will-change-[opacity]"
          style={{ perspective: '1100px' }}
        >
          <div
            ref={simetraTiltRef}
            className="flex h-full w-full transform-3d items-center justify-center will-change-transform"
          >
            <img
              src={Simetra}
              alt="Simetra"
              className="h-full max-h-screen w-full transform-[translateZ(0)] object-contain"
            />
          </div>
        </div>

        <div
          ref={zanjaRef}
          className={`absolute left-0 z-20 w-full will-change-transform ${isMobile ? 'bottom-[0%] h-full' : 'bottom-[-20%]'}`}
        >
          <img src={Zanja} alt="Zanja" className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end pr-4 md:pr-10">
            <Reveal isLoaded={isLoaded} color="#ffffff" width="auto">
              <h2 className="text-2xl tracking-tight md:text-4xl">Services S.A</h2>
            </Reveal>
          </div>
        </div>
        <div
          ref={camionRef}
          className={`absolute top-0 left-0 z-30 flex w-full justify-center will-change-transform ${isMobile ? 'pointer-events-none' : ''}`}
        >
          <img
            src={Camion3d}
            alt="Camion 3D"
            className={` object-contain ${isMobile ? 'hidden' : 'h-screen max-w-none' }`}
          />
        </div>
      </div>
    </section>
  )
}
