/**
 * Carrusel por pasos: layout p1..p5 = slots 0..4.
 * Cuando la misma foto pasa de p5 a p1 (o al revés), se usan DOS <img> con el mismo src:
 * una sale por un lateral y otra entra por el otro (efecto cinta), no un solo elemento cruzando el arco.
 */

import { useMemo, useState } from 'react'
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

const MotionDiv = motion.div

function syncCardWidthVar(el) {
  if (!el) return
  const w = el.naturalWidth > 0 ? el.naturalWidth : el.offsetWidth
  if (w > 0) el.style.setProperty('--w', `${w}px`)
}

const MASK_EDGE =
  'linear-gradient(90deg, transparent 0%, #fff 20%, #fff 80%, transparent 100%)'

const ARC_SPREAD_DEG = 120
const CENTER_SCALE_BOOST = 0.4
const CENTER_LIFT_PX = 60
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

function fractionalSlot(slot0, slot1, n) {
  if (slot0 === null && slot1 === null) return null
  const s0 = slot0 === null ? -0.5 : slot0
  const s1 = slot1 === null ? n - 0.5 : slot1
  return { s0, s1 }
}

/** Índice de slot fraccionario para transición normal (entrada/salida o desplazamiento corto). */
function fractionalSNormal(slot0, slot1, t, n) {
  const fs = fractionalSlot(slot0, slot1, n)
  if (!fs) return null
  return fs.s0 + (fs.s1 - fs.s0) * t
}

/**
 * Dos trayectorias paralelas (mismo t): salida por un borde y entrada por el otro.
 * Adelante: sale por la derecha (hacia n-0.5), entra por la izquierda (desde -0.5).
 * Reverso: sale por la izquierda, entra por la derecha.
 */
function fractionalSHandoffOut(slot0, slot1, t, n) {
  const forward = slot0 === n - 1 && slot1 === 0
  if (forward) return slot0 + (n - 0.5 - slot0) * t
  return slot0 + (-0.5 - slot0) * t
}

function fractionalSHandoffIn(slot0, slot1, t, n) {
  const forward = slot0 === n - 1 && slot1 === 0
  if (forward) return -0.5 + (slot1 - -0.5) * t
  return n - 0.5 + (slot1 - (n - 0.5)) * t
}

function centerCardFlagFromWeight(c) {
  return c > 0.48 ? 1 : 0
}

export function CylinderCarousel({
  images,
  step = 0,
  visible = true,
}) {
  const items = useMemo(() => images.filter(Boolean), [images])
  const n = items.length || 1
  const [widths, setWidths] = useState(() => Array.from({ length: n }, () => FALLBACK_W))

  const { L0, L1, t, hasContent } = useMemo(() => {
    const stepClamped = Math.max(0, Math.min(CAROUSEL_MAX_STEP, step))
    const s0 = Math.floor(stepClamped)
    const s1 = Math.min(CAROUSEL_MAX_STEP, Math.ceil(stepClamped))
    const tt = s1 === s0 ? 1 : (stepClamped - s0) / (s1 - s0)
    const a = getCarouselLayout(s0)
    const b = getCarouselLayout(s1)
    const hc = a.some((x) => x != null) || b.some((x) => x != null)
    return { L0: a, L1: b, t: tt, hasContent: hc }
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
      const cA = centerWeightForFractionalSlot(sA, n)
      const cB = centerWeightForFractionalSlot(sB, n)
      return cA - cB
    })

    return rows
  }, [L0, L1, n, t])

  if (items.length === 0) return null

  return (
    <MotionDiv
      className="absolute top-1/3 left-0 w-screen max-w-none overflow-hidden"
      initial={false}
      animate={{
        opacity: visible && hasContent ? 1 : 0,
        pointerEvents: visible && hasContent ? 'auto' : 'none',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible || !hasContent}
    >
      <div
        className="scene grid w-full overflow-hidden"
        style={{
          perspective: '150em',
          perspectiveOrigin: '50% 50%',
          maskImage: MASK_EDGE,
          maskMode: 'alpha',
          WebkitMaskImage: MASK_EDGE,
          WebkitMaskSize: '100% 100%',
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
            const wPx = widths[imgIdx] ?? FALLBACK_W
            const R = ringRadiusPx(wPx, n, ARC_SPREAD_DEG)
            const scale = 1 + CENTER_SCALE_BOOST * c
            const lift = CENTER_LIFT_PX * c
            const isCenterish = centerCardFlagFromWeight(c) === 1
            /** c cae a 0 en slots vecinos al centro; refuerzo cuadrático + extra si es la carta central escalada. */
            const zBase =
              24 +
              Math.round(c * 95) +
              Math.round(c * c * 220) +
              (isCenterish ? 115 : 0)
            const z =
              enteringOrLeaving || mode === 'handoff-out' || mode === 'handoff-in'
                ? zBase + 140
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
                  boxShadow: isCenterish ? CENTER_BOX_SHADOW : 'none',
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
