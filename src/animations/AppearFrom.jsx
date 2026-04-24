/**
 * animations/AppearFrom.jsx
 * Aparición del contenido desde un lado. Pasa el origen con la prop `from`.
 *
 * Props:
 *   from            : 'left' | 'right' | 'up' | 'down'  (también 'rigth' → right)
 *   id              : string | number — clave para AnimatePresence al cambiar de ítem
 *   className       : contenedor estático
 *   motionClassName : motion.div animado
 *   children        : nodo a animar
 *
 * La lógica de variantes: `appearFrom.variants.js` → `appearFrom()`.
 */

import { AnimatePresence, motion as Motion } from 'framer-motion'

import { appearFrom } from './appearFrom.variants.js'

/**
 * @param {object} props
 * @param {string} [props.from]
 * @param {string|number} props.id
 * @param {string} [props.className]
 * @param {string} [props.motionClassName]
 * @param {import('react').ReactNode} props.children
 */
export function AppearFrom({ from, id, className = '', motionClassName = '', children }) {
  if (children == null) return null
  const v = appearFrom(from)
  return (
    <div className={className} aria-hidden>
      <AnimatePresence mode="wait">
        <Motion.div
          key={id}
          className={motionClassName}
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
        >
          {children}
        </Motion.div>
      </AnimatePresence>
    </div>
  )
}
