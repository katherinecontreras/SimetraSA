import { useEffect } from 'react'

import { ScrollTrigger } from 'gsap/ScrollTrigger'

function debounce(fn, ms) {
  let id
  return (...args) => {
    window.clearTimeout(id)
    id = window.setTimeout(() => fn(...args), ms)
  }
}

/**
 * Recalcula posiciones de ScrollTrigger cuando cambian tamaños reales del layout
 * (carga inicial, resize, barra de Chrome en móvil, rotación).
 * Llamar con `enabled` true cuando el contenido interactivo ya está montado
 * (p. ej. tras cerrar el loader).
 */
function useScrollTriggerRefresh(enabled) {
  useEffect(() => {
    if (!enabled) return

    const refresh = () => {
      ScrollTrigger.refresh()
    }

    const refreshAfterPaint = () => {
      requestAnimationFrame(() => {
        refresh()
        requestAnimationFrame(refresh)
      })
    }

    refreshAfterPaint()

    const timeouts = [
      window.setTimeout(refresh, 0),
      window.setTimeout(refresh, 120),
      window.setTimeout(refresh, 400),
    ]

    const debouncedRefresh = debounce(refresh, 140)

    window.addEventListener('resize', debouncedRefresh, { passive: true })
    window.addEventListener('orientationchange', refresh)

    const vv = window.visualViewport
    if (vv) {
      vv.addEventListener('resize', debouncedRefresh)
    }

    const onLoad = () => refreshAfterPaint()
    window.addEventListener('load', onLoad, { once: true })

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('resize', debouncedRefresh)
      window.removeEventListener('orientationchange', refresh)
      vv?.removeEventListener('resize', debouncedRefresh)
      window.removeEventListener('load', onLoad)
    }
  }, [enabled])
}

export { useScrollTriggerRefresh }
