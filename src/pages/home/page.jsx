/**
 * pages/home/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Página de inicio. Orquesta el loader y las secciones (hero y siguientes inline).
 *
 * Notas de diseño:
 *  - `showLoader` controla el montaje del LoadingScreen; cuando se desmonta
 *    (`loaderExited`) las animaciones de scroll/tilt del Hero se activan.
 */

import { useState } from 'react'

import { Reveal } from '../../animations/Reveal'
import { useHero } from '../../hooks/home/useHero'
import { LoadingScreen } from '../../layouts/LoadingScreen'
import { useDeviceType } from '../../utils/useDeviceType'
import { usePageLoader } from '../../utils/usePageLoader'

import Cielo from '../../assets/seccion1/Cielo.png'
import Simetra from '../../assets/seccion1/Simetra.png'
import Zanja from '../../assets/seccion1/Zanja.png'
import Camion from '../../assets/seccion1/Camion.png'

export default function HomePage() {
  const { isMobile } = useDeviceType()
  const { isLoaded } = usePageLoader([], 8_000)
  const [showLoader, setShowLoader] = useState(true)

  const loaderExited = !showLoader
  const {
    pinRef,
    simetraRef,
    simetraTiltRef,
    zanjaRef,
    camionRef,
  } = useHero({
    isLoaded,
    loaderExited,
  })

  return (
    <>
      {showLoader && (
        <LoadingScreen
          isLoaded={isLoaded}
          onExit={() => setShowLoader(false)}
        />
      )}

      <main>
        <section data-section="hero" className="relative overflow-hidden">
          <div ref={pinRef} className="relative h-screen w-full overflow-hidden">

            <div className="absolute inset-0">
              <img src={Cielo} alt="" aria-hidden className="h-full w-full object-cover" />
            </div>

            <div
              ref={simetraRef}
              className="pointer-events-none absolute left-1/2 top-1/3 z-10 flex h-screen w-4/5
                         -translate-x-1/2 -translate-y-1/2 items-center justify-center
                         opacity-0 will-change-[opacity]"
              style={{ perspective: '1100px' }}
            >
              <div
                ref={simetraTiltRef}
                className="flex h-full w-full items-center justify-center will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src={Simetra}
                  alt="Simetra"
                  className="h-full max-h-screen w-full object-contain [transform:translateZ(0)]"
                />
              </div>
            </div>

            <div
              ref={zanjaRef}
              className={[
                'absolute left-0 z-20 w-full will-change-transform',
                isMobile ? 'bottom-0 h-full' : 'bottom-[-20%]',
              ].join(' ')}
            >
              <img src={Zanja} alt="" aria-hidden className="h-full w-full object-cover" />

              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end pr-4 md:pr-10">
                <Reveal isLoaded={isLoaded} color="#ffffff" width="auto">
                  <h2 className="text-2xl tracking-tight md:text-4xl">Services S.A</h2>
                </Reveal>
              </div>
            </div>

            {!isMobile && (
              <div
                ref={camionRef}
                className="absolute left-0 top-0 z-30 flex w-full justify-center will-change-transform"
              >
                <img
                  src={Camion}
                  alt="Camión"
                  className="h-screen max-w-none object-contain"
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
