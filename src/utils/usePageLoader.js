/**
 * usePageLoader.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook que rastrea la carga completa de una página: imágenes, fuentes,
 * iframes y cualquier recurso personalizado que quieras incluir.
 *
 * Se reinicia automáticamente cada vez que cambia el pathname
 * (cambio de página con react-router-dom).
 *
 * Retorna:
 *   {
 *     progress   : number,   // 0–100  (porcentaje de carga)
 *     isLoaded   : boolean,  // true cuando progress === 100
 *     forceReady : () => void // fuerza isLoaded=true (útil para timeout)
 *   }
 *
 * ─── Uso básico ──────────────────────────────────────────────────────────────
 *
 *   const { progress, isLoaded } = usePageLoader();
 *
 *   // Mostrar pantalla de carga mientras !isLoaded
 *   {!isLoaded && <LoadingScreen progress={progress} />}
 *
 * ─── Agregar recursos personalizados ─────────────────────────────────────────
 *
 *   // Puedes pasar una lista de promesas extra (ej: fetch de datos)
 *   const dataFetch = fetch("/api/projects").then(r => r.json());
 *   const { progress, isLoaded } = usePageLoader([dataFetch]);
 *
 * ─── Timeout de seguridad ────────────────────────────────────────────────────
 *
 *   // Si después de N segundos todavía no cargó, forzamos la entrada.
 *   // El hook acepta un segundo parámetro: timeoutMs (default: 8000ms)
 *   const { progress, isLoaded } = usePageLoader([], 5000);
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * @param {Promise[]} [extraPromises=[]]  - recursos adicionales a esperar
 * @param {number}    [timeoutMs=8000]    - timeout de seguridad en ms
 */
export function usePageLoader(extraPromises = [], timeoutMs = 8000) {
  const { pathname } = useLocation();

  const [progress, setProgress]   = useState(0);
  const [isLoaded, setIsLoaded]   = useState(false);
  const mountedRef                = useRef(true);

  const forceReady = useCallback(() => {
    if (!mountedRef.current) return;
    setProgress(100);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setProgress(0);
    setIsLoaded(false);

    // ── 1. Recopilar todos los recursos a monitorear ──────────────────────────

    // Imágenes ya en el DOM al momento de ejecutar
    const images = Array.from(document.images);

    // Fuentes (Font Loading API)
    const fontPromise = document.fonts
      ? document.fonts.ready
      : Promise.resolve();

    // iframes
    const iframes = Array.from(document.querySelectorAll("iframe"));

    // ── 2. Construir lista de promesas ────────────────────────────────────────

    const imagePromises = images.map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load",  res, { once: true });
              img.addEventListener("error", res, { once: true }); // no bloquear por 404
            })
    );

    const iframePromises = iframes.map(
      (iframe) =>
        new Promise((res) => {
          if (iframe.contentDocument?.readyState === "complete") return res();
          iframe.addEventListener("load", res, { once: true });
        })
    );

    const allPromises = [
      fontPromise,
      ...imagePromises,
      ...iframePromises,
      ...extraPromises,
    ];

    const total = allPromises.length || 1;
    let  done  = 0;

    // ── 3. Rastrear cada promesa individualmente ──────────────────────────────

    const tick = () => {
      if (!mountedRef.current) return;
      done += 1;
      const pct = Math.min(Math.round((done / total) * 100), 99);
      setProgress(pct);
    };

    const trackedPromises = allPromises.map((p) =>
      Promise.resolve(p).then(tick).catch(tick)
    );

    // ── 4. Cuando todas terminan → 100 % ─────────────────────────────────────

    Promise.all(trackedPromises).then(() => {
      if (!mountedRef.current) return;
      setProgress(100);
      setIsLoaded(true);
    });

    // ── 5. Timeout de seguridad ───────────────────────────────────────────────

    const timeoutId = setTimeout(() => {
      if (!mountedRef.current) return;
      setProgress(100);
      setIsLoaded(true);
    }, timeoutMs);

    return () => {
      mountedRef.current = false;
      clearTimeout(timeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return { progress, isLoaded, forceReady };
}