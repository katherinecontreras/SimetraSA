/**
 * Sección "activa" del home según una línea horizontal fija (p. ej. 12% del viewport).
 * Orden: hero → así trabajamos → nuestra historia → proyectos recientes.
 */

import { useEffect, useState } from 'react'

const ORDER = [
  { id: 'hero', getEl: (r) => r.hero },
  { id: 'asi-trabajamos', getEl: (r) => r.s2 },
  { id: 'nuestra-historia', getEl: (r) => r.s3 },
  { id: 'proyectos-recientes', getEl: (r) => r.s4 },
]

/**
 * @param {object} params
 * @param {import('react').RefObject<HTMLElement | null>} params.heroRef
 * @param {import('react').RefObject<HTMLElement | null>} params.s2Ref
 * @param {import('react').RefObject<HTMLElement | null>} params.s3Ref
 * @param {import('react').RefObject<HTMLElement | null>} params.s4Ref
 * @param {boolean} [params.enabled]
 * @param {number} [params.lineRatio] 0..1, posición vertical del criterio (desde arriba)
 */
export function useHomeNavSectionAt({ heroRef, s2Ref, s3Ref, s4Ref, enabled = true, lineRatio = 0.12 }) {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    if (!enabled) {
      setActiveSection('hero')
      return
    }

    const refs = { hero: heroRef, s2: s2Ref, s3: s3Ref, s4: s4Ref }

    const update = () => {
      const y = window.innerHeight * lineRatio

      for (const { id, getEl } of ORDER) {
        const el = getEl(refs)?.current
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (y >= r.top && y <= r.bottom) {
          setActiveSection((prev) => (prev === id ? prev : id))
          return
        }
      }

      // Huecos entre secciones: gana el bloque cuyo centro esté más cerca de y
      let best = 'hero'
      let bestD = Number.POSITIVE_INFINITY
      for (const { id, getEl } of ORDER) {
        const el = getEl(refs)?.current
        if (!el) continue
        const r = el.getBoundingClientRect()
        const mid = (r.top + r.bottom) / 2
        const d = Math.abs(mid - y)
        if (d < bestD) {
          bestD = d
          best = id
        }
      }
      setActiveSection((prev) => (prev === best ? prev : best))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled, heroRef, s2Ref, s3Ref, s4Ref, lineRatio])

  return activeSection
}
