import Section1 from './sections/section1/Section1'
import Section2 from './sections/section2/Section2'

export default function PostulacionPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-neutral-900">Postulacion</h1>
      <div className="mt-6">
        <Section1 />
        <Section2 />
      </div>
    </main>
  )
}
