/**
 * Posiciones sobre un `<path>` a fracciones de su longitud total L.
 *
 * Cuartiles sobre la línea: Q1 en t = 0,25·L, Q2 en 0,5·L, Q3 en 0,75·L, Q4 en 1·L.
 * `getPointAtLength(t)` devuelve (x, y) en coordenadas del viewBox.
 *
 * @param {SVGPathElement} path
 * @param {number[]} [fractions=[0.25, 0.5, 0.75, 1]] — cada valor es la fracción de L (0–1]
 * @returns {{ x: number, y: number, fraction: number }[]}
 */
function getPointsAlongPathByFractions(path, fractions = [0.25, 0.5, 0.75, 1]) {
  if (!path || typeof path.getTotalLength !== 'function') return []

  const length = path.getTotalLength()
  if (!length || !Number.isFinite(length)) return []

  return fractions.map((fraction) => {
    const t = Math.min(1, Math.max(0, fraction))
    const pt = path.getPointAtLength(length * t)
    return { x: pt.x, y: pt.y, fraction: t }
  })
}

export { getPointsAlongPathByFractions }
