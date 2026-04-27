/**
 * animations/AppearFrom.jsx
 * Aparición del contenido desde un lado. Pasa el origen con la prop `from`.
 *
 * Props:
 *   from            : 'left' | 'right' | 'up' | 'down'  (también 'rigth' → right)
 *   id              : string | number — clave para AnimatePresence al cambiar de ítem
 *   className       : contenedor estático
 *   motionClassName : motion.div animado
 *   visible         : boolean — si false, anima salida y deja montado el contenedor
 *   delay           : number — retraso de entrada en segundos
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
 * @param {boolean} [props.visible]
 * @param {number} [props.delay]
 * @param {import('react').ReactNode} props.children
 */
export function AppearFrom({
  from,
  id,
  className = '',
  motionClassName = '',
  visible = true,
  delay = 0,
  children,
}) {
  if (children == null && !visible) return null
  const base = appearFrom(from)
  const v = delay > 0
    ? {
        ...base,
        animate: {
          ...base.animate,
          transition: { ...base.animate.transition, delay },
        },
      }
    : base
  return (
    <div className={className} aria-hidden>
      <AnimatePresence mode="wait">
        {visible && (
          <Motion.div
            key={id}
            className={motionClassName}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
          >
            {children}
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
