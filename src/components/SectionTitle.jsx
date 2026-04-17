/**
 * components/SectionTitle.jsx
 * Título con efecto Reveal (barra + texto).
 *
 * className : clases del h2 (por defecto centrado, grande).
 */

import { Reveal } from '../animations/Reveal'

const DEFAULT_TITLE_CLASS =
  'text-center text-3xl font-bold tracking-tight md:text-5xl'

const TITLE_ACCENT_CLASS = 'border-b-2 border-[#6CBFE0] pb-2'

export function SectionTitle({ text, isLoaded, className }) {
  const titleClass = className
    ? `${className} ${TITLE_ACCENT_CLASS}`
    : `${DEFAULT_TITLE_CLASS} ${TITLE_ACCENT_CLASS}`

  return (
    <Reveal isLoaded={isLoaded} color="#ffffff">
      <h2 className={titleClass}>{text}</h2>
    </Reveal>
  )
}
