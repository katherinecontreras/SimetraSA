/**
 * animations/FadeInAndOut.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fade-in / fade-out con Framer Motion (p. ej. párrafos de `NUESTRA_HISTORIA_PARTS`
 * en la sección “Nuestra historia”).
 *
 * Props:
 *  - visible   {boolean}  controla si el contenido está visible
 *  - children  {ReactNode}
 *  - delay     {number}   retraso de entrada en segundos (default: 0.1)
 *  - duration  {number}   duración en segundos (default: 0.6)
 *  - className {string}   clases Tailwind adicionales
 *  - yOffset   {number}   desplazamiento vertical en px al entrar (default: 18)
 *  - variant   {'fade'|'opacity'}  — `opacity` solo cambia opacidad, sin desplazamiento Y
 */

import { motion, AnimatePresence } from 'framer-motion'

const MotionDiv = motion.div

export function FadeInAndOut({
  visible,
  children,
  delay = 0.1,
  duration = 0.6,
  className = '',
  yOffset = 18,
  variant = 'fade',
}) {
  const transition = { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }

  if (variant === 'opacity') {
    return (
      <AnimatePresence mode="wait">
        {visible && (
          <MotionDiv
            key="fade-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className={className}
          >
            {children}
          </MotionDiv>
        )}
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <MotionDiv
          key="fade-content"
          initial={{ opacity: 0, y: yOffset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -yOffset }}
          transition={transition}
          className={className}
        >
          {children}
        </MotionDiv>
      )}
    </AnimatePresence>
  )
}