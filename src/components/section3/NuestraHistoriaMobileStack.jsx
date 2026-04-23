/**
 * Vista sin SVG (tablet / móvil): partes 1–4 en columna; cada título y texto
 * se revelan al entrar en el viewport; permanecen visibles al seguir bajando.
 */

import { useEffect, useRef, useState } from 'react'

import { FadeInAndOut } from '../../animations/FadeInAndOut'
import { useRevealWhenVisible } from '../../hooks/useRevealWhenVisible'
import { SectionTitle } from '../SectionTitle'

function NuestraHistoriaPartCard({ part, enabled }) {
  const ref = useRef(null)
  const inView = useRevealWhenVisible(ref, {
    enabled,
    threshold: 0.22,
    rootMargin: '0px 0px -6% 0px',
  })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (inView) setRevealed(true)
  }, [inView])

  const show = revealed

  return (
    <article
      ref={ref}
      className="flex w-full max-w-lg mt-10 flex-col items-center gap-5 px-1 py-12 first:pt-2 last:pb-4 sm:gap-6 sm:px-2 sm:py-10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#6CBFE0] bg-black p-0.5 sm:h-24 sm:w-24">
        <img
          src={part.image}
          alt=""
          className="h-full w-full object-cover"
          width={96}
          height={96}
        />
      </div>
      <SectionTitle
        text={part.title}
        isLoaded={show}
        className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
      />
      <FadeInAndOut
        visible={show}
        className="text-center text-base leading-relaxed text-white/95 text-balance sm:text-lg"
        delay={0.12}
        yOffset={10}
      >
        <p className="text-balance">{part.text}</p>
      </FadeInAndOut>
    </article>
  )
}

export function NuestraHistoriaMobileStack({ parts, enabled = true }) {
  return (
    <ol className="m-0 flex w-full max-w-3xl list-none flex-col items-center p-0">
      {parts.map((part) => (
        <li key={part.id} className="w-full">
          <NuestraHistoriaPartCard part={part} enabled={enabled} />
        </li>
      ))}
    </ol>
  )
}
