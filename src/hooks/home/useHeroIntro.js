// ─── Hook: animación de entrada ───────────────────────────────────────────────
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

function useHeroIntro({
  isLoaded,
  simetraRef,
  zanjaRef,
  camionRef,
}) {
  useGSAP(
    () => {
      if (!isLoaded) return

      const tl = gsap.timeline()

      tl.fromTo(
        simetraRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.85, ease: 'power2.out' },
      )
      tl.fromTo(
        zanjaRef.current,
        { scaleY: 0.55, transformOrigin: '50% 100%' },
        { scaleY: 1, transformOrigin: '50% 100%', duration: 0.72, ease: 'power2.out' },
        0.08,
      )
      if (camionRef.current) {
        tl.fromTo(
          camionRef.current,
          { y: '-28vh' },
          { y: 0, duration: 0.85, ease: 'power2.out' },
          0.06,
        )
      }

      return () => tl.kill()
    },
    { dependencies: [isLoaded] },
  )
}
export { useHeroIntro }
