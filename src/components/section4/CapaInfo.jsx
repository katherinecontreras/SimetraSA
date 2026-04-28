import { AppearFrom } from '../../animations/AppearFrom'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

const DIRECCION_INFO = {
  proyecto1: 'left',
  proyecto2: 'down',
  proyecto3: 'right',
}

const POSICION_INFO = {
  left: 'left-0 top-[6rem] bottom-0 w-full px-4 pb-24 pt-[6rem] text-left sm:px-8 md:top-[9.5rem] md:w-1/3 md:pl-8 md:pr-32 md:pt-[5.25rem]',
  right: 'right-0 top-[6rem] bottom-0 w-full px-4 pb-24 pt-[6rem] text-right sm:px-8 md:top-[9.5rem] md:w-1/3 md:pl-32 md:pr-8 md:pt-[5.25rem]',
  up: 'left-0 top-[6rem] bottom-0 w-full px-4 pb-24 pt-[6rem] text-center md:left-1/2 md:top-[9.5rem] md:w-1/3 md:-translate-x-1/2 md:pt-[5.25rem]',
  down: 'left-0 top-[6rem] bottom-0 w-full px-4 pb-24 pt-[6rem] text-center md:left-1/2 md:top-[9.5rem] md:w-1/3 md:-translate-x-1/2 md:pt-[5.25rem]',
}

export function CapaInfo({
  proyecto,
  isPhone = false,
  onVerMedia,
  visible = true,
}) {
  if (!proyecto) return null
  const parrafos = Array.isArray(proyecto.parrafos) ? proyecto.parrafos : []
  const coordenadas = Array.isArray(proyecto.coordenadas) ? proyecto.coordenadas : null
  const direccion = isPhone ? 'left' : (DIRECCION_INFO[proyecto.id] ?? 'left')
  const posicion = POSICION_INFO[direccion] ?? POSICION_INFO.left
  const tipoMedia = proyecto.tipoMedia ?? 'Imagenes'
  const tipoMediaNormalizado = tipoMedia.toLowerCase()
  const tieneVideo = tipoMediaNormalizado === 'video' && proyecto.video
  const tieneMedia = tipoMediaNormalizado !== 'nada' && (tieneVideo || proyecto.imagenes?.length > 0)
  const textoLink = tieneVideo ? 'Ver video' : 'Ver imagenes'

  return (
    <AppearFrom
      from={direccion}
      id={proyecto.id}
      visible={visible}
      className="pointer-events-none fixed inset-0 z-10 h-dvh w-screen overflow-hidden"
      motionClassName="absolute inset-0 h-dvh w-screen will-change-transform"
    >
      <div className={`pointer-events-auto absolute bg-black/65 text-white ${posicion}`}>
        {parrafos.map((parrafo, index) => (
          <p key={index} className="mt-4 first:mt-0 text-base text-white md:text-xl">
            {parrafo}
          </p>
        ))}
        {proyecto.ubicacion ? (
          <p className="mt-5 text-sm font-semibold text-white/75 md:text-xl">{proyecto.ubicacion}</p>
        ) : null}
        {coordenadas ? (
          <div className="mt-4 h-40 overflow-hidden rounded-xl border border-[#6CBFE0]/40 md:h-48">
            <MapContainer
              center={coordenadas}
              zoom={11}
              scrollWheelZoom={false}
              dragging={false}
              doubleClickZoom={false}
              zoomControl={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordenadas} />
            </MapContainer>
          </div>
        ) : null}
        {tieneMedia ? (
          <button
            type="button"
            onClick={onVerMedia}
            className="mt-6 inline-block text-sm font-semibold uppercase tracking-wide text-[#6CBFE0] transition hover:text-white"
          >
            {textoLink}
          </button>
        ) : null}
      </div>
    </AppearFrom>
  )
}