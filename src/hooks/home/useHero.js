import { useRef } from 'react'

import { useHeroIntro } from './useHeroIntro'
import { useHeroScroll } from './useHeroScroll'
import { useHeroTilt } from './useHeroTilt'

/**
 * Refs y efectos del hero (intro GSAP, pin + scroll, tilt).
 * Usar en la página para montar el JSX de la sección sin un componente intermedio.
 */
function useHero({ isLoaded, loaderExited = true }) {
  const pinRef = useRef(null)
  const simetraRef = useRef(null)
  const simetraTiltRef = useRef(null)
  const zanjaRef = useRef(null)
  const camionRef = useRef(null)

  useHeroIntro({ isLoaded, simetraRef, zanjaRef, camionRef })
  useHeroScroll({ isLoaded, loaderExited, pinRef, zanjaRef, camionRef })
  useHeroTilt({ isLoaded, loaderExited, pinRef, tiltRef: simetraTiltRef })

  return {
    pinRef,
    simetraRef,
    simetraTiltRef,
    zanjaRef,
    camionRef,
  }
}

export { useHero }
