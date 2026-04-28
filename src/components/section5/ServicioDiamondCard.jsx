import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const MotionArticle = motion.article
const HOVER_ANIMATION = {
  scale: 1.38,
  transition: { type: 'spring', stiffness: 180, damping: 24, mass: 0.8 },
}

export function ServicioDiamondCard({
  servicio,
  index,
  visible,
  clickReveal = false,
  isClickActive = false,
  onClickReveal,
}) {
  const ServicioIcon = servicio.Icon
  const cardRef = useRef(null)
  const [hoverActive, setHoverActive] = useState(false)
  const [typedText, setTypedText] = useState('')
  const active = clickReveal ? isClickActive : hoverActive

  useEffect(() => {
    if (!active) return

    let i = 0
    const intervalId = window.setInterval(() => {
      i += 5
      setTypedText(servicio.description.slice(0, i))
      if (i >= servicio.description.length) {
        window.clearInterval(intervalId)
      }
    }, 12)

    return () => window.clearInterval(intervalId)
  }, [active, servicio.description])

  const showDetails = () => {
    if (clickReveal) return
    setTypedText('')
    setHoverActive(true)
  }

  const hideDetails = () => {
    if (clickReveal) return
    setHoverActive(false)
    setTypedText('')
  }

  const handleClick = () => {
    if (!clickReveal) return
    setTypedText('')
    onClickReveal?.()
  }

  return (
    <MotionArticle
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      whileHover={clickReveal ? undefined : HOVER_ANIMATION}
      whileFocus={clickReveal ? undefined : HOVER_ANIMATION}
      transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
      onPointerEnter={showDetails}
      onPointerLeave={hideDetails}
      onFocus={showDetails}
      onBlur={hideDetails}
      onClick={handleClick}
      tabIndex={0}
      className={[
        'group flex rotate-45 items-center justify-center rounded-[2.4rem] border border-white/45 bg-white/90 text-black shadow-[0_24px_70px_rgba(0,0,0,0.16)] backdrop-blur-md',
        'transition-[width,height,box-shadow] duration-700 ease-out focus:outline-none',
        active ? 'h-144 w-xl shadow-[0_34px_90px_rgba(0,0,0,0.24)]' : 'h-64 w-64',
        'md:h-80 md:w-80 md:transition-shadow md:duration-500 md:ease-out md:hover:z-20 md:hover:shadow-[0_34px_90px_rgba(0,0,0,0.24)] md:focus:z-20 md:focus:shadow-[0_34px_90px_rgba(0,0,0,0.24)]',
        'md:absolute md:h-80 md:w-80 xl:h-88 xl:w-88',
        index === 0 && 'md:left-[3%] md:top-28 lg:left-[5%] xl:left-[8%]',
        index === 1 && 'md:left-1/2 md:top-92 md:-translate-x-1/2',
        index === 2 && 'md:right-[3%] md:top-28 lg:right-[5%] xl:right-[8%]',
      ].join(' ')}
    >
      <div className="flex h-auto max-h-[82vh] w-[calc(100vw-2rem)] max-w-96 -rotate-45 flex-col items-center justify-center px-3 text-center md:h-[82%] md:w-[82%] md:max-w-none md:px-0 md:max-h-none">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#6CBFE0] transition-transform duration-500 ease-out group-hover:scale-110 group-focus:scale-110 md:h-14 md:w-14">
          <ServicioIcon size={26} strokeWidth={1.8} />
        </div>
        <h3 className="mt-2 max-w-full text-xl font-bold leading-tight md:text-2xl">
          {servicio.title}
        </h3>
        <p
          className={[
            'mt-4 max-h-0 max-w-full overflow-hidden wrap-break-word text-xl leading-snug text-black/80 opacity-0 transition-[max-height,opacity] duration-700 ease-out md:text-base',
            active && 'max-h-176 opacity-100',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {typedText}
          {active && typedText.length < servicio.description.length ? (
            <span className="animate-pulse">|</span>
          ) : null}
        </p>
      </div>
    </MotionArticle>
  )
}
