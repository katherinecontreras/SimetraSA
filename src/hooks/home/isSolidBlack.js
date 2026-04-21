/**
 * Comprueba si el color de fondo computado es negro RGBA opaco.
 * Útil con fondos animados vía `background-color` o clase (`bg-black` vs `bg-black/50`).
 */

function isSolidBlack(element) {
  if (!element || !(element instanceof Element)) return false

  const style = window.getComputedStyle(element)
  const bgColor = style.backgroundColor.trim()

  /** Tailwind v4 suele emitir `oklch(0 0 0)` en lugar de `rgb(0,0,0)`. */
  const oklch = bgColor.match(/^oklch\(\s*([\d.%]+)/i)
  if (oklch) {
    const L = Number.parseFloat(oklch[1].replace('%', ''))
    const lNorm = oklch[1].includes('%') ? L / 100 : L
    return !Number.isNaN(lNorm) && lNorm <= 0.0001
  }

  const match = bgColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/)

  if (!match) return false

  const r = Number.parseInt(match[1], 10)
  const g = Number.parseInt(match[2], 10)
  const b = Number.parseInt(match[3], 10)
  const a = match[4] !== undefined ? Number.parseFloat(match[4]) : 1

  return r === 0 && g === 0 && b === 0 && a === 1
}

/**
 * El scrub de GSAP puede quedarse un poco por debajo de 1 (p. ej. ~0.9928).
 * Por eso no exigimos `opacity === 1`.
 */
const MIN_OPACITY_FOR_VISUALLY_SOLID_BLACK = 0.99

/**
 * Overlay con `bg-black` animado con GSAP vía `opacity`: el `backgroundColor` sigue
 * siendo `rgb(0,0,0)` aunque `opacity` sea menor que 1. Cuenta como “negro sólido” si
 * el fondo es negro y la opacidad alcanza al menos el umbral (no hace falta 1 exacto).
 */
function isVisuallySolidBlack(element) {
  if (!element || !(element instanceof Element)) return false

  const style = window.getComputedStyle(element)
  const opacity = Number.parseFloat(style.opacity)
  if (
    Number.isNaN(opacity) ||
    opacity < MIN_OPACITY_FOR_VISUALLY_SOLID_BLACK
  ) {
    return false
  }

  return isSolidBlack(element)
}

export {
  isSolidBlack,
  isVisuallySolidBlack,
  MIN_OPACITY_FOR_VISUALLY_SOLID_BLACK,
}
