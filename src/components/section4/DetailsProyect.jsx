
import { CapaFondoProyecto } from './CapaFondoProyecto'
import { CapaImgSobreFondoProyecto } from './CapaImgSobreFondoProyecto'
import { CapaInfo } from './CapaInfo'

export function DetailsProyect({ proyecto }) {
  if (!proyecto) return null

  return (
    <div className="relative z-0 isolate h-full min-h-0 w-full sm:min-w-0 overflow-hidden text-white">
      <CapaFondoProyecto proyecto={proyecto} />
      <CapaImgSobreFondoProyecto proyecto={proyecto} />
      <CapaInfo proyecto={proyecto} />
    </div>
  )
}
