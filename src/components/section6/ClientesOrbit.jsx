import { useEffect, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'

import { useHeroTilt } from '../../hooks/home/useHeroTilt'

const CLIENT_POSITIONS = [
  { left: '16%', top: '22%', mobileLeft: '23%', mobileTop: '13%', size: 'w-[7.1rem] md:w-[60rem]', depth: 0.55 },
  { left: '42%', top: '14%', mobileLeft: '72%', mobileTop: '13%', size: 'w-[6.8rem] md:w-[52rem]', depth: 0.38 },
  { left: '84%', top: '22%', mobileLeft: '24%', mobileTop: '27%', size: 'w-[7.1rem] md:w-[60rem]', depth: 0.52 },
  { left: '13%', top: '50%', mobileLeft: '76%', mobileTop: '28%', size: 'w-[6.8rem] md:w-[52rem]', depth: 0.7 },
  { left: '87%', top: '50%', mobileLeft: '18%', mobileTop: '68%', size: 'w-[6.8rem] md:w-[52rem]', depth: 0.68 },
  { left: '20%', top: '77%', mobileLeft: '80%', mobileTop: '68%', size: 'w-[7.1rem] md:w-[60rem]', depth: 0.3 },
  { left: '50%', top: '84%', mobileLeft: '24%', mobileTop: '83%', size: 'w-[6.8rem] md:w-[52rem]', depth: 0.36 },
  { left: '80%', top: '77%', mobileLeft: '76%', mobileTop: '83%', size: 'w-[7.1rem] md:w-[60rem]', depth: 0.5 },
  { left: '58%', top: '14%', mobileLeft: '50%', mobileTop: '92%', size: 'w-[6.5rem] md:w-[70rem]', depth: 0.42 },
]

export function ClientesOrbit({ clientes, visible, isPhone }) {
  const stageRef = useRef(null)
  const tiltRef = useRef(null)
  const frameRef = useRef(null)
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 })

  useHeroTilt({
    isLoaded: visible,
    loaderExited: true,
    pinRef: stageRef,
    tiltRef,
    resetKey: visible,
  })

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const updatePointerOffset = (event) => {
    if (isPhone || !stageRef.current) return

    const rect = stageRef.current.getBoundingClientRect()
    const nextOffset = {
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 22,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 22,
    }

    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current)
    }
    frameRef.current = window.requestAnimationFrame(() => {
      setPointerOffset(nextOffset)
      frameRef.current = null
    })
  }

  const resetPointerOffset = () => {
    if (isPhone) return
    setPointerOffset({ x: 0, y: 0 })
  }

  return (
    <div
      ref={stageRef}
      className="pointer-events-auto absolute inset-0 z-10"
      onPointerMove={updatePointerOffset}
      onPointerLeave={resetPointerOffset}
      aria-hidden
    >
      <div ref={tiltRef} className="relative h-full w-full will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
        {clientes.map((cliente, index) => {
          const position = CLIENT_POSITIONS[index % CLIENT_POSITIONS.length]
          const left = isPhone ? position.mobileLeft : position.left
          const top = isPhone ? position.mobileTop : position.top
          const followX = pointerOffset.x * position.depth
          const followY = pointerOffset.y * position.depth

          return (
            <Motion.div
              key={cliente.alt}
              initial={{ left: '50%', top: '50%', x: '-50%', y: '-50%', opacity: 0, scale: 0.25 }}
              animate={
                visible
                  ? { left, top, x: '-50%', y: '-50%', opacity: 1, scale: 1 }
                  : { left: '50%', top: '50%', x: '-50%', y: '-50%', opacity: 0, scale: 0.25 }
              }
              transition={{
                delay: visible ? 0.78 + index * 0.08 : 0,
                duration: 0.95,
                type: 'spring',
                stiffness: 64,
                damping: 16,
              }}
              className="absolute"
            >
              <div
                className="clientes-orbit-drift"
                style={{
                  '--orbit-duration': `${5.8 + index * 0.32}s`,
                  '--orbit-delay': `${index * -0.45}s`,
                  '--follow-x': `${followX}px`,
                  '--follow-y': `${followY}px`,
                }}
              >
                <Motion.div
                  whileHover={isPhone ? undefined : { scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 170, damping: 18 }}
                  className={[
                    'flex items-center justify-center px-1 py-1 will-change-transform',
                    position.size,
                  ].join(' ')}
                >
                  <img
                    src={cliente.src}
                    alt={cliente.alt}
                    className="max-h-28 w-full object-contain drop-shadow-[0_12px_28px_rgba(108,191,224,0.38)] md:max-h-48"
                    decoding="async"
                  />
                </Motion.div>
              </div>
            </Motion.div>
          )
        })}
      </div>
    </div>
  )
}
