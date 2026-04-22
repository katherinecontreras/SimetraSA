import { useRef } from 'react'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

/**
 * Dibuja un `<path>` con trazo SVG según el scroll (stroke-dashoffset → 0).
 *
 * Puntos por cuartiles del trazo (25 %, 50 %, 75 %, 100 %): reexportados desde
 * `../../utils/pathQuartiles` (`getPathPointsAtQuartiles`, `getPathPointsAtLengthFractions`, `PATH_QUARTILE_FRACTIONS`).
 *
 * @param {object} params
 * @param {React.RefObject<SVGPathElement|null>} params.pathRef
 * @param {React.RefObject<HTMLElement|null>} params.lineStartRef — suele ir justo debajo del título; aquí empieza el recorrido del scroll.
 * @param {React.RefObject<HTMLElement|null>} params.sectionRef — sección que marca el final del trazo (`endTrigger`).
 * @param {boolean} [params.enabled=true]
 * @param {string} [params.start='top 88%'] — cuando `lineStart` entra en viewport.
 * @param {string} [params.end='bottom bottom'] — relativo a `sectionRef`.
 * @param {boolean|number} [params.scrub=true] — `true` = acoplado 1:1 al scroll; número = suavizado (puede sentirse “pegajoso”).
 * @param {(progress01: number) => void} [params.onLineDrawProgress] — progreso 0..1 (ScrollTrigger, alineado al tween del trazo).
 */
function getDrawnPathFraction(path, length) {
  if (!path || !length) return 0
  const raw = gsap.getProperty(path, 'strokeDashoffset')
  let off =
    typeof raw === 'string' ? Number.parseFloat(raw) : Number(raw)
  if (Number.isNaN(off)) {
    const co = getComputedStyle(path).strokeDashoffset
    off = co === '0' ? 0 : Number.parseFloat(co) || 0
  }
  off = Math.min(length, Math.max(0, off))
  const t = 1 - off / length
  /* Evita que subpíxeles dejen el trazo en 0.998 y nunca dispare el cuartil 1. */
  return t >= 0.997 ? 1 : t
}

function useSvgPathDrawOnScroll({
  pathRef,
  lineStartRef,
  sectionRef,
  enabled = true,
  start = 'top 88%',
  end = 'bottom bottom',
  /** `true` = sin inercia (evita sensación de “pegajoso”); número = suavizado en s. */
  scrub = true,
  onLineDrawProgress,
}) {
  const onLineDrawProgressRef = useRef(onLineDrawProgress)
  onLineDrawProgressRef.current = onLineDrawProgress

  useGSAP(
    () => {
      if (!enabled) return

      const path = pathRef.current
      const startEl = lineStartRef.current
      const sectionEl = sectionRef.current
      const isRelativeEnd =
        typeof end === 'string' && /^\s*[+\-]=/.test(String(end).trim())
      if (!path || !startEl) return
      if (!isRelativeEnd && !sectionEl) return

      const length = path.getTotalLength()
      if (!length || !Number.isFinite(length)) return

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'none',
      })

      const scrollTrigger = {
        trigger: startEl,
        start,
        end,
        scrub,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          onLineDrawProgressRef.current?.(self.progress)
        },
      }
      if (!isRelativeEnd) {
        scrollTrigger.endTrigger = sectionEl
      }

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger,
      })

      onLineDrawProgressRef.current?.(
        tween.scrollTrigger?.progress ?? getDrawnPathFraction(path, length),
      )

      return () => {
        onLineDrawProgressRef.current?.(0)
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    },
    { dependencies: [enabled, start, end, scrub] },
  )
}

export { useSvgPathDrawOnScroll }
export {
  getPathPointsAtLengthFractions,
  getPathPointsAtQuartiles,
  DEFAULT_QUARTILES as PATH_QUARTILE_FRACTIONS,
} from '../../utils/pathQuartiles'
