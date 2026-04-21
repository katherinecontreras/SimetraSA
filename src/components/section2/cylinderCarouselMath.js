/**
 * Geometría del arco 3D: slot p1..p5 = índices 0..4 (izquierda → derecha).
 */

/** Ángulo rotateY (grados) para el slot entero 0..n-1 en el arco. */
export function angleDegForSlot(slotIndex, n, spreadDeg) {
  const half = spreadDeg / 2
  const n1 = n - 1
  if (n1 <= 0) return 0
  return -half + (slotIndex / n1) * spreadDeg
}

/**
 * Slot fraccionario en el mismo arco que los enteros (p. ej. -0.5 = a la izquierda del p1,
 * n-0.5 = a la derecha del último). Evita ángulos extremos que hacen girar la carta hacia el fondo.
 */
export function angleDegForFractionalSlot(s, n, spreadDeg) {
  const half = spreadDeg / 2
  const n1 = n - 1
  if (n1 <= 0) return 0
  return -half + (s / n1) * spreadDeg
}

/** Peso centro para slot fraccionario (misma curva que enteros, extendida). */
export function centerWeightForFractionalSlot(s, n) {
  const mid = (n - 1) / 2;
  // Permitimos que el peso (escala/opacidad) caiga más suavemente
  return Math.max(0, 1 - Math.abs(s - mid) / 1.5);
}
/** Peso centro (misma lógica) para slot 0..n-1. */
export function centerWeightForSlot(slotIndex, n) {
  const mid = (n - 1) / 2
  return Math.max(0, 1 - Math.abs(slotIndex - mid))
}

export function ringRadiusPx(wPx, n, spreadDeg, gapPx = 8) {
  const n1 = n - 1
  if (n1 <= 0) return 0
  const stepDeg = spreadDeg / n1
  const halfStepRad = ((stepDeg / 2) * Math.PI) / 180
  const halfW = wPx / 2 + gapPx
  return halfW / Math.tan(halfStepRad)
}
