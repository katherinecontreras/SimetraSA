/**
 * useSectionHeights.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Hook que mide la altura real de cada sección de la página actual y expone
 * los datos que necesitan las animaciones de scroll.
 *
 * Retorna por cada sección registrada:
 *   {
 *     id          : string,   // identificador de la sección (ej: "hero", "about")
 *     height      : number,   // altura en px de la sección
 *     offsetTop   : number,   // px desde el top del documento donde empieza
 *     offsetBottom: number,   // px desde el top del documento donde termina
 *   }
 *
 * También retorna:
 *   totalHeight  : number,   // altura total del documento
 *
 * ─── Cómo usar ───────────────────────────────────────────────────────────────
 *
 * 1) Agrega data-section="nombreSeccion" al elemento raíz de cada sección:
 *
 *    <section data-section="hero">…</section>
 *    <section data-section="about">…</section>
 *
 * 2) En el componente de la página llama al hook:
 *
 *    const { sections, totalHeight } = useSectionHeights();
 *
 *    // sections es un array:
 *    // [
 *    //   { id: "hero",  height: 900, offsetTop: 0,   offsetBottom: 900  },
 *    //   { id: "about", height: 700, offsetTop: 900, offsetBottom: 1600 },
 *    //   …
 *    // ]
 *
 * 3) Pásale esos datos a Framer Motion (useScroll / useTransform / whileInView)
 *    o a cualquier lógica de animación basada en scroll.
 *
 * ─── Notas ───────────────────────────────────────────────────────────────────
 * • Las medidas se recalculan al cambiar el pathname (cambio de página),
 *   al hacer resize y al hacer scroll (para lazy-loaded content que crece).
 * • El parámetro `deps` permite forzar el recálculo externamente (ej: cuando
 *   termina de cargar las imágenes de la página).
 */

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

function measureSections() {
  const nodes = document.querySelectorAll("[data-section]");
  const totalHeight = document.documentElement.scrollHeight;

  const sections = Array.from(nodes).map((el) => {
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const offsetTop = rect.top + scrollY;
    const height = el.offsetHeight;

    return {
      id:           el.dataset.section,
      height,
      offsetTop,
      offsetBottom: offsetTop + height,
    };
  });

  return { sections, totalHeight };
}

/**
 * @param {any[]} [deps=[]] - dependencias adicionales que fuerzan el recálculo
 */
export function useSectionHeights(deps = []) {
  const { pathname } = useLocation();

  const [data, setData] = useState({ sections: [], totalHeight: 0 });

  const recalculate = useCallback(() => {
    setData(measureSections());
  }, []);

  // Recalcular en cada cambio de página, resize o scroll
  useEffect(() => {
    // Pequeño delay para que el DOM se pinte antes de medir
    const timer = setTimeout(recalculate, 100);

    let rafId = null;
    const onResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { recalculate(); rafId = null; });
    };

    // El scroll puede hacer crecer el contenido (imágenes lazy, acordeones, etc.)
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { recalculate(); rafId = null; });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, recalculate, ...deps]);

  return data;
}