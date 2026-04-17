/**
 * Layout por paso según la especificación: p1..p5 = slots 0..4 (izquierda → derecha).
 * Índices de imagen 0..4 = imagen 1..5.
 *
 * Pasos 1–5: relleno (imagen k entra a p1 y empuja).
 * Pasos 6–10: rotación [5,4,3,2,1] con entrada cíclica 1,2,3,4,5.
 */

export const CAROUSEL_MAX_STEP = 10

/** @returns {(number|null)[]} índice 0..4 por slot p1..p5, null = vacío */
export function getCarouselLayout(step) {
  const s = Math.max(0, Math.min(CAROUSEL_MAX_STEP, Math.floor(step)))
  if (s <= 0) return [null, null, null, null, null]

  if (s <= 5) {
    const k = s
    const out = [null, null, null, null, null]
    for (let i = 0; i < k; i++) {
      out[i] = k - i - 1
    }
    return out
  }

  let arr = [4, 3, 2, 1, 0]
  for (let t = 6; t <= s; t++) {
    const enter = (t - 6) % 5
    arr = [enter, ...arr.slice(0, 4)]
  }
  return arr
}
