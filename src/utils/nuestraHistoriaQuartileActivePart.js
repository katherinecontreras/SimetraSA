const NEAR = 0.006

/**
 * Un solo "segmento" visible: la parte cuyo umbral se alcanzó y aún no se alcanzó el siguiente.
 * P.ej. con cuartiles 0.1, 0.4, 0.7, 1.0: Q1 en [0.1,0.4), Q2 en [0.4,0.7), Q3 en [0.7,1), Q4 en [1,1].
 *
 * @param {number} lineDrawProgress
 * @param {{ id: string, quartile: number }} part
 * @param {Array<{ id: string, quartile: number }>} sortedByQuartileAsc
 */
function isNuestraHistoriaPartSolelyActive(
  lineDrawProgress,
  part,
  sortedByQuartileAsc,
) {
  const p = lineDrawProgress
  const i = sortedByQuartileAsc.findIndex((x) => x.id === part.id)
  if (i < 0) return false
  if (p + NEAR < part.quartile) return false
  const next = sortedByQuartileAsc[i + 1]
  if (next) {
    return p < next.quartile - NEAR
  }
  return true
}

export { isNuestraHistoriaPartSolelyActive, NEAR as NUESTRA_HISTORIA_PART_ACTIVE_NEAR }
