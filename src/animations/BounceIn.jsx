/**
 * Brinco (spring) al mostrar u ocultar, separado de FadeInAndOut.
 * Reutilizable: SVG (motion.g) o bloques HTML. Para nudges repetidos, ver BounceNudge.
 */

import { motion } from 'framer-motion'

/** Transición de aparición (misma que Nuestra historia: botones) */
const BOUNCE_ENTRANCE = {
  type: 'spring',
  stiffness: 420,
  damping: 12,
  mass: 0.5,
}

const BOUNCE_EXIT = { duration: 0.12, ease: 'easeIn' }

const shown = { scale: 1, opacity: 1 }
const hidden = { scale: 0, opacity: 0 }

/**
 * Escala+opacidad con spring; útil con `as` para motion.g, motion.div, etc.
 *
 * @param {object} props
 * @param {boolean} props.visible
 * @param {import('framer-motion').JSX} [props.as] — ej. motion.g (SVG), motion.div, motion.h2
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {import('react').CSSProperties} [props.style] — p. ej. { transformOrigin: '0 0' } en SVG
 */
function BounceIn({ visible, as: Comp = motion.div, children, className, style, ...rest }) {
  return (
    <Comp
      initial={false}
      animate={visible ? shown : hidden}
      transition={visible ? BOUNCE_ENTRANCE : BOUNCE_EXIT}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Comp>
  )
}

const nudgeTransition = (stagger) => ({
  duration: 0.5,
  ease: [0.22, 1.24, 0.36, 1],
  delay: stagger,
  times: [0, 0.45, 1],
})

/**
 * Brinco al intentar bajar otra vez (scroll cap). Cada `tick` que sube re-ejecuta el keyframe.
 * @param {string} nudgeId — id estable por elemento (p. ej. id del proyecto)
 * @param {import('framer-motion').JSX} [as] — default motion.h2
 * @param {number} [props.stagger] — retardo s respecto a hermanos (cascada corta, no segundos)
 */
function BounceNudge({ nudgeId, tick, as: Comp = motion.h2, children, className, stagger = 0, style, ...rest }) {
  return (
    <Comp
      key={`${nudgeId}-nudge-${tick}`}
      className={className}
      style={{ willChange: 'transform', ...style }}
      initial={false}
      animate={tick > 0 ? { y: [0, -26, 0] } : { y: 0 }}
      transition={nudgeTransition(stagger)}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export { BounceIn, BounceNudge, BOUNCE_ENTRANCE, BOUNCE_EXIT }
