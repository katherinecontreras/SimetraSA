import { AppearFrom } from '../../animations/AppearFrom'
import { createPortal } from 'react-dom'

const DIRECCION_IMG_SOBRE_FONDO = {
  proyecto1: 'right',
  proyecto2: 'down',
  proyecto3: 'left',
}

const POSICION_IMG_SOBRE_FONDO = {
  left: 'left-0 top-1/2 h-dvh w-auto -translate-y-1/2 object-contain',
  right: 'right-0 top-1/2 h-dvh w-auto -translate-y-1/2 object-contain',
  up: 'left-1/2 top-1/2 h-dvh w-auto -translate-x-1/2 -translate-y-1/2 object-contain',
  down: 'left-1/2 top-1/2 h-dvh w-auto -translate-x-1/2 -translate-y-1/2 object-contain',
}

export function CapaImgSobreFondoProyecto({ proyecto }) {
  if (!proyecto?.imgSobreFondo) return null
  const appearFrom = DIRECCION_IMG_SOBRE_FONDO[proyecto.id] ?? 'left'
  const posicion = POSICION_IMG_SOBRE_FONDO[appearFrom] ?? POSICION_IMG_SOBRE_FONDO.left

  if (typeof document === 'undefined') return null

  return createPortal(
    <AppearFrom
      from={appearFrom}
      id={proyecto.id}
      className="pointer-events-none fixed inset-0 z-9999 h-dvh w-screen overflow-hidden"
      motionClassName="absolute inset-0 h-dvh w-screen will-change-transform"
    >
      <img
        src={proyecto.imgSobreFondo}
        alt="imagen sobre fondo del proyecto"
        className={`absolute ${posicion}`}
        draggable={false}
      />
    </AppearFrom>,
    document.body,
  )
}