/**
 * utils/usePageLoader.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Rastrea la carga completa de una página: imágenes, fuentes, iframes y
 * promesas personalizadas. Se reinicia en cada cambio de pathname.
 *
 * Retorna:
 *   progress   : number        — 0–100
 *   isLoaded   : boolean       — true cuando progress === 100
 *   forceReady : () => void    — fuerza la carga completa (útil en tests/timeout)
 *
 * Uso básico:
 *   const { progress, isLoaded } = usePageLoader()
 *
 * Con promesas extra (ej: fetch de datos):
 *   const { isLoaded } = usePageLoader([fetch('/api/data')])
 *
 * Con timeout personalizado:
 *   const { isLoaded } = usePageLoader([], 5_000)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectPagePromises(extraPromises) {
  const fontPromise = document.fonts?.ready ?? Promise.resolve()

  const imagePromises = Array.from(document.images).map((img) =>
    img.complete
      ? Promise.resolve()
      : new Promise((res) => {
          img.addEventListener('load',  res, { once: true })
          img.addEventListener('error', res, { once: true }) // no bloquear por 404
        }),
  )

  const iframePromises = Array.from(document.querySelectorAll('iframe')).map(
    (iframe) =>
      new Promise((res) => {
        if (iframe.contentDocument?.readyState === 'complete') return res()
        iframe.addEventListener('load', res, { once: true })
      }),
  )

  return [fontPromise, ...imagePromises, ...iframePromises, ...extraPromises]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {Promise[]} [extraPromises=[]]
 * @param {number}    [timeoutMs=8000]
 */
export function usePageLoader(extraPromises = [], timeoutMs = 8_000) {
  const { pathname } = useLocation()

  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Ref para evitar setState tras desmontaje
  const mountedRef = useRef(true)

  // Ref estable para las promesas extra (evita re-disparar el efecto si el
  // padre re-renderiza y pasa un array nuevo con la misma referencia lógica)
  const extraRef = useRef(extraPromises)
  useEffect(() => { extraRef.current = extraPromises })

  const markLoaded = useCallback(() => {
    if (!mountedRef.current) return
    setProgress(100)
    setIsLoaded(true)
  }, [])

  // Alias público por si el consumidor quiere forzar la carga
  const forceReady = markLoaded

  useEffect(() => {
    mountedRef.current = true
    setProgress(0)
    setIsLoaded(false)

    const allPromises = collectPagePromises(extraRef.current)
    const total       = allPromises.length || 1
    let   done        = 0

    const tick = () => {
      if (!mountedRef.current) return
      done += 1
      setProgress(Math.min(Math.round((done / total) * 100), 99))
    }

    const tracked = allPromises.map((p) => Promise.resolve(p).then(tick).catch(tick))

    Promise.all(tracked).then(markLoaded)

    const timeoutId = setTimeout(markLoaded, timeoutMs)

    return () => {
      mountedRef.current = false
      clearTimeout(timeoutId)
    }
  }, [pathname, timeoutMs, markLoaded])

  return { progress, isLoaded, forceReady }
}