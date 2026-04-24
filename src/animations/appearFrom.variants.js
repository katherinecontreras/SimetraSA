/**
 * Variantes de movimiento (Framer Motion) según el lado de aparición.
 * @param {string} [lado] 'left' | 'right' | 'up' | 'down' (también 'rigth' → 'right')
 * @returns {{ initial: object, animate: object, exit: object }}
 */

const transiciónAppearFondo = { duration: 0.6, ease: [0.22, 1, 0.36, 1] }

export function appearFrom(lado) {
  const tIn = transiciónAppearFondo
  const tOut = { ...transiciónAppearFondo, duration: 0.4 }
  const norm = lado === 'rigth' ? 'right' : lado
  switch (norm) {
    case 'right':
      return {
        initial: { x: '100%', y: 0 },
        animate: { x: 0, y: 0, transition: tIn },
        exit: { x: '100%', y: 0, transition: tOut },
      }
    case 'up':
      return {
        initial: { x: 0, y: '-100%' },
        animate: { x: 0, y: 0, transition: tIn },
        exit: { x: 0, y: '-100%', transition: tOut },
      }
    case 'down':
      return {
        initial: { x: 0, y: '100%' },
        animate: { x: 0, y: 0, transition: tIn },
        exit: { x: 0, y: '100%', transition: tOut },
      }
    case 'left':
    default:
      return {
        initial: { x: '-100%', y: 0 },
        animate: { x: 0, y: 0, transition: tIn },
        exit: { x: '100%', y: 0, transition: tOut },
      }
  }
}
