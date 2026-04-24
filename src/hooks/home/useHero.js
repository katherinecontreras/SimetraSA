import { useRef } from 'react'

import { useHeroIntro } from './useHeroIntro'
import { useHeroScroll } from './useHeroScroll'
import { useHeroTilt } from './useHeroTilt'

/**
 * Refs y efectos del hero (intro GSAP, pin + scroll, tilt).
 * Usar en la página para montar el JSX de la sección sin un componente intermedio.
 */
function useHero({
  isLoaded,
  loaderExited = true,
  isNarrowViewport = false,
  onAsiTrabajamosRevealChange,
  onHeroScrollProgress,
  /** Sube al cerrar detalle de proyecto: recrea pin/ScrollTrigger del hero. */
  heroScrollRebuildKey = 0,
}) {
  const pinRef = useRef(null)
  const simetraRef = useRef(null)
  const simetraTiltRef = useRef(null)
  const zanjaRef = useRef(null)
  const blackOverlayRef = useRef(null)
  const camionRef = useRef(null)

  useHeroIntro({
    isLoaded,
    simetraRef,
    zanjaRef,
    camionRef,
  })
  useHeroScroll({
    isLoaded,
    loaderExited,
    isNarrowViewport,
    pinRef,
    simetraRef,
    zanjaRef,
    blackOverlayRef,
    camionRef,
    onAsiTrabajamosRevealChange,
    onHeroScrollProgress,
    heroScrollRebuildKey,
  })
  useHeroTilt({ isLoaded, loaderExited, pinRef, tiltRef: simetraTiltRef })

  return {
    pinRef,
    simetraRef,
    simetraTiltRef,
    zanjaRef,
    blackOverlayRef,
    camionRef,
  }
}

export { useHero }
