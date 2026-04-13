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
    if (!isLoaded) return

    const timers = [
      setTimeout(() => wipeControls.start('visible'),    delay + WIPE_DELAY_MS),
      setTimeout(() => contentControls.start('visible'), delay + CONTENT_DELAY_MS),
    ]

    return () => timers.forEach(clearTimeout)
  }, [isLoaded, delay, contentControls, wipeControls])

  return (
    <div style={{ position: 'relative', width, overflow: 'hidden' }}>
      {/* Contenido animado */}
      <motion.div
        variants={CONTENT_VARIANTS}
        initial="hidden"
        animate={contentControls}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ color }}
      >
        {children}
      </motion.div>

      {/* Barra deslizante (velo) */}
      <motion.div
        variants={WIPE_VARIANTS}
        initial="hidden"
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