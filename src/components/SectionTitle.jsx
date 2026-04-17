/**
 * components/SectionTitle.jsx
 * Título con efecto Reveal (barra + texto).
 *
 * className : clases del h2 (por defecto centrado, grande).
 */

import { Reveal } from '../animations/Reveal'

const DEFAULT_TITLE_CLASS =
  'text-center text-3xl font-bold tracking-tight md:text-5xl'

export function SectionTitle({ text, isLoaded, className }) {
  return (
    <Reveal isLoaded={isLoaded} color="#ffffff">
      <h2 className={className ?? DEFAULT_TITLE_CLASS}>{text}</h2>
    </Reveal>
  )
}
