import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { useHomeNavTheme } from '../../context/HomeNavThemeContext'
import { useRouteTransition } from '../../context/useRouteTransition'
import { DISCIPLINAS, PROYECTOS_EMPRESA } from '../../constants/proyects'
import { BounceIn } from '../../animations/BounceIn'
import { SectionTitle } from '../../components/SectionTitle'
import { useProyectsWaveCircle } from '../../hooks/useProyectsWaveCircle'

const MotionLi = motion.li
const MotionUl = motion.ul
const TODAS_DISCIPLINAS_ID = 'todas'

function getProyectosEmpresa() {
  return PROYECTOS_EMPRESA
}

export default function ProyectsPage() {
  const { setNavLightBlend, setNavBackdropBlend } = useHomeNavTheme()
  const { isTransitioning } = useRouteTransition()
  const proyectosEmpresa = getProyectosEmpresa()
  const proyectoActivo = proyectosEmpresa[0]
  const [disciplinasSeleccionadas, setDisciplinasSeleccionadas] = useState([TODAS_DISCIPLINAS_ID])
  const proyectsWaveCircle = useProyectsWaveCircle({ visible: !isTransitioning })
  const disciplinasProyectoActivo = useMemo(() => {
    const ids = new Set(proyectoActivo.proyectos.flatMap((proyecto) => proyecto.disc_id))
    return DISCIPLINAS.filter((disciplina) => ids.has(disciplina.id))
  }, [proyectoActivo])
  const proyectosFiltrados = useMemo(() => {
    const disciplinaSeleccionada = disciplinasSeleccionadas[0]

    if (disciplinaSeleccionada === TODAS_DISCIPLINAS_ID) {
      return proyectoActivo.proyectos
    }

    return proyectoActivo.proyectos.filter((proyecto) => (
      proyecto.disc_id.includes(disciplinaSeleccionada)
    ))
  }, [disciplinasSeleccionadas, proyectoActivo])
  const filtroDisciplinasKey = disciplinasSeleccionadas.join('-')

  const toggleDisciplina = (disciplinaId) => {
    setDisciplinasSeleccionadas((actuales) => {
      if (disciplinaId === TODAS_DISCIPLINAS_ID) return [TODAS_DISCIPLINAS_ID]

      return actuales.includes(disciplinaId) ? [TODAS_DISCIPLINAS_ID] : [disciplinaId]
    })
  }

  useEffect(() => {
    setNavLightBlend(1)
    setNavBackdropBlend(0)

    return () => {
      setNavLightBlend(0)
      setNavBackdropBlend(0)
    }
  }, [setNavBackdropBlend, setNavLightBlend])

  return (
    <main
      className="relative grid h-screen overflow-hidden bg-[#05070b] grid-cols-3"
      data-proyectos-count={proyectosEmpresa.length}
    >
      <div className="absolute inset-0 top-0 left-0 h-full w-full">
        <img
          src={proyectoActivo.imagen}
          alt="imagen de fondo"
          className="h-full w-full object-cover"
        />
      </div>
      {proyectsWaveCircle}
      <aside className="relative z-20 grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] px-10 pt-28">
        <div className="flex flex-col items-center justify-center gap-3">
          <SectionTitle
            text="Proyectos"
            isLoaded={!isTransitioning}
            className="text-left text-2xl font-bold uppercase tracking-tight text-white md:text-4xl"
          />
          <p className="text-lg text-white/75">
            {proyectosFiltrados.length} proyectos
          </p>
        </div>

        <div className="min-h-0 w-full -mt-8 overflow-y-auto py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait">
            <MotionUl
              key={filtroDisciplinasKey}
              className="flex w-full flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.24, ease: 'easeInOut' }}
            >
              {proyectosFiltrados.map((proyecto, index) => (
                <MotionLi
                  key={`${proyectoActivo.cliente}-${proyecto.desc}`}
                  className="w-[80%] rounded-3xl bg-black/48 px-5 py-4 text-base leading-relaxed text-white shadow-[0_18px_38px_rgba(0,0,0,0.22)] backdrop-blur-sm"
                  initial={{ opacity: 0, y: 22, scale: 0.96 }}
                  animate={
                    isTransitioning
                      ? { opacity: 0, y: 22, scale: 0.96 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.1 + index * 0.055,
                  }}
                >
                  {proyecto.desc}
                </MotionLi>
              ))}
            </MotionUl>
          </AnimatePresence>
        </div>

        <div className="relative z-30 flex w-full items-center justify-center px-4 pt-12 pb-10">
          <button
            className="flex items-center justify-center rounded-full px-4 py-2 text-2xl font-bold text-white"
            style={{ backgroundColor: proyectoActivo.color }}
          >
            <h2>anterior</h2>
          </button>
        </div>
      </aside>
      <section className="relative z-20 flex items-center justify-center perspective-distant">
        <BounceIn
          visible={!isTransitioning}
          className="absolute inset-x-0 top-24 z-30 flex items-center justify-center"
        >
          <div
            className="flex items-center justify-center rounded-full px-4 py-2 text-2xl font-bold text-white"
            style={{ backgroundColor: proyectoActivo.color }}
          >
            <h2>Cliente</h2>
          </div>
        </BounceIn>
        <BounceIn
          visible={!isTransitioning}
          className="relative aspect-square h-[50%] rounded-full"
          style={{
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.5), ${proyectoActivo.color} 34%, color-mix(in srgb, ${proyectoActivo.color} 72%, black) 100%)`,
            boxShadow:
              'inset -22px -28px 44px rgba(0,0,0,0.34), inset 14px 16px 28px rgba(255,255,255,0.22), 0 34px 70px rgba(0,0,0,0.46)',
            transformStyle: 'preserve-3d',
          }}
          aria-hidden
        >
          <span className="absolute inset-[7%] rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.32),transparent_38%)]" />
          <span className="absolute inset-0 rounded-full shadow-[18px_0_34px_rgba(255,255,255,0.13)_inset,-18px_0_34px_rgba(0,0,0,0.32)_inset]" />
          <h2 className="absolute inset-0 z-10 flex items-center justify-center px-8 text-center text-9xl font-bold leading-none text-white">
            {proyectoActivo.cliente}
          </h2>
        </BounceIn>
        <BounceIn
          visible={!isTransitioning}
          className="absolute inset-x-6 bottom-10 z-30 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            { id: TODAS_DISCIPLINAS_ID, nombre: 'Todas' },
            ...disciplinasProyectoActivo,
          ].map((disciplina) => {
            const seleccionada = disciplinasSeleccionadas.includes(disciplina.id)

            return (
              <button
                key={disciplina.id}
                type="button"
                className={[
                  'flex items-center justify-center rounded-full px-3 py-1.5 text-md transition-colors duration-300 ease-out',
                  seleccionada
                    ? 'text-white'
                    : 'bg-white text-black hover:bg-(--cliente-color) hover:text-white',
                ].join(' ')}
                style={{
                  '--cliente-color': proyectoActivo.color,
                  backgroundColor: seleccionada ? proyectoActivo.color : undefined,
                }}
                onClick={() => toggleDisciplina(disciplina.id)}
              >
                {disciplina.nombre}
              </button>
            )
          })}
        </BounceIn>
      </section>
      <aside className="relative z-20" />
    </main>
  )
}
