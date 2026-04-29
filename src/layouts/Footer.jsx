import { useEffect, useRef } from 'react'
import { Mail, MessageCircle } from 'lucide-react'

import iconLogo from '../assets/IconLogo.png'
import { SectionTitle } from '../components/SectionTitle'

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden>
      <path d="M6.94 8.98H3.58V20h3.36V8.98ZM5.26 4a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.42 13.68c0-2.96-1.58-4.34-3.7-4.34a3.2 3.2 0 0 0-2.9 1.6h-.05V8.98h-3.22V20h3.36v-5.45c0-1.44.27-2.83 2.05-2.83 1.75 0 1.78 1.64 1.78 2.92V20h3.36v-6.32h-.68Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" />
    </svg>
  )
}

const socialLinks = [
  {
    href: 'https://www.linkedin.com/company/simetrasa/',
    label: 'LinkedIn de Simetra',
    icon: <LinkedinIcon />,
  },
  {
    href: 'https://www.instagram.com/simetraservicesrl/',
    label: 'Instagram de Simetra',
    icon: <InstagramIcon />,
  },
  {
    href: 'https://wa.me/542994413075',
    label: 'WhatsApp de Simetra',
    icon: <MessageCircle size={22} strokeWidth={1.8} />,
  },
  {
    href: 'mailto:info@simetra.com.ar',
    label: 'Email de Simetra',
    icon: <Mail size={22} strokeWidth={1.8} />,
  },
]

const footerCardClass =
  'min-h-32 bg-black/82 p-12 shadow-[0_0_85px_48px_rgba(0,0,0,0.86)] backdrop-blur-4xl'

function NetworkBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const footer = canvas?.closest('footer')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !footer || !ctx) return undefined

    const points = []
    const mouse = { x: -9999, y: -9999, active: false }
    let width = 0
    let height = 0
    let dpr = 1
    let animationId = 0
    let isVisible = false
    let lastFrame = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createPoints = () => {
      points.length = 0
      const spacing = width < 768 ? 88 : 118
      const cols = Math.ceil(width / spacing) + 2
      const rows = Math.ceil(height / spacing) + 2

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const seed = Math.sin((row + 1) * 37.2 + (col + 1) * 19.8)
          const x = col * spacing - spacing * 0.5 + seed * 18
          const y = row * spacing - spacing * 0.5 + Math.cos(seed * 12) * 18
          points.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 })
        }
      }
    }

    const resize = () => {
      const rect = footer.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = 1
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createPoints()
    }

    const updateMouse = (event) => {
      const rect = footer.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
      mouse.active = true
    }

    const hideMouse = () => {
      mouse.active = false
      mouse.x = -9999
      mouse.y = -9999
    }

    const draw = (time) => {
      if (!isVisible) {
        animationId = 0
        return
      }

      if (time - lastFrame < 33) {
        animationId = requestAnimationFrame(draw)
        return
      }

      lastFrame = time
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1.6
      ctx.shadowColor = '#6CBFE0'
      ctx.shadowBlur = 2

      for (const point of points) {
        const driftX = Math.sin(time * 0.00035 + point.baseY * 0.015) * 4
        const driftY = Math.cos(time * 0.0003 + point.baseX * 0.012) * 4
        const targetX = point.baseX + driftX
        const targetY = point.baseY + driftY

        point.vx += (targetX - point.x) * 0.018
        point.vy += (targetY - point.y) * 0.018

        if (mouse.active) {
          const dx = point.x - mouse.x
          const dy = point.y - mouse.y
          const dist = Math.hypot(dx, dy)
          const radius = 175

          if (dist > 0 && dist < radius) {
            const force = ((radius - dist) / radius) ** 2 * 11
            point.vx += (dx / dist) * force
            point.vy += (dy / dist) * force
          }
        }

        point.vx *= 0.88
        point.vy *= 0.88
        point.x += point.vx
        point.y += point.vy
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const a = points[i]
          const b = points[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          const maxDistance = 135

          if (distance < maxDistance) {
            ctx.strokeStyle = '#6CBFE0'
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const point of points) {
        ctx.fillStyle = '#6CBFE0'
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }

    const startAnimation = () => {
      if (animationId || reducedMotion) return
      animationId = requestAnimationFrame(draw)
    }

    const stopAnimation = () => {
      if (!animationId) return
      cancelAnimationFrame(animationId)
      animationId = 0
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          resize()
          startAnimation()
          return
        }
        stopAnimation()
      },
      { rootMargin: '180px' },
    )

    resizeObserver.observe(footer)
    visibilityObserver.observe(footer)
    footer.addEventListener('pointermove', updateMouse)
    footer.addEventListener('pointerleave', hideMouse)
    resize()

    return () => {
      stopAnimation()
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      footer.removeEventListener('pointermove', updateMouse)
      footer.removeEventListener('pointerleave', hideMouse)
    }
  }, [])

  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
        style={{ zIndex: 0 }}
        viewBox="0 0 1200 360"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="#6CBFE0" strokeWidth="1.6" opacity="0.35" fill="none">
          <path d="M0 72 L120 34 L260 96 L410 42 L560 114 L730 52 L900 92 L1060 38 L1200 74" />
          <path d="M0 175 L150 128 L305 190 L470 138 L630 210 L790 132 L960 186 L1120 126 L1200 154" />
          <path d="M0 285 L140 232 L290 304 L450 238 L610 292 L790 244 L970 306 L1120 236 L1200 268" />
          <path d="M120 34 L150 128 L140 232" />
          <path d="M260 96 L305 190 L290 304" />
          <path d="M410 42 L470 138 L450 238" />
          <path d="M560 114 L630 210 L610 292" />
          <path d="M730 52 L790 132 L790 244" />
          <path d="M900 92 L960 186 L970 306" />
          <path d="M1060 38 L1120 126 L1120 236" />
        </g>
        <g fill="#6CBFE0" opacity="0.45">
          <circle cx="120" cy="34" r="4" />
          <circle cx="260" cy="96" r="4" />
          <circle cx="410" cy="42" r="4" />
          <circle cx="560" cy="114" r="4" />
          <circle cx="730" cy="52" r="4" />
          <circle cx="900" cy="92" r="4" />
          <circle cx="1060" cy="38" r="4" />
          <circle cx="150" cy="128" r="4" />
          <circle cx="305" cy="190" r="4" />
          <circle cx="470" cy="138" r="4" />
          <circle cx="630" cy="210" r="4" />
          <circle cx="790" cy="132" r="4" />
          <circle cx="960" cy="186" r="4" />
          <circle cx="1120" cy="126" r="4" />
          <circle cx="140" cy="232" r="4" />
          <circle cx="290" cy="304" r="4" />
          <circle cx="450" cy="238" r="4" />
          <circle cx="610" cy="292" r="4" />
          <circle cx="790" cy="244" r="4" />
          <circle cx="970" cy="306" r="4" />
          <circle cx="1120" cy="236" r="4" />
        </g>
      </svg>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{ zIndex: 0 }}
        aria-hidden
      />
    </>
  )
}

export function Footer() {
  return (
    <footer className="relative isolate z-10001 overflow-hidden bg-black px-4 py-12 text-white shadow-[inset_0_32px_80px_rgba(0,0,0,0.95),inset_0_-32px_80px_rgba(0,0,0,0.95),inset_32px_0_80px_rgba(0,0,0,0.85),inset_-32px_0_80px_rgba(0,0,0,0.85)] sm:px-6 md:py-16">
      <NetworkBackground />
      <div
        className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 md:grid-cols-3 md:gap-10"
        style={{ zIndex: 1 }}
      >
                <div className={`${footerCardClass} flex flex-col items-center justify-start gap-8 text-center`}>
          <div className="flex flex-col items-center">
            <img
              src={iconLogo}
              alt="Simetra"
              className="h-14 w-auto object-contain"
              width={120}
              height={40}
              decoding="async"
            />
            <h1 className="mt-3 text-2xl uppercase text-white">
              SIMETRA
            </h1>
            <h2 className="text-lg font-bold text-white/70">Services S.A</h2>
          </div>

          <div className="flex items-center justify-center gap-4">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[#6CBFE0] hover:text-[#6CBFE0]"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>

          <div className="space-y-2 text-xl text-white/65">
            <p>
              © Copyright <strong className="font-semibold text-white">SIMETRA SERVICE S.R.L.</strong>{' '}
              All Rights Reserved
            </p>
            <p>
              <a
                href="https://www.linkedin.com/in/katherine-contreras/"
                target="_blank"
                rel="noreferrer"
                className="text-[#6CBFE0] underline underline-offset-4 transition-colors hover:text-white"
              >
                Designed by Katherine Contreras
              </a>
            </p>
          </div>
        </div>
        <div className={footerCardClass}>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              title="Ubicación de Simetra"
              src="https://www.google.com/maps?q=Cdor.%20Rodriguez%201020%20M32%20Lota%2014%20PIN%20Este%2C%20Neuqu%C3%A9n%2C%20Argentina%2C%20Q8300%20Neuqu%C3%A9n&output=embed"
              className="h-56 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <div className={`${footerCardClass} space-y-5`}>
          <SectionTitle
            text="Contáctanos"
            isLoaded
            className="text-left text-2xl font-bold uppercase tracking-tight text-white md:text-3xl"
          />

          <p className="max-w-sm text-sm leading-relaxed text-white/75 md:text-xl">
            Comunícate telefónicamente o visítanos para obtener toda la información acerca de
            nuestros servicios.
          </p>

          <div className="space-y-2 text-sm leading-relaxed text-white/80 md:text-xl">
            <p>
              Tel:{' '}
              <a
                href="https://wa.me/542994413075"
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#6CBFE0]"
              >
                +54 0299 4413075
              </a>
            </p>
            <p>
              Email:{' '}
              <a
                href="mailto:info@simetra.com.ar"
                className="transition-colors hover:text-[#6CBFE0]"
              >
                info@simetra.com.ar
              </a>
            </p>
            <p>Horario de Atención: 9am-6pm</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
