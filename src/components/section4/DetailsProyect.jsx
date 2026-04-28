
import { CapaFondoProyecto } from './CapaFondoProyecto'
import { CapaImgSobreFondoProyecto } from './CapaImgSobreFondoProyecto'
import { CapaInfo } from './CapaInfo'
import { CapaMediaProyecto } from './CapaMediaProyecto'

export function DetailsProyect({
  proyecto,
  isPhone = false,
  onVerMedia,
  mediaVisible = false,
}) {
  if (!proyecto) return null

  return (
    <div
      className={[
        'relative z-0 isolate w-full sm:min-w-0 text-white',
        isPhone && mediaVisible ? 'min-h-0 overflow-visible' : 'h-full min-h-0 overflow-hidden',
      ].join(' ')}
    >
      <CapaFondoProyecto proyecto={proyecto} />
      <CapaMediaProyecto proyecto={proyecto} visible={mediaVisible} isPhone={isPhone} />
      <CapaImgSobreFondoProyecto proyecto={proyecto} isPhone={isPhone} visible={!mediaVisible} />
      <CapaInfo
        proyecto={proyecto}
        isPhone={isPhone}
        onVerMedia={onVerMedia}
        visible={!mediaVisible}
      />
    </div>
  )
}
