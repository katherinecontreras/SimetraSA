/**
 * layouts/LoadingScreen.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Pantalla de carga compuesta por dos paneles (SplitPanelSlide).
 * Se monta sobre el contenido y se desmonta tras la animación de salida.
 *
 * Props:
 *   isLoaded : boolean       — cuando pasa a true dispara la animación de salida
 *   onExit   : () => void    — callback para que el padre desmonte este componente
 *   color    : string        — color de los paneles (se pasa a SplitPanelSlide)
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { SplitPanelSlide } from '../animations/SplitPanelSlide'

const PANELS = ['left', 'right']

export function LoadingScreen({ isLoaded = false, onExit, color }) {
  const [exiting, setExiting]  = useState(false)
  const panelsCompletedRef     = useRef(0)

  // Cuando la carga termina → activa la animación de salida
  useEffect(() => {
    if (isLoaded) setExiting(true)
  }, [isLoaded])

  // Ambos paneles deben terminar su animación antes de llamar a onExit
  const handlePanelComplete = useCallback(() => {
    panelsCompletedRef.current += 1
    if (panelsCompletedRef.current >= PANELS.length) {
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
          direction={exiting ? 'exit' : 'enter'}
          color={color}
          onComplete={exiting ? handlePanelComplete : undefined}
        />
      ))}
    </div>
  )
}