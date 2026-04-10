/**
 * pages/home/page.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Ejemplo de integración de los tres hooks y el LoadingScreen en una página.
 * Reemplaza el contenido de las secciones con tus componentes reales.
 */

import { useState } from 'react'
import { LoadingScreen } from '../../layouts/LoadingScreen'
import { useDeviceType } from '../../utils/useDeviceType'
import { usePageLoader } from '../../utils/usePageLoader'
import { useSectionHeights } from '../../utils/useSectionHeights'

import Hero from './sections/Hero'

export default function HomePage() {
  const { isDesktop, isMobile } = useDeviceType()
  const { progress, isLoaded } = usePageLoader([], 8000)
  const [showLoader, setShowLoader] = useState(true)
  const { sections } = useSectionHeights([isLoaded])

  return (
    <>
      {showLoader && (
        <LoadingScreen
          isLoaded={isLoaded}
          onExit={() => setShowLoader(false)}
        />
      )}

      <main>
        <section data-section="hero">
          <Hero
            isMobile={isMobile}
            isLoaded={isLoaded}
            loaderExited={!showLoader}
            progress={progress}
            sectionData={sections.find((s) => s.id === 'hero')}
          />
        </section>
      </main>
    </>
  )
}