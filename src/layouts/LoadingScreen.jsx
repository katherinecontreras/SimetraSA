import { useEffect, useRef, useState } from 'react'
import { SplitPanelSlide } from '../animations/SplitPanelSlide'


export function LoadingScreen({ isLoaded = false, onExit }) {
  const [exiting, setExiting] = useState(false)
  const exitsDoneRef = useRef(0)

  // ✅ Cuando la carga termina, activa la animación de salida
  useEffect(() => {
    if (isLoaded) {
      setExiting(true)
    }
  }, [isLoaded])

  const handlePanelExit = () => {
    exitsDoneRef.current += 1
    if (exitsDoneRef.current >= 2 && onExit) onExit()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <SplitPanelSlide
        side="left"
        direction={exiting ? 'exit' : 'enter'}
        onComplete={exiting ? handlePanelExit : undefined}
      />
      <SplitPanelSlide
        side="right"
        direction={exiting ? 'exit' : 'enter'}
        onComplete={exiting ? handlePanelExit : undefined}
      />
    </div>
  )
}
