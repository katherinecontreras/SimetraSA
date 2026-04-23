import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

function getDocumentMaxScrollY() {
  const d = document.documentElement
  const b = document.body
  const h = Math.max(d?.scrollHeight ?? 0, b?.scrollHeight ?? 0, d?.offsetHeight ?? 0)
  return Math.max(0, h - window.innerHeight)
}

/**
 * Detecta al cruzar el scroll al que el inicio de “proyectos” queda arriba del todo
 * (o el tope de documento si la página no alcanza esa alineación) para el bounce.
 *
 * Importante: no se limita `window.scrollY` a esa posición; el gate anterior
 * hacía `min(alignY, docMax)` como techo fijo e impedía bajar y ver el resto
 * de la sección 4 o la página.
 *
 * @param {object} o
 * @param {import('react').RefObject<HTMLElement | null>} o.sectionRef
 * @param {boolean} [o.enabled] — p. ej. isDesktop
 */
function useProyectosRecientesScrollGate({ sectionRef, enabled = true }) {
  /** scrollY aproximado al alinear el top de la sección con el viewport (capado a docMax) */
  const alignScrollYRef = useRef(0)
  const prevScrollY = useRef(-1)
  const prevSectionTop = useRef(-1)
  const [nudgeCount, setNudgeCount] = useState(0)

  const recompute = useCallback(() => {
    const el = sectionRef.current
    if (!el) {
      alignScrollYRef.current = 0
      return
    }
    const alignY = el.getBoundingClientRect().top + window.scrollY
    const docMax = getDocumentMaxScrollY()
    alignScrollYRef.current = docMax > 0 ? Math.min(alignY, docMax) : alignY
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
      const align = alignScrollYRef.current
      const y = window.scrollY
      if (align > 0) {
        const prev = prevScrollY.current
        const T = 1
        nudgeY = prev >= 0 && prev < align - T && y >= align - T
        prevScrollY.current = y
      } else {
        prevScrollY.current = y
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
      const docMax = getDocumentMaxScrollY()
      if (docMax <= 0) return
      if (window.scrollY < docMax - 1) return
      e.preventDefault()
      setNudgeCount((c) => c + 1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [enabled])

  return { nudgeCount, recompute }
}

export { useProyectosRecientesScrollGate }
