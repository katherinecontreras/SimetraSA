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

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve()

  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true })
  })
}

function waitForImage(img) {
  const loaded = img.complete && img.naturalWidth > 0
  const loadPromise = loaded
    ? Promise.resolve()
    : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true }) // no bloquear por 404
      })

  return loadPromise
    .then(() => (typeof img.decode === 'function' ? img.decode() : undefined))
    .catch(() => undefined)
}

function waitForNextPaints(count = 2) {
  return new Promise((resolve) => {
    let frames = 0

    const tick = () => {
      frames += 1
      if (frames >= count) {
        resolve()
        return
      }
      requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  })
}

function waitForIdle(timeout = 1_200) {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(resolve, { timeout })
      return
    }

    setTimeout(resolve, Math.min(timeout, 250))
  })
}

async function collectPagePromises(extraPromises) {
  await waitForNextPaints(2)

  const fontPromise = document.fonts?.ready ?? Promise.resolve()
  const imagePromises = Array.from(document.images)
    .filter((img) => img.loading !== 'lazy')
    .map(waitForImage)

  return [
    waitForWindowLoad(),
    fontPromise,
    ...imagePromises,
    waitForNextPaints(3),
    waitForIdle(),
    ...extraPromises,
  ]
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
    let cancelled = false

    const run = async () => {
      const allPromises = await collectPagePromises(extraRef.current)
      if (cancelled || !mountedRef.current) return

      const total = allPromises.length || 1
      let done = 0

      const tick = () => {
        if (cancelled || !mountedRef.current) return
        done += 1
        setProgress(Math.min(Math.round((done / total) * 100), 99))
      }

      const tracked = allPromises.map((p) => Promise.resolve(p).then(tick).catch(tick))

      Promise.all(tracked)
        .then(() => waitForNextPaints(2))
        .then(() => waitForIdle(1_500))
        .then(() => {
          if (!cancelled) markLoaded()
        })
    }

    run()

    const timeoutId = setTimeout(() => {
      if (!cancelled) markLoaded()
    }, timeoutMs)

    return () => {
      cancelled = true
      mountedRef.current = false
      clearTimeout(timeoutId)
    }
  }, [pathname, timeoutMs, markLoaded])

  return { progress, isLoaded, forceReady }
}