/**
 * layouts/LoadingScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Pantalla de carga compuesta por dos paneles (SplitPanelSlide).
 * Se monta sobre el contenido y se desmonta tras la animación de salida.
 *
 * Props:
 *   isLoaded        : boolean — cuando pasa a true dispara la animación de salida
 *   onEnterComplete : () => void — callback cuando los paneles terminan de cubrir
 *   onExit          : () => void — callback para que el padre desmonte este componente
 *   color           : string  — color de los paneles (se pasa a SplitPanelSlide)
 *   animateEnter    : boolean — si true, los paneles entran desde los bordes
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { SplitPanelSlide } from '../animations/SplitPanelSlide'

const PANELS = ['left', 'right']

export function LoadingScreen({
  isLoaded = false,
  onEnterComplete,
  onExit,
  color,
  animateEnter = false,
}) {
  const [exiting, setExiting]  = useState(false)
  const enterCompletedRef      = useRef(0)
  const exitCompletedRef       = useRef(0)

  // Cuando la carga termina → activa la animación de salida
  useEffect(() => {
    if (isLoaded) setExiting(true)
  }, [isLoaded])

  // Ambos paneles deben terminar de cubrir antes de navegar.
  const handleEnterComplete = useCallback(() => {
    enterCompletedRef.current += 1
    if (enterCompletedRef.current >= PANELS.length) {
      onEnterComplete?.()
    }
  }, [onEnterComplete])

  // Ambos paneles deben terminar su salida antes de desmontar.
  const handleExitComplete = useCallback(() => {
    exitCompletedRef.current += 1
    if (exitCompletedRef.current >= PANELS.length) {
      onExit?.()
    }
  }, [onExit])

  return (
    <div
      aria-hidden
      style={{
        position        : 'fixed',
        inset           : 0,
        zIndex          : 9999,
        overflow        : 'hidden',
        backgroundColor : 'transparent',
        pointerEvents   : exiting ? 'none' : 'all',
      }}
    >
      {PANELS.map((side) => (
        <SplitPanelSlide
          key={side}
          side={side}
          direction={exiting ? 'exit' : animateEnter ? 'cover' : 'enter'}
          color={color}
          onComplete={exiting ? handleExitComplete : animateEnter ? handleEnterComplete : undefined}
        />
      ))}
    </div>
  )
}