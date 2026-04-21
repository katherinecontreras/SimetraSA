/**
 * Puntos a lo largo de un <path> SVG en coordenadas de usuario, por fracción de arco [0, 1].
 * Útil para colocar Q1=25%, Q2=50%, Q3=75%, Q4=100% sobre el trazo.
 *
 * @param {SVGPathElement} path
 * @param {number[]} fractions - ej. [0.25, 0.5, 0.75, 1]
 * @returns {{ x: number, y: number, t: number, distance: number }[]}
 */
function getPathPointsAtLengthFractions(path, fractions) {
  if (!path || typeof path.getTotalLength !== 'function') return []

  const L = path.getTotalLength()
  if (!Number.isFinite(L) || L <= 0) return []

  return fractions.map((t) => {
    const clampedT = Math.min(1, Math.max(0, t))
    const distance =
      clampedT >= 1 ? L - 1e-6 : L * clampedT
    const p = path.getPointAtLength(distance)
    return { x: p.x, y: p.y, t: clampedT, distance }
  })
}

/**
 * Cuartiles sobre la longitud de arco: 25 %, 50 %, 75 %, 100 %.
 */
const DEFAULT_QUARTILES = [0.25, 0.5, 0.75, 1]

function getPathPointsAtQuartiles(path) {
  return getPathPointsAtLengthFractions(path, DEFAULT_QUARTILES)
}

export { getPathPointsAtLengthFractions, getPathPointsAtQuartiles, DEFAULT_QUARTILES }
