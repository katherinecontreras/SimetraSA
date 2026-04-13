/**
 * utils/useDeviceType.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Detecta el tipo de dispositivo según el ancho de la ventana.
 * Usa matchMedia internamente para evitar recalcular en cada px de resize.
 *
 * Retorna:
 *   deviceType : 'desktop' | 'tablet' | 'mobile'
 *   isDesktop  : boolean   — true para ≥ 1024 px
 *   isMobile   : boolean   — true para < 1024 px  (tablet + teléfono)
 *
 * Uso:
 *   const { isDesktop, isMobile } = useDeviceType()
 */

import { useState, useEffect } from 'react'

// ─── Breakpoints (alineados con Tailwind) ─────────────────────────────────────
const BP = {
  TABLET  : 640,   // sm
  DESKTOP : 1024,  // lg
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDeviceType(width) {
  if (width >= BP.DESKTOP) return 'desktop'
  if (width >= BP.TABLET)  return 'tablet'
  return 'mobile'
}

// Seguro para SSR: devuelve 'desktop' si no hay window
function safeInitialType() {
  if (typeof window === 'undefined') return 'desktop'
  return getDeviceType(window.innerWidth)
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState(safeInitialType)

  useEffect(() => {
    // Dos media queries: una por cada breakpoint relevante.
    // MediaQueryList.addEventListener dispara solo en el cruce del umbral,
    // sin necesidad de RAF ni throttle manual.
    const mqDesktop = window.matchMedia(`(min-width: ${BP.DESKTOP}px)`)
    const mqTablet  = window.matchMedia(`(min-width: ${BP.TABLET}px)`)

    const update = () => setDeviceType(getDeviceType(window.innerWidth))

    mqDesktop.addEventListener('change', update)
    mqTablet.addEventListener('change', update)

    return () => {
      mqDesktop.removeEventListener('change', update)
      mqTablet.removeEventListener('change', update)
    }
  }, [])

  return {
    deviceType,
    isDesktop : deviceType === 'desktop',
    isMobile  : deviceType !== 'desktop',
  }
}