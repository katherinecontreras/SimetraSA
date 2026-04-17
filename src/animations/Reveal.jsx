/**
 * animations/Reveal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Revelado con barra que se desliza sobre el contenido.
 *
 * Props:
 *   children  : ReactNode
 *   width     : CSSProperties['width']  (default: 'fit-content')
 *   color     : string                  (default: '#ffffff') — color del velo Y del texto
 *   isLoaded  : boolean                 (default: false)     — dispara la animación
 *   delay     : number                  (default: 0)         — ms de retardo extra
 */

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

const MotionDiv = motion.div

// ─── Variantes ────────────────────────────────────────────────────────────────

const CONTENT_VARIANTS = {
  hidden:  { opacity: 0, x: 75 },
  visible: { opacity: 1, x: 0  },
}

const WIPE_VARIANTS = {
  hidden:  { left: '0%'   },
  visible: { left: '100%' },
}

// ─── Tiempos base (ms) ────────────────────────────────────────────────────────
const WIPE_DELAY_MS    = 200
const CONTENT_DELAY_MS = 500

const INSTANT = { duration: 0 }

// ─── Componente ──────────────────────────────────────────────────────────────

export function Reveal({
  children,
  width   = 'fit-content',
  color   = '#ffffff',
  isLoaded = false,
  delay   = 0,
}) {
  const contentControls = useAnimation()
  const wipeControls    = useAnimation()

  useEffect(() => {
    if (!isLoaded) {
      // Salida: texto oculto y velo FUERA (visible = left 100%), no franja blanca tapando
      void contentControls.start('hidden', { transition: { duration: 0.2 } })
      void wipeControls.start('visible', { transition: { duration: 0.25, ease: 'easeInOut' } })
      return
    }

    // Entrada: velo cubre de golpe y luego la animación habitual
    void wipeControls.start('hidden', { transition: INSTANT })
    void contentControls.start('hidden', { transition: INSTANT })

    const timers = [
      setTimeout(() => wipeControls.start('visible'),    delay + WIPE_DELAY_MS),
      setTimeout(() => contentControls.start('visible'), delay + CONTENT_DELAY_MS),
    ]

    return () => timers.forEach(clearTimeout)
  }, [isLoaded, delay, contentControls, wipeControls])

  return (
    <div style={{ position: 'relative', width, overflow: 'hidden' }}>
      {/* Contenido animado */}
      <MotionDiv
        variants={CONTENT_VARIANTS}
        initial="hidden"
        animate={contentControls}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ color }}
      >
        {children}
      </MotionDiv>

      {/* Barra deslizante (velo) — initial visible = fuera de vista, sin flash blanco al desmontar */}
      <MotionDiv
        variants={WIPE_VARIANTS}
        initial="visible"
        animate={wipeControls}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        aria-hidden
        style={{
          position      : 'absolute',
          inset         : '4px 0',
          background    : color,
          zIndex        : 20,
          pointerEvents : 'none',
        }}
      />
    </div>
  )
}
