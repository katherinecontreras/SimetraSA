/** 1 = el nuevo entra por la derecha, el que sale hacia la izq.; -1 = al revés. 0 = sin desliz (lista). */
import { AppearFrom } from '../../animations/AppearFrom'
/**
 * Fondo a pantalla completa sobre el negro de la sección; el contenido va en `z-10` encima.
 * @param {{ proyecto: { id: string, imgFondo?: string, appearFrom?: string } }} props
 */
export function CapaFondoProyecto({ proyecto }) {
    if (!proyecto?.imgFondo) return null
    return (
      <AppearFrom
        from={proyecto.appearFrom}
        id={proyecto.id}
        className="pointer-events-none fixed inset-0 z-0 h-dvh w-screen overflow-hidden"
        motionClassName="absolute inset-0 h-dvh w-screen will-change-transform"
      >
        <img
          src={proyecto.imgFondo}
          alt=""
          className="h-dvh w-screen object-cover"
          draggable={false}
        />
      </AppearFrom>
    )
  }