import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const MotionDiv = motion.div

function buildWavePath(mouse, time, baseRadius = 99) {
  const points = []
  const total = 112
  const mouseAngle = Math.atan2(mouse.y, mouse.x)
  const mouseDistance = Math.hypot(mouse.x, mouse.y)
  const radialInfluence = Math.max(0, 1 - Math.abs(mouseDistance - baseRadius) / 46)

  for (let i = 0; i < total; i += 1) {
    const angle = (Math.PI * 2 * i) / total
    const wave =
      Math.sin(angle * 5 + time * 0.0016) * 3.2 +
      Math.sin(angle * 9 - time * 0.0011) * 1.8
    const angleDistance = Math.atan2(Math.sin(angle - mouseAngle), Math.cos(angle - mouseAngle))
    const angleInfluence = Math.exp(-(angleDistance ** 2) / (2 * 0.36 ** 2))
    const push = mouse.strength * radialInfluence * angleInfluence * 18
    const radius = baseRadius + wave - push

    points.push([
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
    ])
  }

  return `${points.map(([x, y], index) => (
    `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  )).join(' ')} Z`
}

export function useProyectsWaveCircle({ visible = true } = {}) {
  const rootRef = useRef(null)
  const mainPathRef = useRef(null)
  const targetMouseRef = useRef({ x: 0, y: 0, strength: 0 })
  const currentMouseRef = useRef({ x: 0, y: 0, strength: 0 })

  useEffect(() => {
    const updateMouse = (event) => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 100
      const y = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 100
      const distance = Math.hypot(x, y)
      const strength = Math.max(0, 1 - Math.abs(distance - 99) / 46)

      targetMouseRef.current = { x, y, strength }
    }

    const hideMouse = () => {
      targetMouseRef.current = {
        ...targetMouseRef.current,
        strength: 0,
      }
    }

    window.addEventListener('pointermove', updateMouse, { passive: true })
    window.addEventListener('pointerleave', hideMouse)

    let animationId = 0
    const animate = (time) => {
      const current = currentMouseRef.current
      const target = targetMouseRef.current
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      current.strength += (target.strength - current.strength) * 0.14

      mainPathRef.current?.setAttribute('d', buildWavePath(current, time, 99))

      animationId = window.requestAnimationFrame(animate)
    }

    animationId = window.requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', updateMouse)
      window.removeEventListener('pointerleave', hideMouse)
      window.cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <MotionDiv
      ref={rootRef}
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_48px_rgba(0,0,0,0.28)]"
      initial={{ scale: 0.02, opacity: 0 }}
      animate={visible ? { scale: 1, opacity: 1 } : { scale: 0.02, opacity: 0 }}
      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox="-115 -115 230 230"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <path
          ref={mainPathRef}
          fill="rgb(0 0 0 / 0.48)"
          stroke="rgb(0 0 0 / 0.48)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </MotionDiv>
  )
}
