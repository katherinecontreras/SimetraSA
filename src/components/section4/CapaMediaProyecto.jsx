import { AppearFrom } from '../../animations/AppearFrom'
import { AnimatePresence, motion as Motion } from 'framer-motion'

export function CapaMediaProyecto({ proyecto, visible = false, isPhone = false }) {
  const imagenes = Array.isArray(proyecto?.imagenes) ? proyecto.imagenes : []
  const tipoMedia = proyecto?.tipoMedia ?? 'Imagenes'
  const tipoMediaNormalizado = tipoMedia.toLowerCase()
  const esVideo = tipoMediaNormalizado === 'video'
  const video = esVideo ? proyecto?.video : ''
  const imagenesGaleria = imagenes.slice(0, 8)

  if (!proyecto || tipoMediaNormalizado === 'nada') return null

  return (
    <div
      className={[
        'pointer-events-none z-8 w-full',
        isPhone ? 'relative min-h-0' : 'fixed inset-x-0 top-36 bottom-0',
      ].join(' ')}
    >
      {esVideo ? (
        <AppearFrom
          from="down"
          id={`${proyecto.id}-video`}
          visible={visible}
          className={isPhone ? 'relative w-full' : 'absolute inset-0'}
          motionClassName={isPhone ? 'relative w-full' : 'absolute inset-0'}
        >
          <div className="pointer-events-auto aspect-video w-full overflow-hidden bg-black shadow-2xl">
            {video ? (
              <video
                src={video}
                title={`Video ${proyecto.title}`}
                className="h-full w-full"
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : null}
          </div>
        </AppearFrom>
      ) : (
        <div
          className={[
            'grid w-full',
            isPhone ? 'grid-cols-1' : 'h-full grid-cols-4 grid-rows-2',
          ].join(' ')}
        >
          {isPhone ? (
            imagenesGaleria.map((imagen, index) => (
              <AppearFrom
                key={`${proyecto.id}-imagen-${index}`}
                from="left"
                id={`${proyecto.id}-imagen-${index}`}
                visible={visible}
                delay={index * 0.06}
                className="relative h-[400px] w-full overflow-hidden"
                motionClassName="absolute inset-0 h-full w-full"
              >
                <img
                  src={imagen}
                  alt={`Imagen ${index + 1} de ${proyecto.title}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </AppearFrom>
            ))
          ) : (
            <AnimatePresence>
              {visible &&
                imagenesGaleria.map((imagen, index) => (
                  <Motion.div
                    key={`${proyecto.id}-imagen-${index}`}
                    className="relative h-full w-full overflow-hidden"
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.38,
                      ease: [0.22, 1.24, 0.36, 1],
                    }}
                  >
                    <img
                      src={imagen}
                      alt={`Imagen ${index + 1} de ${proyecto.title}`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </Motion.div>
                ))}
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  )
}
