import { useEffect, useState } from 'react'

import { isVisuallySolidBlack } from './isSolidBlack'

/**
 * Observa un elemento cuyo negro depende del scroll (p. ej. GSAP scrub sobre `opacity`)
 * y actualiza el estado cuando pasa a negro opaco real.
 */
function useVisuallySolidBlack(ref, options = {}) {
  const { enabled = true } = options
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setSolid(false)
      return
    }

    let observer

    const check = () => {
      const el = ref.current
      if (!el) {
        setSolid(false)
        return
      }

      const next = isVisuallySolidBlack(el)
      setSolid((prev) => (prev === next ? prev : next))
    }

    const attach = () => {
      const el = ref.current
      if (!el) return

      check()
      observer?.disconnect()
      observer = new MutationObserver(check)
      observer.observe(el, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      })
    }

    attach()
    const raf = requestAnimationFrame(attach)

    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [enabled, ref])

  return solid
}

export { useVisuallySolidBlack }
