/**
 * animations/SplitPanelSlide.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Panel que se desliza hacia adentro para cubrir o hacia afuera para revelar.
 *
 * Props:
 *   side        : 'left' | 'right'
 *   direction   : 'cover' | 'exit' | 'enter'
 *   color       : string            (default: '#2B71AC') — color de fondo del panel
 *   onComplete  : () => void        — callback al terminar la animación
 *   children    : ReactNode
 */

import { motion } from 'framer-motion'

// ─── Constantes ───────────────────────────────────────────────────────────────

const TRANSITION = {
  duration : 0.85,
  ease     : [0.76, 0, 0.24, 1], // easeInOutQuart
}

/** @type {Record<'left'|'right', Record<'cover'|'enter'|'exit', {initial:{x:string}, animate:{x:string}}>>} */
const VARIANTS = {
  left: {
    cover : { initial: { x: '-100%' }, animate: { x: '0%'    } },
    enter : { initial: { x: '0%'    }, animate: { x: '0%'    } },
    exit  : { initial: { x: '0%'    }, animate: { x: '-100%' } },
  },
  right: {
    cover : { initial: { x: '100%' }, animate: { x: '0%'   } },
    enter : { initial: { x: '0%'    }, animate: { x: '0%'   } },
    exit  : { initial: { x: '0%'    }, animate: { x: '100%' } },
  },
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function SplitPanelSlide({
  side,
  direction,
  color      = '#2B71AC',
  onComplete,
  children,
}) {
  const { initial, animate } = VARIANTS[side][direction]

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={TRANSITION}
      onAnimationComplete={onComplete}
      style={{
        position        : 'absolute',
        top             : 0,
        left            : side === 'left' ? 0 : '50%',
        width           : '50%',
        height          : '100%',
        backgroundColor : color,
      }}
    >
      {children}
    </motion.div>
  )
}