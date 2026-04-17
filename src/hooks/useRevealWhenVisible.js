import { useEffect, useState } from 'react'

/**
 * true cuando el elemento está intersectando el viewport (para disparar Reveal al entrar).
 * Al salir vuelve a false para que el efecto pueda repetirse al volver a entrar.
 */
function useRevealWhenVisible(ref, { rootMargin = '0px', threshold = 0.2, enabled = true } = {}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setVisible(false)
      return
    }
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
      },
      { root: null, rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled, ref, rootMargin, threshold])

  return visible
}

export { useRevealWhenVisible }
