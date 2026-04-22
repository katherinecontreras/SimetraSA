import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Máximo scroll alcanzable: el mínimo entre alinear el inicio de la sección arriba
 * y el fin real de documento. Si el documento no permite llegar a la alineación
 * (scroll máx < posición alineada), el gate anterior hacía que `nudge` nunca disparara.
 */
function getDocumentMaxScrollY() {
  const d = document.documentElement
  const b = document.body
  const h = Math.max(d?.scrollHeight ?? 0, b?.scrollHeight ?? 0, d?.offsetHeight ?? 0)
  return Math.max(0, h - window.innerHeight)
}

/**
 * Máximo scroll: el inicio de la sección 4 (proyectos) alineada arriba, sin pasar
 * el fin de página. Un brinco al alinear; si se queda a mitad (página corta) al
 * llegar al scroll máx; y si se insiste con la rueda en el tope.
 *
 * @param {object} o
 * @param {import('react').RefObject<HTMLElement | null>} o.sectionRef
 * @param {boolean} [o.enabled] — p. ej. isDesktop
 */
function useProyectosRecientesScrollGate({ sectionRef, enabled = true }) {
  const maxScrollY = useRef(0)
  const prevScrollY = useRef(-1)
  const prevSectionTop = useRef(-1)
  const [nudgeCount, setNudgeCount] = useState(0)

  const recompute = useCallback(() => {
    const el = sectionRef.current
    if (!el) {
      maxScrollY.current = 0
      return
    }
    const alignY = el.getBoundingClientRect().top + window.scrollY
    const docMax = getDocumentMaxScrollY()
    maxScrollY.current = docMax > 0 ? Math.min(alignY, docMax) : alignY
  }, [sectionRef])

  useLayoutEffect(() => {
    if (!enabled) return
    recompute()
  }, [enabled, recompute])

  useEffect(() => {
    if (!enabled) return
    const ro = new ResizeObserver(() => recompute())
    if (sectionRef.current) {
      ro.observe(sectionRef.current)
    }
    const t1 = setTimeout(recompute, 0)
    const t2 = setTimeout(recompute, 200)
    window.addEventListener('load', recompute, { once: true })
    window.addEventListener('resize', recompute, { passive: true })
    return () => {
      ro.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', recompute)
    }
  }, [enabled, recompute, sectionRef])

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return

      let nudgeY = false
      const max = maxScrollY.current
      if (max > 0) {
        let y = window.scrollY
        if (y > max) {
          window.scrollTo({ top: max, left: 0, behavior: 'auto' })
          y = max
        }

        const prev = prevScrollY.current
        const T = 1
        nudgeY = prev >= 0 && prev < max - T && y >= max - T
        prevScrollY.current = y
      } else {
        prevScrollY.current = window.scrollY
      }

      const t = el.getBoundingClientRect().top
      const prevT = prevSectionTop.current
      const nudgeT = prevT >= 0 && prevT > 2.5 && t <= 2.5
      prevSectionTop.current = t

      if (nudgeY || nudgeT) {
        setNudgeCount((c) => c + 1)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, sectionRef])

  useEffect(() => {
    if (!enabled) return
    const onWheel = (e) => {
      if (e.deltaY <= 0) return
      const max = maxScrollY.current
      if (max <= 0) return
      if (window.scrollY >= max - 1) {
        e.preventDefault()
        setNudgeCount((c) => c + 1)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [enabled])

  return { nudgeCount, recompute }
}

export { useProyectosRecientesScrollGate }
