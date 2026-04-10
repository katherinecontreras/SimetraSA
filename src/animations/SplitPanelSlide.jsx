/**
 * SplitPanelSlide.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Animación de panel que se desliza hacia afuera (exit) o hacia adentro (enter).
 *
 * Props:
 *   side      : "left" | "right"   — lado del panel
 *   direction : "exit" | "enter"   — "exit" = sale de la pantalla,
 *                                    "enter" = entra a la pantalla
 *   onComplete: () => void          — callback al terminar la animación
 *   children  : ReactNode           — contenido del panel (opcional)
 *
 * Uso en LoadingScreen:
 *   <SplitPanelSlide side="left"  direction="exit" onComplete={handleDone} />
 *   <SplitPanelSlide side="right" direction="exit" />
 */

import { motion } from 'framer-motion'

// ─── Tabla de variantes ───────────────────────────────────────────────────────
//
//  Para "enter": el panel viene desde afuera y llega a x: 0 (posición natural).
//  Para "exit":  el panel está en x: 0 y sale hacia afuera.

const variants = {
  left: {
    enter: {
      initial: { x: "0%" },
      animate: { x: "0%" },
    },
    exit: {
      initial: { x: "0%"    },
      animate: { x: "-100%" },
    },
  },
  right: {
    enter: {
      initial: { x: "0%" },
      animate: { x: "0%" },
    },
    exit: {
      initial: { x: "0%"   },
      animate: { x: "100%" },
    },
  },
};

const TRANSITION = {
  duration: 0.85,
  ease: [0.76, 0, 0.24, 1], // cubic-bezier elegante (easeInOutQuart)
}

const MotionPanel = motion.div

export function SplitPanelSlide({ side, direction, onComplete, children }) {
  const { initial, animate } = variants[side][direction]

  return (
    <MotionPanel
      initial={initial}
      animate={animate}
      transition={TRANSITION}
      onAnimationComplete={onComplete}
      style={{
        position : "absolute",
        top      : 0,
        left     : side === "left" ? 0 : "50%",
        width    : "50%",
        height   : "100%",
        backgroundColor: "#2B71AC",
      }}
    >
      {children}
    </MotionPanel>
  )
}