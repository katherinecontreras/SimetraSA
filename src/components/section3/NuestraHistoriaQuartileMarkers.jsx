/**
 * Iconos (botones) sobre el trazo del SVG, uno por cuartil (Q1..Q4).
 * Posición = fracción de longitud del path; estilo: círculo negro + borde color línea.
 */

import { useId, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { getPathPointsAtLengthFractions } from '../../utils/pathQuartiles'

const MotionG = motion.g

const LINE_STROKE = '#6CBFE0'
const OUTER_R = 44
/** Hasta dónde llega el bitmap respecto al centro; el círculo de clip es algo mayor para dejar aire. */
const IMAGE_R = 21
/** Factor: la foto ocupa ~90% del círculo; el resto aire bajo el borde rojo. */
const IMAGE_FILL = 0.9
/**
 * Círculo de recorte en OBB: casi inscrito, para bordes limpios (la imagen va escalada
 * a IMAGE_FILL y no queda harta contra el aro del clip).
 */
const CLIP_CIRCLE_OBB = 0.5

const NEAR = 1e-4

function isQuartilVisible(lineDrawProgress, quartile) {
  return lineDrawProgress + NEAR >= quartile
}

/**
 * Fondo acento (color de línea) entre este cuartil y el siguiente, hasta alcanzar el próximo.
 */
function isInSegmentToNextQuartil(p, quartile, nextQuartile) {
  if (p + NEAR < quartile) return false
  if (nextQuartile == null) return true
  return p < nextQuartile - NEAR
}

/**
 * @param {object} props
 * @param {React.RefObject<SVGPathElement|null>} props.pathRef
 * @param {Array<{ id: string, image: string, quartile: number, title: string, text: string }>} props.parts
 * @param {string} [props.lineColor]
 * @param {number} [props.lineDrawProgress=0] — 0..1, mismo progreso que el trazo; el icono del cuartil Q solo se muestra cuando el trazo ha llegado a esa fracción.
 */
function NuestraHistoriaQuartileMarkers({
  pathRef,
  parts,
  lineColor = LINE_STROKE,
  lineDrawProgress = 0,
}) {
  const clipId = `nuestra-historia-marker-clip-${useId().replace(/:/g, '')}`
  const [markers, setMarkers] = useState(() => [])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !parts.length) {
      queueMicrotask(() => setMarkers([]))
      return
    }

    const update = () => {
      const fractions = parts.map((p) => p.quartile)
      const pts = getPathPointsAtLengthFractions(path, fractions)
      setMarkers(
        parts.map((part, i) => ({
          ...part,
          ...pts[i],
        })),
      )
    }

    update()

    const svg = path.ownerSVGElement
    if (!svg) return undefined

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update)
    })
    ro.observe(svg)
    return () => ro.disconnect()
  }, [pathRef, parts])

  const byQuartile = [...markers].sort((a, b) => a.quartile - b.quartile)

  return (
    <>
      <defs>
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <circle cx="0.5" cy="0.5" r={CLIP_CIRCLE_OBB} shapeRendering="geometricPrecision" />
        </clipPath>
      </defs>
      {markers.map((m) => {
        const visible = isQuartilVisible(lineDrawProgress, m.quartile)
        const pos = byQuartile.findIndex((x) => x.id === m.id)
        const nextQ = byQuartile[pos + 1]?.quartile
        const segmentActive = isInSegmentToNextQuartil(
          lineDrawProgress,
          m.quartile,
          nextQ ?? null,
        )
        const fillColor = visible && segmentActive ? lineColor : 'black'
        return (
          <g
            key={m.id}
            transform={`translate(${m.x} ${m.y})`}
            style={{
              pointerEvents: visible ? 'auto' : 'none',
            }}
            aria-hidden={!visible}
          >
            <title>{m.title}</title>
            <MotionG
              initial={false}
              style={{ transformOrigin: '0px 0px' }}
              animate={
                visible
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={
                visible
                  ? {
                      type: 'spring',
                      stiffness: 420,
                      damping: 12,
                      mass: 0.5,
                    }
                  : { duration: 0.12, ease: 'easeIn' }
              }
            >
              <circle
                r={OUTER_R}
                fill={fillColor}
                stroke={lineColor}
                strokeWidth={2}
                className="cursor-pointer [transition:fill_0.25s_ease-out]"
              />
              <image
                href={m.image}
                x={-IMAGE_R * IMAGE_FILL}
                y={-IMAGE_R * IMAGE_FILL}
                width={IMAGE_R * 2 * IMAGE_FILL}
                height={IMAGE_R * 2 * IMAGE_FILL}
                clipPath={`url(#${clipId})`}
                className="pointer-events-none"
                preserveAspectRatio="xMidYMid slice"
                style={{ imageRendering: 'auto' }}
              />
            </MotionG>
          </g>
        )
      })}
    </>
  )
}

export { NuestraHistoriaQuartileMarkers, LINE_STROKE as NUESTRA_HISTORIA_LINE_COLOR }
