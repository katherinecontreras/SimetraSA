import gsap from 'gsap'
import { useGSAP } from '@gsap/react'   
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ─── Hook: scroll pin ─────────────────────────────────────────────────────────

function useHeroScroll({ isLoaded, loaderExited, pinRef, zanjaRef, camionRef }) {
    useGSAP(
      () => {
        if (!isLoaded || !loaderExited) return
  
        let scrollTl = null
  
        const setup = () => {
          ScrollTrigger.refresh()
  
          scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger          : pinRef.current,
              start            : 'top top',
              end              : '+=280%',
              pin              : true,
              scrub            : 1,
              invalidateOnRefresh: true,
            },
          })
          scrollTl.to(zanjaRef.current,  { scaleY: 2, transformOrigin: '50% 100%', ease: 'none' }, 0)
          if (camionRef.current) {
            scrollTl.to(camionRef.current, { scale: 0, y: '-125vh', transformOrigin: '50% 40%', ease: 'none' }, 0)
          }
        }
  
        const delayed = gsap.delayedCall(0.05, setup)
  
        return () => {
          delayed.kill()
          scrollTl?.scrollTrigger?.kill()
          scrollTl?.kill()
        }
      },
      { dependencies: [isLoaded, loaderExited] },
    )
}
export { useHeroScroll }