/**
 * Detalle de un proyecto (sección 4). En tlf: título con flechas y transición de deslizamiento.
 * En desktop: párrafos, ubicación y “Volver a proyectos”.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const transiciónCarril = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

/** 1 = el nuevo entra por la derecha, el que sale hacia la izq.; -1 = al revés. 0 = sin desliz (lista). */
function variantesCarril(dirección) {
  if (dirección === 0) {
    return {
      initial: { opacity: 0, x: 0 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 0, transition: { ...transiciónCarril, duration: 0.2 } },
    }
  }
  if (dirección > 0) {
    return {
      initial: { x: '100%', opacity: 0.85 },
      animate: { x: 0, opacity: 1, transition: transiciónCarril },
      exit: { x: '-100%', opacity: 0.85, transition: transiciónCarril },
    }
  }
  return {
    initial: { x: '-100%', opacity: 0.85 },
    animate: { x: 0, opacity: 1, transition: transiciónCarril },
    exit: { x: '100%', opacity: 0.85, transition: transiciónCarril },
  }
}

/**
 * @param {object} props
 * @param {object} props.proyecto
 * @param {() => void} [props.onCerrar]
 * @param {boolean} [props.isPhone]
 */
export function DetailsProyect({ proyecto, onCerrar, isPhone }) {
  if (!proyecto) return null

  const parrafos = Array.isArray(proyecto.parrafos) ? proyecto.parrafos : []
  const ubicacion = proyecto.ubicacion

  if (isPhone) {
    return (
      <div className="w-full min-w-0 overflow-hidden px-1 pb-8 pt-2 text-white">
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="mt-6 w-full text-center text-sm font-semibold text-[#6CBFE0] underline-offset-2 transition hover:underline"
          >
            Volver a proyectos
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 text-white sm:px-8 md:px-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-balance sm:text-3xl md:text-4xl">
            {proyecto.title}
          </h2>
          {ubicacion ? (
            <p className="mt-2 text-sm text-white/70 md:text-base">{ubicacion}</p>
          ) : null}
        </div>
        {onCerrar && (
          <button
            type="button"
            onClick={onCerrar}
            className="self-start rounded-lg border-2 border-[#6CBFE0] px-4 py-2 text-sm font-semibold text-[#6CBFE0] transition hover:bg-[#6CBFE0] hover:text-black sm:self-auto"
          >
            Volver a proyectos
          </button>
        )}
      </div>
      {parrafos.length > 0 ? (
        <div className="flex flex-col gap-4 text-white/90">
          {parrafos.map((t, i) => (
            <p
              key={i}
              className="font-[family-name:var(--font-body)] text-base font-light leading-relaxed sm:text-lg"
            >
              {t}
            </p>
          ))}
        </div>
      ) : (
        <p className="font-[family-name:var(--font-body)] text-base italic text-white/50">
          Próximamente más detalles de este proyecto.
        </p>
      )}
    </div>
  )
}
