import { AppearFrom } from '../../animations/AppearFrom'
import { createPortal } from 'react-dom'

const DIRECCION_IMG_SOBRE_FONDO = {
  proyecto1: 'right',
  proyecto2: 'left',
  proyecto3: 'left',
}

const POSICION_IMG_SOBRE_FONDO = {
  left: 'left-0 bottom-0 h-auto max-h-[85dvh] w-auto object-contain md:top-1/2 md:bottom-auto md:h-dvh md:max-h-none md:-translate-y-1/2',
  right: 'right-0/8 bottom-0 h-auto max-h-[85dvh] w-auto object-contain md:top-1/2 ',
  down: 'left-1/2 bottom-0 h-auto max-h-[75dvh] -translate-x-3/4  object-contain md:top-1/2 md:bottom-auto md:h-dvh md:max-h-none md:-translate-y-1/2',
}

export function CapaImgSobreFondoProyecto({ proyecto, isPhone = false, visible = true }) {
  if (isPhone || !proyecto?.imgSobreFondo) return null
  const appearFrom = DIRECCION_IMG_SOBRE_FONDO[proyecto.id] ?? 'left'
  const posicion = POSICION_IMG_SOBRE_FONDO[appearFrom] ?? POSICION_IMG_SOBRE_FONDO.left

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-9999 h-dvh w-screen overflow-hidden">
      <AppearFrom
        from={appearFrom}
        id={proyecto.id}
        visible={visible}
        className="absolute inset-0 h-dvh w-screen overflow-hidden"
        motionClassName="absolute inset-0 h-dvh w-screen will-change-transform"
      >
        <img
          src={proyecto.imgSobreFondo}
          alt="imagen sobre fondo del proyecto"
          className={`absolute ${posicion}`}
          draggable={false}
        />
      </AppearFrom>
    </div>,
    document.body,
  )
}