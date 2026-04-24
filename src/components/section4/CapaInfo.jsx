import { AppearFrom } from '../../animations/AppearFrom'
import { createPortal } from 'react-dom'

const DIRECCION_INFO = {
  proyecto1: 'left',
  proyecto2: 'down',
  proyecto3: 'right',
}

const POSICION_INFO = {
  left: 'left-0 top-1/2 max-w-xl -translate-y-1/2 px-4 text-left sm:px-8 md:px-16',
  right: 'right-0 top-1/2 max-w-xl -translate-y-1/2 px-4 text-right sm:px-8 md:px-16',
  up: 'left-1/2 top-1/2 max-w-xl -translate-x-1/2 -translate-y-1/2 px-4 text-center',
  down: 'left-1/2 top-1/2 max-w-xl -translate-x-1/2 -translate-y-1/2 px-4 text-center',
}

export function CapaInfo({ proyecto }) {
  if (!proyecto) return null
  const parrafos = Array.isArray(proyecto.parrafos) ? proyecto.parrafos : []
  const direccion = DIRECCION_INFO[proyecto.id] ?? 'left'
  const posicion = POSICION_INFO[direccion] ?? POSICION_INFO.left

  if (typeof document === 'undefined') return null

  return createPortal(
    <AppearFrom
      from={direccion}
      id={proyecto.id}
      className="pointer-events-none fixed inset-0 z-9998 h-dvh w-screen overflow-hidden"
      motionClassName="absolute inset-0 h-dvh w-screen will-change-transform"
    >
      <div className={`pointer-events-auto absolute text-white ${posicion}`}>
        <h2 className="text-2xl font-bold uppercase tracking-tight text-balance sm:text-3xl md:text-4xl">
          {proyecto.title}
        </h2>
        {proyecto.ubicacion ? (
          <p className="mt-2 text-sm text-white/70 md:text-base">{proyecto.ubicacion}</p>
        ) : null}
        {parrafos.map((parrafo, index) => (
          <p key={index} className="mt-4 text-sm text-white/80 md:text-base">
            {parrafo}
          </p>
        ))}
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#6CBFE0]">
          Ver imagenes
        </p>
      </div>
    </AppearFrom>,
    document.body,
  )
}