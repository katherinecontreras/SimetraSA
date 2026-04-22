/**
 * Carrusel por pasos: layout p1..p5 = slots 0..4.
 * Avance automático solo en fase “armada” (pasos 5..10, las 5 imágenes siempre visibles).
 * Al entrar en viewport acelera ~1 s.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import {
  CAROUSEL_MAX_STEP,
  getCarouselLayout,
} from './asiTrabajamosCarouselLayout'
import {
  angleDegForFractionalSlot,
  centerWeightForFractionalSlot,
  ringRadiusPx,
} from './cylinderCarouselMath'

/** Primer paso con las 5 cajas ocupadas (nunca se muestra el estado vacío 0..4). */
const STEP_MIN_ARMED = 5
const PHASE_LEN_ARMED = CAROUSEL_MAX_STEP - STEP_MIN_ARMED + 1

/** Velocidad base: pasos por segundo dentro del rango armado. */
const AUTO_STEP_PER_SEC = 0.35
/** Multiplicador durante el impulso al entrar en pantalla. */
const VIEWPORT_BOOST_MULT = 2.6
/** Duración del impulso (ms). */
const VIEWPORT_BOOST_MS = 1000

const MotionDiv = motion.div

function syncCardWidthVar(el) {
  if (!el) return
  const w = el.naturalWidth > 0 ? el.naturalWidth : el.offsetWidth
  if (w > 0) el.style.setProperty('--w', `${w}px`)
}

const MASK_EDGE =
  'linear-gradient(90deg, transparent 0%, #fff 20%, #fff 80%, transparent 100%)'

const ARC_SPREAD_DEG = 120
/** Espacio extra entre cartas en el arco (px); mayor = menos solape al animar. */
const CARD_RING_GAP_PX = 22
const CENTER_LIFT_PX = 28
const CENTER_BOX_SHADOW =
  '0 16px 40px rgba(0, 0, 0, 0.32), 0 6px 16px rgba(0, 0, 0, 0.16)'
const FALLBACK_W = 420

function findSlot(layout, imgIdx) {
  for (let i = 0; i < layout.length; i++) {
    if (layout[i] === imgIdx) return i
  }
  return null
}

/** Cruce p5 ↔ p1: misma foto no debe animarse en un solo elemento de slot 4 → 0. */
function isHandoffAcrossEnds(slot0, slot1, n) {
  if (slot0 === null || slot1 === null) return false
  return (slot0 === n - 1 && slot1 === 0) || (slot0 === 0 && slot1 === n - 1)
}

/** Índice de slot fraccionario para transición normal (entrada/salida o desplazamiento corto). */
function fractionalSNormal(slot0, slot1, t, n) {
  const fs = fractionalSlot(slot0, slot1, n)
  if (!fs) return null
  return fs.s0 + (fs.s1 - fs.s0) * t
}

function fractionalSlot(slot0, slot1, n) {
  if (slot0 === null && slot1 === null) return null;
  const s0 = slot0 === null ? -1 : slot0; // Antes -0.5
  const s1 = slot1 === null ? n + 0.5 : slot1; // Antes n-0.5
  return { s0, s1 };
}

function fractionalSHandoffOut(slot0, slot1, t, n) {
  const forward = slot0 === n - 1 && slot1 === 0;
  // Sale disparada más lejos para que el "fade out" sea natural
  if (forward) return slot0 + (n + 0 - slot0) * t; 
  return slot0 + (-1 - slot0) * t;
}

function fractionalSHandoffIn(slot0, slot1, t, n) {
  const forward = slot0 === n - 1 && slot1 === 0;
  // Entra desde más atrás para que ya traiga "vuelo" al aparecer
  if (forward) return -1 + (slot1 - -1) * t;
  return n + 0.5 + (slot1 - (n + 0.5)) * t;
}

function centerCardFlagFromWeight(c) {
  return c > 0.48 ? 1 : 0
}

/** z-index coherente con la posición en el arco (0/4 atrás, 1/3 medio, 2 delante). Evita que bordes queden bajo 1–3 al animar. */
function zLayerFromSlot(s, n) {
  const mid = (n - 1) / 2
  const sZ = Math.max(0, Math.min(n - 1, s))
  const distFromCenter = Math.abs(sZ - mid)
  return (
    180 +
    Math.round((2 - distFromCenter) * 92) +
    Math.round((2 - distFromCenter) ** 2 * 24)
  )
}

function CylinderCarousel3D({ images, visible = true, isPhone = false }) {
  const items = useMemo(() => images.filter(Boolean), [images])
  const n = items.length || 1
  const [widths, setWidths] = useState(() => Array.from({ length: n }, () => FALLBACK_W))
  const [step, setStep] = useState(STEP_MIN_ARMED)
  const accRef = useRef(STEP_MIN_ARMED)
  const rootRef = useRef(null)
  const boostUntilRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          boostUntilRef.current = performance.now() + VIEWPORT_BOOST_MS
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const tick = () => {
      const now = performance.now()
      const last = lastTsRef.current
      lastTsRef.current = now
      const dt = last == null ? 0 : Math.min(0.05, (now - last) / 1000)
      const boosted = now < boostUntilRef.current
      const speed = AUTO_STEP_PER_SEC * (boosted ? VIEWPORT_BOOST_MULT : 1)
      accRef.current += speed * dt
      const local = accRef.current - STEP_MIN_ARMED
      const wrapped =
        ((local % PHASE_LEN_ARMED) + PHASE_LEN_ARMED) % PHASE_LEN_ARMED
      setStep(STEP_MIN_ARMED + wrapped)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [])

  const { L0, L1, t } = useMemo(() => {
    const stepClamped = Math.max(
      STEP_MIN_ARMED,
      Math.min(CAROUSEL_MAX_STEP, step),
    )
    const s0 = Math.floor(stepClamped)
    const s1 = Math.min(CAROUSEL_MAX_STEP, Math.ceil(stepClamped))
    const tt = s1 === s0 ? 1 : (stepClamped - s0) / (s1 - s0)
    const a = getCarouselLayout(s0)
    const b = getCarouselLayout(s1)
    return { L0: a, L1: b, t: tt }
  }, [step])

  const renderRows = useMemo(() => {
    const rows = []
    for (let imgIdx = 0; imgIdx < n; imgIdx++) {
      const slot0 = findSlot(L0, imgIdx)
      const slot1 = findSlot(L1, imgIdx)
      if (slot0 === null && slot1 === null) continue

      if (
        slot0 !== null &&
        slot1 !== null &&
        isHandoffAcrossEnds(slot0, slot1, n)
      ) {
        rows.push({
          key: `handoff-out-${imgIdx}`,
          imgIdx,
          mode: 'handoff-out',
          slot0,
          slot1,
        })
        rows.push({
          key: `handoff-in-${imgIdx}`,
          imgIdx,
          mode: 'handoff-in',
          slot0,
          slot1,
        })
      } else {
        rows.push({
          key: `normal-${imgIdx}`,
          imgIdx,
          mode: 'normal',
          slot0,
          slot1,
        })
      }
    }

    rows.sort((a, b) => {
      const sA =
        a.mode === 'handoff-out'
          ? fractionalSHandoffOut(a.slot0, a.slot1, t, n)
          : a.mode === 'handoff-in'
            ? fractionalSHandoffIn(a.slot0, a.slot1, t, n)
            : fractionalSNormal(a.slot0, a.slot1, t, n)
      const sB =
        b.mode === 'handoff-out'
          ? fractionalSHandoffOut(b.slot0, b.slot1, t, n)
          : b.mode === 'handoff-in'
            ? fractionalSHandoffIn(b.slot0, b.slot1, t, n)
            : fractionalSNormal(b.slot0, b.slot1, t, n)
      if (sA === null || sB === null) return 0
      const zA = zLayerFromSlot(sA, n)
      const zB = zLayerFromSlot(sB, n)
      if (zA !== zB) return zA - zB
      return sA - sB
    })

    return rows
  }, [L0, L1, n, t])

  if (items.length === 0) return null

  const maxCardW = Math.max(FALLBACK_W, ...widths)

  return (
    <MotionDiv
      ref={rootRef}
      className={
        isPhone
          ? 'relative z-20 mx-auto mt-4 w-full max-w-none overflow-hidden'
          /* w-screen (100vw) desborda ~ancho de scrollbar; sub-barra o scroll x en body. */
          : 'absolute left-0 right-0 top-1/3 w-full min-w-0 max-w-full overflow-hidden'
      }
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <div
        className={
          isPhone
            ? 'scene grid w-full overflow-hidden min-h-[min(50vh,440px)]'
            : 'scene grid w-full overflow-hidden'
        }
        style={{
          perspective: '150em',
          perspectiveOrigin: '50% 50%',
          ...(isPhone
            ? {}
            : {
                maskImage: MASK_EDGE,
                maskMode: 'alpha',
                WebkitMaskImage: MASK_EDGE,
                WebkitMaskSize: '100% 100%',
              }),
        }}
      >
        <div
          className="a3d place-self-center grid"
          style={{
            transformStyle: 'preserve-3d',
            gridArea: '1 / 1',
          }}
        >
          {renderRows.map((row) => {
            const { imgIdx, mode, slot0, slot1 } = row
            let s = null
            if (mode === 'normal') s = fractionalSNormal(slot0, slot1, t, n)
            else if (mode === 'handoff-out')
              s = fractionalSHandoffOut(slot0, slot1, t, n)
            else s = fractionalSHandoffIn(slot0, slot1, t, n)

            if (s === null) return null

            const theta = angleDegForFractionalSlot(s, n, ARC_SPREAD_DEG)
            const c = centerWeightForFractionalSlot(s, n)
            const enteringOrLeaving =
              mode !== 'normal' ||
              slot0 === null ||
              slot1 === null

            const src = items[imgIdx]
            // Un solo radio para todas las cartas: mismo cilindro; si no, cada R distinto solapa bordes.
            const R = ringRadiusPx(maxCardW, n, ARC_SPREAD_DEG, CARD_RING_GAP_PX)
            const scale = 1
            const lift = CENTER_LIFT_PX * c
            const isCenterish = centerCardFlagFromWeight(c) === 1
            const zBase = zLayerFromSlot(s, n)
            const z =
              enteringOrLeaving || mode === 'handoff-out' || mode === 'handoff-in'
                ? zBase + 72
                : zBase

            return (
              <img
                key={row.key}
                src={src}
                alt=""
                draggable={false}
                className="card relative col-start-1 row-start-1 h-auto w-auto max-w-none shrink-0"
                onLoad={(e) => {
                  syncCardWidthVar(e.currentTarget)
                  const el = e.currentTarget
                  const w = el.naturalWidth > 0 ? el.naturalWidth : el.offsetWidth
                  if (w > 0) {
                    setWidths((prev) => {
                      const next = [...prev]
                      next[imgIdx] = w
                      return next
                    })
                  }
                }}
                ref={(el) => {
                  if (el) requestAnimationFrame(() => syncCardWidthVar(el))
                }}
                style={{
                  gridArea: '1 / 1',
                  position: 'relative',
                  borderRadius: '1.5em',
                  backfaceVisibility: 'hidden',
                  boxShadow:
                    isCenterish && !isPhone ? CENTER_BOX_SHADOW : 'none',
                  zIndex: z,
                  transform: `rotateY(${theta}deg) translateZ(${-R}px) scale(${scale}) translateZ(${lift}px)`,
                }}
              />
            )
          })}
        </div>
      </div>
    </MotionDiv>
  )
}

export function CylinderCarousel({
  images,
  visible = true,
  /**
   * Tlf (<640px): mismo 3D a ancho completo (100vw centrado, sin clip ni máscara lateral);
   * sin sombra en la carta del centro. Tablet/desktop: máscara suave `MASK_EDGE`.
   */
  isPhone = false,
}) {
  return <CylinderCarousel3D images={images} visible={visible} isPhone={isPhone} />
}
