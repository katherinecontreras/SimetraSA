import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export function VacantesTransitionShapes({
  enabled,
  vacantesSectionRef,
  serviciosSectionRef,
}) {
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const diamondRef = useRef(null)

  useGSAP(
    () => {
      if (!enabled) return

      const section = vacantesSectionRef.current
      const servicesSection = serviciosSectionRef.current
      const left = leftRef.current
      const right = rightRef.current
      const diamond = diamondRef.current
      if (!section || !servicesSection || !left || !right || !diamond) return

      const mm = gsap.matchMedia()
      const yToServices = (el, ratio) => () => {
        const targetY =
          servicesSection.offsetTop - section.offsetTop + servicesSection.offsetHeight * ratio
        return targetY - (el.offsetTop + el.offsetHeight / 2)
      }

      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            endTrigger: servicesSection,
            end: 'center center',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          left,
          { xPercent: -76, y: 0, rotation: 60, scale: 0.56 },
          { xPercent: -24, y: yToServices(left, 0.33), rotation: 40, scale: 1.12, ease: 'none' },
          0,
        )
          .fromTo(
            right,
            { xPercent: 76, y: 0, rotation: 120, scale: 0.56 },
            { xPercent: 24, y: yToServices(right, 0.33), rotation: 140, scale: 1.12, ease: 'none' },
            0,
          )
          .fromTo(
            diamond,
            { xPercent: -50, yPercent: 0, y: 0, scale: 0.32, rotation: 45 },
            { xPercent: -50, yPercent: 0, y: yToServices(diamond, 0.5), scale: 1, rotation: 45, ease: 'none' },
            0,
          )

        return () => tl.scrollTrigger?.kill()
      })

      mm.add('(max-width: 767px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            endTrigger: servicesSection,
            end: 'center center',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          left,
          { xPercent: -86, y: 0, rotation: 60, scale: 0.44 },
          { xPercent: -54, y: yToServices(left, 0.34), rotation: 40, scale: 0.88, ease: 'none' },
          0,
        )
          .fromTo(
            right,
            { xPercent: 86, y: 0, rotation: 120, scale: 0.44 },
            { xPercent: 54, y: yToServices(right, 0.34), rotation: 140, scale: 0.88, ease: 'none' },
            0,
          )
          .fromTo(
            diamond,
            { xPercent: -50, yPercent: 0, y: 0, scale: 0.3, rotation: 45 },
            { xPercent: -50, yPercent: 0, y: yToServices(diamond, 0.5), scale: 0.9, rotation: 45, ease: 'none' },
            0,
          )

        return () => tl.scrollTrigger?.kill()
      })

      return () => mm.revert()
    },
    { dependencies: [enabled, vacantesSectionRef, serviciosSectionRef] },
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-visible" aria-hidden>
      <div
        ref={leftRef}
        className="absolute left-0 top-[clamp(8rem,20vh,15rem)] h-56 w-56 origin-center rounded-[2.4rem] bg-[#6CBFE0] shadow-[0_28px_80px_rgba(108,191,224,0.42)] md:h-92 md:w-92"
      />
      <div
        ref={rightRef}
        className="absolute right-0 top-[clamp(8rem,20vh,15rem)] h-56 w-56 origin-center rounded-[2.4rem] bg-[#6CBFE0] shadow-[0_28px_80px_rgba(108,191,224,0.42)] md:h-92 md:w-92"
      />
      <div
        ref={diamondRef}
        className="absolute left-1/2 -bottom-72 h-152 w-152 origin-center -translate-x-1/2 rounded-[3rem] bg-[#6CBFE0] shadow-[0_34px_100px_rgba(108,191,224,0.46)] md:-bottom-96 md:h-216 md:w-216"
      />
    </div>
  )
}
