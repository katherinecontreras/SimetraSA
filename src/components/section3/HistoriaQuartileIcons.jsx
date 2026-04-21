/**
 * Botones circulares sobre el path en cada cuartil (imagen + borde color línea + fondo negro).
 */

import { useLayoutEffect, useState } from 'react'

import { NUESTRA_HISTORIA_LINE_COLOR, NUESTRA_HISTORIA_PARTS } from '../../constants/nuestraHistoria'
import { getPointsAlongPathByFractions } from '../../utils/svgPathQuartiles'

/** Mitad del lado del cuadrado en unidades del viewBox (escala con el SVG). */
const ICON_RADIUS_U = 52

function HistoriaQuartileIcons({ pathRef }) {
  const [points, setPoints] = useState([])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return

    const measure = () => {
      const fractions = NUESTRA_HISTORIA_PARTS.map((p) => p.quartile)
      const next = getPointsAlongPathByFractions(path, fractions)
      if (next.length) setPoints(next)
    }

    measure()
    const raf = requestAnimationFrame(measure)

    const svg = path.ownerSVGElement
    const ro =
      svg &&
      new ResizeObserver(() => {
        measure()
      })
    if (svg && ro) ro.observe(svg)

    return () => {
      cancelAnimationFrame(raf)
      ro?.disconnect()
    }
  }, [pathRef])

  if (points.length !== NUESTRA_HISTORIA_PARTS.length) return null

  const side = ICON_RADIUS_U * 2

  return (
    <>
      {NUESTRA_HISTORIA_PARTS.map((part, index) => {
        const { x, y } = points[index]
        return (
          <foreignObject
            key={part.id}
            x={x - ICON_RADIUS_U}
            y={y - ICON_RADIUS_U}
            width={side}
            height={side}
            pointerEvents="auto"
            className="overflow-visible"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              role="button"
              tabIndex={0}
              aria-label={part.title}
              className="flex h-full w-full cursor-default items-center justify-center rounded-full bg-black p-1"
              style={{
                borderWidth: 3,
                borderStyle: 'solid',
                borderColor: NUESTRA_HISTORIA_LINE_COLOR,
                boxSizing: 'border-box',
              }}
            >
              <img
                src={part.image}
                alt=""
                className="h-full w-full rounded-full object-cover"
                draggable={false}
              />
            </div>
          </foreignObject>
        )
      })}
    </>
  )
}

export { HistoriaQuartileIcons }
