/**
 * useDeviceType.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook que detecta el tipo de dispositivo según el ancho de la ventana.
 *
 * Grupos de diseño:
 *   • "desktop"  → PC y Laptop  (≥ 1024px)  → diseño "grande"
 *   • "mobile"   → Teléfono     (< 640px)   → diseño "pequeño"
 *   • "tablet"   → Tablet       (640–1023px)→ diseño "pequeño" (mismo que mobile)
 *
 * Retorna:
 *   {
 *     deviceType : "desktop" | "tablet" | "mobile",
 *     isDesktop  : boolean,   // true para PC y Laptop
 *     isMobile   : boolean,   // true para teléfono y tablet
 *   }
 *
 * Uso:
 *   const { isDesktop, isMobile, deviceType } = useDeviceType();
 *   {isDesktop ? <NavbarPC /> : <NavbarTLF />}
 */

import { useState, useEffect } from "react";

// ─── Breakpoints (ajustar si cambia el diseño de Tailwind) ───────────────────
const BREAKPOINTS = {
  TABLET_MIN: 640,   // sm
  DESKTOP_MIN: 1024, // lg
};

function getDeviceType(width) {
  if (width >= BREAKPOINTS.DESKTOP_MIN) return "desktop";
  if (width >= BREAKPOINTS.TABLET_MIN)  return "tablet";
  return "mobile";
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState(() =>
    getDeviceType(window.innerWidth)
  );

  useEffect(() => {
    let rafId = null;

    const handleResize = () => {
      // Throttle con requestAnimationFrame para no recalcular en cada pixel
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setDeviceType(getDeviceType(window.innerWidth));
        rafId = null;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return {
    deviceType,
    isDesktop: deviceType === "desktop",
    isMobile:  deviceType === "tablet" || deviceType === "mobile",
  };
}