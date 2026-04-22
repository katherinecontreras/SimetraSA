/**
 * Títulos (SectionTitle) y cuerpo (FadeInAndOut) por cuartil, alineados al path;
 * se muestran cuando el trazo alcanza el mismo avance que el botón.
 */

import { useId, useLayoutEffect, useState } from 'react'

import { FadeInAndOut } from '../../animations/FadeInAndOut'
import { SectionTitle } from '../SectionTitle'
import { getPathPointsAtLengthFractions } from '../../utils/pathQuartiles'
import { isNuestraHistoriaPartSolelyActive } from '../../utils/nuestraHistoriaQuartileActivePart'

const W_SVG = 1781
const H_SVG = 2070

/**
 * Cajas en coordenadas de usuario del viewBox (0..1781, 0..2070).
 * q2 usa m1 (posición de Q1) para mantener la misma altura de bloque que la parte 1.
 */
function getLabelBox(part, m, m1) {
  const id = part.id
  if (id === 'q1') {
    // Debajo del botón
    return { x: m.x - 320, y: m.y + 150, w: 640, h: 420 }
  }
  if (id === 'q2') {
    // Casi centrado, un poco a la derecha; misma altura (Y) que el bloque bajo el botón 1
    const y0 = (m1?.y ?? m.y) + 250
    const w = 520
    const x = W_SVG * 0.52 - w / 2 + 350
    return { x, y: y0, w, h: 400 }
  }
  if (id === 'q3') {
    // Título y texto encima del botón, centrados horizontalmente
    return { x: m.x - 500, y: m.y - 400, w: 600, h: 190 }
  }
  if (id === 'q4') {
    // El path termina abajo (y~2069). Centrar en Y recorta casi toda la caja fuera del viewBox.
    // Colocamos el bloque **encima** del hito, con x e y ajustados al rect [0,1781]×[0,2070].
    const w = Math.min(0.7 * W_SVG, W_SVG - 16)
    const h = 200
    let x = m.x - w / 2
    x = Math.max(300, Math.min(x, W_SVG - w))
    let y = m.y - h
    y = Math.max(6, Math.min(y, H_SVG - h ))
    return { x, y, w, h }
  }
  return { x: m.x, y: m.y, w: 400, h: 200 }
}

function NuestraHistoriaQuartileLabels({
  pathRef,
  parts,
  lineDrawProgress = 0,
}) {
  const foId = `nh-fo-${useId().replace(/:/g, '')}`
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

  const m1 = markers.find((x) => x.id === 'q1')
  const byQuartile = [...markers].sort((a, b) => a.quartile - b.quartile)

  return (
    <>
      {markers.map((m) => {
        const visible = isNuestraHistoriaPartSolelyActive(
          lineDrawProgress,
          m,
          byQuartile,
        )
        const { x, y, w, h } = getLabelBox(m, m, m1)
        return (
          <foreignObject
            key={m.id}
            x={x}
            y={y}
            width={w}
            height={h}
            className="pointer-events-none overflow-visible"
            aria-hidden={!visible}
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              className="h-full w-full"
              id={`${foId}-${m.id}`}
              style={{
                fontFamily: 'system-ui, sans-serif',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: m.id === 'q3' ? 'flex-end' : 'flex-start',
                textAlign: 'center',
                overflow: 'visible',
              }}
            >
              <div className="pointer-events-none flex w-full flex-col items-center">
                <div className={`w-full max-w-full ${m.id === 'q3' ?  'ml-8' : m.id === 'q4' ? 'ml-150' : 'ml-42'}`}>
                  <SectionTitle
                    text={m.title}
                    isLoaded={visible}
                    className="text-balance text-center text-3xl font-bold tracking-tight md:text-5xl"
                  />
                </div>
                <div className="mt-10 w-full max-w-full sm:mt-6">
                  <FadeInAndOut
                    visible={visible}
                    className="text-center text-3xl leading-relaxed text-white/95 text-balance"
                    delay={0.15}
                    yOffset={12}
                  >
                    <p className="text-center">{m.text}</p>
                  </FadeInAndOut>
                </div>
              </div>
            </div>
          </foreignObject>
        )
      })}
    </>
  )
}

export { NuestraHistoriaQuartileLabels }
