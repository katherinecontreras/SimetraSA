import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function useScrollBlackOverlayFade({ overlayRef, enabled }) {
  useGSAP(
    () => {
      if (!enabled) return

      const el = overlayRef.current
      if (!el) return

      gsap.to(el, {
        opacity: 1,
        overwrite: 'auto',
        scrollTrigger: {
          trigger: "[data-section='asi-trabajamos']",
          start: 'top bottom',
          end: 'top 10%',
          scrub: true,
          preventOverlaps: true,
          fastScrollEnd: true,
        },
      })
    },
    { dependencies: [enabled, overlayRef] },
  )
}
