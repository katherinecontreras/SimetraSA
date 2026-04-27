// ─── Hook: tilt 3D ───────────────────────────────────────────────────────────
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'   
import { TILT } from '../../constantes/constanteHero'

function useHeroTilt({
  isLoaded,
  loaderExited,
  pinRef,
  tiltRef,
  listenOnWindow = false,
  resetKey,
}) {
    useGSAP(
      () => {
        if (!isLoaded || !loaderExited) return
  
        const pin  = pinRef.current
        const tilt = tiltRef.current
        if (!pin || !tilt) return
  
        gsap.set(tilt, { transformPerspective: 1100, transformStyle: 'preserve-3d' })
  
        const prefersMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  
        const duration = prefersMouse ? 0.55 : TILT.ORIENT_QUICK_TO_SEC
        const ease     = prefersMouse ? 'power2.out' : 'power3.out'
  
        const setRotX = gsap.quickTo(tilt, 'rotationX', { duration, ease })
        const setRotY = gsap.quickTo(tilt, 'rotationY', { duration, ease })
  
        const resetTilt = () => { setRotX(0); setRotY(0) }
  
        // ── Desktop: mouse ────────────────────────────────────────────────────
        if (prefersMouse) {
          const onMove = (e) => {
            const r  = pin.getBoundingClientRect()
            const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2
            const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2
            setRotX(-ny * TILT.MOUSE_MAX_DEG)
            setRotY( nx * TILT.MOUSE_MAX_DEG)
          }
  
          const moveTarget = listenOnWindow ? window : pin
          const leaveTarget = listenOnWindow ? window : pin
  
          moveTarget.addEventListener('pointermove',  onMove)
          leaveTarget.addEventListener(listenOnWindow ? 'blur' : 'pointerleave', resetTilt)
  
          return () => {
            moveTarget.removeEventListener('pointermove',  onMove)
            leaveTarget.removeEventListener(listenOnWindow ? 'blur' : 'pointerleave', resetTilt)
            gsap.set(tilt, { rotationX: 0, rotationY: 0 })
          }
        }
  
        // ── Móvil: giroscopio ─────────────────────────────────────────────────
        let baseBeta   = null
        let baseGamma  = null
        let detach     = null
  
        const onOrientation = (e) => {
          if (e.beta == null || e.gamma == null) return
          baseBeta  ??= e.beta
          baseGamma ??= e.gamma
  
          setRotX(gsap.utils.clamp(-TILT.ORIENT_MAX_DEG, TILT.ORIENT_MAX_DEG,
            -(e.beta  - baseBeta)  * TILT.ORIENT_SENS_BETA))
          setRotY(gsap.utils.clamp(-TILT.ORIENT_MAX_DEG, TILT.ORIENT_MAX_DEG,
             (e.gamma - baseGamma) * TILT.ORIENT_SENS_GAMMA))
        }
  
        const attachOrientation = () => {
          if (detach) return
          window.addEventListener('deviceorientation', onOrientation, true)
          detach = () => {
            window.removeEventListener('deviceorientation', onOrientation, true)
            detach = baseBeta = baseGamma = null
          }
        }
  
        const requestPermission = async () => {
          try {
            if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
              const state = await DeviceOrientationEvent.requestPermission()
              if (state !== 'granted') return
            }
            attachOrientation()
          } catch { /* permiso denegado */ }
        }
  
        // Android no requiere permiso explícito
        if (typeof DeviceOrientationEvent?.requestPermission !== 'function') {
          attachOrientation()
        }
  
        const touchTarget = listenOnWindow ? window : pin
        touchTarget.addEventListener('touchstart', requestPermission, { passive: true, once: true })
  
        return () => {
          touchTarget.removeEventListener('touchstart', requestPermission)
          detach?.()
          gsap.set(tilt, { rotationX: 0, rotationY: 0 })
        }
      },
      { dependencies: [isLoaded, loaderExited, listenOnWindow, resetKey] },
    )
  }
export { useHeroTilt }