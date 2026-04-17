/**
 * Scroll bloqueado: cada gesto acumulado avanza/retrocede un paso discreto (0..10).
 * Pasos 1–5 rellenan; 6–10 rotan. Paso 10 completo → desbloquea. Reverso hasta paso 0.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { CAROUSEL_MAX_STEP } from '../../components/section2/asiTrabajamosCarouselLayout'

/** Más alto = hace falta más scroll por paso (más despacio entre pasos discretos). */
const WHEEL_THRESHOLD = 168
/** Más bajo = el paso visual tarda más en alcanzar el objetivo (desplazamiento más suave). */
const LERP = 0.044

function normalizeWheelDeltaY(e) {
  let dy = e.deltaY
  if (e.deltaMode === 1) dy *= 16
  else if (e.deltaMode === 2) dy *= 800
  return dy
}

export function useAsiTrabajamosCarouselScroll({
  enabled,
  titleRevealComplete,
  sectionRef,
}) {
  const [phase, setPhase] = useState('idle')
  const phaseRef = useRef('idle')
  const targetStepRef = useRef(0)
  const [displayStep, setDisplayStep] = useState(0)
  const [carouselActive, setCarouselActive] = useState(false)
  const completedForwardRef = useRef(false)
  const initializedRef = useRef(false)
  const wheelAccRef = useRef(0)
  /** Scroll Y guardado al salir de la sección (enabled false); al volver subiendo se arma el reverso. */
  const scrollYWhenSectionDisabledRef = useRef(null)

  const armReverseFromBelow = useCallback(() => {
    if (!completedForwardRef.current || phaseRef.current !== 'unlocked') return
    if (targetStepRef.current < CAROUSEL_MAX_STEP) return
    setPhase('locked-reverse')
    phaseRef.current = 'locked-reverse'
    targetStepRef.current = CAROUSEL_MAX_STEP
    setDisplayStep(CAROUSEL_MAX_STEP)
    wheelAccRef.current = 0
    setCarouselActive(true)
  }, [])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    if (enabled) return
    document.body.style.overflow = ''
    if (phaseRef.current === 'locked-forward' || phaseRef.current === 'locked-reverse') {
      setPhase('unlocked')
      phaseRef.current = 'unlocked'
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !titleRevealComplete) return
    if (initializedRef.current) return
    initializedRef.current = true
    setCarouselActive(true)
    setPhase('locked-forward')
    phaseRef.current = 'locked-forward'
    targetStepRef.current = 0
    setDisplayStep(0)
    wheelAccRef.current = 0
  }, [enabled, titleRevealComplete])

  useEffect(() => {
    let raf
    const loop = () => {
      setDisplayStep((prev) => {
        const tgt = targetStepRef.current
        const next = prev + (tgt - prev) * LERP
        return Math.abs(tgt - next) < 0.0018 ? tgt : next
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const locked =
      phase === 'locked-forward' || phase === 'locked-reverse'
    if (!enabled || !locked) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const onWheel = (e) => {
      const ph = phaseRef.current
      if (ph !== 'locked-forward' && ph !== 'locked-reverse') return
      e.preventDefault()
      e.stopPropagation()

      wheelAccRef.current += normalizeWheelDeltaY(e)

      const finishForward = () => {
        completedForwardRef.current = true
        setPhase('unlocked')
        phaseRef.current = 'unlocked'
      }

      const finishReverse = () => {
        setPhase('unlocked')
        phaseRef.current = 'unlocked'
        setCarouselActive(false)
      }

      /** Scroll hacia abajo: avanza en forward; en reverse deshace el retroceso (sube paso). */
      while (wheelAccRef.current >= WHEEL_THRESHOLD) {
        wheelAccRef.current -= WHEEL_THRESHOLD
        const mode = phaseRef.current
        if (mode !== 'locked-forward' && mode !== 'locked-reverse') break
        if (mode === 'locked-forward') {
          if (targetStepRef.current >= CAROUSEL_MAX_STEP) break
          targetStepRef.current += 1
          if (targetStepRef.current >= CAROUSEL_MAX_STEP) finishForward()
        } else {
          if (targetStepRef.current >= CAROUSEL_MAX_STEP) break
          targetStepRef.current += 1
        }
      }

      /** Scroll hacia arriba: retrocede en forward; en reverse acerca a 0 (efecto inverso). */
      while (wheelAccRef.current <= -WHEEL_THRESHOLD) {
        wheelAccRef.current += WHEEL_THRESHOLD
        const mode = phaseRef.current
        if (mode !== 'locked-forward' && mode !== 'locked-reverse') break
        if (mode === 'locked-forward') {
          if (targetStepRef.current <= 0) break
          targetStepRef.current -= 1
        } else {
          if (targetStepRef.current <= 0) break
          targetStepRef.current -= 1
          if (targetStepRef.current <= 0) finishReverse()
        }
      }
    }

    const onTouchMove = (e) => {
      if (phaseRef.current === 'locked-forward' || phaseRef.current === 'locked-reverse') {
        e.preventDefault()
      }
    }

    document.addEventListener('wheel', onWheel, { passive: false, capture: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('wheel', onWheel, { capture: true })
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [enabled, phase])

  useLayoutEffect(() => {
    if (!enabled) return
    ScrollTrigger.refresh()
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      scrollYWhenSectionDisabledRef.current = window.scrollY
      return
    }
    const prevY = scrollYWhenSectionDisabledRef.current
    scrollYWhenSectionDisabledRef.current = null
    if (prevY === null) return
    if (window.scrollY >= prevY - 4) return
    armReverseFromBelow()
  }, [enabled, armReverseFromBelow])

  /**
   * Si el usuario sube al hero (sección 1), la sección 2 queda debajo del viewport (top > innerHeight).
   * Resetea al estado inicial (paso 0, vacío) para que al bajar de nuevo el efecto arranque desde cero.
   */
  useEffect(() => {
    const el = sectionRef?.current
    if (!el) return

    let heroArmDone = false

    const tick = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const sectionBelowViewport = r.top > vh

      if (!sectionBelowViewport) {
        heroArmDone = false
        return
      }

      if (!initializedRef.current) return
      if (heroArmDone) return

      heroArmDone = true
      initializedRef.current = false
      completedForwardRef.current = false
      targetStepRef.current = 0
      setDisplayStep(0)
      wheelAccRef.current = 0
      setCarouselActive(false)
      setPhase('idle')
      phaseRef.current = 'idle'
    }

    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [sectionRef])

  useGSAP(
    () => {
      if (!enabled) return
      const el = sectionRef?.current
      if (!el) return

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onEnterBack: armReverseFromBelow,
      })

      return () => st.kill()
    },
    { dependencies: [enabled, sectionRef, armReverseFromBelow] },
  )

  return {
    scrollLocked: phase === 'locked-forward' || phase === 'locked-reverse',
    displayStep,
    carouselActive,
    phase,
  }
}
