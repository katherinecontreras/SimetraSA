import { motion } from 'framer-motion'
import { Briefcase, Clock, MapPin, Wallet } from 'lucide-react'

export function VacanteCard({ vacante, index, visible }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
      className="group relative flex min-h-112 flex-col overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.10)] transition duration-300 hover:-translate-y-2 hover:border-[#6CBFE0]/80 hover:shadow-[0_30px_90px_rgba(108,191,224,0.25)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#6CBFE0]" aria-hidden />
      <div className="absolute right-5 top-5 rounded-full bg-black p-3 text-[#6CBFE0] transition duration-300 group-hover:scale-110 group-hover:bg-[#6CBFE0] group-hover:text-black">
        <Briefcase size={22} strokeWidth={1.8} />
      </div>

      <div className="pr-14">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#217a9f]">
          {vacante.area}
        </p>
        <h3 className="mt-4 text-2xl font-bold leading-tight text-black md:text-3xl">
          {vacante.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-black/70">
          {vacante.description}
        </p>
      </div>

      <div className="mt-6 grid gap-3 text-sm font-semibold text-black/75">
        <div className="flex items-center gap-3 rounded-2xl bg-black/4 px-4 py-3">
          <MapPin size={18} className="text-[#217a9f]" />
          <span>{vacante.location}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-black/4 px-4 py-3">
            <Clock size={17} className="shrink-0 text-[#217a9f]" />
            <span>{vacante.type}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-black/4 px-4 py-3">
            <Wallet size={17} className="shrink-0 text-[#217a9f]" />
            <span>{vacante.salary}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {vacante.requirements.map((requirement) => (
          <span
            key={requirement}
            className="rounded-full border border-[#6CBFE0]/50 bg-[#6CBFE0]/10 px-3 py-1.5 text-sm font-semibold text-black/75"
          >
            {requirement}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          className="w-full rounded-full bg-black px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-[#6CBFE0] hover:text-black"
        >
          Ver puesto
        </button>
      </div>
    </motion.article>
  )
}
