import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Hero: pin + scrub (el pin evita que el trigger se desalinee y el camión deje de animar) ─

const BLACK_AND_TEXT_START = 0
const BLACK_AND_TEXT_DUR = 0.45

/**
 * Misma curva de opacidad que el `blackOverlayRef` (0 → 1 → 0) en el timeline del pin.
 * Sirve al nav para mezclar el texto a blanco en sincronía con el oscurecimento del hero.
 * @param {number} p — progreso 0..1 de `onHeroScrollProgress` / `ScrollTrigger.progress`
 * @returns {number} 0..1
 */
function heroNavBlendFromScrollProgress(p) {
  const d = BLACK_AND_TEXT_DUR
  if (p <= 0) return 0
  if (p <= d) return p / d
  if (p < 1) return 1 - (p - d) / (1 - d)
  return 0
}

/** Progreso del ScrollTrigger (0–1) al completar la transición del overlay / handoff a la siguiente sección */
const SERVICES_EXIT_COMPLETE_PROGRESS =
  (BLACK_AND_TEXT_START + BLACK_AND_TEXT_DUR) / 1

const PIN_SCROLL_END = { wide: '+=280%', narrow: '+=200%' }

function useHeroScroll({
  isLoaded,
  loaderExited,
  isNarrowViewport = false,
  pinRef,
  simetraRef,
  zanjaRef,
  blackOverlayRef,
  camionRef,
  onAsiTrabajamosRevealChange,
  /** Progreso 0–1 del scrub del hero (para revertir Reveal de Services al hacer scroll). */
  onHeroScrollProgress,
  /** Al variar se mata y recrea el ScrollTrigger (p. ej. el hero estuvo en display:none). */
  heroScrollRebuildKey = 0,
}) {
  useGSAP(
    () => {
      if (!isLoaded || !loaderExited) return

      let scrollTl = null

      const setup = () => {
        ScrollTrigger.refresh()

        scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: isNarrowViewport ? PIN_SCROLL_END.narrow : PIN_SCROLL_END.wide,
            pin: true,
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              onHeroScrollProgress?.(p)
              onAsiTrabajamosRevealChange?.(
                p >= SERVICES_EXIT_COMPLETE_PROGRESS,
              )
            },
          },
        })

        scrollTl.to(
          zanjaRef.current,
          { scaleY: 2, transformOrigin: '50% 100%', ease: 'none', duration: 1 },
          0,
        )

        if (simetraRef.current) {
          scrollTl.to(
            simetraRef.current,
            { opacity: 0, ease: 'none', duration: 1 },
            0,
          )
        }

        if (blackOverlayRef.current) {
          const timelineEnd = 1
          scrollTl.fromTo(
            blackOverlayRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              ease: 'none',
              duration: BLACK_AND_TEXT_DUR,
            },
            BLACK_AND_TEXT_START,
          )
          scrollTl.to(
            blackOverlayRef.current,
            {
              opacity: 0,
              ease: 'none',
              duration:
                timelineEnd - (BLACK_AND_TEXT_START + BLACK_AND_TEXT_DUR),
            },
            BLACK_AND_TEXT_START + BLACK_AND_TEXT_DUR,
          )
        }

        if (camionRef.current) {
          scrollTl.fromTo(
            camionRef.current,
            { y: 0 },
            {
              y: '-150vh',
              ease: 'none',
              duration: 0.48,
              overwrite: 'auto',
            },
            0,
          )
        }
      }

      const delayed = gsap.delayedCall(0.05, setup)

      return () => {
        delayed.kill()
        scrollTl?.scrollTrigger?.kill()
        scrollTl?.kill()
      }
    },
    {
      dependencies: [
        isLoaded,
        loaderExited,
        isNarrowViewport,
        onAsiTrabajamosRevealChange,
        onHeroScrollProgress,
        heroScrollRebuildKey,
      ],
    },
  )
}
export { useHeroScroll, heroNavBlendFromScrollProgress }
