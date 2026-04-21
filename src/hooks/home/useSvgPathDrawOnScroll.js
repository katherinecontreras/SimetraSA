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
 * @param {boolean|number} [params.scrub=0.45]
 * @param {(progress01: number) => void} [params.onLineDrawProgress] — fracción de trazo visible (1 − offset/L), alineada al dibujo real.
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
  return 1 - off / length
}

function useSvgPathDrawOnScroll({
  pathRef,
  lineStartRef,
  sectionRef,
  enabled = true,
  start = 'top 88%',
  end = 'bottom bottom',
  scrub = 0.45,
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
      if (!path || !startEl || !sectionEl) return

      const length = path.getTotalLength()
      if (!length || !Number.isFinite(length)) return

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'none',
      })

      const tween = gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: startEl,
          start,
          endTrigger: sectionEl,
          end,
          scrub,
          invalidateOnRefresh: true,
          onUpdate: () => {
            onLineDrawProgressRef.current?.(
              getDrawnPathFraction(path, length),
            )
          },
        },
      })

      onLineDrawProgressRef.current?.(getDrawnPathFraction(path, length))

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
