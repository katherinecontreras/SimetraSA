import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

/**
 * Revelado con barra que se desliza. `color` define el color del velo y del texto.
 * Se anima cuando `isLoaded` pasa a true (no usa inView).
 */
export function Reveal({
  children,
  width = 'fit-content',
  color = '#ffffff',
  isLoaded = false,
}) {
  const mainControls = useAnimation()
  const slideControls = useAnimation()

  useEffect(() => {
    if (!isLoaded) return

    const t1 = setTimeout(() => {
      mainControls.start('visible')
    }, 500)
    const t2 = setTimeout(() => {
      slideControls.start('visible')
    }, 200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [isLoaded, mainControls, slideControls])

  return (
    <div style={{ position: 'relative', width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 75 },
          visible: { opacity: 1, x: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
        style={{ color }}
      >
        {children}
      </motion.div>

      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: '100%' },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          right: 0,
          background: color,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
